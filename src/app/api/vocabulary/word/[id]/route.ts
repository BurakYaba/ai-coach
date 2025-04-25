import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import memoryCache from "@/lib/cache";
import {
  PerformanceRating,
  calculateNextReview,
} from "@/lib/spaced-repetition";
import { VocabularyBank } from "@/models/VocabularyBank";

// Define the SpacedRepetitionItem type
interface SpacedRepetitionItem {
  mastery: number;
  easinessFactor: number;
  repetitions: number;
  interval: number;
}

// Define the review history entry type
interface ReviewHistoryEntry {
  date: Date | string;
  performance: number;
  context: string;
}

// PATCH /api/vocabulary/word/[id] - Update a word in the vocabulary bank
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use authOptions to get the session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try different ways to get the user ID
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Validate the word ID
    if (!params.id || !mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid word ID format" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const body = await req.json();

    // Convert ISO date strings to Date objects
    if (body.lastReviewed && typeof body.lastReviewed === "string") {
      try {
        body.lastReviewed = new Date(body.lastReviewed);
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid lastReviewed date format" },
          { status: 400 }
        );
      }
    }

    if (body.nextReview && typeof body.nextReview === "string") {
      try {
        body.nextReview = new Date(body.nextReview);
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid nextReview date format" },
          { status: 400 }
        );
      }
    }

    // Convert date strings in reviewHistory
    if (body.reviewHistory && Array.isArray(body.reviewHistory)) {
      try {
        // Filter out any invalid entries first
        const validEntries = body.reviewHistory.filter(
          (entry: ReviewHistoryEntry) =>
            entry &&
            typeof entry === "object" &&
            entry.date !== undefined &&
            entry.date !== null &&
            entry.performance !== undefined &&
            entry.performance !== null
        );

        body.reviewHistory = validEntries.map((entry: ReviewHistoryEntry) => {
          let dateValue = entry.date;
          if (typeof entry.date === "string") {
            try {
              dateValue = new Date(entry.date);
              if (isNaN(dateValue.getTime())) {
                dateValue = new Date();
              }
            } catch (e) {
              dateValue = new Date();
            }
          } else if (
            !(entry.date instanceof Date) ||
            isNaN((entry.date as Date).getTime())
          ) {
            dateValue = new Date();
          }

          // Ensure performance is a valid number between 0-4
          let performanceValue = PerformanceRating.HESITANT; // Default
          if (typeof entry.performance === "number") {
            performanceValue = Math.min(4, Math.max(0, entry.performance));
          } else if (typeof entry.performance === "string") {
            try {
              const parsed = parseInt(entry.performance, 10);
              if (!isNaN(parsed)) {
                performanceValue = Math.min(4, Math.max(0, parsed));
              }
            } catch (e) {
              // Use default value if parsing fails
            }
          }

          return {
            date: dateValue,
            performance: performanceValue,
            context: entry.context || "Review",
          };
        });
      } catch (e) {
        // Instead of returning an error, set reviewHistory to an empty array
        body.reviewHistory = [];
      }
    }

    const vocabBank = await VocabularyBank.findOne({ userId: userObjectId });

    if (!vocabBank) {
      return NextResponse.json(
        { error: "Vocabulary bank not found" },
        { status: 404 }
      );
    }

    const wordIndex = vocabBank.words.findIndex(
      (w: { _id: { toString: () => string } }) => w._id.toString() === params.id
    );
    if (wordIndex === -1) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      "definition",
      "context",
      "examples",
      "pronunciation",
      "partOfSpeech",
      "difficulty",
      "mastery",
      "tags",
      "nextReview",
      "lastReviewed",
      "reviewHistory",
    ];

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }

    // Update review-related fields if mastery is being updated but nextReview is not provided
    if ("mastery" in updates && !("nextReview" in updates)) {
      updates.lastReviewed = new Date();

      // If reviewHistory is being updated and contains a performance rating, use it
      let performance = PerformanceRating.HESITANT; // Default to hesitant if no performance rating

      if (body.reviewHistory && body.reviewHistory.length > 0) {
        const latestReview = body.reviewHistory[body.reviewHistory.length - 1];
        if (typeof latestReview.performance === "number") {
          performance = latestReview.performance;
        }
      }

      // Use the spaced repetition utility to calculate the next review date
      const currentWord = vocabBank.words[wordIndex];

      // Extract easiness factor and repetitions from the word if available
      const wordData: SpacedRepetitionItem = {
        mastery:
          typeof updates.mastery === "number"
            ? updates.mastery
            : typeof updates.mastery === "string"
              ? Number(updates.mastery)
              : currentWord.mastery || 0,
        easinessFactor: currentWord.easinessFactor || 2.5,
        repetitions: currentWord.repetitions || 0,
        interval: currentWord.interval || 0,
      };

      updates.nextReview = calculateNextReview(performance, wordData);

      // Store the easiness factor and repetitions if the model supports it
      if ("easinessFactor" in currentWord) {
        updates.easinessFactor = wordData.easinessFactor;
      }

      if ("repetitions" in currentWord) {
        updates.repetitions = wordData.repetitions;
      }

      if ("interval" in currentWord) {
        updates.interval = wordData.interval;
      }

      // Add review history entry if not already provided
      if (!("reviewHistory" in updates)) {
        const reviewEntry: ReviewHistoryEntry = {
          date:
            updates.lastReviewed instanceof Date
              ? updates.lastReviewed
              : new Date(),
          performance: performance,
          context: "Manual review",
        };

        vocabBank.words[wordIndex].reviewHistory.push(reviewEntry);
      }
    }
    // Handle direct performance rating updates
    else if ("performance" in body && !("mastery" in updates)) {
      const performance = Number(body.performance);
      const currentWord = vocabBank.words[wordIndex];

      // Calculate new mastery based on performance
      const currentMastery = currentWord.mastery || 0;
      let masteryChange = 0;

      switch (performance) {
        case PerformanceRating.FORGOT:
          masteryChange = -15; // Significant decrease for forgotten words
          break;
        case PerformanceRating.DIFFICULT:
          masteryChange = -5; // Small decrease for difficult recall
          break;
        case PerformanceRating.HESITANT:
          masteryChange = 5; // Small increase for hesitant recall
          break;
        case PerformanceRating.EASY:
          masteryChange = 10; // Moderate increase for easy recall
          break;
        case PerformanceRating.PERFECT:
          masteryChange = 15; // Significant increase for perfect recall
          break;
      }

      // Calculate new mastery level, ensuring it stays within 0-100 range
      const newMastery = Math.min(
        100,
        Math.max(0, currentMastery + masteryChange)
      );
      updates.mastery = newMastery;

      // Update last reviewed date
      updates.lastReviewed = new Date();

      // Calculate next review date
      const wordData: SpacedRepetitionItem = {
        mastery: newMastery,
        easinessFactor: currentWord.easinessFactor || 2.5,
        repetitions: currentWord.repetitions || 0,
        interval: currentWord.interval || 0,
      };

      updates.nextReview = calculateNextReview(performance, wordData);

      // Update easiness factor and repetitions
      if ("easinessFactor" in currentWord) {
        // Calculate the new easiness factor (EF)
        const easinessFactor = currentWord.easinessFactor || 2.5;
        const newEF = Math.max(
          1.3,
          easinessFactor +
            (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
        );
        updates.easinessFactor = newEF;
      }

      if ("repetitions" in currentWord) {
        // Calculate new repetitions
        let newRepetitions = currentWord.repetitions || 0;
        if (performance < PerformanceRating.HESITANT) {
          newRepetitions = 0; // Reset repetitions for poor performance
        } else {
          newRepetitions += 1; // Increment for good performance
        }
        updates.repetitions = newRepetitions;
      }

      if ("interval" in currentWord) {
        // Calculate new interval based on performance and repetitions
        const repetitions =
          typeof updates.repetitions === "number" ? updates.repetitions : 0;
        const easinessFactor =
          typeof updates.easinessFactor === "number"
            ? updates.easinessFactor
            : 2.5;
        let newInterval = 0;

        if (performance < PerformanceRating.HESITANT) {
          newInterval = 1; // Reset interval for poor performance
        } else {
          if (repetitions === 1) {
            newInterval = 1; // 1 day
          } else if (repetitions === 2) {
            newInterval = 6; // 6 days
          } else {
            // For subsequent repetitions, multiply the previous interval by the easiness factor
            newInterval = Math.round(
              (currentWord.interval || 0) * easinessFactor
            );
          }
        }
        updates.interval = newInterval;
      }

      // Add review history entry
      const reviewEntry: ReviewHistoryEntry = {
        date: new Date(),
        performance: performance,
        context: "Spaced repetition review",
      };

      if (!Array.isArray(vocabBank.words[wordIndex].reviewHistory)) {
        vocabBank.words[wordIndex].reviewHistory = [];
      }

      vocabBank.words[wordIndex].reviewHistory.push(reviewEntry);

      console.log(
        `Updating word mastery from ${currentMastery}% to ${newMastery}% based on performance rating ${performance}`
      );
    }

    // Update the word
    Object.assign(vocabBank.words[wordIndex], updates);

    // Validate performance rating in reviewHistory
    if (
      updates.reviewHistory &&
      Array.isArray(updates.reviewHistory) &&
      updates.reviewHistory.length > 0
    ) {
      // Ensure all performance ratings are between 0 and 4
      updates.reviewHistory.forEach((entry: ReviewHistoryEntry) => {
        if (typeof entry.performance === "number") {
          // Clamp performance to 0-4 range
          entry.performance = Math.min(4, Math.max(0, entry.performance));
        }
      });
    }

    try {
      console.log("Attempting to save updated vocabulary bank");

      try {
        // First try the normal save (will likely work in most cases)
        await vocabBank.save();
      } catch (saveError: any) {
        // If we get a version error, fall back to direct update approach
        if (saveError.name === "VersionError") {
          console.log(
            "Version conflict detected, trying direct update approach"
          );

          // Get the specific word that we just modified
          const wordToUpdate = vocabBank.words[wordIndex];

          // Use findOneAndUpdate to update just this specific word
          const result = await VocabularyBank.findOneAndUpdate(
            { userId, "words._id": params.id },
            { $set: { [`words.${wordIndex}`]: wordToUpdate } },
            { new: true }
          );

          if (!result) {
            console.error("Failed to update word after version conflict");
            return NextResponse.json(
              { error: "Failed to update word. Please try again." },
              { status: 409 }
            );
          }

          console.log(
            "Successfully updated word using direct update after version conflict"
          );
        } else {
          // If it's not a version error, rethrow
          throw saveError;
        }
      }

      // Invalidate all cache entries for this user
      const cacheKeys = memoryCache
        .keys()
        .filter(key => key.startsWith(`vocabulary:${userId}:`));
      cacheKeys.forEach(key => memoryCache.delete(key));
      console.log(
        `Invalidated ${cacheKeys.length} cache entries for user ${userId}`
      );

      console.log("Successfully saved vocabulary bank");
      return NextResponse.json(vocabBank.words[wordIndex]);
    } catch (saveError: any) {
      console.error("Error saving vocabulary bank:", saveError);

      // Check for validation errors
      if (saveError.name === "ValidationError") {
        console.error("Validation error details:", saveError.errors);
        return NextResponse.json(
          { error: "Validation error: " + saveError.message },
          { status: 400 }
        );
      }

      throw saveError; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    console.error("Error updating word:", error);

    // Add more detailed error information
    let errorMessage = "Internal server error";
    const statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Log the full error stack for debugging
      console.error("Error stack:", error.stack);
    }

    // Log the request body for debugging (excluding sensitive data)
    try {
      const body = await req.clone().json();
      // Remove any sensitive fields if needed
      console.error("Request body that caused error:", {
        ...body,
        // Exclude sensitive fields if any
      });
    } catch (e) {
      console.error("Could not parse request body for error logging");
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// DELETE /api/vocabulary/word/[id] - Delete a word from the vocabulary bank
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Processing DELETE request for word ID:", params.id);

    // Use authOptions to get the session
    const session = await getServerSession(authOptions);
    console.log("Session data:", JSON.stringify(session, null, 2));

    if (!session) {
      console.log("Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user) {
      console.log("Unauthorized: No user in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try different ways to get the user ID
    const userId = session.user.id;
    console.log("User ID from session:", userId);

    if (!userId) {
      console.log("Session user object:", session.user);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const vocabBank = await VocabularyBank.findOne({ userId: userObjectId });

    if (!vocabBank) {
      return NextResponse.json(
        { error: "Vocabulary bank not found" },
        { status: 404 }
      );
    }

    const wordIndex = vocabBank.words.findIndex(
      (w: { _id: { toString: () => string } }) => w._id.toString() === params.id
    );
    if (wordIndex === -1) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    // Remove the word
    vocabBank.words.splice(wordIndex, 1);
    await vocabBank.save();

    return NextResponse.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting word:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/vocabulary/word/[id] - Update a word in the vocabulary bank (for backward compatibility)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Forward to PATCH handler for backward compatibility
  return PATCH(req, { params });
}
