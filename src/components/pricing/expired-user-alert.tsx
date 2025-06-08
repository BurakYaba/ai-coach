"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ExpiredUserAlert() {
  const searchParams = useSearchParams();
  const isExpired = searchParams?.get("expired") === "true";

  if (!isExpired) {
    return null;
  }

  return (
    <Alert className="mb-8 border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Your free trial has expired!</strong> Choose a subscription plan
        below to continue accessing all learning features and maintain your
        progress.
      </AlertDescription>
    </Alert>
  );
}

export function PricingHeading() {
  const searchParams = useSearchParams();
  const isExpired = searchParams?.get("expired") === "true";

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {isExpired
          ? "Continue Your Learning Journey"
          : "Choose Your Learning Plan"}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {isExpired
          ? "Select a subscription plan to regain access to all AI-powered learning features"
          : "Start your language learning journey with our comprehensive AI-powered platform"}
      </p>
    </>
  );
}

export function useIsExpiredUser() {
  const searchParams = useSearchParams();
  return searchParams?.get("expired") === "true";
}
