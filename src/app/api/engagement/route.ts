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

// Helper function to calculate weekly progress
async function calculateWeeklyProgress(userId: string) {
  try {
    const user = await User.findById(userId);
    const profile = await GamificationService.getUserProfile(userId);

    // Get weekly goal from user onboarding
    const weeklyGoal = user?.onboarding?.weeklyStudyTimeGoal || 210; // default 30 min * 7 days

    // Calculate actual study time for the past week
    // This would typically involve querying activity logs
    // For now, we'll use mock data based on the user's activity
    const actualStudyTime = Math.floor(weeklyGoal * 0.75); // Mock: 75% of goal achieved

    // Get strongest skill and improvement area from skill assessment
    const skillAssessment = user?.onboarding?.skillAssessment;
    const scores = skillAssessment?.scores || {};

    let strongestSkill = "reading";
    let improvementArea = "speaking";
    let highestScore = 0;
    let lowestScore = 100;

    Object.entries(scores).forEach(([skill, score]) => {
      const numericScore = typeof score === "number" ? score : 0;
      if (numericScore > highestScore) {
        highestScore = numericScore;
        strongestSkill = skill;
      }
      if (numericScore < lowestScore) {
        lowestScore = numericScore;
        improvementArea = skill;
      }
    });

    // Mock XP earned this week (would be calculated from actual activity)
    const xpEarned = Math.floor(Math.random() * 500) + 200;

    // Mock completed sessions (would be calculated from actual activity)
    const completedSessions = Math.floor(
      actualStudyTime / (user?.onboarding?.dailyStudyTimeGoal || 30)
    );

    // Mock recent achievements (would be fetched from recent activity)
    const achievements =
      profile.achievements.length > 0
        ? profile.achievements.slice(-2).map(a => a.id)
        : [];

    return {
      weeklyGoal,
      actualStudyTime,
      streakCount: profile.streak?.current || 0,
      completedSessions,
      strongestSkill:
        strongestSkill.charAt(0).toUpperCase() + strongestSkill.slice(1),
      improvementArea:
        improvementArea.charAt(0).toUpperCase() + improvementArea.slice(1),
      xpEarned,
      level: profile.level,
      achievements,
    };
  } catch (error) {
    console.error("Error calculating weekly progress:", error);
    // Return default data if calculation fails
    return {
      weeklyGoal: 210,
      actualStudyTime: 150,
      streakCount: 0,
      completedSessions: 5,
      strongestSkill: "Reading",
      improvementArea: "Speaking",
      xpEarned: 250,
      level: 1,
      achievements: [],
    };
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
