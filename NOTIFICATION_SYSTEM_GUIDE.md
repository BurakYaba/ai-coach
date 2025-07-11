# Fluenta AI Notification Email System

## Overview

The notification system sends automated emails to users based on their study preferences and learning progress:

1. **Study Reminders** - Sent before user's preferred practice time on their selected learning days
2. **Weekly Progress Reports** - Comprehensive learning summary sent every Monday morning

## Features

### Study Reminders

- ⏰ **Smart Scheduling**: Sent based on user's preferred practice time and reminder timing
- 📅 **Customizable Days**: Only sent on user's selected learning days
- 🔥 **Streak Integration**: Shows current streak to motivate users
- 🎯 **Goal Display**: Shows daily study time goal
- ⚙️ **User Control**: Users can enable/disable via settings

### Weekly Progress Reports

- 📊 **Comprehensive Stats**: Study time, sessions completed, XP earned
- 📈 **Progress Tracking**: Goal achievement percentage and trends
- 🏆 **Achievements**: New achievements unlocked during the week
- 💪 **Skill Analysis**: Strongest skills and improvement recommendations
- 📱 **Daily Breakdown**: Day-by-day activity summary

## System Architecture

### Core Components

1. **Progress Calculator** (`/lib/notifications/progress-calculator.ts`)

   - Calculates weekly learning statistics
   - Analyzes user performance and skill development
   - Generates motivational insights

2. **Scheduler** (`/lib/notifications/scheduler.ts`)

   - Determines when users should receive notifications
   - Handles eligibility checks and timing logic
   - Processes bulk notification sending

3. **Email Templates** (`/lib/email.ts` & `/lib/email-resend.ts`)

   - Beautiful HTML email templates
   - Supports both SMTP and Resend providers
   - Responsive design with fallback text versions

4. **Management API** (`/api/notifications/schedule`)
   - Admin controls for testing and bulk processing
   - Real-time eligibility checking
   - Notification statistics and logging

## Setup Instructions

### 1. Environment Variables

Ensure these variables are configured in your `.env.local`:

```env
# Email Configuration (choose one)

# Option A: Resend (Recommended)
RESEND_API_KEY=your_resend_api_key_here

# Option B: SMTP (Fallback)
EMAIL_PROVIDER=godaddy
EMAIL_HOST=smtpout.secureserver.net
EMAIL_PORT=465
EMAIL_USERNAME=notifications@fluenta-ai.com
EMAIL_PASSWORD=your_email_password

# Required for all setups
NEXTAUTH_URL=http://localhost:3000
```

### 2. User Settings

Users control notifications through their settings:

```typescript
// User settings in database
settings: {
  studyReminders: boolean,           // Enable/disable study reminders
  weeklyProgressReport: boolean,     // Enable/disable weekly reports
  reminderTiming: string,            // "15", "30", "60", "120" (minutes before)
}

// User onboarding preferences
onboarding: {
  preferredPracticeTime: string,     // "early_morning", "afternoon", etc.
  preferredLearningDays: string[],   // ["monday", "wednesday", "friday"]
  dailyStudyTimeGoal: number,        // Daily goal in minutes
  weeklyStudyTimeGoal: number,       // Weekly goal in minutes
}
```

### 3. Testing the System

#### Using the Admin Interface

1. **Access Admin Panel**

   ```
   http://localhost:3000/admin/notifications
   ```

2. **Available Test Actions**
   - Check user eligibility
   - Send test notifications to specific users
   - Process bulk notifications
   - View notification logs and statistics

#### Using API Endpoints

**Check user eligibility:**

```bash
curl "http://localhost:3000/api/notifications/schedule?userId=USER_ID"
```

**Send test study reminder:**

```bash
curl -X POST http://localhost:3000/api/notifications/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test_user_reminder",
    "userId": "USER_ID"
  }'
```

**Send test weekly report:**

```bash
curl -X POST http://localhost:3000/api/notifications/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test_user_weekly",
    "userId": "USER_ID"
  }'
```

**Process all notifications:**

```bash
curl -X POST http://localhost:3000/api/notifications/schedule \
  -H "Content-Type: application/json" \
  -d '{"action": "process_all"}'
```

## Testing Scenarios

### Test Case 1: Study Reminder Eligibility

**Setup:**

1. Create a test user with study reminders enabled
2. Set preferred practice time to current time + 30 minutes
3. Set reminder timing to 30 minutes
4. Include today in preferred learning days

**Expected Result:**

- User should be eligible for reminder
- Reminder should be sent approximately 30 minutes before study time

### Test Case 2: Weekly Progress Report

**Setup:**

