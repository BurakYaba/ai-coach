import dbConnect from "@/lib/db";
import User from "@/models/User";
import { GamificationService } from "@/lib/gamification/gamification-service";
import { sendStudyReminderEmail, sendWeeklyProgressEmail } from "@/lib/email";
import { sendStudyReminderEmailResend } from "@/lib/email-resend";
import { calculateWeeklyProgress } from "./progress-calculator";

// Notification tracking model
export interface NotificationLog {
  userId: string;
  type: "study_reminder" | "weekly_progress" | "achievement";
  sentAt: Date;
  status: "sent" | "failed" | "skipped";
  reason?: string;
  messageId?: string;
  provider?: string; // Track which email provider was used
}

// Email sending with intelligent fallback
async function sendEmailWithFallback(
  emailType: "study_reminder" | "weekly_progress",
  params: any
): Promise<{
  success: boolean;
  error?: string;
  messageId?: string;
  provider: string;
}> {
  // Try Resend first (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("Attempting to send email via Resend...");
      let result;

      if (emailType === "study_reminder") {
        result = await sendStudyReminderEmailResend(
          params.email,
          params.name,
          params.studyGoal,
          params.preferredTime,
          params.streakCount
        );
      } else if (emailType === "weekly_progress") {
        // For weekly progress, we need to use the regular email function
        // since sendWeeklyProgressEmailResend doesn't exist yet
        throw new Error(
          "Weekly progress not implemented in Resend, falling back to SMTP"
        );
      }

      if (result && result.success) {
        console.log(`Email sent successfully via Resend: ${result.messageId}`);
        return {
          success: true,
          messageId: result.messageId,
          provider: "resend",
        };
      }

      // If Resend returns error, fall back to SMTP
      console.log("Resend failed, falling back to SMTP:", result?.error);
      throw new Error(result?.error || "Resend failed");
    } catch (error) {
      console.log("Resend failed, attempting fallback to SMTP:", error);

      // Check if this is a rate limit error
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        errorMessage.includes("rate limit") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("limit")
      ) {
        console.log(
          "⚠️  Resend rate limit detected, switching to SMTP fallback"
        );
      }
    }
  }

  // Fallback to SMTP (GoDaddy)
  try {
    console.log("Sending email via SMTP fallback...");
    let result;

    if (emailType === "study_reminder") {
      result = await sendStudyReminderEmail(
        params.email,
        params.name,
        params.studyGoal,
        params.preferredTime,
        params.streakCount
      );
    } else if (emailType === "weekly_progress") {
      result = await sendWeeklyProgressEmail(
        params.email,
        params.name,
        params.progressData
      );
    }

    if (result && result.success) {
      console.log(`Email sent successfully via SMTP: ${result.messageId}`);
      return {
        success: true,
        messageId: result.messageId,
        provider: "smtp",
      };
    }

    return {
      success: false,
      error: result?.error || "SMTP also failed",
      provider: "smtp",
    };
  } catch (error) {
    console.error("Both Resend and SMTP failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "All email providers failed",
      provider: "none",
    };
  }
}

// Time conversion helpers
export function convertTimeToUTC(
  localTime: string,
  userTimezone: string = "UTC"
): Date {
  const now = new Date();
  const [hours, minutes] = parseTimeString(localTime);

  const localDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  // For now, we'll assume the user's local time
  // In production, you'd want to store user timezone and convert properly
  return localDate;
}

export function parseTimeString(timeString: string): [number, number] {
  // Parse practice time like "early_morning", "mid_morning", etc.
  const timeMap: { [key: string]: [number, number] } = {
    early_morning: [7, 0], // 7:00 AM
    mid_morning: [10, 30], // 10:30 AM
    afternoon: [14, 0], // 2:00 PM
    early_evening: [18, 30], // 6:30 PM
    late_evening: [20, 0], // 8:00 PM
  };

  return timeMap[timeString] || [18, 30]; // Default to early evening
}

export function parseReminderTiming(reminderTiming: string): number {
  // Convert reminder timing to minutes
  const timingMap: { [key: string]: number } = {
    "30_min": 30,
    "1_hour": 60,
    "2_hours": 120,
    "15": 15,
    "30": 30,
    "60": 60,
    "120": 120,
  };

  return timingMap[reminderTiming] || 30;
}

