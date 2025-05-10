import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import GamificationProfile from "@/models/GamificationProfile";
import { Achievement, achievements } from "@/lib/gamification/achievements";
import { GamificationService } from "@/lib/gamification/gamification-service";

type ModuleType =
  | "reading"
  | "writing"
  | "listening"
  | "speaking"
  | "vocabulary"
  | "grammar"
  | "games";

export async function GET(
  req: NextRequest,
  { params }: { params: { module: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { module } = params;

    // Validate module parameter
    const validModules: ModuleType[] = [
      "reading",
      "writing",
      "listening",
      "speaking",
      "vocabulary",
      "grammar",
      "games",
    ];
    if (!validModules.includes(module as ModuleType)) {
      return NextResponse.json({ error: "Invalid module" }, { status: 400 });
    }

    await dbConnect();

    // Get user's gamification profile using the improved service method
    // which handles duplicate key errors and race conditions
    const profile = await GamificationService.getUserProfile(userId);

    // Get all available achievements for this module
    const moduleAchievements = achievements.filter(
      achievement =>
        achievement.requirement.module === module ||
        (achievement.category === "milestone" &&
          !achievement.requirement.module)
    );

    // Get unlocked achievements for this user
    const unlockedAchievementIds = profile.achievements.map(a => a.id);

    // Mark achievements as unlocked and add unlocked date
    const achievementsWithStatus = moduleAchievements.map(achievement => {
      const isUnlocked = unlockedAchievementIds.includes(achievement.id);
      const unlockedAchievement = profile.achievements.find(
        a => a.id === achievement.id
      );

      return {
        ...achievement,
        unlocked: isUnlocked,
        unlockedAt: isUnlocked ? unlockedAchievement?.unlockedAt : undefined,
      };
    });

    return NextResponse.json({
      achievements: achievementsWithStatus,
    });
  } catch (error) {
    console.error(`Error fetching ${params.module} achievements:`, error);
    return NextResponse.json(
      { error: "Failed to fetch module achievements" },
      { status: 500 }
    );
  }
}
