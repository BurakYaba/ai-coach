import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function migrateUsersForOnboarding() {
  try {
    await dbConnect();

    console.log("Starting onboarding migration for existing users...");

    // Find users that don't have onboarding field yet
    const users = await User.find({
      $or: [
        { onboarding: { $exists: false } },
        { "onboarding.completed": { $exists: false } },
      ],
    });

    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;

    for (const user of users) {
      try {
        // Set onboarding as completed for existing users to skip the process
        user.onboarding = {
          completed: true, // Existing users skip onboarding
          currentStep: 5, // Mark as completed
          skillAssessment: {
            completed: false,
            ceferLevel: "B1", // Default level based on existing languageLevel
            weakAreas: [],
            strengths: [],
            assessmentDate: new Date(),
            scores: {
              reading: 0,
              writing: 0,
              listening: 0,
              speaking: 0,
              vocabulary: 0,
              grammar: 0,
            },
          },
          preferences: {
            learningGoals: [],
            interests: user.learningPreferences?.topics || [],
            timeAvailable: "flexible",
            preferredTime:
              user.learningPreferences?.preferredLearningTime?.[0] || "evening",
            learningStyle: "mixed",
          },
          recommendedPath: {
            primaryFocus: ["reading", "writing", "vocabulary"],
            suggestedOrder: ["reading", "vocabulary", "writing", "grammar"],
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
          console.log(`Migrated ${migratedCount} users...`);
        }
      } catch (error) {
        console.error(`Error migrating user ${user._id}:`, error);
      }
    }

    console.log(`Successfully migrated ${migratedCount} users for onboarding`);
    return { success: true, migratedCount };
  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Function to run migration if this file is executed directly
if (require.main === module) {
  migrateUsersForOnboarding()
    .then(result => {
      if (result.success) {
        console.log("Migration completed successfully");
        process.exit(0);
      } else {
        console.error("Migration failed:", result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("Migration error:", error);
      process.exit(1);
    });
}
