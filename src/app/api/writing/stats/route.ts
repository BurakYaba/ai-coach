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

    const stats = {
      totalSessions: writingSessions.length,
      completedSessions: writingSessions.filter(
        session => session.status === 'completed'
      ).length,
      averageScore: 0,
      totalWords: 0,
      lastSession: writingSessions.length > 0 ? writingSessions[0] : null,
    };

    if (writingSessions.length > 0) {
      const completedSessions = writingSessions.filter(
        session => session.status === 'completed'
      );

      if (completedSessions.length > 0) {
        const totalScore = completedSessions.reduce(
          (sum, session) => sum + (session.analysis?.overallScore || 0),
          0
        );
        stats.averageScore = totalScore / completedSessions.length;
      }

      stats.totalWords = writingSessions.reduce(
        (sum, session) =>
          sum + (session.submission?.finalVersion?.wordCount || 0),
        0
      );
    }

    return NextResponse.json(stats);
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
