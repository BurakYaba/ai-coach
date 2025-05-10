import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import GamificationProfile from "@/models/GamificationProfile";
import { calculateLevelFromXP } from "@/lib/gamification/gamification-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { experience } = await req.json();

    // Ensure experience is provided
    if (typeof experience !== "number") {
      return NextResponse.json(
        { error: "Experience must be a number" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user's profile
    const profile = await GamificationProfile.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Gamification profile not found" },
        { status: 404 }
      );
    }

    // Calculate the correct level based on experience
    const { level, experienceToNextLevel } = calculateLevelFromXP(experience);

    // Save the previous level for the response
    const previousLevel = profile.level;

    // Update the level and experienceToNextLevel in the database
    profile.level = level;
    profile.experienceToNextLevel = experienceToNextLevel;
    await profile.save();

    // Log for debugging
    console.log(`Updated level for user ${userId}:`, {
      experience,
      previousLevel,
      newLevel: level,
      experienceToNextLevel,
    });

    return NextResponse.json({
      success: true,
      previousLevel,
      newLevel: level,
      experienceToNextLevel,
    });
  } catch (error) {
    console.error("Error updating level:", error);
    return NextResponse.json(
      { error: "Failed to update level" },
      { status: 500 }
    );
  }
}
