"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingCompletionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const hasProcessed = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!searchParams || hasProcessed.current) return;

    const hasRefreshToken = searchParams.get("refresh_token") === "true";
    const hasOnboardingCompleted =
      searchParams.get("onboarding_completed") === "true";

    if (
      (hasRefreshToken || hasOnboardingCompleted) &&
      session &&
      !isRefreshing
    ) {
      console.log(
        "OnboardingCompletionHandler: Handling onboarding completion redirect"
      );
      hasProcessed.current = true;
      setIsRefreshing(true);

      const handleOnboardingRefresh = async () => {
        try {
          // Wait a moment for database update to complete
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Force JWT token refresh by updating the session
          console.log("OnboardingCompletionHandler: Forcing JWT token refresh");
          await updateSession({ forceRefresh: true });

          // Extended delay to ensure JWT refresh completes
          await new Promise(resolve => setTimeout(resolve, 2000));

          console.log(
            "OnboardingCompletionHandler: JWT token refresh completed"
          );

          // Clean up the URL by removing the refresh_token parameters
          console.log(
            "OnboardingCompletionHandler: Cleaning up URL parameters"
          );
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh_token");
          url.searchParams.delete("onboarding_completed");
          router.replace(url.pathname + url.search);
        } catch (error) {
          console.error(
            "OnboardingCompletionHandler: Error refreshing session:",
            error
          );
          // Still clean up URL even if refresh fails
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh_token");
          url.searchParams.delete("onboarding_completed");
          router.replace(url.pathname + url.search);
        } finally {
          setIsRefreshing(false);
        }
      };

      handleOnboardingRefresh();
    }
  }, [searchParams, session, updateSession, router, isRefreshing]);

  // This component doesn't render anything
  return null;
}