1. Create a test user with weekly reports enabled
2. Ensure user has some learning activity in the past week
3. Run the test on a Monday morning (8-11 AM)

**Expected Result:**

- User should receive comprehensive progress report
- Report should include accurate statistics and insights

### Test Case 3: Scheduling Logic

**Test different scenarios:**

```javascript
// User not eligible scenarios
{
  studyReminders: false,              // → "Study reminders disabled"
  preferredLearningDays: [],          // → "No study schedule configured"
  todayNotInSchedule: true,           // → "Not a preferred learning day"
  alreadySentToday: true,             // → "Reminder already sent today"
  outsideTimeWindow: true,            // → "Not within reminder window"
}

// User eligible scenario
{
  studyReminders: true,
  preferredLearningDays: ["monday", "wednesday", "friday"],
  reminderTiming: "30",               // 30 minutes before
  preferredPracticeTime: "early_evening", // 6:30 PM
  currentTime: "6:00 PM",             // Within 10-minute window of 6:00 PM reminder
  noReminderSentToday: true,
}
```

## Scheduling in Production

### Option 1: Cron Jobs (Recommended)

Add to your server's crontab or use a service like Vercel Cron:

```bash
# Study reminders - check every 30 minutes during active hours
*/30 6-22 * * * curl -X POST http://your-domain.com/api/notifications/schedule -d '{"action":"process_study_reminders"}'

# Weekly reports - Monday at 9 AM
0 9 * * 1 curl -X POST http://your-domain.com/api/notifications/schedule -d '{"action":"process_weekly_reports"}'
```

### Option 2: Vercel Cron Functions

Create `api/cron/notifications.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  processStudyReminders,
  processWeeklyReports,
} from "@/lib/notifications/scheduler";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  // Verify cron secret
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const today = new Date();
  const isMonday = today.getDay() === 1;
  const hour = today.getHours();

  try {
    let results = {};

    // Process study reminders during active hours
    if (hour >= 6 && hour <= 22) {
      results.studyReminders = await processStudyReminders();
    }

    // Process weekly reports on Monday morning
    if (isMonday && hour >= 8 && hour <= 11) {
      results.weeklyReports = await processWeeklyReports();
    }

    return NextResponse.json({
      success: true,
      timestamp: today.toISOString(),
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

And configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "*/30 6-22 * * *"
    }
  ]
}
```

## Vercel Deployment with Cron Jobs

### Automatic Notification Scheduling

The notification system is configured to work with **Vercel Cron Jobs** for automatic scheduling in production:

