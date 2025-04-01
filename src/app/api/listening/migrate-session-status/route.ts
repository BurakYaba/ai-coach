import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

import { isAdmin } from '@/lib/permissions';

// POST /api/listening/migrate-session-status - Fix session completion status
export async function POST(req: NextRequest) {
  try {
    // Authenticate user as admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !isAdmin(session?.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find all user sessions (non-library items) with completionTime set
    const sessionsWithCompletionTime = await ListeningSession.find({
      isLibrary: { $ne: true },
      'userProgress.completionTime': { $exists: true, $ne: null },
    });

    console.log(
      `Found ${sessionsWithCompletionTime.length} sessions with completionTime`
    );

    // Keep track of sessions updated
    const updates = {
      completionTimeRemoved: 0,
      completionTimeSet: 0,
      alreadyCorrect: 0,
    };

    // Process each session
    for (const session of sessionsWithCompletionTime) {
      const totalQuestions = session.questions?.length || 0;
      const totalVocab = session.vocabulary?.length || 0;
      const answeredQuestions = session.userProgress?.questionsAnswered || 0;
      const reviewedVocab =
        session.userProgress?.vocabularyReviewed?.length || 0;

      // Calculate progress percentage
      const progressPercentage =
        totalQuestions + totalVocab > 0
          ? Math.round(
              ((answeredQuestions + reviewedVocab) /
                (totalQuestions + totalVocab)) *
                100
            )
          : 0;

      // If progress is not 100% but completionTime is set, remove it
      if (progressPercentage < 100) {
        await ListeningSession.findByIdAndUpdate(session._id, {
          $unset: { 'userProgress.completionTime': '' },
        });
        updates.completionTimeRemoved++;
      } else {
        updates.alreadyCorrect++;
      }
    }

    // Find all user sessions without completionTime but with 100% progress
    const sessionsWithoutCompletionTime = await ListeningSession.find({
      isLibrary: { $ne: true },
      $or: [
        { 'userProgress.completionTime': { $exists: false } },
        { 'userProgress.completionTime': null },
      ],
    });

    console.log(
      `Found ${sessionsWithoutCompletionTime.length} sessions without completionTime`
    );

    // Process each session
    for (const session of sessionsWithoutCompletionTime) {
      const totalQuestions = session.questions?.length || 0;
      const totalVocab = session.vocabulary?.length || 0;
      const answeredQuestions = session.userProgress?.questionsAnswered || 0;
      const reviewedVocab =
        session.userProgress?.vocabularyReviewed?.length || 0;

      // Calculate progress percentage
      const progressPercentage =
        totalQuestions + totalVocab > 0
          ? Math.round(
              ((answeredQuestions + reviewedVocab) /
                (totalQuestions + totalVocab)) *
                100
            )
          : 0;

      // If progress is 100% but completionTime is not set, set it
      if (progressPercentage === 100) {
        await ListeningSession.findByIdAndUpdate(session._id, {
          $set: { 'userProgress.completionTime': new Date() },
        });
        updates.completionTimeSet++;
      }
    }

    return NextResponse.json({
      message: 'Session status migration completed successfully',
      updates,
    });
  } catch (error) {
    console.error('Error migrating session status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
