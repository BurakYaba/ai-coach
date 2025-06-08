import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Check, ArrowLeft, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authOptions } from "@/lib/auth";
import { CheckoutButton } from "@/components/payments/checkout-button";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

// Client component to handle expired user alert
import {
  ExpiredUserAlert,
  PricingHeading,
} from "@/components/pricing/expired-user-alert";

export const metadata: Metadata = {
  title: "Pricing - Fluenta",
  description: "Choose your subscription plan",
};

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  planType: "monthly" | "annual";
}

const plans: PricingPlan[] = [
  {
    name: "Monthly",
    price: "$14.99",
    period: "month",
    description: "Perfect for short-term learning goals",
    features: [
      "Full access to all 6 learning modules",
      "AI-powered personalized feedback",
      "Progress tracking and analytics",
      "Speaking practice with voice recognition",
      "Writing exercises with grammar correction",
      "Reading comprehension with adaptive difficulty",
      "Listening exercises with various accents",
      "Vocabulary building tools",
      "Grammar lessons and practice",
      "24/7 customer support",
    ],
    planType: "monthly",
  },
  {
    name: "Annual",
    price: "$149.99",
    period: "year",
    description: "Best value for committed learners",
    features: [
      "Everything in Monthly plan",
      "2 months free (save $30)",
      "Priority customer support",
      "Early access to new features",
      "Advanced analytics and insights",
      "Downloadable certificates",
    ],
    popular: true,
    planType: "annual",
  },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  // If user is logged in, check if they're a school user
  if (session?.user?.id) {
    await dbConnect();
    const user = await User.findById(session.user.id);

    // If user is associated with a school, redirect them to dashboard
    if (user?.school) {
      redirect("/dashboard?message=school-user");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <PricingContent session={session} />
      </div>
    </div>
  );
}

function PricingContent({ session }: { session: any }) {
  // Determine the correct back link based on authentication status
  const backLink = session?.user ? "/dashboard" : "/";
  const backText = session?.user ? "Back to Dashboard" : "Back to Home";

  return (
    <>
      <ExpiredUserAlert />

      <div className="mb-8">
        <Link
          href={backLink}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backText}
        </Link>

        <div className="text-center">
          <PricingHeading />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-2">/{plan.period}</span>
              </div>
              <CardDescription className="text-base">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {session?.user ? (
                <CheckoutButton
                  planType={plan.planType}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Choose {plan.name} Plan
                </CheckoutButton>
              ) : (
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/register">Sign Up to Get Started</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h3 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h3>
        <div className="max-w-2xl mx-auto space-y-4 text-left">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time. You'll continue
              to have access until the end of your billing period.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Do you offer a free trial?</h4>
            <p className="text-gray-600">
              Yes! All new users get 7 days of free access to try all features
              before committing to a subscription.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-gray-600">
              We accept all major credit cards and debit cards through our
              secure payment processor.
            </p>
          </div>
        </div>
      </div>

      {!session?.user && (
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/register">Get Started Today</Link>
          </Button>
        </div>
      )}
    </>
  );
}
