import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import WritingSession from '@/models/WritingSession';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const writingSessions = await WritingSession.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Default stats object with all required fields
    const stats = {
      totalSessions: writingSessions.length,
      completedSessions: writingSessions.filter(
        session => session.status === 'completed'
      ).length,
      sessionsLastWeek: 0, // Will calculate below
      averageScore: 0,
      scoreChange: 0, // Will calculate below
      totalWords: 0,
      wordsLastMonth: 0, // Will calculate below
      skillProgress: {
        grammar: 0,
        vocabulary: 0,
        coherence: 0,
        style: 0,
      },
      streak: 0, // Will calculate below
      hasData: writingSessions.length > 0,
      lastSession: writingSessions.length > 0 ? writingSessions[0] : null,
    };

    if (writingSessions.length > 0) {
      const completedSessions = writingSessions.filter(
        session => session.status === 'completed'
      );

      // Calculate average score
      if (completedSessions.length > 0) {
        const totalScore = completedSessions.reduce(
          (sum, session) => sum + (session.analysis?.overallScore || 0),
          0
        );
        stats.averageScore = Math.round(totalScore / completedSessions.length);
      }

      // Calculate total words
      stats.totalWords = writingSessions.reduce(
        (sum, session) =>
          sum + (session.submission?.finalVersion?.wordCount || 0),
        0
      );

      // Calculate sessions from last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      stats.sessionsLastWeek = writingSessions.filter(
        session => new Date(session.createdAt) > oneWeekAgo
      ).length;

      // Calculate words written in the last month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      stats.wordsLastMonth = writingSessions
        .filter(session => new Date(session.createdAt) > oneMonthAgo)
        .reduce(
          (sum, session) =>
            sum + (session.submission?.finalVersion?.wordCount || 0),
          0
        );

      // Calculate skill progress based on the last 5 completed sessions
      const recentCompletedSessions = completedSessions
        .slice(0, 5)
        .filter(session => session.analysis);

      if (recentCompletedSessions.length > 0) {
        const grammarScores = recentCompletedSessions.map(
          session => session.analysis?.details?.grammar?.score || 0
        );
        const vocabularyScores = recentCompletedSessions.map(
          session => session.analysis?.details?.vocabulary?.score || 0
        );
        const structureScores = recentCompletedSessions.map(
          session => session.analysis?.details?.structure?.score || 0
        );
        const contentScores = recentCompletedSessions.map(
          session => session.analysis?.details?.content?.score || 0
        );

        const getAverage = (scores: number[]) =>
          scores.length > 0
            ? Math.round(
                scores.reduce((sum, score) => sum + score, 0) / scores.length
              )
            : 0;

        stats.skillProgress = {
          grammar: getAverage(grammarScores),
          vocabulary: getAverage(vocabularyScores),
          coherence: getAverage(structureScores), // Using structure score for coherence
          style: getAverage(contentScores), // Using content score for style
        };
      }

      // Calculate score change (comparing current average to previous month)
      if (completedSessions.length > 1) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const recentSessions = completedSessions.filter(
          session => new Date(session.createdAt) > oneMonthAgo
        );

        const olderSessions = completedSessions.filter(
          session => new Date(session.createdAt) <= oneMonthAgo
        );

        if (recentSessions.length > 0 && olderSessions.length > 0) {
          const recentAvg =
            recentSessions.reduce(
              (sum, session) => sum + (session.analysis?.overallScore || 0),
              0
            ) / recentSessions.length;

          const olderAvg =
            olderSessions.reduce(
              (sum, session) => sum + (session.analysis?.overallScore || 0),
              0
            ) / olderSessions.length;

          stats.scoreChange = Math.round(recentAvg - olderAvg);
        }
      }

      // Calculate writing streak (consecutive days with completed sessions)
      // For simplicity, we'll just set this to the number of completed sessions for now
      stats.streak = completedSessions.length;
    }

    return NextResponse.json({ stats });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch writing stats' },
      { status: 500 }
    );
  }
}
