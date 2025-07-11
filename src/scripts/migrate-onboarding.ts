import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function migrateUsersForOnboarding() {
  try {
    await dbConnect();

    console.log(
      "Starting onboarding migration - marking all users as completed..."
    );

    // Find all users and ensure they have completed onboarding
    const users = await User.find({});

    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;

    for (const user of users) {
      try {
        // Set onboarding as completed for all users (onboarding system removed)
        user.onboarding = {
          completed: true, // All users skip onboarding
          currentStep: 5, // Mark as completed
          language: "en" as "en" | "tr", // Default language with proper typing
          nativeLanguage: "turkish", // Default native language
          country: "turkey", // Default country
          region: "Istanbul", // Default region
          preferredPracticeTime: "early_evening", // Default practice time
          preferredLearningDays: ["monday", "wednesday", "friday"], // Default learning days
          reminderTiming: "1_hour", // Default reminder timing
          reasonsForLearning: ["work", "travel"], // Default reasons
          howHeardAbout: "search_engine", // Default referral source
          dailyStudyTimeGoal: 30, // Default daily study time goal
          weeklyStudyTimeGoal: 210, // Default weekly study time goal
          consentDataUsage: true, // Default consent
          consentAnalytics: true, // Default analytics consent
          skillAssessment: {
            completed: false,
            ceferLevel: "B1", // Default intermediate level
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
          preferences: {
            learningGoals: ["general_fluency"],
            interests: user.learningPreferences?.topics || [],
            timeAvailable: "30-60 minutes",
            preferredTime:
              user.learningPreferences?.preferredLearningTime?.[0] || "evening",
            learningStyle: "mixed",
            difficultyPreference: "moderate",
            focusAreas: [],
            strengths: [],
            weaknesses: [],
          },
          recommendedPath: {
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
          tours: {
            completed: [],
            skipped: [],
          },
          moduleVisits: {},
          completedAt: new Date(),
        };

        await user.save();
        migratedCount++;

        if (migratedCount % 100 === 0) {
          console.log(`Migrated ${migratedCount} users so far...`);
        }
      } catch (error) {
        console.error(`Error migrating user ${user._id}:`, error);
      }
    }

    console.log(
      `Migration completed successfully! Migrated ${migratedCount} out of ${users.length} users.`
    );
    return { success: true, migratedCount, totalUsers: users.length };
  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUsersForOnboarding()
    .then(result => {
      console.log("Migration result:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
