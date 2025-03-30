import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

export const dynamic = 'force-dynamic';

// Define CEFR levels since we can't import from the missing module
const CEFRLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Define interfaces for our data structures
interface TopicCount {
  topic: string;
  count: number;
}

interface ProgressByCategory {
  level?: string;
  type?: string;
  total: number;
  completed: number;
  percentage: number;
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // Calculate overall statistics
    const totalSessions = await ListeningSession.countDocuments({ userId });

    // Get completed sessions (sessions with completionTime)
    const completedSessions = await ListeningSession.find({
      userId,
      'userProgress.completionTime': { $exists: true },
    });

    const totalCompletedSessions = completedSessions.length;

    // Calculate total listening time (in minutes)
    const totalListeningTime = await ListeningSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$content.duration' } } },
    ]);

    const totalTimeInMinutes =
      totalListeningTime.length > 0
        ? Math.round(totalListeningTime[0].total / 60)
        : 0;

    // Calculate average score across completed sessions
    let averageScore = 0;
    if (totalCompletedSessions > 0) {
      const totalScore = completedSessions.reduce((sum, session) => {
        return sum + (session.userProgress.score || 0);
      }, 0);
      averageScore =
        Math.round((totalScore / totalCompletedSessions) * 100) / 100;
    }

    // Calculate progress by level
    const progressByLevel = await Promise.all(
      CEFRLevels.map(async (level: string) => {
        const sessionsAtLevel = await ListeningSession.find({
          userId,
          'content.level': level,
        });

        const completedAtLevel = sessionsAtLevel.filter(
          session => session.userProgress.completionTime
        ).length;

        return {
          level,
          total: sessionsAtLevel.length,
          completed: completedAtLevel,
          percentage:
            sessionsAtLevel.length > 0
              ? Math.round((completedAtLevel / sessionsAtLevel.length) * 100)
              : 0,
        };
      })
    );

    // Calculate progress by content type
    const contentTypes = ['monologue', 'dialogue', 'interview', 'news'];
    const progressByContentType = await Promise.all(
      contentTypes.map(async (type: string) => {
        const sessionsOfType = await ListeningSession.find({
          userId,
          'content.contentType': type,
        });

        const completedOfType = sessionsOfType.filter(
          session => session.userProgress.completionTime
        ).length;

        return {
          type,
          total: sessionsOfType.length,
          completed: completedOfType,
          percentage:
            sessionsOfType.length > 0
              ? Math.round((completedOfType / sessionsOfType.length) * 100)
              : 0,
        };
      })
    );

    // Get streak data
    // A day is considered active if the user completed at least one session
    const uniqueActiveDays = new Set<string>();
    completedSessions.forEach(session => {
      if (session.userProgress.completionTime) {
        const date = new Date(session.userProgress.completionTime);
        uniqueActiveDays.add(
          `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        );
      }
    });

    // Current streak calculation
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 100; i++) {
      // Limit to avoid infinite loop
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;

      if (uniqueActiveDays.has(dateKey)) {
        currentStreak++;
      } else if (i > 0) {
        // Skip today if not active
        break;
      }
    }

    // Calculate most common topics
    const topicCounts: Record<string, number> = {};
    const sessions = await ListeningSession.find({ userId }).select(
      'content.topic'
    );

    sessions.forEach(session => {
      const topic = session.content.topic;
      if (topic) {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      }
    });

    const commonTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a: TopicCount, b: TopicCount) => b.count - a.count)
      .slice(0, 5);

    // Return all statistics
    return NextResponse.json({
      overview: {
        totalSessions,
        completedSessions: totalCompletedSessions,
        totalListeningTime: totalTimeInMinutes,
        averageScore,
        currentStreak,
      },
      progressByLevel,
      progressByContentType,
      commonTopics,
    });
  } catch (error) {
    console.error('Error fetching listening statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
