"use client";

import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useGoogleAnalytics();

  return <>{children}</>;
}
