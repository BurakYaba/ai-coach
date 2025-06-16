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
    complete_session: 5,
    correct_answer: 5,
    review_word: 2,
  },
  writing: {
    complete_session: 30,
    words_200_plus: 10,
    words_500_plus: 20,
  },
  listening: {
    complete_session: 5,
    correct_answer: 2,
    review_word: 2,
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

// Calculate XP needed for a given level
export function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 0; // Level 1 starts at 0 XP
  if (level === 2) return 100; // Level 2 starts at 100 XP

  // For Level 3 and above, use increasing XP requirements
  // Level 3: 250 XP (100 + 150)
  // Level 4: 450 XP (100 + 150 + 200)
  // Level 5: 700 XP (100 + 150 + 200 + 250)
  // And so on...

  let totalXP = 100; // Starting with requirement for Level 2
  let increment = 150; // Initial increment (for Level 3)

  for (let i = 3; i <= level; i++) {
    totalXP += increment;
    increment += 50; // Each level requires 50 more XP than the previous increment
  }

  return totalXP;
}

// Level calculation
export function calculateLevelFromXP(xp: number): {
  level: number;
  experienceToNextLevel: number;
  currentLevelXP?: number;
  nextLevelXP?: number;
  xpSinceCurrentLevel?: number;
  xpNeededForNextLevel?: number;
  progressPercentage?: number;
} {
  // Handle special case of 0 XP
  if (xp === 0) {
    return {
      level: 1,
      experienceToNextLevel: 100, // Need 100 XP to reach level 2
      currentLevelXP: 0,
      nextLevelXP: 100,
      xpSinceCurrentLevel: 0,
      xpNeededForNextLevel: 100,
      progressPercentage: 0,
    };
  }

  // FIXED: Adjust level calculation to match user expectations
  // Find the level where user's XP puts them
  let level = 1;
  while (xp >= xpForLevel(level)) {
    level++;
  }

  // Adjust back since we went one level too far
  level--;

  // Add 1 to level to match user expectations (100 XP = Level 2, not Level 1)
  level += 1;

  // Ensure level is at least 1
  level = Math.max(level, 1);

  // FIXED: Calculate XP thresholds based on the adjusted level
  // Since we've adjusted the level, we need to adjust the thresholds too
  const currentLevelXP = xpForLevel(level - 1); // XP threshold for current level
  const nextLevelXP = xpForLevel(level); // XP threshold for next level

  // Calculate XP progress within current level
  const xpSinceCurrentLevel = xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  // Calculate percentage progress to next level
  const progressPercentage = (xpSinceCurrentLevel / xpNeededForNextLevel) * 100;

  // Log detailed debugging information
  console.log("XP Calculation Debug:", {
    userTotalXP: xp,
    currentLevel: level,
    currentLevelThreshold: currentLevelXP,
    nextLevelThreshold: nextLevelXP,
    xpSinceCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  });

  return {
    level,
    experienceToNextLevel: xpNeededForNextLevel, // Total XP difference between levels
    currentLevelXP,
    nextLevelXP,
    xpSinceCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
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

    try {
      // Use findOneAndUpdate with upsert to safely get or create the profile
      // This handles the race condition that can cause duplicate key errors
      const profile = await GamificationProfile.findOneAndUpdate(
        { userId: objectId },
        {
          $setOnInsert: {
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
          },
        },
        {
          upsert: true, // Create if doesn't exist
          new: true, // Return the updated/created document
          runValidators: true, // Validate the document before saving
        }
      );

      return profile;
    } catch (error) {
      console.error("Error getting/creating gamification profile:", error);

      // If we still get an error, attempt one more time with a simple find
      // This should handle any race conditions that occurred
      const existingProfile = await GamificationProfile.findOne({
        userId: objectId,
      });

      if (existingProfile) {
        return existingProfile;
      }

      // If no profile exists and we can't create one, throw the error
      throw error;
    }
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

    // Check for duplicate activity if sessionId is provided
    let isDuplicate = false;
    if (
      metadata.sessionId &&
      (activityType === "complete_session" ||
        activityType === "conversation_session")
    ) {
      const existingActivity = await UserActivity.findOne({
        userId: objectId,
        module,
        $or: [
          { activityType: "complete_session" },
          { activityType: "conversation_session" },
        ],
        "metadata.sessionId": metadata.sessionId,
      });

      if (existingActivity) {
        console.log(
          `Duplicate activity detected for session ${metadata.sessionId}, skipping record creation`
        );
        isDuplicate = true;
      }
    }

    // Record the activity - but only if it's not a duplicate and meets other criteria
    const shouldRecordActivity =
      !isDuplicate &&
      (activityType === "complete_session" ||
        activityType === "conversation_session" ||
        !metadata.isPartOfCompletedSession);

    if (shouldRecordActivity) {
      await UserActivity.create({
        userId: objectId,
        activityType,
        module,
        xpEarned: xpAmount,
        metadata,
      });
    }

    // Update module activity count - only for session completion activities to avoid double counting
    // Also do not increment count for activities that are part of a completed session or duplicates
    if (
      module in profile.stats.moduleActivity &&
      !isDuplicate &&
      (activityType === "complete_session" ||
        activityType === "conversation_session" ||
        !metadata.isPartOfCompletedSession)
    ) {
      // Only increment the count if:
      // 1. It's a complete_session or conversation_session activity OR
      // 2. It's NOT marked as part of a completed session
      // 3. It's NOT a duplicate
      if (
        activityType === "complete_session" ||
        activityType === "conversation_session"
      ) {
        // Always increment for session completion activities (if not duplicate)
        profile.stats.moduleActivity[
          module as keyof typeof profile.stats.moduleActivity
        ] += 1;
      } else if (
        !metadata.isPartOfCompletedSession &&
        activityType !== "review_word"
      ) {
        // Increment for other activities as long as they're not part of a completed session
        // and not vocabulary reviews (which are handled specially)
        profile.stats.moduleActivity[
          module as keyof typeof profile.stats.moduleActivity
        ] += 1;
      }
    }

    // Add XP to profile (even for duplicates, as user still earned the XP)
    const newTotalXP = profile.experience + xpAmount;
    profile.experience = newTotalXP;
    profile.stats.totalXP += xpAmount;

    // Recalculate level
    const { level, experienceToNextLevel } = calculateLevelFromXP(newTotalXP);
    const leveledUp = level > profile.level;
    profile.level = level;
    profile.experienceToNextLevel = experienceToNextLevel;

    // Log for debugging
    console.log("XP Award - Profile After Calculation:", {
      userId: userId,
      activity: `${module}/${activityType}`,
      xpAwarded: xpAmount,
      newTotalXP: newTotalXP,
      newLevel: level,
      levelUp: leveledUp,
      experienceToNextLevel: experienceToNextLevel,
      fullCalculation: calculateLevelFromXP(newTotalXP),
      isPartOfCompletedSession: metadata.isPartOfCompletedSession,
      isDuplicate: isDuplicate,
    });

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

    // Multiply XP for vocabulary reviews and correct answers based on count
    if (activityType === "review_word" && metadata.count) {
      xp = xp * metadata.count;
      console.log(`Awarding ${xp} XP for ${metadata.count} vocabulary reviews`);
    } else if (activityType === "correct_answer" && metadata.count) {
      xp = xp * metadata.count;
      console.log(`Awarding ${xp} XP for ${metadata.count} correct answers`);
    }

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