// Check if user should receive study reminder
export async function shouldSendStudyReminder(userId: string): Promise<{
  shouldSend: boolean;
  reason: string;
  scheduledTime?: Date;
}> {
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return { shouldSend: false, reason: "User not found" };
    }

    // Check if study reminders are enabled
    if (!user.settings?.studyReminders) {
      return { shouldSend: false, reason: "Study reminders disabled" };
    }

    // Check if user has valid study schedule
    const onboarding = user.onboarding;
    if (
      !onboarding?.preferredPracticeTime ||
      !onboarding?.preferredLearningDays?.length
    ) {
      return { shouldSend: false, reason: "No study schedule configured" };
    }

    // Check if today is a preferred learning day
    const today = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = dayNames[today.getDay()];

    if (!onboarding.preferredLearningDays.includes(todayName)) {
      return {
        shouldSend: false,
        reason: `Not a preferred learning day (${todayName})`,
      };
    }

    // Calculate when the reminder should be sent
    const [studyHour, studyMinute] = parseTimeString(
      onboarding.preferredPracticeTime
    );
    const reminderMinutes = parseReminderTiming(
      onboarding.reminderTiming || "30"
    );

    const studyTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      studyHour,
      studyMinute
    );
    const reminderTime = new Date(
      studyTime.getTime() - reminderMinutes * 60 * 1000
    );

    // Check if it's time to send the reminder (within 20 minutes window)
    // This accommodates the 15-minute cron job intervals
    const now = new Date();
    const timeDiff = now.getTime() - reminderTime.getTime();
    const withinWindow = timeDiff >= 0 && timeDiff <= 20 * 60 * 1000; // 20 minutes after scheduled time

    if (!withinWindow) {
      const futureReminder = timeDiff < 0;
      return {
        shouldSend: false,
        reason: futureReminder
          ? `Reminder scheduled for future. Scheduled: ${reminderTime.toLocaleTimeString()}, Current: ${now.toLocaleTimeString()}`
          : `Reminder window passed. Scheduled: ${reminderTime.toLocaleTimeString()}, Current: ${now.toLocaleTimeString()}`,
        scheduledTime: reminderTime,
      };
    }

    // Check if reminder was already sent today
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const lastReminder = await getLastNotification(userId, "study_reminder");

    if (lastReminder && lastReminder.sentAt >= todayStart) {
      return { shouldSend: false, reason: "Reminder already sent today" };
    }

    return {
      shouldSend: true,
      reason: "All conditions met",
      scheduledTime: reminderTime,
    };
  } catch (error) {
    console.error("Error checking study reminder eligibility:", error);
    return { shouldSend: false, reason: "Error checking eligibility" };
  }
}

// Check if user should receive weekly progress report
export async function shouldSendWeeklyProgress(userId: string): Promise<{
  shouldSend: boolean;
  reason: string;
}> {
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return { shouldSend: false, reason: "User not found" };
    }

    // Check if weekly progress reports are enabled
    if (!user.settings?.weeklyProgressReport) {
      return { shouldSend: false, reason: "Weekly progress reports disabled" };
    }

    // Check if it's Monday (start of week for progress reports)
    const today = new Date();
    const isMonday = today.getDay() === 1;

    if (!isMonday) {
      return { shouldSend: false, reason: "Not Monday (weekly report day)" };
    }

    // Check if it's morning (around 9 AM)
    const hour = today.getHours();
    if (hour < 8 || hour > 11) {
      return {
        shouldSend: false,
        reason: "Not within morning window (8-11 AM)",
      };
    }

    // Check if weekly report was already sent this week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);

    const lastWeeklyReport = await getLastNotification(
      userId,
      "weekly_progress"
    );

    if (lastWeeklyReport && lastWeeklyReport.sentAt >= weekStart) {
      return {
        shouldSend: false,
        reason: "Weekly report already sent this week",
      };
    }

    return { shouldSend: true, reason: "All conditions met" };
  } catch (error) {
    console.error("Error checking weekly progress eligibility:", error);
    return { shouldSend: false, reason: "Error checking eligibility" };
  }
}

// Send study reminder to a user
export async function sendStudyReminderToUser(userId: string): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Get user's gamification profile for streak data
    const profile = await GamificationService.getUserProfile(userId);

    // Use intelligent fallback system
    const result = await sendEmailWithFallback("study_reminder", {
      email: user.email,
      name: user.name,
      studyGoal: user.onboarding?.dailyStudyTimeGoal || 30,
      preferredTime: user.onboarding?.preferredPracticeTime || "evening",
      streakCount: profile.streak?.current || 0,
    });

    // Enhanced logging with provider info
    await logNotification({
      userId,
      type: "study_reminder",
      sentAt: new Date(),
      status: result.success ? "sent" : "failed",
      reason: result.success
        ? `Successfully sent via ${result.provider}`
        : result.error,
      messageId: result.messageId,
      provider: result.provider,
    });

    return {
      success: result.success,
      message: result.success
        ? "Study reminder sent successfully"
        : result.error || "Failed to send reminder",
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending study reminder:", error);

    await logNotification({
      userId,
      type: "study_reminder",
      sentAt: new Date(),
      status: "failed",
      reason: error instanceof Error ? error.message : "Unknown error",
    });

    return { success: false, message: "Error sending study reminder" };
  }
}

