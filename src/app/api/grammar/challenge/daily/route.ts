import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GrammarIssue from "@/models/GrammarIssue";
import User from "@/models/User";

// Set route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

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
    // Randomly assign the position of the correct answer
    const correctOption = Math.floor(Math.random() * 4); // Randomize the correct option position

    // Generate all incorrect options first
    const incorrectOptions: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate more options than needed to ensure uniqueness
      const incorrectOption = generateIncorrectOption(
        selectedIssue.issue.correction,
        i
      );
      // Only add if it's not the same as the correct answer and not already in the list
      if (
        incorrectOption !== selectedIssue.issue.correction &&
        !incorrectOptions.includes(incorrectOption)
      ) {
        incorrectOptions.push(incorrectOption);
      }

      // Break once we have 3 unique incorrect options
      if (incorrectOptions.length >= 3) break;
    }

    // If we couldn't generate 3 unique options, use some fallback options
    while (incorrectOptions.length < 3) {
      const fallbackOption = generateFallbackOption(
        selectedIssue.issue.correction,
        incorrectOptions.length
      );
      if (
        !incorrectOptions.includes(fallbackOption) &&
        fallbackOption !== selectedIssue.issue.correction
      ) {
        incorrectOptions.push(fallbackOption);
      }
    }

    // Insert the correct option at the randomly chosen position
    const options = [...incorrectOptions];
    options.splice(correctOption, 0, selectedIssue.issue.correction);

    // Ensure we only have 4 options total
    options.length = 4;

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
  const result = [...words]; // Create a copy to modify

  // More diverse modifications based on the seed
  switch (seed % 5) {
    case 0:
      // Change a verb tense or form
      if (words.length > 2) {
        const pos = Math.floor(words.length / 2);
        if (words[pos].endsWith("ed")) {
          result[pos] = words[pos].slice(0, -2) + "ing";
        } else if (words[pos].endsWith("ing")) {
          result[pos] = words[pos].slice(0, -3) + "ed";
        } else if (words[pos] === "is") {
          result[pos] = "are";
        } else if (words[pos] === "are") {
          result[pos] = "is";
        } else if (words[pos] === "has") {
          result[pos] = "have";
        } else if (words[pos] === "have") {
          result[pos] = "has";
        } else if (words[pos] === "was") {
          result[pos] = "were";
        } else if (words[pos] === "were") {
          result[pos] = "was";
        }
      }
      break;
    case 1:
      // Change article (a/an/the)
      for (let i = 0; i < words.length; i++) {
        if (words[i] === "a") {
          result[i] = "the";
          break;
        } else if (words[i] === "an") {
          result[i] = "a";
          break;
        } else if (words[i] === "the") {
          const nextWord = words[i + 1] || "";
          // Choose appropriate article based on next word
          if (/^[aeiou]/i.test(nextWord)) {
            result[i] = "an";
          } else {
            result[i] = "a";
          }
          break;
        }
      }
      break;
    case 2:
      // Swap word order of adjacent words
      if (words.length > 3) {
        const pos = 1 + Math.floor(Math.random() * (words.length - 2));
        const temp = result[pos];
        result[pos] = result[pos + 1];
        result[pos + 1] = temp;
      }
      break;
    case 3:
      // Change singular/plural forms
      for (let i = 0; i < words.length; i++) {
        if (
          words[i].endsWith("s") &&
          words[i].length > 2 &&
          !/ss$/.test(words[i])
        ) {
          // Likely plural, make singular
          result[i] = words[i].slice(0, -1);
          break;
        } else if (!words[i].endsWith("s") && words[i].length > 2) {
          // Likely singular, make plural
          result[i] = words[i] + "s";
          break;
        }
      }
      break;
    case 4:
      // Add or remove negation
      {
        let hasNot = false;
        for (let i = 0; i < words.length; i++) {
          if (words[i] === "not" || words[i] === "n't") {
            // Remove negation
            result.splice(i, 1);
            hasNot = true;
            break;
          }
        }
        if (!hasNot && words.length > 2) {
          // Add negation after first auxiliary verb
          const auxVerbs = [
            "is",
            "are",
            "was",
            "were",
            "do",
            "does",
            "did",
            "have",
            "has",
            "had",
          ];
          for (let i = 0; i < words.length; i++) {
            if (auxVerbs.includes(words[i].toLowerCase())) {
              result.splice(i + 1, 0, "not");
              break;
            }
          }
        }
      }
      break;
  }

  return result.join(" ");
}

// Function to generate fallback options if we can't get enough unique options
function generateFallbackOption(correctAnswer: string, index: number): string {
  const words = correctAnswer.split(" ");

  // Create dramatically different options as fallbacks
  switch (index) {
    case 0:
      // Reverse the entire sentence
      return words.reverse().join(" ");
    case 1:
      // Replace a substantial word with "INCORRECT"
      if (words.length > 2) {
        const newWords = [...words];
        const pos = Math.floor(words.length / 2);
        newWords[pos] = "INCORRECT";
        return newWords.join(" ");
      }
      return "This option is incorrect";
    default:
      // Scramble word order significantly
      return words.sort(() => Math.random() - 0.5).join(" ");
  }
}
