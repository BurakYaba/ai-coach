import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { GamificationService } from "@/lib/gamification/gamification-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mark onboarding as completed
    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        language: "en",
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

    user.onboarding.completed = true;
    user.onboarding.completedAt = new Date();
    user.onboarding.currentStep = 5; // Final step

    await user.save();

    // Create gamification profile for the user
    try {
      await GamificationService.getUserProfile(session.user.id);
    } catch (error) {
      // Don't fail the onboarding completion if gamification profile creation fails
    }

    // Signal that the JWT token should be refreshed
    // This will be handled by the frontend after the redirect
    const response = NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      redirect: "/dashboard",
      forceRefresh: true, // Signal that JWT should be refreshed
    });

    // Add headers to prevent caching
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
