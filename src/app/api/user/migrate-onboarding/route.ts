import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user needs migration
    const needsMigration =
      !user.onboarding ||
      typeof user.onboarding.completed === "undefined" ||
      !user.onboarding.nativeLanguage;

    if (!needsMigration) {
      return NextResponse.json({
        message: "User onboarding structure is already up to date",
        migrated: false,
      });
    }

    console.log(`Migrating onboarding structure for user ${user._id}`);

    // Initialize or update onboarding structure for old user
    user.onboarding = {
      completed: true, // Mark as completed for old users to skip onboarding flow
      currentStep: 5,
      language: user.onboarding?.language || "en",
      nativeLanguage: user.onboarding?.nativeLanguage || "",
      country: user.onboarding?.country || "",
      region: user.onboarding?.region || "",
      preferredPracticeTime: user.onboarding?.preferredPracticeTime || "",
      preferredLearningDays: user.onboarding?.preferredLearningDays || [],
      reminderTiming: user.onboarding?.reminderTiming || "1_hour",
      dailyStudyTimeGoal: user.onboarding?.dailyStudyTimeGoal || 30,
      weeklyStudyTimeGoal: user.onboarding?.weeklyStudyTimeGoal || 210,
      reasonsForLearning: user.onboarding?.reasonsForLearning || [],
      howHeardAbout: user.onboarding?.howHeardAbout || "",
      consentDataUsage: user.onboarding?.consentDataUsage || false,
      consentAnalytics: user.onboarding?.consentAnalytics || false,
      skillAssessment: user.onboarding?.skillAssessment || {
        completed: false,
        ceferLevel: "B1",
        weakAreas: ["grammar", "vocabulary"],
        strengths: ["reading"],
        assessmentDate: new Date(),
        scores: {
          reading: 50,
          writing: 40,
          listening: 45,
          speaking: 35,
          vocabulary: 40,
          grammar: 35,
        },
      },
      preferences: user.onboarding?.preferences || {
        learningGoals: ["general_fluency"],
        interests: [],
        timeAvailable: "30-60 minutes",
        preferredTime: "evening",
        learningStyle: "mixed",
        difficultyPreference: "moderate",
        focusAreas: [],
        strengths: [],
        weaknesses: [],
      },
      recommendedPath: user.onboarding?.recommendedPath || {
        primaryFocus: ["vocabulary", "grammar", "reading"],
        suggestedOrder: [
          "vocabulary",
          "reading",
          "grammar",
          "writing",
          "listening",
          "speaking",
          "games",
        ],
        estimatedWeeks: 12,
      },
      tours: user.onboarding?.tours || {
        completed: [],
        skipped: [],
      },
      moduleVisits: user.onboarding?.moduleVisits || {},
      completedAt: user.onboarding?.completedAt || new Date(),
    };

    // Also ensure other required fields exist
    if (!user.learningPreferences) {
      user.learningPreferences = {
        topics: ["general"],
        dailyGoal: 30,
        preferredLearningTime: ["morning"],
      };
    }

    if (!user.progress) {
      user.progress = {
        readingLevel: 1,
        writingLevel: 1,
        speakingLevel: 1,
        totalPoints: 0,
        streak: 0,
      };
    }

    if (!user.settings) {
      user.settings = {
        emailNotifications: true,
        progressReminders: true,
        theme: "light",
        weeklyProgressReport: true,
        achievementNotifications: true,
        streakReminders: true,
        studyReminders: true,
        reminderTiming: "1_hour",
      };
    }

    await user.save();

    console.log(`Successfully migrated user ${user._id}`);

    return NextResponse.json({
      message: "User onboarding structure migrated successfully",
      migrated: true,
      onboarding: user.onboarding,
    });
  } catch (error: any) {
    console.error("Error migrating user onboarding:", error);
    return NextResponse.json(
      {
        error: "Failed to migrate user onboarding",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
