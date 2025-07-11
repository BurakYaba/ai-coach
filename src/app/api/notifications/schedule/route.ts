import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  processStudyReminders,
  processWeeklyReports,
  shouldSendStudyReminder,
  shouldSendWeeklyProgress,
  sendStudyReminderToUser,
  sendWeeklyProgressToUser,
  getNotificationStats,
} from "@/lib/notifications/scheduler";

// POST /api/notifications/schedule - Trigger notification processing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow both authenticated users (for testing their own) and system calls
    const body = await request.json();
    const { action, userId, type } = body;

    // Validate admin access for bulk operations
    if (action === "process_all") {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Authentication required for bulk operations" },
          { status: 401 }
        );
      }

      // Check if user has admin role (you may want to implement proper admin check)
      // For now, we'll allow any authenticated user to run this for testing
    }

    let result;

    switch (action) {
      case "process_study_reminders":
        result = await processStudyReminders();
        break;

      case "process_weekly_reports":
        result = await processWeeklyReports();
        break;

      case "process_all": {
        const studyResult = await processStudyReminders();
        const weeklyResult = await processWeeklyReports();
        result = {
          studyReminders: studyResult,
          weeklyReports: weeklyResult,
          summary: {
            totalProcessed: studyResult.processed + weeklyResult.processed,
            totalSent: studyResult.sent + weeklyResult.sent,
            totalSkipped: studyResult.skipped + weeklyResult.skipped,
            totalFailed: studyResult.failed + weeklyResult.failed,
          },
        };
        break;
      }

      case "test_user_reminder": {
        if (!userId) {
          return NextResponse.json(
            { error: "userId required for user testing" },
            { status: 400 }
          );
        }

        // Check eligibility first
        const eligibility = await shouldSendStudyReminder(userId);
        if (type === "check_only") {
          return NextResponse.json({ eligibility });
        }

        // Send the reminder
        result = await sendStudyReminderToUser(userId);
        break;
      }

      case "test_user_weekly": {
        if (!userId) {
          return NextResponse.json(
            { error: "userId required for user testing" },
            { status: 400 }
          );
        }

        // Check eligibility first
        const weeklyEligibility = await shouldSendWeeklyProgress(userId);
        if (type === "check_only") {
          return NextResponse.json({ eligibility: weeklyEligibility });
        }

        // Send the weekly report
        result = await sendWeeklyProgressToUser(userId);
        break;
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use: process_study_reminders, process_weekly_reports, process_all, test_user_reminder, test_user_weekly",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in notification scheduling:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/notifications/schedule - Handle cron jobs and get notification status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const action = url.searchParams.get("action");

    // Check if this is a cron job request (no specific user or action params)
    const isCronJob = !userId && !action;

    if (isCronJob) {
      // This is being called by Vercel cron - process notifications automatically
      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentMinute = now.getUTCMinutes();
      const currentDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.

      let result;
      let action = "study_reminders";

      // Monday at 8:00 AM UTC - send weekly progress reports
      if (currentDay === 1 && currentHour === 8 && currentMinute === 0) {
        console.log("Cron job triggered: Processing weekly progress reports");
        result = await processWeeklyReports();
        action = "weekly_reports";
      } else {
        // All other times - send study reminders
        console.log(
          `Cron job triggered: Processing study reminders (${currentHour}:${currentMinute.toString().padStart(2, "0")} UTC)`
        );
        result = await processStudyReminders();
      }

      return NextResponse.json({
        success: true,
        cronJob: true,
        action,
        result,
        timestamp: new Date().toISOString(),
      });
    }

    // Regular GET request - return stats and user status
    const stats = await getNotificationStats(userId || undefined);

    // If checking for a specific user, also get their current eligibility
    let userStatus;
    if (userId) {
      const studyEligibility = await shouldSendStudyReminder(userId);
      const weeklyEligibility = await shouldSendWeeklyProgress(userId);

      userStatus = {
        studyReminder: studyEligibility,
        weeklyProgress: weeklyEligibility,
      };
    }

    return NextResponse.json({
      success: true,
      stats,
      userStatus,
      currentTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in notification GET request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
