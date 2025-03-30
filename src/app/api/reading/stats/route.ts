import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Import models
    const ReadingSession = (await import('@/models/ReadingSession')).default;
    const User = (await import('@/models/User')).default;

    // Get user
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert user ID to ObjectId if needed
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(session.user.id);
    } catch (error) {
      userId = session.user.id;
    }

    // Get reading sessions for the user
    const sessions = await ReadingSession.find({ userId })
      .select(
        'title level topic wordCount estimatedReadingTime questions vocabulary userProgress createdAt'
      )
      .sort({ createdAt: -1 })
      .lean();

    if (sessions.length === 0) {
      return NextResponse.json({
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
      });
    }

    // Calculate total sessions
    const totalSessions = sessions.length;

    // Calculate completed sessions
    const completedSessions = sessions.filter(
      session => session.userProgress.completionTime
    ).length;

    // Calculate sessions in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const sessionsLastWeek = sessions.filter(
      session => new Date(session.createdAt) >= oneWeekAgo
    ).length;

    // Calculate comprehension score
    let totalComprehensionScore = 0;
    let totalAnsweredQuestions = 0;

    sessions.forEach(session => {
      if (session.userProgress.questionsAnswered > 0) {
        // For each session, we need to calculate the comprehension score
        // based on correct answers, but since we may not track this directly,
        // we'll estimate it based on progress for now
        const sessionScore = Math.round(
          (session.userProgress.questionsAnswered / session.questions.length) *
            100
        );

        totalComprehensionScore += sessionScore;
        totalAnsweredQuestions++;
      }
    });

    const averageComprehension =
      totalAnsweredQuestions > 0
        ? Math.round(totalComprehensionScore / totalAnsweredQuestions)
        : 0;

    // Estimate comprehension change (mock data for now)
    // In a real implementation, you would compare to historical data
    const comprehensionChange = 5;

    // Calculate total words
    let totalWords = 0;
    sessions.forEach(session => {
      totalWords += session.wordCount || 0;
    });

    // Calculate words read in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let wordsLastMonth = 0;
    sessions.forEach(session => {
      if (new Date(session.createdAt) >= oneMonthAgo) {
        wordsLastMonth += session.wordCount || 0;
      }
    });

    // Calculate topics read
    const topicsMap = new Map();
    sessions.forEach(session => {
      const topic = session.topic;
      if (topic) {
        const count = topicsMap.get(topic) || 0;
        topicsMap.set(topic, count + 1);
      }
    });

    const topicsRead = Array.from(topicsMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get streak from user model if available, otherwise default to 0
    const streak = user.progress?.streak || 0;

    // Return the stats
    return NextResponse.json({
      stats: {
        totalSessions,
        completedSessions,
        sessionsLastWeek,
        averageComprehension,
        comprehensionChange,
        totalWords,
        wordsLastMonth,
        topicsRead,
        streak,
        hasData: true,
      },
    });
  } catch (error) {
    console.error('Error fetching reading stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading statistics' },
      { status: 500 }
    );
  }
}
