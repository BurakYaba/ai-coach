import { dbConnect } from "@/lib/db";
import GamificationProfile, {
  IGamificationProfile,
} from "@/models/GamificationProfile";
import UserActivity, { IUserActivity } from "@/models/UserActivity";
import mongoose, { Document, Types } from "mongoose";

import { Achievement, achievements, getAchievementById } from "./achievements";
import { Badge, badges, getBadgeById } from "./badges";

// XP configuration
const XP_CONFIG = {
  reading: {
    complete_session: 20,
    correct_answer: 5,
    review_word: 2,
  },
  writing: {
    complete_session: 30,
    words_200_plus: 10,
    words_500_plus: 20,
  },
  listening: {
    complete_session: 20,
    correct_answer: 5,
  },
  speaking: {
    complete_session: 30,
    conversation_session: 40,
  },
  vocabulary: {
    review_word: 2,
    master_word: 5,
  },
  grammar: {
    complete_lesson: 15,
    complete_exercise: 10,
  },
  games: {
    complete_game: 15,
    // Bonus XP is dynamic based on score
  },
};

// Level calculation
export function calculateLevelFromXP(xp: number): {
  level: number;
  experienceToNextLevel: number;
} {
  let level = 1;
  while (xpForLevel(level) <= xp) {
    level++;
  }

  const currentLevelXP = level === 1 ? 0 : xpForLevel(level - 1);
  const nextLevelXP = xpForLevel(level);
  const experienceToNextLevel = nextLevelXP - currentLevelXP;

  return {
    level: level > 1 ? level - 1 : 1,
    experienceToNextLevel,
  };
}

// Calculate XP needed for a given level
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Calculate streak based on last activity and current date
export function calculateStreak(
  lastActivityDate: Date,
  currentStreak: number
): {
  current: number;
  lastActivity: Date;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActivity = new Date(
    lastActivityDate.getFullYear(),
    lastActivityDate.getMonth(),
    lastActivityDate.getDate()
  );

  // Calculate the difference in days
  const diffTime = today.getTime() - lastActivity.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If the last activity was today, maintain the streak
  if (diffDays === 0) {
    return { current: currentStreak, lastActivity: now };
  }

  // If the last activity was yesterday, increment the streak
  if (diffDays === 1) {
    return { current: currentStreak + 1, lastActivity: now };
  }

  // If the last activity was more than a day ago, reset the streak
  return { current: 1, lastActivity: now };
}

// Main gamification service class
export class GamificationService {
  // Get or create a user's gamification profile
  static async getUserProfile(
    userId: string
  ): Promise<IGamificationProfile & Document> {
    await dbConnect();

    // Convert string ID to ObjectId if needed
    const objectId = new mongoose.Types.ObjectId(userId);

    // Try to find existing profile
    let profile = await GamificationProfile.findOne({ userId: objectId });

    // Create new profile if none exists
    if (!profile) {
      profile = await GamificationProfile.create({
        userId: objectId,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        streak: {
          current: 0,
          longest: 0,
          lastActivity: new Date(),
        },
        achievements: [],
        badges: [],
        stats: {
          totalXP: 0,
          activeDays: 0,
          moduleActivity: {
            reading: 0,
            writing: 0,
            listening: 0,
            speaking: 0,
            vocabulary: 0,
            grammar: 0,
            games: 0,
          },
        },
      });
    }

    return profile;
  }

  // Award XP for an activity
  static async awardXP(
    userId: string,
    module: string,
    activityType: string,
    metadata: Record<string, any> = {}
  ): Promise<{
    xpAwarded: number;
    leveledUp: boolean;
    newLevel?: number;
    newAchievements: Achievement[];
    newBadges: Badge[];
    streakUpdated: boolean;
    currentStreak: number;
  }> {
    await dbConnect();
    const objectId = new mongoose.Types.ObjectId(userId);

    // Calculate XP based on activity
    const xpAmount = this.calculateXP(module, activityType, metadata);

    // Get user profile
    const profile = await this.getUserProfile(userId);

    // Check if we need to update streak
    const streakResult = this.updateStreak(profile);

    // Record the activity
    await UserActivity.create({
      userId: objectId,
      activityType,
      module,
      xpEarned: xpAmount,
      metadata,
    });

    // Update module activity count
    if (module in profile.stats.moduleActivity) {
      profile.stats.moduleActivity[
        module as keyof typeof profile.stats.moduleActivity
      ] += 1;
    }

    // Add XP to profile
    const newTotalXP = profile.experience + xpAmount;
    profile.experience = newTotalXP;
    profile.stats.totalXP += xpAmount;

    // Recalculate level
    const { level, experienceToNextLevel } = calculateLevelFromXP(newTotalXP);
    const leveledUp = level > profile.level;
    profile.level = level;
    profile.experienceToNextLevel = experienceToNextLevel;

    // Check for new achievements
    const newAchievements = await this.checkAchievements(userId, profile);

    // Check for new badges
    const newBadges = await this.checkBadges(userId, profile);

    // Save updated profile
    await profile.save();

    return {
      xpAwarded: xpAmount,
      leveledUp,
      newLevel: leveledUp ? level : undefined,
      newAchievements,
      newBadges,
      streakUpdated: streakResult.updated,
      currentStreak: profile.streak.current,
    };
  }

