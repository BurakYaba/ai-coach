import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getStripe, STRIPE_PRODUCTS } from "@/lib/stripe";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planType } = await request.json();

    if (!planType || !["monthly", "annual"].includes(planType)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    await dbConnect();

    // Verify user exists and is an individual user (not associated with a school)
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.school) {
      return NextResponse.json(
        { error: "School users cannot purchase individual subscriptions" },
        { status: 400 }
      );
    }

    const product = STRIPE_PRODUCTS[planType as keyof typeof STRIPE_PRODUCTS];
    const stripe = getStripe();

    // Find or create Stripe customer
    let stripeCustomerId = null;

    // Try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      // Create new customer if none exists
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId, // Use existing or new customer
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        planType,
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&refresh_token=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
      // Custom business information for checkout
      custom_text: {
        submit: {
          message: "Complete your Fluenta subscription",
        },
      },
      // Optional: Add branding
      billing_address_collection: "auto",
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
