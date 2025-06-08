import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return onboarding progress or default state
    const onboardingProgress = user.onboarding || {
      completed: false,
      currentStep: 0,
      skillAssessment: {
        completed: false,
        ceferLevel: "B1",
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
        interests: [],
        timeAvailable: "flexible",
        preferredTime: "evening",
        learningStyle: "mixed",
      },
      recommendedPath: {
        primaryFocus: [],
        suggestedOrder: [],
        estimatedWeeks: 12,
      },
      tours: {
        completed: [],
        skipped: [],
      },
      moduleVisits: {},
    };

    return NextResponse.json({ onboarding: onboardingProgress });
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding progress" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      currentStep,
      preferences,
      recommendedPath,
      completed,
      completedAt,
      skillAssessment,
      tours,
      moduleVisits,
      skipStep,
    } = body;

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize onboarding if it doesn't exist
    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        skillAssessment: {
          completed: false,
          ceferLevel: "B1",
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
          interests: [],
          timeAvailable: "flexible",
          preferredTime: "evening",
          learningStyle: "mixed",
        },
        recommendedPath: {
          primaryFocus: [],
          suggestedOrder: [],
          estimatedWeeks: 12,
        },
        tours: {
          completed: [],
          skipped: [],
        },
        moduleVisits: {},
      };
    }

    // Ensure onboarding tours are properly initialized
    if (!user.onboarding.tours) {
      user.onboarding.tours = {
        completed: [],
        skipped: [],
      };
    }
    if (!user.onboarding.moduleVisits) {
      user.onboarding.moduleVisits = {};
    }

    // Handle step skipping - if user wants to skip a specific step
    if (skipStep !== undefined) {
      const stepNumber =
        typeof skipStep === "number" ? skipStep : parseInt(skipStep);

      // Set defaults based on which step is being skipped
      if (stepNumber === 1) {
        // Skipping skill assessment
        user.onboarding.skillAssessment = {
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
        };
      } else if (stepNumber === 2) {
        // Skipping preferences
        user.onboarding.preferences = {
          ...user.onboarding.preferences,
          learningGoals: ["general_fluency"],
          timeAvailable: "30-60 minutes",
          learningStyle: "mixed",
        };
      }

      // Advance to next step
      user.onboarding.currentStep = Math.max(
        user.onboarding.currentStep,
        stepNumber + 1
      );
    }

    // Update fields if provided
    if (typeof currentStep === "number") {
      user.onboarding.currentStep = currentStep;
    }

    if (skillAssessment) {
      user.onboarding.skillAssessment = {
        completed: skillAssessment.completed || true,
        ceferLevel:
          skillAssessment.recommendedLevel ||
          skillAssessment.ceferLevel ||
          "B1",
        weakAreas: skillAssessment.weakAreas || [],
        strengths: skillAssessment.strengths || [],
        assessmentDate: new Date(),
        scores: {
          reading: skillAssessment.skillScores?.reading || 0,
          writing: skillAssessment.skillScores?.writing || 0,
          listening: skillAssessment.skillScores?.listening || 0,
          speaking: skillAssessment.skillScores?.speaking || 0,
          vocabulary: skillAssessment.skillScores?.vocabulary || 0,
          grammar: skillAssessment.skillScores?.grammar || 0,
        },
      };
    }

    if (preferences) {
      user.onboarding.preferences = {
        ...user.onboarding.preferences,
        ...preferences,
      };
    }

    if (recommendedPath) {
      user.onboarding.recommendedPath = {
        ...user.onboarding.recommendedPath,
        ...recommendedPath,
      };
    }

    // Handle tours updates - tours contains module names that are completed/skipped
    if (tours) {
      Object.keys(tours).forEach(module => {
        const tourData = tours[module];
        if (
          tourData.completed &&
          !user.onboarding!.tours.completed.includes(module)
        ) {
          user.onboarding!.tours.completed.push(module);
        }
        if (
          tourData.skipped &&
          !user.onboarding!.tours.skipped.includes(module)
        ) {
          user.onboarding!.tours.skipped.push(module);
        }
      });
    }

    // Handle module visits updates
    if (moduleVisits) {
      Object.keys(moduleVisits).forEach(module => {
        const existingVisit = user.onboarding!.moduleVisits[module];
        user.onboarding!.moduleVisits[module] = {
          firstVisit:
            existingVisit?.firstVisit ||
            new Date(moduleVisits[module].firstVisit),
          totalVisits:
            (existingVisit?.totalVisits || 0) +
            (moduleVisits[module].visitCount || 1),
          lastVisit: new Date(),
        };
      });
    }

    if (typeof completed === "boolean") {
      console.log(
        `Setting onboarding completed to ${completed} for user ${session.user.id}`
      );
      user.onboarding.completed = completed;
      if (completed && !user.onboarding.completedAt) {
        user.onboarding.completedAt = completedAt
          ? new Date(completedAt)
          : new Date();
        console.log(`Set completion date: ${user.onboarding.completedAt}`);
      }
    }

    await user.save();
    console.log(
      `User onboarding saved - completed: ${user.onboarding.completed}`
    );

    return NextResponse.json({
      success: true,
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding progress" },
      { status: 500 }
    );
  }
}