  // Calculate XP for an activity
  private static calculateXP(
    module: string,
    activityType: string,
    metadata: Record<string, any>
  ): number {
    // Make sure module exists in config
    if (!(module in XP_CONFIG)) {
      return 0;
    }

    const moduleConfig = XP_CONFIG[module as keyof typeof XP_CONFIG];

    // Check if activity type exists in module config
    if (!(activityType in moduleConfig)) {
      return 0;
    }

    // Base XP for the activity
    let xp = moduleConfig[activityType as keyof typeof moduleConfig] as number;

    // Additional XP based on metadata
    if (module === "writing") {
      // Bonus for longer writing submissions
      const wordCount = metadata.wordCount || 0;
      if (wordCount >= 500) {
        xp += XP_CONFIG.writing.words_500_plus;
      } else if (wordCount >= 200) {
        xp += XP_CONFIG.writing.words_200_plus;
      }
    } else if (module === "games") {
      // Bonus based on game score
      const score = metadata.score || 0;
      const maxScore = metadata.maxScore || 100;
      const scoreRatio = Math.min(score / maxScore, 1);
      const bonusXP = Math.floor(25 * scoreRatio); // Up to 25 bonus XP based on score
      xp += bonusXP;
    }

    return xp;
  }

  // Update user streak
  private static updateStreak(profile: IGamificationProfile & Document): {
    updated: boolean;
  } {
    const { current, lastActivity } = calculateStreak(
      profile.streak.lastActivity,
      profile.streak.current
    );

    // Check if streak changed
    const streakChanged = current !== profile.streak.current;

    // Update streak
    profile.streak.current = current;
    profile.streak.lastActivity = lastActivity;

    // Update longest streak if current streak is longer
    if (current > profile.streak.longest) {
      profile.streak.longest = current;
    }

    return { updated: streakChanged };
  }

  // Check for new achievements
  private static async checkAchievements(
    userId: string,
    profile: IGamificationProfile & Document
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];
    const userAchievementIds = profile.achievements.map(a => a.id);

    // Check each achievement
    for (const achievement of achievements) {
      // Skip achievements already earned
      if (userAchievementIds.includes(achievement.id)) {
        continue;
      }

      // Check if the achievement should be awarded
      const shouldAward = await this.checkAchievementRequirements(
        userId,
        achievement,
        profile
      );

      if (shouldAward) {
        // Add to profile
        profile.achievements.push({
          id: achievement.id,
          unlockedAt: new Date(),
        });

        // Add XP for the achievement
        profile.experience += achievement.xpReward;
        profile.stats.totalXP += achievement.xpReward;

        // Add to return list
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // Check if a specific achievement's requirements are met
  private static async checkAchievementRequirements(
    userId: string,
    achievement: Achievement,
    profile: IGamificationProfile & Document
  ): Promise<boolean> {
    const { type, value, module } = achievement.requirement;

    switch (type) {
      case "completion_count": {
        // Check number of completed sessions in a module
        if (!module) return false;

        const count = await UserActivity.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          module,
          activityType: "complete_session",
        });

        return count >= value;
      }

      case "mastered_words": {
        // Check number of mastered vocabulary words
        const count = await UserActivity.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          module: "vocabulary",
          activityType: "master_word",
        });

        return count >= value;
      }

      case "streak": {
        // Check current streak
        return profile.streak.current >= value;
      }

      case "level": {
        // Check user level
        return profile.level >= value;
      }

      case "total_xp": {
        // Check total XP
        return profile.stats.totalXP >= value;
      }

      case "active_days": {
        // Check number of active days
        return profile.stats.activeDays >= value;
      }

      case "all_modules": {
        // Check activity across all modules
        const modules = [
          "reading",
          "writing",
          "listening",
          "speaking",
          "vocabulary",
          "grammar",
          "games",
        ];

        const moduleActivities = await Promise.all(
          modules.map(m =>
            UserActivity.countDocuments({
              userId: new mongoose.Types.ObjectId(userId),
              module: m,
            })
          )
        );

        // Check if all modules have at least 'value' activities
        return moduleActivities.every(count => count >= value);
      }

