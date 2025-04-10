import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GrammarIssue from "@/models/GrammarIssue";
import User from "@/models/User";

// GET /api/grammar/challenge/daily - Get a daily grammar challenge
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user data to check if they've already completed today's challenge
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already completed a challenge today
    const lastChallenge = user.grammarProgress?.lastDailyChallenge;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasCompletedToday = lastChallenge
      ? new Date(lastChallenge).setHours(0, 0, 0, 0) === today.getTime()
      : false;

    // Find a high-priority unresolved issue to use for the challenge
    const issues = await GrammarIssue.find({
      userId: session.user.id,
      resolved: false,
    })
      .sort({ priority: -1 })
      .limit(10)
      .lean();

    if (issues.length === 0) {
      return NextResponse.json({
        hasCompletedToday,
        challenge: null,
      });
    }

    // Select a random issue from the high-priority ones
    const selectedIssue = issues[Math.floor(Math.random() * issues.length)];

    // Generate multiple choice options (the correct answer + 3 distractors)
    const correctOption = 0; // First option is always correct for simplicity
    const options = [
      selectedIssue.issue.correction,
      // Generate 3 plausible but incorrect options
      generateIncorrectOption(selectedIssue.issue.correction, 1),
      generateIncorrectOption(selectedIssue.issue.correction, 2),
      generateIncorrectOption(selectedIssue.issue.correction, 3),
    ];

    // Return the challenge
    return NextResponse.json({
      hasCompletedToday,
      challenge: {
        _id: selectedIssue._id,
        issue: selectedIssue.issue,
        category: selectedIssue.category,
        ceferLevel: selectedIssue.ceferLevel,
        options,
        correctOption,
      },
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}

// Helper function to generate plausible but incorrect options
function generateIncorrectOption(correctAnswer: string, seed: number): string {
  const words = correctAnswer.split(" ");

  // Different types of modifications based on the seed
  switch (seed % 3) {
    case 0:
      // Change a verb tense or form
      if (words.length > 2) {
        const pos = Math.floor(words.length / 2);
        if (words[pos].endsWith("ed")) {
          words[pos] = words[pos].slice(0, -2) + "ing";
        } else if (words[pos].endsWith("ing")) {
          words[pos] = words[pos].slice(0, -3) + "ed";
        } else if (words[pos] === "is") {
          words[pos] = "are";
        } else if (words[pos] === "are") {
          words[pos] = "is";
        }
      }
      break;
    case 1:
      // Change article (a/an/the)
      for (let i = 0; i < words.length; i++) {
        if (words[i] === "a") {
          words[i] = "the";
          break;
        } else if (words[i] === "an") {
          words[i] = "a";
          break;
        } else if (words[i] === "the") {
          words[i] = "a";
          break;
        }
      }
      break;
    case 2:
      // Swap word order
      if (words.length > 3) {
        const temp = words[1];
        words[1] = words[2];
        words[2] = temp;
      }
      break;
  }

  return words.join(" ");
}
