// Replace with your Google Analytics Measurement ID
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
    // Just initialize - page tracking will be handled by the useGoogleAnalytics hook
    console.log("Google Analytics initialized");
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    const pageTitle = title || globalThis.document?.title || "";
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_title: pageTitle,
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user engagement events
export const trackEngagement = (engagement_time_msec: number) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", "user_engagement", {
      engagement_time_msec,
    });
  }
};

// Track conversions (useful for your language learning app)
export const trackConversion = (
  event_name: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", event_name, parameters);
  }
};

// Track lesson completion (specific to your app)
export const trackLessonCompletion = (
  lessonId: string,
  lessonType: string,
  score?: number
) => {
  trackEvent(
    "lesson_completed",
    "learning",
    `${lessonType}_${lessonId}`,
    score
  );
};

// Track subscription events (useful for your Stripe integration)
export const trackSubscription = (
  event_type: "subscribe" | "cancel" | "upgrade",
  plan_name: string
) => {
  trackEvent(event_type, "subscription", plan_name);
};