      case "total_activities": {
        // Check total number of activities
        const count = await UserActivity.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
        });

        return count >= value;
      }

      default:
        return false;
    }
  }

  // Check for new badges
  private static async checkBadges(
    userId: string,
    profile: IGamificationProfile & Document
  ): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    const userBadgeIds = profile.badges.map(b => b.id);

    // For each module, check if the user qualifies for badges
    const modules = [
      "reading",
      "writing",
      "listening",
      "speaking",
      "vocabulary",
      "grammar",
      "games",
    ];

    for (const moduleType of modules) {
      // Check activity count for each module
      const activityCount =
        profile.stats.moduleActivity[
          moduleType as keyof typeof profile.stats.moduleActivity
        ];

      // Check for bronze badge (>= 10 activities)
      const bronzeBadgeId = `${moduleType}_bronze`;
      if (!userBadgeIds.includes(bronzeBadgeId) && activityCount >= 10) {
        const badge = getBadgeById(bronzeBadgeId);
        if (badge) {
          profile.badges.push({
            id: bronzeBadgeId,
            unlockedAt: new Date(),
          });
          newBadges.push(badge);
        }
      }

      // Check for silver badge (>= 50 activities)
      const silverBadgeId = `${moduleType}_silver`;
      if (!userBadgeIds.includes(silverBadgeId) && activityCount >= 50) {
        const badge = getBadgeById(silverBadgeId);
        if (badge) {
          profile.badges.push({
            id: silverBadgeId,
            unlockedAt: new Date(),
          });
          newBadges.push(badge);
        }
      }

      // Check for gold badge (>= 200 activities)
      const goldBadgeId = `${moduleType}_gold`;
      if (!userBadgeIds.includes(goldBadgeId) && activityCount >= 200) {
        const badge = getBadgeById(goldBadgeId);
        if (badge) {
          profile.badges.push({
            id: goldBadgeId,
            unlockedAt: new Date(),
          });
          newBadges.push(badge);
        }
      }
    }

    // Check cross-module badges

    // All-rounder badges (activity in all modules)
    const moduleWithActivity = modules.filter(
      moduleType =>
        profile.stats.moduleActivity[
          moduleType as keyof typeof profile.stats.moduleActivity
        ] > 0
    );

    // Bronze: Activity in all modules
    if (
      !userBadgeIds.includes("all_rounder_bronze") &&
      moduleWithActivity.length === modules.length
    ) {
      const badge = getBadgeById("all_rounder_bronze");
      if (badge) {
        profile.badges.push({
          id: "all_rounder_bronze",
          unlockedAt: new Date(),
        });
        newBadges.push(badge);
      }
    }

    // Silver: At least bronze badge in each module
    if (!userBadgeIds.includes("all_rounder_silver")) {
      const hasBronzeInAllModules = modules.every(moduleType =>
        userBadgeIds.includes(`${moduleType}_bronze`)
      );

      if (hasBronzeInAllModules) {
        const badge = getBadgeById("all_rounder_silver");
        if (badge) {
          profile.badges.push({
            id: "all_rounder_silver",
            unlockedAt: new Date(),
          });
          newBadges.push(badge);
        }
      }
    }

    // Streak badges
    const { current: currentStreak } = profile.streak;

    // Bronze: 7-day streak
    if (!userBadgeIds.includes("streak_master_bronze") && currentStreak >= 7) {
      const badge = getBadgeById("streak_master_bronze");
      if (badge) {
        profile.badges.push({
          id: "streak_master_bronze",
          unlockedAt: new Date(),
        });
        newBadges.push(badge);
      }
    }

    // Silver: 30-day streak
    if (!userBadgeIds.includes("streak_master_silver") && currentStreak >= 30) {
      const badge = getBadgeById("streak_master_silver");
      if (badge) {
        profile.badges.push({
          id: "streak_master_silver",
          unlockedAt: new Date(),
        });
        newBadges.push(badge);
      }
    }

    // Gold: 100-day streak
    if (!userBadgeIds.includes("streak_master_gold") && currentStreak >= 100) {
      const badge = getBadgeById("streak_master_gold");
      if (badge) {
        profile.badges.push({
          id: "streak_master_gold",
          unlockedAt: new Date(),
        });
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  // Get user achievements with details
  static async getUserAchievements(userId: string): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      icon: string;
      unlockedAt: Date;
    }>
  > {
    const profile = await this.getUserProfile(userId);

    return profile.achievements
      .map(achievement => {
        const achievementDetails = getAchievementById(achievement.id);
        if (!achievementDetails) return null;

        return {
          id: achievement.id,
          name: achievementDetails.name,
          description: achievementDetails.description,
          category: achievementDetails.category,
          icon: achievementDetails.icon,
          unlockedAt: achievement.unlockedAt,
        };
      })
      .filter(a => a !== null) as Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      icon: string;
      unlockedAt: Date;
    }>;
  }

  // Get user badges with details
  static async getUserBadges(userId: string): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      tier: string;
      category: string;
      unlockedAt: Date;
    }>
  > {
    const profile = await this.getUserProfile(userId);

    return profile.badges
      .map(badge => {
        const badgeDetails = getBadgeById(badge.id);
        if (!badgeDetails) return null;

        return {
          id: badge.id,
          name: badgeDetails.name,
          description: badgeDetails.description,
          icon: badgeDetails.icon,
          tier: badgeDetails.tier,
          category: badgeDetails.category,
          unlockedAt: badge.unlockedAt,
        };
      })
      .filter(b => b !== null) as Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      tier: string;
      category: string;
      unlockedAt: Date;
    }>;
  }

  // Get recent activities with XP earned
  static async getRecentActivities(
    userId: string,
    limit = 10
  ): Promise<IUserActivity[]> {
    await dbConnect();

    return UserActivity.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
