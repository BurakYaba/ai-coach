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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        {/* Back Button and Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-3 sm:mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Subscription Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
            Manage your Fluenta subscription, billing, and payment methods
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Current Subscription Card */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription className="text-sm">
                Your current subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">
                  Plan Type:
                </span>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {subscription?.type === "monthly"
                    ? "Monthly"
                    : subscription?.type === "annual"
                      ? "Annual"
                      : "Free"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">
                  Status:
                </span>
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
                  <span className="font-medium text-sm sm:text-base">
                    Started:
                  </span>
                  <span className="text-sm sm:text-base">
                    {format(new Date(subscription.startDate), "MMM dd, yyyy")}
                  </span>
                </div>
              )}

              {subscription?.endDate && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">
                    {isActive ? "Next billing:" : "Expired:"}
                  </span>
                  <span className="flex items-center gap-2 text-sm sm:text-base">
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
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
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
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm">
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
              {isActive ? (
                <>
                  <BillingPortalButton className="w-full justify-start text-sm sm:text-base" />
                  <UpdatePaymentButton className="w-full justify-start text-sm sm:text-base" />
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm sm:text-base"
                    asChild
                  >
                    <a href="/pricing">
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </a>
                  </Button>
                  <ManageSubscriptionButton
                    className="w-full justify-start text-sm sm:text-base"
                    variant="destructive"
                  >
                    Cancel Subscription
                  </ManageSubscriptionButton>
                </>
              ) : (
                <>
                  <Button
                    className="w-full justify-start text-sm sm:text-base"
                    asChild
                  >
                    <a href="/pricing">
                      <CheckCircleIcon className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm sm:text-base"
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
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Subscription Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    What's Included
                  </h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Full access to all learning modules</li>
                    <li>• Speaking practice with AI</li>
                    <li>• Writing feedback and corrections</li>
                    <li>• Progress tracking and analytics</li>
                    <li>• Unlimited practice sessions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    Billing Information
                  </h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Monthly: $14.99/month</li>
                    <li>• Annual: $149.99/year (save 17%)</li>
                    <li>• Cancel anytime</li>
                    <li>• Secure payments via Stripe</li>
                    <li>• Automatic renewals</li>
                  </ul>
                </div>
              </div>

              {!isActive && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Free Trial:</strong> All new users get 14 days of
                    free access to try all features before committing to a
                    subscription.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
