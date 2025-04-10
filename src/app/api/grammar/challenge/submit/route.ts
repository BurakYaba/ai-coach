import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GrammarIssue from "@/models/GrammarIssue";
import User from "@/models/User";

// POST /api/grammar/challenge/submit - Submit daily grammar challenge answer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get request body
    const body = await req.json();
    const { challengeId, isCorrect } = body;

    // Validate required fields
    if (challengeId === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: challengeId or isCorrect" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize grammar progress if it doesn't exist
    if (!user.grammarProgress) {
      user.grammarProgress = {
        challengeStreak: 0,
        badges: [],
        mastery: [],
      };
    }

    // Check if they already completed a challenge today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastChallenge = user.grammarProgress.lastDailyChallenge;
    const alreadyCompletedToday = lastChallenge
      ? new Date(lastChallenge).setHours(0, 0, 0, 0) === today.getTime()
      : false;

    // If they already completed a challenge today, don't update streak
    if (alreadyCompletedToday) {
      return NextResponse.json({
        newStreak: user.grammarProgress.challengeStreak,
        message: "Daily challenge already completed",
      });
    }

    // Update the grammar issue as resolved if the answer was correct
    if (isCorrect) {
      await GrammarIssue.findByIdAndUpdate(challengeId, {
        resolved: true,
        resolvedAt: new Date(),
      });
    }

    // Update the streak
    // If correct, increment streak; if incorrect, reset to 0
    if (isCorrect) {
      user.grammarProgress.challengeStreak =
        (user.grammarProgress.challengeStreak || 0) + 1;
    } else {
      user.grammarProgress.challengeStreak = 0;
    }

    // Update last challenge date
    user.grammarProgress.lastDailyChallenge = new Date();

    // Check if they earned a badge
    let badgeEarned = null;
    const currentStreak = user.grammarProgress.challengeStreak;

    // These are placeholder badge rules; actual badge logic may vary
    if (isCorrect && currentStreak === 7) {
      badgeEarned = { name: "One Week Streak", type: "grammar" };

      // Add badge to user's grammar progress if not already added
      if (
        !user.grammarProgress.badges.some(b => b.name === "One Week Streak")
      ) {
        user.grammarProgress.badges.push({
          name: "One Week Streak",
          category: "grammar",
          level: "intermediate",
          earnedAt: new Date(),
        });
      }
    } else if (isCorrect && currentStreak === 30) {
      badgeEarned = { name: "One Month Streak", type: "grammar" };

      // Add badge to user's grammar progress if not already added
      if (
        !user.grammarProgress.badges.some(b => b.name === "One Month Streak")
      ) {
        user.grammarProgress.badges.push({
          name: "One Month Streak",
          category: "grammar",
          level: "advanced",
          earnedAt: new Date(),
        });
      }
    }

    // Save user with updated progress
    await user.save();

    return NextResponse.json({
      newStreak: user.grammarProgress.challengeStreak,
      badgeEarned,
      message: "Challenge response recorded successfully",
    });
  } catch (error) {
    console.error("Error submitting grammar challenge:", error);
    return NextResponse.json(
      { error: "Failed to submit grammar challenge" },
      { status: 500 }
    );
  }
}
