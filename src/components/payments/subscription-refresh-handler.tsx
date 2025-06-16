"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

export function SubscriptionRefreshHandler() {
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const shouldRefreshToken = searchParams?.get("refresh_token") === "true";
    const isSuccess = searchParams?.get("success") === "true";

    if (shouldRefreshToken && session && !isRefreshing) {
      setIsRefreshing(true);

      const refreshSubscription = async () => {
        try {
          // Wait a moment for webhook to process
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Call our refresh API endpoint to get fresh subscription data
          const response = await fetch("/api/auth/refresh-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();

            // Force JWT token refresh by updating the session
            await update({ forceRefresh: true });

            // Extended delay to ensure JWT refresh completes
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message with proper toast
            if (isSuccess) {
              toast({
                title: "Payment successful!",
                description: "Your subscription has been updated.",
              });
            }

            // Clean up the URL by removing the refresh_token parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("refresh_token");
            url.searchParams.delete("success");
            router.replace(url.pathname + url.search);
          } else {
            console.error("Failed to refresh subscription");
          }
        } catch (error) {
          console.error("Error refreshing subscription:", error);
        } finally {
          setIsRefreshing(false);
        }
      };

      refreshSubscription();
    }
  }, [searchParams, session, update, router, isRefreshing]);

  return null; // This component doesn't render anything
}