#### Cron Job Schedule (configured in `vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/notifications/schedule",
      "schedule": "*/15 * * * *" // Every 15 minutes for study reminders
    },
    {
      "path": "/api/notifications/schedule",
      "schedule": "0 8 * * 1" // 8 AM UTC every Monday (weekly reports)
    }
  ]
}
```

#### How It Works:

1. **Study Reminders**: Run **every 15 minutes** throughout the day

   - Ensures precise timing for user's preferred reminder schedule
   - Accommodates all user preferences (30 min, 1 hour, 2 hours before practice time)
   - Each cron job checks all users and sends reminders only to eligible ones
   - Eligibility based on user's preferred practice time, learning days, and reminder timing
   - **Example**: User wants to practice at 7:00 AM with 2-hour early reminder → reminder sent at 5:00 AM

2. **Weekly Progress Reports**: Run every Monday at 8:00 AM UTC (exact time)

   - Automatically detected by the API when `currentDay === 1 && currentHour === 8 && currentMinute === 0`
   - Sends comprehensive weekly summaries with learning statistics

3. **Smart Processing**: The API automatically determines the action:

   - Monday 8:00 AM UTC → Weekly progress reports
   - All other 15-minute intervals → Study reminders

4. **Reminder Window Logic**:
   - Reminders are sent within 20 minutes of the scheduled time
   - Prevents duplicate reminders with daily tracking
   - Handles future reminders vs. missed reminders intelligently

### Deployment Steps:

1. **Environment Variables**: Ensure these are set in your Vercel project:

   ```bash
   DATABASE_URL=your_mongodb_connection_string
   RESEND_API_KEY=your_resend_api_key  # or SMTP settings
   NEXTAUTH_URL=your_production_url
   ```

2. **Deploy to Vercel**:

   ```bash
   vercel --prod
   ```

3. **Verify Cron Jobs**: After deployment, check the Vercel dashboard:

   - Go to your project → Functions → Cron Jobs
   - You should see **2 cron jobs** listed:
     - `*/15 * * * *` (every 15 minutes for study reminders)
     - `0 8 * * 1` (Monday 8 AM UTC for weekly reports)
   - Monitor the execution logs

4. **Test the System**:

   ```bash
   # Test the cron endpoint directly
   curl https://your-app.vercel.app/api/notifications/schedule

   # Test specific user
   curl https://your-app.vercel.app/api/notifications/schedule?userId=USER_ID
   ```

### Monitoring:

- **Vercel Dashboard**: Monitor cron job execution and logs
- **Admin Interface**: Use `/admin/notifications` to view notification statistics
- **Database**: Check the `notifications` collection for sent notifications
- **Email Provider**: Monitor email delivery rates in Resend/SMTP dashboard

### Important Notes:

- **Time Zones**: All cron jobs run in UTC. User time zones are handled by the eligibility logic
- **Rate Limits**: Vercel cron jobs have execution limits. Monitor usage in the dashboard
- **Error Handling**: Failed notifications are logged with error details
- **Scalability**: The system processes all users in batches for efficiency

### Troubleshooting:

1. **Cron Jobs Not Running**: Check Vercel dashboard for errors
2. **No Emails Sent**: Verify email provider configuration and user eligibility
3. **Database Connection**: Ensure MongoDB connection string is correct
4. **Rate Limits**: Monitor API usage and adjust cron frequency if needed

## Monitoring and Analytics

### Notification Statistics

The system tracks:

- Total notifications sent
- Success/failure rates
- Delivery times
- User engagement patterns

### Email Deliverability

**Best Practices:**

1. Use proper SPF/DKIM records
2. Monitor sender reputation
3. Handle bounces and unsubscribes
4. Keep email content relevant and valuable

**Testing Deliverability:**

1. Test with multiple email providers (Gmail, Outlook, etc.)
2. Check spam folder rates
3. Monitor open/click rates (if tracking implemented)
4. Use tools like mail-tester.com

## Troubleshooting

### Common Issues

**Emails not sending:**

1. Check email configuration in environment variables
2. Verify API keys and SMTP credentials
3. Test email connection using `/api/test-email`
4. Check server logs for detailed error messages

**Users not receiving notifications:**

1. Verify user has notifications enabled in settings
2. Check user's study schedule configuration
3. Ensure user meets eligibility criteria
4. Check if notification was already sent (avoid duplicates)

**Timing issues:**

1. Verify server timezone settings
2. Check user's preferred study times
3. Ensure reminder timing calculations are correct
4. Test with different time scenarios

### Debug Logging

Enable detailed logging by setting:

```env
DEBUG_NOTIFICATIONS=true
```

This will log:

- Eligibility checks for each user
- Email sending attempts and results
- Timing calculations and scheduling decisions

## Performance Considerations

### Bulk Processing

- Process notifications in batches to avoid overwhelming email service
- Implement rate limiting for email sending
- Use database indexing for user queries
- Consider using a queue system for large user bases

### Database Optimization

Key indexes for performance:

```sql
-- User settings lookup
CREATE INDEX idx_users_notification_settings ON users USING HASH(settings.studyReminders, settings.weeklyProgressReport);

-- Activity queries for progress calculation
CREATE INDEX idx_user_activity_week ON user_activities(userId, createdAt);

-- Gamification profile lookup
CREATE INDEX idx_gamification_userId ON gamification_profiles(userId);
```

## Security Considerations

1. **Email Privacy**: Don't include sensitive information in emails
2. **Rate Limiting**: Prevent abuse of notification APIs
3. **Authentication**: Secure admin endpoints appropriately
4. **Data Handling**: Follow GDPR/privacy regulations for user data
5. **Unsubscribe**: Provide easy opt-out mechanisms

## Future Enhancements

### Potential Features

1. **Email Templates**: Visual template editor for administrators
2. **A/B Testing**: Test different email content and timing
3. **Advanced Analytics**: Open rates, click tracking, conversion metrics
4. **SMS Notifications**: Alternative notification channel
5. **Push Notifications**: Browser push notifications for web app
6. **Personalization**: AI-powered content customization
7. **Multi-language**: Localized emails based on user's native language

### Integration Opportunities

1. **Calendar Integration**: Sync with user's calendar for optimal timing
2. **Time Zone Detection**: Automatic timezone handling
3. **Learning Analytics**: Deeper insights into user behavior patterns
4. **Gamification**: Enhanced streak and achievement notifications

## Support

For issues or questions about the notification system:

1. Check the admin panel for system status and logs
2. Review user settings and onboarding data
3. Test with the provided API endpoints
4. Monitor email deliverability metrics
5. Contact the development team with specific error details

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** Production Ready
