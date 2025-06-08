"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/google-analytics";

export function useGoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const params = searchParams?.toString();
      const url = pathname + (params ? `?${params}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);
}
