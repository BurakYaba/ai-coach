import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserActivity from "@/models/UserActivity";
import GamificationProfile from "@/models/GamificationProfile";

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
  onboarding?: {
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

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
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

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get users with pagination
    const users = await User.find(searchQuery)
      .select(
        "name email progress onboarding subscription lastActive updatedAt"
      )
      .sort({ lastActive: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserDocument[]>();

    // Get analytics for each user
    const usersWithAnalytics = await Promise.all(
      users.map(async user => {
        const userId = user._id;

        // Get total sessions across all modules
        const totalSessions = await UserActivity.countDocuments({
          userId,
          activityType: "complete_session",
        });

        // Get detailed module metrics
        const moduleMetrics = await UserActivity.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              activityType: "complete_session",
            },
          },
          {
            $group: {
              _id: "$module",
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

        // Get gamification stats
        const gamificationProfile = await GamificationProfile.findOne({
          userId: new mongoose.Types.ObjectId(userId),
        }).lean();

        // Get recent activity trend
        const recentActivity = await UserActivity.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
          {
            $group: {
              _id: {
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

        moduleMetrics.forEach(metric => {
          const moduleName = metric._id;
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
        });

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

        // Process activity trends
        const activityTrends = recentActivity.reduce(
          (acc, curr) => {
            const { date, module: moduleName } = curr._id;
            if (!acc[moduleName]) {
              acc[moduleName] = [];
            }
            acc[moduleName].push({
              date,
              sessions: curr.count,
              xp: curr.xpEarned,
            });
            return acc;
          },
          {} as Record<
            string,
            Array<{ date: string; sessions: number; xp: number }>
          >
        );

        return {
          _id: userId.toString(),
          name: user.name,
          email: user.email,
          totalSessions,
          lastActive: (user.lastActive || user.updatedAt).toISOString(),
          moduleActivity: moduleActivityMap,
          completionRates,
          detailedMetrics,
          activityTrends,
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
        };
      })
    );

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
