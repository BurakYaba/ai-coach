import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

// Mark this route as dynamic since it uses getServerSession
export const dynamic = "force-dynamic";

// GET /api/user/profile - Get current user profile
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

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// Helper function to ensure old users have proper onboarding structure
function ensureOnboardingStructure(user: any) {
  if (!user.onboarding) {
    // Initialize onboarding structure for old users
    user.onboarding = {
      completed: true, // Mark as completed for old users to skip onboarding flow
      currentStep: 5,
      language: "en",
      nativeLanguage: "",
      preferredPracticeTime: "",
      preferredLearningDays: [],
      reminderTiming: "1_hour",
      reasonsForLearning: [],
      howHeardAbout: "",
      consentDataUsage: false,
      consentAnalytics: false,
    };
    console.log(`Initialized onboarding structure for old user ${user._id}`);
  }

  // Ensure all required fields exist with defaults
  const defaults = {
    nativeLanguage: "",
    preferredPracticeTime: "",
    preferredLearningDays: [],
    reminderTiming: "1_hour",
    reasonsForLearning: [],
    howHeardAbout: "",
    consentDataUsage: false,
    consentAnalytics: false,
  };

  Object.keys(defaults).forEach(key => {
    if ((user.onboarding as any)[key] === undefined) {
      (user.onboarding as any)[key] = (defaults as any)[key];
    }
  });
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const data = await request.json();

    await dbConnect();

    // First, get the current user to check their structure
    const existingUser = await User.findById(session.user.id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure onboarding structure exists for old users
    ensureOnboardingStructure(existingUser);

    // Build update object
    const updateObject: any = {};

    // Handle basic profile updates
    if (data.name !== undefined) {
      updateObject.name = data.name;
    }

    if (
      data.dailyGoal !== undefined ||
      data.preferredLearningTime !== undefined
    ) {
      updateObject.learningPreferences = {
        ...existingUser.learningPreferences,
        ...(data.dailyGoal !== undefined && { dailyGoal: data.dailyGoal }),
        ...(data.preferredLearningTime !== undefined && {
          preferredLearningTime: data.preferredLearningTime,
        }),
      };
    }

    // Handle onboarding data updates if provided
    if (data.onboarding) {
      // Build onboarding update object - properly typed
      const onboardingUpdate: any = { ...existingUser.onboarding };

      if (data.onboarding.nativeLanguage !== undefined) {
        onboardingUpdate.nativeLanguage = data.onboarding.nativeLanguage;
      }
      if (data.onboarding.preferredPracticeTime !== undefined) {
        onboardingUpdate.preferredPracticeTime =
          data.onboarding.preferredPracticeTime;
      }
      if (data.onboarding.preferredLearningDays !== undefined) {
        onboardingUpdate.preferredLearningDays =
          data.onboarding.preferredLearningDays;
      }
      if (data.onboarding.reminderTiming !== undefined) {
        onboardingUpdate.reminderTiming = data.onboarding.reminderTiming;
      }
      if (data.onboarding.reasonsForLearning !== undefined) {
        onboardingUpdate.reasonsForLearning =
          data.onboarding.reasonsForLearning;
      }
      if (data.onboarding.howHeardAbout !== undefined) {
        onboardingUpdate.howHeardAbout = data.onboarding.howHeardAbout;
      }
      if (data.onboarding.consentDataUsage !== undefined) {
        onboardingUpdate.consentDataUsage = data.onboarding.consentDataUsage;
      }
      if (data.onboarding.consentAnalytics !== undefined) {
        onboardingUpdate.consentAnalytics = data.onboarding.consentAnalytics;
      }

      updateObject.onboarding = onboardingUpdate;
    }

    // Preserve existing topics if not provided
    if (!data.topics && existingUser.learningPreferences?.topics) {
      if (!updateObject.learningPreferences) {
        updateObject.learningPreferences = {
          ...existingUser.learningPreferences,
        };
      }
      updateObject.learningPreferences.topics =
        existingUser.learningPreferences.topics;
    }

    // Perform the update
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    // Save user
    await user.save();

    // Force JWT refresh to update session with new profile data
    await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    console.error("❌ Profile Update Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update user profile",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
