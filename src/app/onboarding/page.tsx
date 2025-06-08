"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Check if user has already completed onboarding
    checkOnboardingStatus();
  }, [session, status, router]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        if (data.onboarding?.completed) {
          // User has already completed onboarding, redirect to dashboard
          router.push("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    // Redirect to dashboard after successful onboarding
    router.push("/dashboard");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
