import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
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

    // Set up complete onboarding with default values
    user.onboarding = {
      completed: true,
      completedAt: new Date(),
      currentStep: 5, // Final step
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
        interests: [],
        timeAvailable: "30-60 minutes",
        preferredTime: "evening",
        learningStyle: "mixed",
      },
      recommendedPath: {
        primaryFocus: ["grammar", "vocabulary"],
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
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Onboarding skipped successfully. You can start exploring the modules or take assessments later for personalized recommendations.",
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    return NextResponse.json(
      { error: "Failed to skip onboarding. Please try again." },
      { status: 500 }
    );
  }
}
