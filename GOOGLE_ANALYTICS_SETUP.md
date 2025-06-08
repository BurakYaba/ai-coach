# Google Analytics Setup Guide

## Overview

Google Analytics has been integrated into your Fluenta language learning app to track user behavior, engagement, and conversion metrics.

## Environment Configuration

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID.

## Getting Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or select an existing one
3. Create a new property for your website
4. In the property settings, go to "Data Streams"
5. Create a new "Web" data stream
6. Enter your website URL (e.g., `https://yourdomain.com`)
7. Copy the Measurement ID (starts with `G-`)

## Features Implemented

### 1. Basic Tracking

- **Page Views**: Automatically tracks when users navigate between pages
- **User Sessions**: Tracks user engagement and session duration
- **Bounce Rate**: Measures how many users leave after viewing one page

### 2. Custom Events for Language Learning

- **Lesson Completion**: Tracks when users complete lessons
- **Subscription Events**: Tracks when users subscribe, cancel, or upgrade
- **Custom Conversions**: Tracks important user actions

### 3. Files Created/Modified

#### New Files:

- `src/lib/google-analytics.ts` - Main analytics configuration and utility functions
- `src/components/analytics/GoogleAnalytics.tsx` - Component that loads GA scripts
- `src/hooks/useGoogleAnalytics.ts` - Hook for automatic route tracking
- `src/components/providers/AnalyticsProvider.tsx` - Provider for analytics context

#### Modified Files:

- `src/app/layout.tsx` - Added GoogleAnalytics component and AnalyticsProvider

## Usage Examples

### Track Custom Events

```typescript
import {
  trackEvent,
  trackLessonCompletion,
  trackSubscription,
} from "@/lib/google-analytics";

// Track a custom event
trackEvent("button_click", "ui_interaction", "header_cta");

// Track lesson completion
trackLessonCompletion("lesson_1", "grammar", 85);

// Track subscription events
trackSubscription("subscribe", "premium_monthly");
```

### Track Conversions

```typescript
import { trackConversion } from "@/lib/google-analytics";

// Track when a user completes onboarding
trackConversion("complete_onboarding", {
  language: "spanish",
  level: "beginner",
});
```

## Key Metrics to Monitor

### User Engagement

- **Pages per Session**: How many pages users visit
- **Average Session Duration**: How long users stay on your app
- **Bounce Rate**: Percentage of single-page sessions

### Learning Progress

- **Lesson Completion Rate**: Percentage of started lessons that are completed
- **Course Progress**: How far users progress through courses
- **Difficulty Patterns**: Which lessons users struggle with most

### Business Metrics

- **Subscription Conversion**: Free to paid conversion rate
- **Feature Usage**: Which features are used most
- **User Retention**: How often users return to the app

## Testing

To test if Google Analytics is working:

1. Set up your Measurement ID in `.env.local`
2. Start your development server: `npm run dev`
3. Open your browser's Developer Tools
4. Go to the Network tab
5. Navigate through your app
6. Look for requests to `www.google-analytics.com` or `analytics.google.com`

You can also use the [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) for more detailed debugging.

## Privacy Considerations

- The integration respects user privacy and doesn't collect personally identifiable information
- All tracking is done client-side and follows Google's privacy guidelines
- Consider adding a cookie consent banner if required in your jurisdiction

## Next Steps

1. Set up your Google Analytics account and get your Measurement ID
2. Add the Measurement ID to your environment variables
3. Deploy your app with the new analytics integration
4. Set up conversion goals in Google Analytics dashboard
5. Create custom dashboards for your specific metrics
