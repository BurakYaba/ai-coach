"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID, initGA } from "@/lib/google-analytics";

export default function GoogleAnalytics() {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      return (
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    setIsMobile(checkMobile());

    // For mobile: load analytics on user interaction to improve LCP
    // For desktop: load immediately
    if (checkMobile()) {
      const handleFirstInteraction = () => {
        setShouldLoadAnalytics(true);
        // Remove listeners after first interaction
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener("scroll", handleFirstInteraction);
        document.removeEventListener("click", handleFirstInteraction);
      };

      // Load on first user interaction (touch, scroll, or click)
      document.addEventListener("touchstart", handleFirstInteraction, {
        passive: true,
      });
      document.addEventListener("scroll", handleFirstInteraction, {
        passive: true,
      });
      document.addEventListener("click", handleFirstInteraction, {
        passive: true,
      });

      // Fallback: Load after 3 seconds if no interaction
      const fallbackTimer = setTimeout(() => {
        setShouldLoadAnalytics(true);
      }, 3000);

      return () => {
        clearTimeout(fallbackTimer);
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener("scroll", handleFirstInteraction);
        document.removeEventListener("click", handleFirstInteraction);
      };
    } else {
      // Desktop: load immediately
      setShouldLoadAnalytics(true);
    }
  }, []);

  useEffect(() => {
    if (shouldLoadAnalytics && GA_MEASUREMENT_ID) {
      initGA();
    }
  }, [shouldLoadAnalytics]);

  if (!GA_MEASUREMENT_ID || !shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      <Script
        strategy={isMobile ? "lazyOnload" : "afterInteractive"}
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy={isMobile ? "lazyOnload" : "afterInteractive"}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
