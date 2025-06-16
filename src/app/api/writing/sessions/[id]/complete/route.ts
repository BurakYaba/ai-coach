import mongoose, {
  Document,
  Schema,
  Model,
  FilterQuery,
  UpdateQuery,
} from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import WritingSession, { IWritingSession } from "@/models/WritingSession";
import { GamificationService } from "@/lib/gamification/gamification-service";
import { recordWritingCompletion } from "@/lib/gamification/activity-recorder";

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Connect to database
    await dbConnect();

    // Validate ID
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Fetch session
    const writingSession = await WritingSession.findById(params.id);

    // Check if session exists
    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    // Check if user owns the session
    if (writingSession.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if session can be marked as completed
    if (writingSession.status !== "analyzed") {
      return NextResponse.json(
        {
          error:
            "Session must be analyzed before it can be marked as completed",
          currentStatus: writingSession.status,
        },
        { status: 400 }
      );
    }

    // Update status to completed
    writingSession.status = "completed";
    await writingSession.save();

    // Update user progress stats
    await updateUserProgress(userId, writingSession);

    // Record activity and award XP
    try {
      const wordCount = writingSession.submission?.finalVersion?.wordCount || 0;
      const timeSpent = calculateTimeSpent(writingSession);

      // Record the writing completion for gamification
      await recordWritingCompletion(userId, params.id, wordCount, timeSpent);
    } catch (error) {
      console.error(
        `Error awarding XP for writing session ${params.id}:`,
        error
      );
      // Don't fail the request if gamification fails
    }

    return NextResponse.json({
      success: true,
      message: "Session marked as completed",
      session: writingSession,
    });
  } catch (error) {
    console.error("Error marking session as completed:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to complete session", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}

// Calculate time spent on the writing session (in seconds)
function calculateTimeSpent(
  writingSession: IWritingSession & Document
): number {
  if (!writingSession.submission?.finalVersion?.submittedAt) {
    return 300; // Default to 5 minutes if no submission time
  }

  const submittedAt = new Date(
    writingSession.submission.finalVersion.submittedAt
  );

  // Use timeTracking.startTime as the fallback if createdAt is not available
  // This is safer as timeTracking.startTime is definitely in the interface
  const startTime = writingSession.timeTracking?.startTime
    ? new Date(writingSession.timeTracking.startTime)
    : (writingSession as any).createdAt
      ? new Date((writingSession as any).createdAt)
      : new Date(submittedAt.getTime() - 300000); // Default to 5 minutes before submission

  // Calculate time difference in seconds
  const timeSpentMs = submittedAt.getTime() - startTime.getTime();
  const timeSpentSec = Math.floor(timeSpentMs / 1000);

  // Ensure reasonable time (min 1 minute, max 2 hours)
  return Math.min(Math.max(timeSpentSec, 60), 7200);
}

async function updateUserProgress(
  userId: string,
  writingSession: IWritingSession & Document
) {
  try {
    // Get current date for tracking
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if UserProgress model exists, if not, we'll create it
    let UserProgress: Model<IUserProgress>;
    try {
      UserProgress = mongoose.model<IUserProgress>("UserProgress");
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
                ref: "WritingSession",
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
        "UserProgress",
        UserProgressSchema
      );
    }

    // Check if UserStats model exists, if not, we'll create it
    let UserStats: Model<IUserStats>;
    try {
      UserStats = mongoose.model<IUserStats>("UserStats");
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

      UserStats = mongoose.model<IUserStats>("UserStats", UserStatsSchema);
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
          "writing.completed": 1,
          "writing.totalWords": wordCount,
          ...byDateUpdate,
        },
      } as UpdateQuery<IUserProgress>,
      { upsert: true }
    );

    // Get userStats or create if it doesn't exist
    const userStats = await UserStats.findOne({
      userId,
    } as FilterQuery<IUserStats>);

    if (userStats) {
      // Update user stats - streak calculation removed
      await UserStats.findOneAndUpdate(
        { userId } as FilterQuery<IUserStats>,
        {
          $set: {
            lastActiveDate: today,
            "writing.lastCompleted": today,
          },
          $inc: {
            "writing.totalCompleted": 1,
          },
        } as UpdateQuery<IUserStats>
      );
    } else {
      // Create new user stats document - default streak value used
      await UserStats.create({
        userId,
        createdAt: new Date(),
        lastActiveDate: today,
        streak: 0, // Default value instead of calculating
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
