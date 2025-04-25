// Refactored to address type issues and improve code organization

import { dbConnect } from "@/lib/db";
import Leaderboard, { ILeaderboard } from "@/models/Leaderboard";
import GamificationProfile from "@/models/GamificationProfile";
import UserActivity from "@/models/UserActivity";
import User, { IUser } from "@/models/User";
import mongoose, { Document } from "mongoose";

// Common interface for leaderboard entries to avoid duplication
interface LeaderboardEntry {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatarUrl?: string;
  value: number;
  rank: number;
}

// Common type for leaderboard period
type LeaderboardPeriod = "weekly" | "monthly" | "all-time";

// Common type for leaderboard category
type LeaderboardCategory = "xp" | "streak" | "module-specific";

// MongoDB document type helper
type LeaderboardDocument = Document<unknown, object, ILeaderboard> &
  ILeaderboard & { _id: mongoose.Types.ObjectId };

export class LeaderboardService {
  // Get leaderboard for a specific type and category
  static async getLeaderboard(
    type: LeaderboardPeriod,
    category: LeaderboardCategory,
    moduleType?: string
  ): Promise<LeaderboardDocument | null> {
    await dbConnect();

    // For module-specific leaderboards, module type is required
    if (category === "module-specific" && !moduleType) {
      throw new Error(
        "Module type is required for module-specific leaderboards"
      );
    }

    // Find existing leaderboard that hasn't expired
    let leaderboard = await Leaderboard.findOne({
      type,
      category,
      moduleType,
      expiresAt: { $gt: new Date() },
    });

    // If no valid leaderboard exists, generate a new one
    if (!leaderboard) {
      leaderboard = await this.generateLeaderboard(type, category, moduleType);
    }

    return leaderboard;
  }

  // Generate a new leaderboard
  private static async generateLeaderboard(
    type: LeaderboardPeriod,
    category: LeaderboardCategory,
    moduleType?: string
  ): Promise<LeaderboardDocument | null> {
    await dbConnect();

    // Calculate the date range for the leaderboard
    const { startDate, expiresAt } = this.calculateDateRange(type);

    // Get the leaderboard data based on category
    let entries: LeaderboardEntry[];
    if (category === "xp") {
      entries = await this.generateXPLeaderboard(type, startDate);
    } else if (category === "streak") {
      entries = await this.generateStreakLeaderboard();
    } else if (category === "module-specific" && moduleType) {
      entries = await this.generateModuleLeaderboard(
        moduleType,
        type,
        startDate
      );
    } else {
      throw new Error("Invalid leaderboard category");
    }

    // Create the leaderboard document
    try {
      const leaderboard = await Leaderboard.create({
        type,
        category,
        moduleType,
        entries,
        refreshedAt: new Date(),
        expiresAt,
      });

      return leaderboard;
    } catch (error) {
      console.error("Error generating leaderboard:", error);
      return null;
    }
  }

  // Calculate date range for different leaderboard types
  private static calculateDateRange(type: LeaderboardPeriod): {
    startDate: Date;
    expiresAt: Date;
  } {
    const now = new Date();
    const expiresAt = new Date(now);
    let startDate = new Date(now);

    if (type === "weekly") {
      // Start from the beginning of the week (Monday)
      startDate.setDate(
        now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
      );
      startDate.setHours(0, 0, 0, 0);

      // Expires at the end of the week (Sunday)
      expiresAt.setDate(now.getDate() + (7 - now.getDay()));
      expiresAt.setHours(23, 59, 59, 999);
    } else if (type === "monthly") {
      // Start from the beginning of the month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      // Expires at the end of the month
      expiresAt.setMonth(now.getMonth() + 1, 0);
      expiresAt.setHours(23, 59, 59, 999);
    } else {
      // All-time leaderboards have no specific start date
      startDate = new Date(0); // Beginning of time

      // Expires in 1 week (refreshed weekly)
      expiresAt.setDate(now.getDate() + 7);
      expiresAt.setHours(23, 59, 59, 999);
    }

    return { startDate, expiresAt };
  }

