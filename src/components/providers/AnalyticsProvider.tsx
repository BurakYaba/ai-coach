"use client";

import { Suspense } from "react";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

function AnalyticsTracker() {
  useGoogleAnalytics();
  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
