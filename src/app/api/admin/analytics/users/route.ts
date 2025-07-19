import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserActivity from "@/models/UserActivity";
import GamificationProfile from "@/models/GamificationProfile";

// Mark this route as dynamic since it uses getServerSession
export const dynamic = "force-dynamic";

interface ModuleActivityMap {
  reading: number;
  writing: number;
  speaking: number;
  grammar: number;
  vocabulary: number;
  games: number;
  [key: string]: number;
}

interface ModuleMetrics {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  timeSpent: number;
  itemsCompleted: number;
  wordCount?: number;
  uniqueWords?: number;
  accuracy?: number;
}

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  lastActive?: Date;
  updatedAt: Date;
  createdAt: Date;
  onboarding?: {
    completed: boolean;
    currentStep: number;
    language: "en" | "tr";
    nativeLanguage: string;
    country: string;
    region: string;
    preferredPracticeTime: string;
    preferredLearningDays: string[];
    reminderTiming: string;
    reasonsForLearning: string[];
    howHeardAbout: string;
    dailyStudyTimeGoal: number;
    weeklyStudyTimeGoal: number;
    consentDataUsage: boolean;
    consentAnalytics: boolean;
    completedAt?: Date;
    skillAssessment?: {
      ceferLevel?: string;
    };
  };
  progress?: {
    totalPoints?: number;
    streak?: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Get pagination and filter parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const moduleFilter = url.searchParams.get("module") || "all";
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Build date range filter for activity queries
    const dateFilter: any = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) {
        dateFilter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.createdAt.$lte = new Date(dateTo);
      }
    } else {
      // Default to last 30 days if no date range specified
      dateFilter.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    }

    // Build module filter for activity queries
    const activityMatchFilter: any = {
      activityType: "complete_session",
      ...dateFilter,
    };
    if (moduleFilter !== "all") {
      activityMatchFilter.module = moduleFilter;
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get users with pagination (ordered from newest to oldest by registration date)
    const users = await User.find(searchQuery)
      .select(
        "name email progress onboarding subscription lastActive updatedAt createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserDocument[]>();

    if (users.length === 0) {
      return NextResponse.json({
        users: [],
        pagination: {
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit),
          currentPage: page,
          perPage: limit,
        },
      });
    }

    const userIds = users.map(user => new mongoose.Types.ObjectId(user._id));

    // Bulk fetch all user activities with optimized aggregation
    const bulkActivityMetrics = await UserActivity.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          ...activityMatchFilter,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            module: "$module",
          },
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: {
              $cond: [{ $eq: ["$metadata.completed", true] }, 1, 0],
            },
          },
          averageScore: { $avg: "$metadata.score" },
          timeSpent: { $sum: "$metadata.duration" },
          itemsCompleted: { $sum: "$metadata.itemsCompleted" },
          totalWordCount: { $sum: "$metadata.wordCount" },
          uniqueWords: { $addToSet: "$metadata.uniqueWords" },
          accuracy: { $avg: "$metadata.accuracy" },
        },
      },
    ]);

    // Bulk fetch gamification profiles
    const gamificationProfiles = await GamificationProfile.find({
      userId: { $in: userIds },
    }).lean();

    // Bulk fetch activity trends
    const bulkActivityTrends = await UserActivity.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            module: "$module",
          },
          count: { $sum: 1 },
          xpEarned: { $sum: "$xpEarned" },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    // Create lookup maps for efficient data processing
    const activityByUser = new Map();
    const gamificationByUser = new Map();
    const trendsbyUser = new Map();

    // Process bulk activity metrics
    bulkActivityMetrics.forEach(metric => {
      const userId = metric._id.userId.toString();
      if (!activityByUser.has(userId)) {
        activityByUser.set(userId, {});
      }
      activityByUser.get(userId)[metric._id.module] = metric;
    });

    // Process gamification profiles
    gamificationProfiles.forEach(profile => {
      gamificationByUser.set(profile.userId.toString(), profile);
    });

    // Process activity trends
    bulkActivityTrends.forEach(trend => {
      const userId = trend._id.userId.toString();
      const moduleName = trend._id.module;
      if (!trendsbyUser.has(userId)) {
        trendsbyUser.set(userId, {});
      }
      if (!trendsbyUser.get(userId)[moduleName]) {
        trendsbyUser.get(userId)[moduleName] = [];
      }
      trendsbyUser.get(userId)[moduleName].push({
        date: trend._id.date,
        sessions: trend.count,
        xp: trend.xpEarned,
      });
    });

    // Transform users with their analytics
    const usersWithAnalytics = users.map(user => {
      const userId = user._id.toString();
      const userActivity = activityByUser.get(userId) || {};
      const gamificationProfile = gamificationByUser.get(userId);
      const userTrends = trendsbyUser.get(userId) || {};

      // Calculate total sessions
      const totalSessions = Object.values(userActivity).reduce(
        (sum: number, activity: any) => sum + (activity.totalSessions || 0),
        0
      );

      // Process module metrics
      const moduleActivityMap: ModuleActivityMap = {
        reading: 0,
        writing: 0,
        speaking: 0,
        grammar: 0,
        vocabulary: 0,
        games: 0,
      };

      const detailedMetrics: Record<string, ModuleMetrics> = {};

      Object.entries(userActivity).forEach(
        ([moduleName, metric]: [string, any]) => {
          moduleActivityMap[moduleName] = metric.totalSessions;
          detailedMetrics[moduleName] = {
            totalSessions: metric.totalSessions,
            completedSessions: metric.completedSessions,
            averageScore: Math.round(metric.averageScore || 0),
            timeSpent: Math.round((metric.timeSpent || 0) / 60), // Convert to minutes
            itemsCompleted: metric.itemsCompleted || 0,
            wordCount: metric.totalWordCount,
            uniqueWords: metric.uniqueWords?.length,
            accuracy: Math.round((metric.accuracy || 0) * 100),
          };
        }
      );

      // Calculate completion rates
      const completionRates: Record<string, number> = {};
      Object.entries(detailedMetrics).forEach(([moduleName, metrics]) => {
        completionRates[moduleName] =
          metrics.totalSessions > 0
            ? Math.round(
                (metrics.completedSessions / metrics.totalSessions) * 100
              )
            : 0;
      });

      return {
        _id: userId,
        name: user.name,
        email: user.email,
        totalSessions,
        lastActive: (user.lastActive || user.updatedAt).toISOString(),
        registeredAt: user.createdAt.toISOString(),
        moduleActivity: moduleActivityMap,
        completionRates,
        detailedMetrics,
        activityTrends: userTrends,
        gamification: {
          level: gamificationProfile?.level || 1,
          experience: gamificationProfile?.experience || 0,
          streak: {
            current: gamificationProfile?.streak?.current || 0,
            longest: gamificationProfile?.streak?.longest || 0,
          },
          achievements: gamificationProfile?.achievements?.length || 0,
          badges: gamificationProfile?.badges?.length || 0,
          stats: gamificationProfile?.stats || {
            totalXP: 0,
            activeDays: 0,
            moduleActivity: moduleActivityMap,
          },
        },
        progress: {
          level: user.onboarding?.skillAssessment?.ceferLevel || "N/A",
          xp: user.progress?.totalPoints || 0,
          streak: user.progress?.streak || 0,
        },
        onboarding: {
          completed: user.onboarding?.completed || false,
          currentStep: user.onboarding?.currentStep || 1,
          language: user.onboarding?.language || "en",
          nativeLanguage: user.onboarding?.nativeLanguage || "",
          country: user.onboarding?.country || "",
          region: user.onboarding?.region || "",
          preferredPracticeTime: user.onboarding?.preferredPracticeTime || "",
          preferredLearningDays: user.onboarding?.preferredLearningDays || [],
          reminderTiming: user.onboarding?.reminderTiming || "",
          reasonsForLearning: user.onboarding?.reasonsForLearning || [],
          howHeardAbout: user.onboarding?.howHeardAbout || "",
          dailyStudyTimeGoal: user.onboarding?.dailyStudyTimeGoal || 0,
          weeklyStudyTimeGoal: user.onboarding?.weeklyStudyTimeGoal || 0,
          consentDataUsage: user.onboarding?.consentDataUsage || false,
          consentAnalytics: user.onboarding?.consentAnalytics || false,
          completedAt: user.onboarding?.completedAt?.toISOString() || null,
        },
      };
    });

    return NextResponse.json({
      users: usersWithAnalytics,
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}
