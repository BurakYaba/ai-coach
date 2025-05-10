import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import UserActivity from "@/models/UserActivity";
import GamificationProfile from "@/models/GamificationProfile";
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

    // Get user's gamification profile using the safer service method
    const profile = await GamificationService.getUserProfile(userId);

    // Get module-specific activities
    const activities = await UserActivity.find({
      userId,
      module,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // Count distinct sessions using sessionId in metadata
    const sessions = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          module,
          activityType: "complete_session",
        },
      },
      {
        $group: {
          _id: "$metadata.sessionId",
        },
      },
    ]);

    // Get correct session count (either from distinct sessions or from profile)
    const moduleSessionCount =
      sessions.length ||
      profile.stats.moduleActivity[module as ModuleType] ||
      0;

    // Calculate total time spent (from metadata.duration if available)
    const totalTimeSpent = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          module,
          "metadata.duration": { $exists: true },
        },
      },
      { $group: { _id: null, total: { $sum: "$metadata.duration" } } },
    ]);

    const timeSpentMinutes =
      totalTimeSpent.length > 0 ? Math.floor(totalTimeSpent[0].total / 60) : 0;

    // Calculate total items completed (from metadata.itemsCompleted if available)
    const totalItems = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          module,
          "metadata.itemsCompleted": { $exists: true },
        },
      },
      { $group: { _id: null, total: { $sum: "$metadata.itemsCompleted" } } },
    ]);

    // If no metadata.itemsCompleted, use a more reliable count
    const itemsCompleted =
      totalItems.length > 0 ? totalItems[0].total : moduleSessionCount;

    // Calculate average score (from metadata.score if available)
    const scores = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          module,
          "metadata.score": { $exists: true, $gt: 0 },
        },
      },
      { $group: { _id: null, average: { $avg: "$metadata.score" } } },
    ]);

    const averageScore = scores.length > 0 ? Math.round(scores[0].average) : 0;

    // Calculate total XP earned for this module
    const totalXP = await UserActivity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), module } },
      { $group: { _id: null, total: { $sum: "$xpEarned" } } },
    ]);

    const moduleXP = totalXP.length > 0 ? totalXP[0].total : 0;

    // Get recent activities for this module, ensuring unique sessions
    const uniqueActivities = [];
    const seenSessionIds = new Set();

    for (const activity of activities) {
      const sessionId = activity.metadata?.sessionId;
      const activityType = activity.activityType;

      // For complete_session activities, only include each session once
      if (activityType === "complete_session" && sessionId) {
        if (seenSessionIds.has(sessionId)) {
          continue;
        }
        seenSessionIds.add(sessionId);
      }

      uniqueActivities.push(activity);
    }

    const recentActivity = uniqueActivities.map(activity => ({
      id: activity._id.toString(),
      date: activity.createdAt,
      xp: activity.xpEarned,
      description: `${activity.activityType.split("_").join(" ")} (${module})`,
      activityType: activity.activityType,
    }));

    // Get module level (calculate based on XP) - Using a linear formula for consistency
    const xpForModuleLevel = (level: number) => 100 * level;
    let moduleLevel = 1;
    let moduleXPSoFar = moduleXP;

    while (moduleXPSoFar >= xpForModuleLevel(moduleLevel)) {
      moduleXPSoFar -= xpForModuleLevel(moduleLevel);
      moduleLevel++;
    }

    const nextLevelXP = xpForModuleLevel(moduleLevel);
    const moduleProgress =
      moduleXPSoFar > 0 ? Math.floor((moduleXPSoFar / nextLevelXP) * 100) : 0;

    // Get achievements for this module
    const { achievements } = await import("@/lib/gamification/achievements");

    // Get all available achievements for this module
    const moduleAchievements = achievements.filter(
      achievement =>
        achievement.requirement.module === module ||
        (achievement.category === "milestone" &&
          !achievement.requirement.module)
    );

    // Get unlocked achievements for this user
    const unlockedAchievementIds = profile.achievements.map(a => a.id);

    // Count unlocked achievements for this module
    const unlockedModuleAchievements = moduleAchievements.filter(achievement =>
      unlockedAchievementIds.includes(achievement.id)
    );

    // Return the stats
    return NextResponse.json({
      stats: {
        totalSessions: moduleSessionCount,
        totalTimeSpent: timeSpentMinutes,
        completedItems: itemsCompleted,
        averageScore: averageScore,
        totalXP: moduleXP,
        recentActivity,
        level: {
          value: moduleLevel,
          progress: moduleProgress,
        },
        achievements: {
          total: moduleAchievements.length,
          unlocked: unlockedModuleAchievements.length,
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching ${params.module} stats:`, error);
    return NextResponse.json(
      { error: "Failed to fetch module stats" },
      { status: 500 }
    );
  }
}
