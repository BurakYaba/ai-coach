import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import {
  getCacheHeaders,
  handleApiError,
  getCachedItem,
  setCacheItem,
} from "@/lib/reading-utils";
import ReadingSession from "@/models/ReadingSession";
import User from "@/models/User";

// Ensure dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first (stats can be cached for longer periods)
    const cacheKey = `reading_stats_${session.user.id}`;
    const cachedStats = getCachedItem(cacheKey);
    if (cachedStats) {
      return NextResponse.json(cachedStats, {
        headers: getCacheHeaders(300), // 5 minute cache
      });
    }

    await dbConnect();

    // Convert user ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Get user data and reading sessions in parallel
    const [user, sessions] = await Promise.all([
      // Get user with minimal projection
      User.findById(session.user.id).select("progress").lean(),

      // Get reading sessions with optimized projection
      ReadingSession.find({ userId })
        .select(
          "title level topic wordCount estimatedReadingTime questions userProgress.completionTime userProgress.questionsAnswered createdAt"
        )
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (sessions.length === 0) {
      const emptyStats = {
        stats: {
          totalSessions: 0,
          completedSessions: 0,
          sessionsLastWeek: 0,
          averageComprehension: 0,
          comprehensionChange: 0,
          totalWords: 0,
          wordsLastMonth: 0,
          topicsRead: [],
          streak: 0,
          hasData: false,
        },
      };

      // Cache empty stats result
      setCacheItem(cacheKey, emptyStats);

      return NextResponse.json(emptyStats, {
        headers: getCacheHeaders(300), // 5 minute cache
      });
    }

    // Calculate dates once for reuse
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Calculate all metrics in a single pass through the sessions array
    const totalSessions = sessions.length;
    let completedSessions = 0;
    let sessionsLastWeek = 0;
    let totalComprehensionScore = 0;
    let totalAnsweredQuestions = 0;
    let totalWords = 0;
    let wordsLastMonth = 0;
    const topicsMap = new Map();

    sessions.forEach(session => {
      // Count completed sessions
      if (session.userProgress?.completionTime) {
        completedSessions++;
      }

      // Count recent sessions
      const sessionDate = new Date(session.createdAt);
      if (sessionDate >= oneWeekAgo) {
        sessionsLastWeek++;
      }

      // Calculate comprehension score
      if (session.userProgress?.questionsAnswered > 0) {
        // For sessions with answered questions, calculate success rate
        const sessionScore = Math.round(
          (session.userProgress.questionsAnswered /
            (session.questions?.length || 1)) *
            100
        );
        totalComprehensionScore += sessionScore;
        totalAnsweredQuestions++;
      }

      // Calculate total words
      totalWords += session.wordCount || 0;

      // Calculate recent words
      if (sessionDate >= oneMonthAgo) {
        wordsLastMonth += session.wordCount || 0;
      }

      // Count topics
      if (session.topic) {
        const count = topicsMap.get(session.topic) || 0;
        topicsMap.set(session.topic, count + 1);
      }
    });

    // Calculate average comprehension
    const averageComprehension =
      totalAnsweredQuestions > 0
        ? Math.round(totalComprehensionScore / totalAnsweredQuestions)
        : 0;

    // Get top topics
    const topicsRead = Array.from(topicsMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Remove streak lookup from user model
    const streak = 0; // Fixed value instead of getting from user.progress.streak

    // Prepare the stats response
    const statsResponse = {
      stats: {
        totalSessions,
        completedSessions,
        sessionsLastWeek,
        averageComprehension,
        comprehensionChange: 0, // This would need historical data to calculate
        totalWords,
        wordsLastMonth,
        topicsRead,
        streak,
        hasData: true,
      },
    };

    // Cache the result
    setCacheItem(cacheKey, statsResponse);

    // Return with cache headers
    return NextResponse.json(statsResponse, {
      headers: getCacheHeaders(300), // 5 minute cache
    });
  } catch (error) {
    return handleApiError(error, "Error fetching reading statistics");
  }
}