// Send weekly progress report to a user
export async function sendWeeklyProgressToUser(userId: string): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Calculate weekly progress data
    const weeklyData = await calculateWeeklyProgress(userId);

    // Use intelligent fallback system
    const result = await sendEmailWithFallback("weekly_progress", {
      email: user.email,
      name: user.name,
      progressData: weeklyData,
    });

    // Enhanced logging with provider info
    await logNotification({
      userId,
      type: "weekly_progress",
      sentAt: new Date(),
      status: result.success ? "sent" : "failed",
      reason: result.success
        ? `Successfully sent via ${result.provider}`
        : result.error,
      messageId: result.messageId,
      provider: result.provider,
    });

    return {
      success: result.success,
      message: result.success
        ? "Weekly progress report sent successfully"
        : result.error || "Failed to send report",
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending weekly progress report:", error);

    await logNotification({
      userId,
      type: "weekly_progress",
      sentAt: new Date(),
      status: "failed",
      reason: error instanceof Error ? error.message : "Unknown error",
    });

    return { success: false, message: "Error sending weekly progress report" };
  }
}

// Process notifications for all eligible users
export async function processStudyReminders(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
  results: Array<{ userId: string; status: string; message: string }>;
}> {
  const results = [];
  let processed = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  try {
    await dbConnect();

    // Get all users with study reminders enabled
    const users = await User.find({
      "settings.studyReminders": true,
      "onboarding.completed": true,
    }).select("_id name email onboarding settings");

    console.log(`Processing study reminders for ${users.length} users`);

    for (const user of users) {
      processed++;

      try {
        // Check if user should receive reminder
        const eligibility = await shouldSendStudyReminder(user._id.toString());

        if (!eligibility.shouldSend) {
          skipped++;
          results.push({
            userId: user._id.toString(),
            status: "skipped",
            message: eligibility.reason,
          });
          continue;
        }

        // Send the reminder
        const result = await sendStudyReminderToUser(user._id.toString());

        if (result.success) {
          sent++;
          results.push({
            userId: user._id.toString(),
            status: "sent",
            message: result.message,
          });
        } else {
          failed++;
          results.push({
            userId: user._id.toString(),
            status: "failed",
            message: result.message,
          });
        }
      } catch (error) {
        failed++;
        results.push({
          userId: user._id.toString(),
          status: "failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(
      `Study reminders processed: ${processed} total, ${sent} sent, ${skipped} skipped, ${failed} failed`
    );

    return { processed, sent, skipped, failed, results };
  } catch (error) {
    console.error("Error processing study reminders:", error);
    throw error;
  }
}

// Process weekly progress reports for all eligible users
export async function processWeeklyReports(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
  results: Array<{ userId: string; status: string; message: string }>;
}> {
  const results = [];
  let processed = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  try {
    await dbConnect();

    // Get all users with weekly progress reports enabled
    const users = await User.find({
      "settings.weeklyProgressReport": true,
      "onboarding.completed": true,
    }).select("_id name email onboarding settings");

    console.log(`Processing weekly progress reports for ${users.length} users`);

    for (const user of users) {
      processed++;

      try {
        // Check if user should receive weekly report
        const eligibility = await shouldSendWeeklyProgress(user._id.toString());

        if (!eligibility.shouldSend) {
          skipped++;
          results.push({
            userId: user._id.toString(),
            status: "skipped",
            message: eligibility.reason,
          });
          continue;
        }

        // Send the weekly report
        const result = await sendWeeklyProgressToUser(user._id.toString());

        if (result.success) {
          sent++;
          results.push({
            userId: user._id.toString(),
            status: "sent",
            message: result.message,
          });
        } else {
          failed++;
          results.push({
            userId: user._id.toString(),
            status: "failed",
            message: result.message,
          });
        }
      } catch (error) {
        failed++;
        results.push({
          userId: user._id.toString(),
          status: "failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(
      `Weekly reports processed: ${processed} total, ${sent} sent, ${skipped} skipped, ${failed} failed`
    );

    return { processed, sent, skipped, failed, results };
  } catch (error) {
    console.error("Error processing weekly reports:", error);
    throw error;
  }
}

// Simple in-memory notification log (in production, use database)
const notificationLogs: NotificationLog[] = [];

async function logNotification(log: NotificationLog): Promise<void> {
  notificationLogs.push(log);
  // In production, save to database
  console.log(`Notification logged:`, {
    userId: log.userId,
    type: log.type,
    status: log.status,
    reason: log.reason,
  });
}

async function getLastNotification(
  userId: string,
  type: string
): Promise<NotificationLog | null> {
  // In production, query from database
  const userLogs = notificationLogs
    .filter(log => log.userId === userId && log.type === type)
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

  return userLogs[0] || null;
}

// Get notification statistics
export async function getNotificationStats(userId?: string): Promise<{
  total: number;
  sent: number;
  failed: number;
  byType: Record<string, number>;
  recent: NotificationLog[];
}> {
  const logs = userId
    ? notificationLogs.filter(log => log.userId === userId)
    : notificationLogs;

  const total = logs.length;
  const sent = logs.filter(log => log.status === "sent").length;
  const failed = logs.filter(log => log.status === "failed").length;

  const byType = logs.reduce(
    (acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const recent = logs
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    .slice(0, 10);

  return { total, sent, failed, byType, recent };
}
