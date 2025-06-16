"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

// Turkish market specific Google Analytics configuration
const TURKISH_GA_ID = process.env.NEXT_PUBLIC_TURKISH_GA_ID || "G-XXXXXXXXXX"; // Replace with actual Turkish GA ID
const GLOBAL_GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"; // Main GA ID

declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export default function TurkishGoogleAnalytics() {
  const pathname = usePathname();
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine if we're on Turkish pages
  const isTurkishPage = pathname?.startsWith("/tr") || false;

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
    if (typeof window !== "undefined" && window.gtag && shouldLoadAnalytics) {
      // Track page views for both global and Turkish-specific analytics
      window.gtag("config", GLOBAL_GA_ID, {
        page_path: pathname,
        custom_map: {
          custom_dimension_1: isTurkishPage ? "Turkish" : "English",
        },
      });

      // If on Turkish page, also track with Turkish-specific GA
      if (isTurkishPage && TURKISH_GA_ID !== GLOBAL_GA_ID) {
        window.gtag("config", TURKISH_GA_ID, {
          page_path: pathname,
          language: "tr",
          country: "TR",
          market: "Turkish",
        });
      }

      // Track Turkish market specific events
      if (isTurkishPage) {
        window.gtag("event", "turkish_page_view", {
          event_category: "Turkish Market",
          event_label: pathname,
          language: "tr",
        });
      }
    }
  }, [pathname, isTurkishPage, shouldLoadAnalytics]);

  // Track Turkish-specific user interactions
  const trackTurkishEvent = (
    eventName: string,
    parameters: Record<string, any> = {}
  ) => {
    if (typeof window !== "undefined" && window.gtag && isTurkishPage) {
      window.gtag("event", eventName, {
        event_category: "Turkish Market",
        language: "tr",
        market: "Turkish",
        ...parameters,
      });
    }
  };

  // Expose tracking function globally for Turkish pages
  useEffect(() => {
    if (isTurkishPage && typeof window !== "undefined") {
      (window as any).trackTurkishEvent = trackTurkishEvent;
    }
  }, [isTurkishPage]);

  // Don't render until analytics should load
  if (!shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      {/* Global Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GLOBAL_GA_ID}`}
        strategy={isMobile ? "lazyOnload" : "afterInteractive"}
      />
      <Script
        id="google-analytics"
        strategy={isMobile ? "lazyOnload" : "afterInteractive"}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GLOBAL_GA_ID}', {
            page_path: window.location.pathname,
            custom_map: {
              'custom_dimension_1': '${isTurkishPage ? "Turkish" : "English"}'
            }
          });
          
          ${
            isTurkishPage && TURKISH_GA_ID !== GLOBAL_GA_ID
              ? `
          // Turkish-specific Google Analytics
          gtag('config', '${TURKISH_GA_ID}', {
            page_path: window.location.pathname,
            language: 'tr',
            country: 'TR',
            market: 'Turkish'
          });
          `
              : ""
          }
        `}
      </Script>

      {/* Turkish market specific tracking */}
      {isTurkishPage && (
        <Script
          id="turkish-analytics"
          strategy={isMobile ? "lazyOnload" : "afterInteractive"}
        >
          {`
            // Track Turkish market entry
            gtag('event', 'turkish_market_entry', {
              event_category: 'Turkish Market',
              event_label: '${pathname}',
              language: 'tr'
            });
            
            // Track Turkish language preference
            gtag('event', 'language_preference', {
              event_category: 'Localization',
              event_label: 'Turkish',
              language: 'tr'
            });
            
            // Enhanced ecommerce for Turkish market
            gtag('config', '${GLOBAL_GA_ID}', {
              currency: 'TRY',
              country: 'TR',
              language: 'tr'
            });
          `}
        </Script>
      )}
    </>
  );
}

// Helper functions for Turkish market analytics
export const turkishAnalytics = {
  // Track Turkish pricing interactions
  trackPricingView: (plan: string, price: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_item", {
        event_category: "Turkish Pricing",
        event_label: plan,
        currency: "TRY",
        value: parseFloat(price.replace("₺", "")),
        language: "tr",
      });
    }
  },

  // Track Turkish registration attempts
  trackTurkishRegistration: (source: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "sign_up", {
        event_category: "Turkish Market",
        event_label: source,
        language: "tr",
        market: "Turkish",
      });
    }
  },

  // Track Turkish blog engagement
  trackTurkishBlogRead: (articleTitle: string, readTime: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "turkish_blog_read", {
        event_category: "Turkish Content",
        event_label: articleTitle,
        read_time: readTime,
        language: "tr",
      });
    }
  },

  // Track Turkish contact form submissions
  trackTurkishContact: (formType: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "turkish_contact", {
        event_category: "Turkish Lead Generation",
        event_label: formType,
        language: "tr",
      });
    }
  },

  // Track Turkish feature usage
  trackTurkishFeatureUsage: (feature: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "turkish_feature_usage", {
        event_category: "Turkish User Behavior",
        event_label: feature,
        language: "tr",
      });
    }
  },

  // Track Turkish conversion funnel
  trackTurkishFunnelStep: (step: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "turkish_funnel_step", {
        event_category: "Turkish Conversion Funnel",
        event_label: step,
        language: "tr",
        value: value || 0,
      });
    }
  },
};
