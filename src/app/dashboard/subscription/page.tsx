import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ManageSubscriptionButton,
  BillingPortalButton,
  UpdatePaymentButton,
} from "@/components/payments/manage-subscription-button";
import { CheckoutButton } from "@/components/payments/checkout-button";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const metadata: Metadata = {
  title: "Subscription Management - Fluenta",
  description: "Manage your Fluenta subscription",
};

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  // Redirect school users - they can't manage individual subscriptions
  if (user.school) {
    redirect("/dashboard?error=school-user");
  }

  const subscription = user.subscription;
  const isActive =
    subscription?.status === "active" &&
    (!subscription?.endDate || new Date(subscription.endDate) > new Date());

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button and Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your Fluenta subscription, billing, and payment methods
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <CardDescription>Your current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan Type:</span>
              <Badge variant={isActive ? "default" : "secondary"}>
                {subscription?.type === "monthly"
                  ? "Monthly"
                  : subscription?.type === "annual"
                    ? "Annual"
                    : "Free"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={isActive ? "default" : "destructive"}>
                  {subscription?.status || "inactive"}
                </Badge>
              </div>
            </div>

            {subscription?.startDate && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Started:</span>
                <span>
                  {format(new Date(subscription.startDate), "MMM dd, yyyy")}
                </span>
              </div>
            )}

            {subscription?.endDate && (
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {isActive ? "Next billing:" : "Expired:"}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(subscription.endDate), "MMM dd, yyyy")}
                </span>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              {isActive ? (
                <ManageSubscriptionButton className="w-full" />
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Your subscription has expired. Choose a plan to continue:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <CheckoutButton
                      planType="monthly"
                      variant="outline"
                      className="text-xs"
                    >
                      Monthly Plan
                    </CheckoutButton>
                    <CheckoutButton
                      planType="annual"
                      variant="default"
                      className="text-xs"
                    >
                      Annual Plan
                    </CheckoutButton>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isActive ? (
              <>
                <BillingPortalButton className="w-full justify-start" />
                <UpdatePaymentButton className="w-full justify-start" />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/pricing">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </a>
                </Button>
                <ManageSubscriptionButton
                  className="w-full justify-start"
                  variant="destructive"
                >
                  Cancel Subscription
                </ManageSubscriptionButton>
              </>
            ) : (
              <>
                <Button className="w-full justify-start" asChild>
                  <a href="/pricing">
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/pricing">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    View Plans
                  </a>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What's Included</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Full access to all learning modules</li>
                  <li>• Speaking practice with AI</li>
                  <li>• Writing feedback and corrections</li>
                  <li>• Progress tracking and analytics</li>
                  <li>• Unlimited practice sessions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Billing Information</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Monthly: $14.99/month</li>
                  <li>• Annual: $149.99/year (save 17%)</li>
                  <li>• Cancel anytime</li>
                  <li>• Secure payments via Stripe</li>
                  <li>• Automatic renewals</li>
                </ul>
              </div>
            </div>

            {!isActive && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Free Trial:</strong> All new users get 7 days of free
                  access to try all features before committing to a
                  subscription.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
