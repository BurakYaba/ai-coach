import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { VocabularyBank } from "@/models/VocabularyBank";
import memoryCache from "@/lib/cache";

// POST /api/vocabulary/word/[id]/favorite - Toggle favorite status of a word
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(
      "Processing POST request to toggle favorite status for word ID:",
      params.id
    );

    // Use authOptions to get the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log("Unauthorized: No valid session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user ID
    const userId = session.user.id;
    if (!userId) {
      console.log("Unauthorized: No user ID in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the word ID
    if (!mongoose.isValidObjectId(params.id)) {
      console.log("Invalid word ID format:", params.id);
      return NextResponse.json(
        { error: "Invalid word ID format" },
        { status: 400 }
      );
    }

    // Convert string ID to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the vocabulary bank for this user
    const vocabBank = await VocabularyBank.findOne({ userId: userObjectId });

    if (!vocabBank) {
      return NextResponse.json(
        { error: "Vocabulary bank not found" },
        { status: 404 }
      );
    }

    // Find the word in the vocabulary bank
    const wordIndex = vocabBank.words.findIndex(
      (w: { _id: { toString: () => string } }) => w._id.toString() === params.id
    );

    if (wordIndex === -1) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    // Get the current word
    const word = vocabBank.words[wordIndex];

    // Toggle the favorite status
    const tags = word.tags || [];
    const favoriteIndex = tags.indexOf("favorite");

    if (favoriteIndex === -1) {
      // Add favorite tag
      tags.push("favorite");
      console.log(`Adding 'favorite' tag to word: ${word.word}`);
    } else {
      // Remove favorite tag
      tags.splice(favoriteIndex, 1);
      console.log(`Removing 'favorite' tag from word: ${word.word}`);
    }

    // Update the word's tags
    vocabBank.words[wordIndex].tags = tags;

    try {
      // Save the updated vocabulary bank
      await vocabBank.save();

      // Invalidate cache
      const cacheKeys = memoryCache
        .keys()
        .filter((key: string) => key.startsWith(`vocabulary:${userId}:`));

      cacheKeys.forEach((key: string) => memoryCache.delete(key));
      console.log(
        `Invalidated ${cacheKeys.length} cache entries for user ${userId}`
      );

      // Return the updated word
      return NextResponse.json(vocabBank.words[wordIndex]);
    } catch (saveError: any) {
      console.error("Error saving vocabulary bank:", saveError);

      if (saveError.name === "ValidationError") {
        return NextResponse.json(
          { error: "Validation error: " + saveError.message },
          { status: 400 }
        );
      }

      throw saveError;
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);

    let errorMessage = "Internal server error";
    const statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
