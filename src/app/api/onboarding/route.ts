import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
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

    return NextResponse.json({
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { step, data } = body;

    if (!step || !data) {
      return NextResponse.json(
        { error: "Missing step or data" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update onboarding data based on step
    switch (step) {
      case 1: // Native language
        user.onboarding.nativeLanguage = data.nativeLanguage;
        user.onboarding.currentStep = 2;
        break;

      case 2: // Country and region
        user.onboarding.country = data.country;
        user.onboarding.region = data.region;
        user.onboarding.currentStep = 3;
        break;

      case 3: // Preferred practice time and learning days
        user.onboarding.preferredPracticeTime = data.preferredPracticeTime;
        user.onboarding.preferredLearningDays = data.preferredLearningDays;
        user.onboarding.currentStep = 4;
        break;

      case 4: // Reasons for learning English
        user.onboarding.reasonsForLearning = data.reasonsForLearning;
        user.onboarding.currentStep = 5;
        break;

      case 5: // How heard about Fluenta AI
        user.onboarding.howHeardAbout = data.howHeardAbout;
        user.onboarding.currentStep = 6;
        break;

      case 6: // Study time goals
        user.onboarding.dailyStudyTimeGoal = data.dailyStudyTimeGoal;
        user.onboarding.weeklyStudyTimeGoal = data.weeklyStudyTimeGoal;
        user.onboarding.currentStep = 7;
        break;

      case 7: // Consent
        user.onboarding.consentDataUsage = data.consentDataUsage;
        user.onboarding.consentAnalytics = data.consentAnalytics;
        user.onboarding.completed = true;
        user.onboarding.completedAt = new Date();
        break;

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      onboarding: user.onboarding,
      isCompleted: user.onboarding.completed,
    });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
