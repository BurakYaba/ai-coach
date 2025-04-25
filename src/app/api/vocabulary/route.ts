import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { VocabularyBank } from "@/models/VocabularyBank";

// Define types for vocabulary items
interface VocabularyItem {
  word: string;
  definition: string;
  context: string[];
  examples: string[];
  // Add other properties as needed
}

// Define a type for validation errors
interface ValidationError {
  name: string;
  message: string;
  errors?: Record<string, unknown>;
}

// GET /api/vocabulary - Get user's vocabulary bank
export async function GET(_req: NextRequest) {
  try {
    // Get session and validate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find vocabulary bank or create a new one
    const vocabBank = await VocabularyBank.findOne({
      userId: session.user.id,
    });

    if (!vocabBank) {
      return NextResponse.json(
        { words: [], message: "No vocabulary bank found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ words: vocabBank.words });
  } catch (error) {
    // Log error and return error response
    return NextResponse.json(
      { error: "Failed to fetch vocabulary" },
      { status: 500 }
    );
  }
}

// POST /api/vocabulary - Add new words to vocabulary bank
export async function POST(req: NextRequest) {
  try {
    // Get session and validate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { word } = data;

    if (!word) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find vocabulary bank or create one
    const vocabBank = await VocabularyBank.findOneAndUpdate(
      { userId: session.user.id },
      {
        $setOnInsert: {
          userId: session.user.id,
          words: [],
          stats: {
            totalWords: 0,
            masteredWords: 0,
            learningWords: 0,
            needsReviewWords: 0,
            averageMastery: 0,
            lastStudySession: new Date(),
            studyStreak: 0,
          },
          settings: {
            dailyWordGoal: 5,
            reviewFrequency: "spaced",
            notificationsEnabled: true,
          },
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    // Check if word already exists
    const wordExists = vocabBank.words.some(
      (w: VocabularyItem) => w.word.toLowerCase() === word.word.toLowerCase()
    );

    if (wordExists) {
      return NextResponse.json(
        { error: "Word already exists in vocabulary bank" },
        { status: 409 }
      );
    }

    // Add new word to vocabulary bank
    vocabBank.words.push({
      ...word,
      mastery: 0,
      lastReviewed: new Date(),
      nextReview: new Date(),
      easinessFactor: 2.5,
      repetitions: 0,
      interval: 0,
      reviewHistory: [
        {
          date: new Date(),
          performance: 0,
          context: word.source?.title
            ? `Added from ${word.source.type}: ${word.source.title}`
            : "Manually added",
        },
      ],
    });

    await vocabBank.save();

    return NextResponse.json({
      success: true,
      word: vocabBank.words[vocabBank.words.length - 1],
    });
  } catch (error) {
    // Check for validation errors
    if ((error as ValidationError).name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: (error as ValidationError).message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add word to vocabulary bank" },
      { status: 500 }
    );
  }
}
