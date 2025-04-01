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

interface CategoryCount {
  category: string;
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

    // Base query to exclude library items (they are reference items, not user sessions)
    const baseQuery = {
      userId,
      isLibrary: { $ne: true },
    };

    // Calculate overall statistics
    const totalSessions = await ListeningSession.countDocuments(baseQuery);

    // Get completed sessions (sessions with completionTime)
    const completedSessions = await ListeningSession.find({
      ...baseQuery,
      'userProgress.completionTime': { $exists: true },
    });

    // Additional debugging: Inspect raw data of completed sessions
    console.log('RAW COMPLETED SESSIONS DATA:');
    completedSessions.forEach((session, index) => {
      console.log(`Session ${index + 1} ID:`, session._id);
      console.log(`Session ${index + 1} Title:`, session.title);
      console.log(
        `Session ${index + 1} Completion Time:`,
        session.userProgress.completionTime
      );
      console.log(
        `Session ${index + 1} Questions Answered:`,
        session.userProgress.questionsAnswered
      );
      console.log(
        `Session ${index + 1} Correct Answers:`,
        session.userProgress.correctAnswers
      );
      console.log(
        `Session ${index + 1} userProgress:`,
        JSON.stringify(session.userProgress)
      );
    });

    const totalCompletedSessions = completedSessions.length;

    // Calculate total listening time (in minutes)
    const totalListeningTime = await ListeningSession.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isLibrary: { $ne: true },
        },
      },
      { $group: { _id: null, total: { $sum: '$duration' } } },
    ]);

    const totalTimeInMinutes =
      totalListeningTime.length > 0
        ? Math.round(totalListeningTime[0].total / 60)
        : 0;

    // Calculate average score across completed sessions
    let averageScore = 0;
    if (totalCompletedSessions > 0) {
      // Add debug logging
      console.log('Found completed sessions:', totalCompletedSessions);
      completedSessions.forEach((session, index) => {
        console.log(
          `Session ${index + 1} comprehensionScore:`,
          session.userProgress?.comprehensionScore
        );
      });

      const totalScore = completedSessions.reduce((sum, session) => {
        const score = session.userProgress?.comprehensionScore || 0;
        console.log('Adding score:', score);
        return sum + score;
      }, 0);

      averageScore =
        Math.round((totalScore / totalCompletedSessions) * 100) / 100;
      console.log('Calculated average score:', averageScore);
    } else {
      console.log('No completed sessions found');
    }

    // Calculate library-specific statistics
    const libraryStats = await ListeningSession.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isLibrary: { $ne: true },
          libraryItemId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [
                { $ifNull: ['$userProgress.completionTime', false] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const librarySessionsStats =
      libraryStats.length > 0 ? libraryStats[0] : { total: 0, completed: 0 };

    // Calculate progress by level
    const progressByLevel = await Promise.all(
      CEFRLevels.map(async (level: string) => {
        const sessionsAtLevel = await ListeningSession.find({
          ...baseQuery,
          level,
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
          ...baseQuery,
          contentType: type,
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
    const sessions = await ListeningSession.find(baseQuery).select('topic');

    sessions.forEach(session => {
      const topic = session.topic;
      if (topic) {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      }
    });

    const commonTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a: TopicCount, b: TopicCount) => b.count - a.count)
      .slice(0, 5);

    // Calculate most common categories (for library sessions)
    const categoryStats = await ListeningSession.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isLibrary: { $ne: true },
          libraryItemId: { $exists: true, $ne: null },
          category: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const commonCategories = categoryStats.map(item => ({
      category: item._id,
      count: item.count,
    }));

    // Return all statistics
    return NextResponse.json({
      overview: {
        totalSessions,
        completedSessions: totalCompletedSessions,
        totalListeningTime: totalTimeInMinutes,
        averageScore,
        currentStreak,
        librarySessionsTotal: librarySessionsStats.total,
        librarySessionsCompleted: librarySessionsStats.completed,
      },
      progressByLevel,
      progressByContentType,
      commonTopics,
      commonCategories,
    });
  } catch (error) {
    console.error('Error fetching listening statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
