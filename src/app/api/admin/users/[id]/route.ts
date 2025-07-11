import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserSession from "@/models/UserSession";
import ListeningSession from "@/models/ListeningSession";
import SpeakingSession from "@/models/SpeakingSession";
import ReadingSession from "@/models/ReadingSession";
import WritingSession from "@/models/WritingSession";
import WritingPrompt from "@/models/WritingPrompt";
import VocabularyBank from "@/models/VocabularyBank";
import UserActivity from "@/models/UserActivity";
import SkillAssessment from "@/models/SkillAssessment";
import ListeningStats from "@/models/ListeningStats";
import LearningGroup from "@/models/LearningGroup";
import Leaderboard from "@/models/Leaderboard";
import GrammarLesson from "@/models/GrammarLesson";
import GrammarIssue from "@/models/GrammarIssue";
import GamificationProfile from "@/models/GamificationProfile";
import Feedback from "@/models/Feedback";
import Challenge from "@/models/Challenge";
import School from "@/models/School";
import Branch from "@/models/Branch";
import { forceLogoutUser } from "@/lib/session-manager";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // Ensure the user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow updating specific fields
    const allowedUpdates = ["role"];
    const updates: Record<string, any> = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Prevent changing the last admin role if it's the only one
    if (existingUser.role === "admin" && updates.role === "user") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin role" },
          { status: 400 }
        );
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;

    // Ensure the user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting the last admin
    if (existingUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin user" },
          { status: 400 }
        );
      }
    }

    // Delete all related data - comprehensive cleanup
    const deletionResults = {
      sessions: 0,
      activities: 0,
      progress: 0,
      adminRoles: 0,
    };

    try {
      // 1. Clean up all user sessions first (force logout)
      const sessionCount = await forceLogoutUser(id);
      console.log(`Cleaned up ${sessionCount} active sessions for user ${id}`);

      // 2. Delete all user sessions from database
      const userSessionsResult = await UserSession.deleteMany({ userId: id });
      deletionResults.sessions += userSessionsResult.deletedCount;

      // 3. Delete all learning sessions
      const [listeningResult, speakingResult, readingResult, writingResult] =
        await Promise.all([
          ListeningSession.deleteMany({ userId: id }),
          SpeakingSession.deleteMany({ user: id }), // Note: SpeakingSession uses "user" field
          ReadingSession.deleteMany({ userId: id }),
          WritingSession.deleteMany({ userId: id }),
        ]);

      deletionResults.sessions +=
        listeningResult.deletedCount +
        speakingResult.deletedCount +
        readingResult.deletedCount +
        writingResult.deletedCount;

      // 4. Delete user progress and learning data
      const [
        writingPromptResult,
        vocabResult,
        skillResult,
        statsResult,
        grammarLessonResult,
        grammarIssueResult,
        gamificationResult,
      ] = await Promise.all([
        WritingPrompt.deleteMany({ userId: id }),
        VocabularyBank.deleteMany({ userId: id }),
        SkillAssessment.deleteMany({ userId: id }),
        ListeningStats.deleteMany({ userId: id }),
        GrammarLesson.deleteMany({ userId: id }),
        GrammarIssue.deleteMany({ userId: id }),
        GamificationProfile.deleteMany({ userId: id }),
      ]);

      deletionResults.progress +=
        writingPromptResult.deletedCount +
        vocabResult.deletedCount +
        skillResult.deletedCount +
        statsResult.deletedCount +
        grammarLessonResult.deletedCount +
        grammarIssueResult.deletedCount +
        gamificationResult.deletedCount;

      // 5. Delete user activities and challenges
      const [
        activityResult,
        learningGroupResult,
        leaderboardResult,
        challengeResult,
        feedbackResult,
      ] = await Promise.all([
        UserActivity.deleteMany({ userId: id }),
        LearningGroup.deleteMany({ userId: id }),
        Leaderboard.deleteMany({ userId: id }),
        Challenge.deleteMany({ userId: id }),
        Feedback.deleteMany({ userId: id }),
      ]);

      deletionResults.activities +=
        activityResult.deletedCount +
        learningGroupResult.deletedCount +
        leaderboardResult.deletedCount +
        challengeResult.deletedCount +
        feedbackResult.deletedCount;

      // 6. Remove user from school and branch admin arrays
      const [schoolUpdateResult, branchUpdateResult] = await Promise.all([
        School.updateMany({ admins: id }, { $pull: { admins: id } }),
        Branch.updateMany({ admins: id }, { $pull: { admins: id } }),
      ]);

      deletionResults.adminRoles +=
        schoolUpdateResult.modifiedCount + branchUpdateResult.modifiedCount;

      console.log(
        `User data cleanup completed for user ${id}:`,
        deletionResults
      );
    } catch (cleanupError) {
      console.error("Error during user data cleanup:", cleanupError);
      // Continue with user deletion even if cleanup fails partially
      // This prevents the system from being stuck if some cleanup fails
    }

    // Finally, delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: "User deleted successfully",
      cleanupResults: deletionResults,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
