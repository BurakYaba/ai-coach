import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType;

  if (!userId || !planType) {
    console.error("Missing metadata in checkout session");
    return;
  }

  try {
    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();

    if (planType === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      subscription: {
        type: planType,
        status: "active",
        startDate,
        endDate,
      },
    });

    console.log(`Subscription activated for user ${userId}: ${planType}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle successful recurring payments
  const subscriptionId = (invoice as any).subscription;

  if (subscriptionId && typeof subscriptionId === "string") {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await updateUserSubscriptionFromStripe(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payments - could send email notifications here
  console.log(`Payment failed for invoice: ${invoice.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await updateUserSubscriptionFromStripe(subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find user by subscription metadata and mark subscription as expired
  const userId = subscription.metadata?.userId;

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      "subscription.status": "expired",
    });
    console.log(`Subscription deleted for user ${userId}`);
  }
}

async function updateUserSubscriptionFromStripe(
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  const status = subscription.status === "active" ? "active" : "expired";
  const currentPeriodEnd = new Date(
    (subscription as any).current_period_end * 1000
  );

  await User.findByIdAndUpdate(userId, {
    "subscription.status": status,
    "subscription.endDate": currentPeriodEnd,
  });

  console.log(
    `Updated subscription for user ${userId}: ${status} until ${currentPeriodEnd}`
  );
}
