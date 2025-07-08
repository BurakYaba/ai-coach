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

    // Return onboarding data (mainly for tour tracking)
    // Since onboarding is now completed by default, we just return the existing data
    const onboardingData = user.onboarding || {
      completed: true,
      currentStep: 5,
      language: "en",
      skillAssessment: {
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
      preferences: {
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

    return NextResponse.json({ onboarding: onboardingData });
  } catch (error) {
    console.error("Error fetching tour progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour progress" },
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
    const { tours, moduleVisits } = body;

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure onboarding is initialized (with completed state)
    if (!user.onboarding) {
      user.onboarding = {
        completed: true,
        currentStep: 7,
        language: "en",
        nativeLanguage: "",
        country: "",
        region: "",
        preferredPracticeTime: "",
        preferredLearningDays: [],
        reasonsForLearning: [],
        howHeardAbout: "",
        dailyStudyTimeGoal: 0,
        weeklyStudyTimeGoal: 0,
        consentDataUsage: false,
        consentAnalytics: false,
        skillAssessment: {
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
        preferences: {
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
    }

    // Ensure tours are properly initialized
    if (!user.onboarding.tours) {
      user.onboarding.tours = {
        completed: [],
        skipped: [],
      };
    }
    if (!user.onboarding.moduleVisits) {
      user.onboarding.moduleVisits = {};
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

    await user.save();

    return NextResponse.json({
      success: true,
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Error updating tour progress:", error);
    return NextResponse.json(
      { error: "Failed to update tour progress" },
      { status: 500 }
    );
  }
}
