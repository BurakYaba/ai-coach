import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Set route to be dynamically rendered at request time
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

    // Validate what can be updated - only allow specific fields
    const allowedUpdates: any = {
      name: data.name,
      learningPreferences: {
        dailyGoal: data.dailyGoal,
        preferredLearningTime: data.preferredLearningTime,
      },
    };

    // Handle onboarding data updates if provided
    if (data.onboarding) {
      const onboardingUpdates: any = {};

      // Only update provided onboarding fields
      if (data.onboarding.nativeLanguage !== undefined) {
        onboardingUpdates["onboarding.nativeLanguage"] =
          data.onboarding.nativeLanguage;
      }
      if (data.onboarding.country !== undefined) {
        onboardingUpdates["onboarding.country"] = data.onboarding.country;
      }
      if (data.onboarding.region !== undefined) {
        onboardingUpdates["onboarding.region"] = data.onboarding.region;
      }
      if (data.onboarding.preferredPracticeTime !== undefined) {
        onboardingUpdates["onboarding.preferredPracticeTime"] =
          data.onboarding.preferredPracticeTime;
      }
      if (data.onboarding.preferredLearningDays !== undefined) {
        onboardingUpdates["onboarding.preferredLearningDays"] =
          data.onboarding.preferredLearningDays;
      }
      if (data.onboarding.reasonsForLearning !== undefined) {
        onboardingUpdates["onboarding.reasonsForLearning"] =
          data.onboarding.reasonsForLearning;
      }
      if (data.onboarding.dailyStudyTimeGoal !== undefined) {
        onboardingUpdates["onboarding.dailyStudyTimeGoal"] =
          data.onboarding.dailyStudyTimeGoal;
      }
      if (data.onboarding.weeklyStudyTimeGoal !== undefined) {
        onboardingUpdates["onboarding.weeklyStudyTimeGoal"] =
          data.onboarding.weeklyStudyTimeGoal;
      }

      // Merge onboarding updates with allowed updates
      Object.assign(allowedUpdates, onboardingUpdates);
    }

    // Preserve existing topics if not provided to avoid overwriting them
    if (!data.topics) {
      const existingUser = await User.findById(session.user.id);
      if (existingUser && existingUser.learningPreferences?.topics) {
        allowedUpdates.learningPreferences.topics =
          existingUser.learningPreferences.topics;
      }
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
