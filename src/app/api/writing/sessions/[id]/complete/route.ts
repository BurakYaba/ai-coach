import mongoose, {
  Document,
  Schema,
  Model,
  FilterQuery,
  UpdateQuery,
} from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import WritingSession, { IWritingSession } from '@/models/WritingSession';

interface IUserProgress extends Document {
  userId: string;
  writing: {
    completed: number;
    totalWords: number;
    byDate: Map<string, Map<string, unknown>>;
    history: Array<{
      sessionId: mongoose.Types.ObjectId;
      type: string;
      topic: string;
      score: number;
      wordCount: number;
      completedAt: Date;
    }>;
  };
  createdAt: Date;
}

interface IUserStats extends Document {
  userId: string;
  createdAt: Date;
  lastActiveDate: Date;
  streak: number;
  writing: {
    lastCompleted: Date;
    totalCompleted: number;
  };
}

// POST /api/writing/sessions/[id]/complete - Mark a session as completed
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Validate ID
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Fetch session
    const writingSession = await WritingSession.findById(params.id);

    // Check if session exists
    if (!writingSession) {
      return NextResponse.json(
        { error: 'Writing session not found' },
        { status: 404 }
      );
    }

    // Check if user owns the session
    if (writingSession.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if session can be marked as completed
    if (writingSession.status !== 'analyzed') {
      return NextResponse.json(
        {
          error:
            'Session must be analyzed before it can be marked as completed',
          currentStatus: writingSession.status,
        },
        { status: 400 }
      );
    }

    // Update status to completed
    writingSession.status = 'completed';
    await writingSession.save();

    return NextResponse.json({
      success: true,
      message: 'Session marked as completed',
      session: writingSession,
    });
  } catch (error) {
    console.error('Error marking session as completed:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to complete session', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}

async function updateUserProgress(
  userId: string,
  writingSession: IWritingSession & Document
) {
  try {
    // Get current date for tracking
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if UserProgress model exists, if not, we'll create it
    let UserProgress: Model<IUserProgress>;
    try {
      UserProgress = mongoose.model<IUserProgress>('UserProgress');
    } catch (e) {
      // Define the schema if the model doesn't exist
      const UserProgressSchema = new Schema<IUserProgress>({
        userId: { type: String, required: true },
        writing: {
          completed: { type: Number, default: 0 },
          totalWords: { type: Number, default: 0 },
          byDate: { type: Map, of: Map, default: () => new Map() },
          history: [
            {
              sessionId: {
                type: Schema.Types.ObjectId,
                ref: 'WritingSession',
              },
              type: String,
              topic: String,
              score: Number,
              wordCount: Number,
              completedAt: Date,
            },
          ],
        },
        createdAt: { type: Date, default: Date.now },
      });

      UserProgress = mongoose.model<IUserProgress>(
        'UserProgress',
        UserProgressSchema
      );
    }

    // Check if UserStats model exists, if not, we'll create it
    let UserStats: Model<IUserStats>;
    try {
      UserStats = mongoose.model<IUserStats>('UserStats');
    } catch (e) {
      // Define the schema if the model doesn't exist
      const UserStatsSchema = new Schema<IUserStats>({
        userId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        lastActiveDate: { type: Date },
        streak: { type: Number, default: 0 },
        writing: {
          lastCompleted: { type: Date },
          totalCompleted: { type: Number, default: 0 },
        },
      });

      UserStats = mongoose.model<IUserStats>('UserStats', UserStatsSchema);
    }

    // Update or create user progress document
    const wordCount = writingSession.submission?.finalVersion?.wordCount || 0;

    // Create the update object for the byDate field
    const byDateUpdate: Record<string, number> = {};
    byDateUpdate[`writing.byDate.${dateString}.completed`] = 1;
    byDateUpdate[`writing.byDate.${dateString}.words`] = wordCount;

    await UserProgress.findOneAndUpdate(
      { userId } as FilterQuery<IUserProgress>,
      {
        $inc: {
          'writing.completed': 1,
          'writing.totalWords': wordCount,
          ...byDateUpdate,
        },
      } as UpdateQuery<IUserProgress>,
      { upsert: true }
    );

    // Get user's current streak
    const userStats = await UserStats.findOne({
      userId,
    } as FilterQuery<IUserStats>);

    if (userStats) {
      const lastActiveDate = userStats.lastActiveDate
        ? new Date(userStats.lastActiveDate)
        : null;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Format dates to compare just the date part (YYYY-MM-DD)
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const lastActiveDateString = lastActiveDate
        ? lastActiveDate.toISOString().split('T')[0]
        : null;

      let newStreak = userStats.streak || 0;

      // If last active date was yesterday, increment streak
      if (lastActiveDateString === yesterdayString) {
        newStreak += 1;
      }
      // If last active date was today, keep streak the same
      else if (lastActiveDateString === dateString) {
        // Do nothing, streak remains the same
      }
      // Otherwise, reset streak to 1 (today)
      else {
        newStreak = 1;
      }

      // Update user stats
      await UserStats.findOneAndUpdate(
        { userId } as FilterQuery<IUserStats>,
        {
          $set: {
            lastActiveDate: today,
            streak: newStreak,
            'writing.lastCompleted': today,
          },
          $inc: {
            'writing.totalCompleted': 1,
          },
        } as UpdateQuery<IUserStats>
      );
    } else {
      // Create new user stats document
      await UserStats.create({
        userId,
        createdAt: new Date(),
        lastActiveDate: today,
        streak: 1,
        writing: {
          lastCompleted: today,
          totalCompleted: 1,
        },
      });
    }
  } catch (error) {
    // We don't want to fail the main operation if this fails
    // Just log the error and continue
  }
}
