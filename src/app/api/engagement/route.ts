import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { GamificationService } from "@/lib/gamification/gamification-service";
import {
  sendStudyReminderEmail,
  sendWeeklyProgressEmail,
  sendAchievementEmail,
} from "@/lib/email";
import { calculateWeeklyProgress } from "@/lib/notifications/progress-calculator";

// POST /api/engagement - Trigger engagement emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { type, data } = await request.json();

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let result;

    switch (type) {
      case "study_reminder": {
        // Check if user has study reminders enabled
        if (!user.settings?.studyReminders) {
          return NextResponse.json({ message: "Study reminders disabled" });
        }

        // Get user's gamification profile for streak data
        const profile = await GamificationService.getUserProfile(
          session.user.id
        );

        result = await sendStudyReminderEmail(
          user.email,
          user.name,
          user.onboarding?.dailyStudyTimeGoal || 30,
          user.onboarding?.preferredPracticeTime || "evening",
          profile.streak?.current || 0
        );
        break;
      }

      case "weekly_progress": {
        // Check if user has weekly progress reports enabled
        if (!user.settings?.weeklyProgressReport) {
          return NextResponse.json({
            message: "Weekly progress reports disabled",
          });
        }

        // Calculate weekly progress data
        const weeklyData = await calculateWeeklyProgress(session.user.id);

        result = await sendWeeklyProgressEmail(
          user.email,
          user.name,
          weeklyData
        );
        break;
      }

      case "achievement":
        // Check if user has achievement notifications enabled
        if (!user.settings?.achievementNotifications) {
          return NextResponse.json({
            message: "Achievement notifications disabled",
          });
        }

        if (!data?.achievement) {
          return NextResponse.json(
            { error: "Achievement data required" },
            { status: 400 }
          );
        }

        result = await sendAchievementEmail(
          user.email,
          user.name,
          data.achievement
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid engagement type" },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        message: "Engagement email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending engagement email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/engagement - Get engagement status and preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select(
      "settings onboarding"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const engagementSettings = {
      studyReminders: user.settings?.studyReminders ?? true,
      weeklyProgressReport: user.settings?.weeklyProgressReport ?? true,
      achievementNotifications: user.settings?.achievementNotifications ?? true,
      streakReminders: user.settings?.streakReminders ?? true,
      reminderTiming: user.settings?.reminderTiming ?? "30",
      preferredStudyTime: user.onboarding?.preferredPracticeTime || "evening",
      dailyGoal: user.onboarding?.dailyStudyTimeGoal || 30,
      weeklyGoal: user.onboarding?.weeklyStudyTimeGoal || 210,
      studyDays: user.onboarding?.preferredLearningDays || [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
    };

    return NextResponse.json({ engagementSettings });
  } catch (error) {
    console.error("Error fetching engagement settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
