import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GrammarIssue from '@/models/GrammarIssue';
import GrammarLesson from '@/models/GrammarLesson';
import User from '@/models/User';

// GET /api/user/grammar-progress - Get user's grammar progress
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count resolved issues
    const resolvedIssuesCount = await GrammarIssue.countDocuments({
      userId: session.user.id,
      resolved: true,
    });

    // Count completed lessons
    const completedLessonsCount = await GrammarLesson.countDocuments({
      userId: session.user.id,
      completed: true,
    });

    // Get badges and challenge streak from user document
    const badges = user.grammarProgress?.badges || [];
    const challengeStreak = user.grammarProgress?.challengeStreak || 0;
    const lastDailyChallenge = user.grammarProgress?.lastDailyChallenge;

    // Prepare statistics for mastery levels
    const masteryData = user.grammarProgress?.mastery || [];

    return NextResponse.json({
      issuesResolved: resolvedIssuesCount,
      lessonsCompleted: completedLessonsCount,
      badges,
      challengeStreak,
      lastDailyChallenge,
      mastery: masteryData,
    });
  } catch (error) {
    console.error('Error fetching grammar progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar progress' },
      { status: 500 }
    );
  }
}
