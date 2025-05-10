import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import GamificationProfile from "@/models/GamificationProfile";
import { calculateLevelFromXP } from "@/lib/gamification/gamification-service";

export async function POST(req: NextRequest) {
  try {
    // Require authentication and ensure it's an admin user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For added security, you could check if the user is an admin here

    await dbConnect();

    // Get all profiles
    const profiles = await GamificationProfile.find({});
    const results = [];
    let updatedCount = 0;

    // Process each profile
    for (const profile of profiles) {
      const { level: calculatedLevel, experienceToNextLevel } =
        calculateLevelFromXP(profile.experience);

      // Check if there's a discrepancy
      if (calculatedLevel !== profile.level) {
        const oldLevel = profile.level;

        // Update the profile
        profile.level = calculatedLevel;
        profile.experienceToNextLevel = experienceToNextLevel;
        await profile.save();

        results.push({
          userId: profile.userId,
          experience: profile.experience,
          oldLevel,
          newLevel: calculatedLevel,
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Checked ${profiles.length} profiles, updated ${updatedCount} levels`,
      updatedProfiles: results,
    });
  } catch (error) {
    console.error("Error syncing levels:", error);
    return NextResponse.json(
      { error: "Failed to sync levels" },
      { status: 500 }
    );
  }
}