  // Generate XP leaderboard for a specific time period
  private static async generateXPLeaderboard(
    type: LeaderboardPeriod,
    startDate: Date
  ): Promise<LeaderboardEntry[]> {
    // If weekly or monthly, get XP earned in that period from user activities
    if (type === "weekly" || type === "monthly") {
      // Aggregate XP earned during the period by user
      const xpEarnedByUser = await UserActivity.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalXP: { $sum: "$xpEarned" },
          },
        },
        {
          $sort: { totalXP: -1 },
        },
        {
          $limit: 50, // Limit to top 50 users
        },
      ]);

      // Get user details for each entry
      const entries: LeaderboardEntry[] = await Promise.all(
        xpEarnedByUser.map(async (entry, index) => {
          const user = await User.findById(entry._id);
          return {
            userId: entry._id,
            username: user
              ? user.name || (user.email as string)
              : "Unknown User",
            avatarUrl: user?.image,
            value: entry.totalXP,
            rank: index + 1,
          };
        })
      );

      return entries;
    } else {
      // For all-time, use total XP from gamification profiles
      const topProfiles = await GamificationProfile.find()
        .sort({ "stats.totalXP": -1 })
        .limit(50);

      // Get user details for each profile
      const entries: LeaderboardEntry[] = await Promise.all(
        topProfiles.map(async (profile, index) => {
          const user = await User.findById(profile.userId);
          return {
            userId: profile.userId,
            username: user
              ? user.name || (user.email as string)
              : "Unknown User",
            avatarUrl: user?.image,
            value: profile.stats.totalXP,
            rank: index + 1,
          };
        })
      );

      return entries;
    }
  }

  // Generate streak leaderboard
  private static async generateStreakLeaderboard(): Promise<
    LeaderboardEntry[]
  > {
    // Get top 50 users by streak
    const topStreaks = await GamificationProfile.find()
      .sort({ "streak.current": -1 })
      .limit(50);

    // Get user details for each profile
    const entries: LeaderboardEntry[] = await Promise.all(
      topStreaks.map(async (profile, index) => {
        const user = await User.findById(profile.userId);
        return {
          userId: profile.userId,
          username: user ? user.name || (user.email as string) : "Unknown User",
          avatarUrl: user?.image,
          value: profile.streak.current,
          rank: index + 1,
        };
      })
    );

    return entries;
  }

  // Generate module-specific leaderboard
  private static async generateModuleLeaderboard(
    moduleType: string,
    type: LeaderboardPeriod,
    startDate: Date
  ): Promise<LeaderboardEntry[]> {
    if (type === "weekly" || type === "monthly") {
      // Count module activities in the given period
      const moduleActivities = await UserActivity.aggregate([
        {
          $match: {
            module: moduleType,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$userId",
            activityCount: { $sum: 1 },
          },
        },
        {
          $sort: { activityCount: -1 },
        },
        {
          $limit: 50, // Limit to top 50 users
        },
      ]);

      // Get user details for each entry
      const entries: LeaderboardEntry[] = await Promise.all(
        moduleActivities.map(async (entry, index) => {
          const user = await User.findById(entry._id);
          return {
            userId: entry._id,
            username: user
              ? user.name || (user.email as string)
              : "Unknown User",
            avatarUrl: user?.image,
            value: entry.activityCount,
            rank: index + 1,
          };
        })
      );

      return entries;
    } else {
      // For all-time, use module activity from gamification profiles
      const profiles = await GamificationProfile.find()
        .sort({
          [`stats.moduleActivity.${moduleType}`]: -1,
        })
        .limit(50);

      // Get user details for each profile
      const entries: LeaderboardEntry[] = await Promise.all(
        profiles.map(async (profile, index) => {
          const user = await User.findById(profile.userId);
          const moduleActivityCount =
            profile.stats.moduleActivity[
              moduleType as keyof typeof profile.stats.moduleActivity
            ];

          return {
            userId: profile.userId,
            username: user
              ? user.name || (user.email as string)
              : "Unknown User",
            avatarUrl: user?.image,
            value:
              typeof moduleActivityCount === "number" ? moduleActivityCount : 0,
            rank: index + 1,
          };
        })
      );

      return entries;
    }
  }

  // Refresh a specific leaderboard
  static async refreshLeaderboard(
    type: LeaderboardPeriod,
    category: LeaderboardCategory,
    moduleType?: string
  ): Promise<boolean> {
    await dbConnect();

    // For module-specific leaderboards, module type is required
    if (category === "module-specific" && !moduleType) {
      throw new Error(
        "Module type is required for module-specific leaderboards"
      );
    }

    // Delete existing leaderboard
    await Leaderboard.deleteOne({
      type,
      category,
      moduleType,
    });

    // Generate a new one
    const newLeaderboard = await this.generateLeaderboard(
      type,
      category,
      moduleType
    );

    return !!newLeaderboard;
  }
}
