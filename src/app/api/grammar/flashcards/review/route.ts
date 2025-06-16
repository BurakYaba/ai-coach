import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { recordActivity } from "@/lib/gamification/activity-recorder";

// POST /api/grammar/flashcards/review - Update a flashcard's review status
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.flashcardId || typeof body.known !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: flashcardId or known" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize grammarProgress if it doesn't exist
    if (!user.grammarProgress) {
      user.grammarProgress = {
        badges: [],
        mastery: [],
        challengeStreak: 0,
      };
    }

    // Extract category from flashcardId
    // Format: category_number or default_category_number
    const idParts = body.flashcardId.split("_");
    let category = idParts[0];
    if (category === "default") {
      category = idParts[1];
    }

    // Find existing mastery for this category
    const existingMasteryIndex = user.grammarProgress.mastery.findIndex(
      m => m.category === category
    );

    if (existingMasteryIndex >= 0) {
      // Update existing mastery entry
      if (body.known) {
        // Increase mastery level if marked as known (max 5)
        user.grammarProgress.mastery[existingMasteryIndex].level = Math.min(
          5,
          user.grammarProgress.mastery[existingMasteryIndex].level + 0.2
        );
      } else {
        // Decrease mastery level if marked as unknown (min 1)
        user.grammarProgress.mastery[existingMasteryIndex].level = Math.max(
          1,
          user.grammarProgress.mastery[existingMasteryIndex].level - 0.5
        );
      }

      // Update last practiced timestamp
      user.grammarProgress.mastery[existingMasteryIndex].lastPracticed =
        new Date();
    } else {
      // Add new mastery entry
      user.grammarProgress.mastery.push({
        category,
        level: body.known ? 1.2 : 1, // Start slightly higher if known
        lastPracticed: new Date(),
      });
    }

    await user.save();

    // Record activity for gamification
    try {
      const score = body.known ? 100 : 0;
      await recordActivity(session.user.id, "grammar", "complete_exercise", {
        flashcardId: body.flashcardId,
        category,
        score,
        known: body.known,
        itemsCompleted: 1,
        timestamp: new Date().toISOString(),
      });
      console.log("Successfully recorded grammar flashcard review");
    } catch (error) {
      console.error("Error recording grammar flashcard review:", error);
      // Don't fail the request if gamification fails
    }

    return NextResponse.json({
      success: true,
      known: body.known,
      category,
    });
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard review" },
      { status: 500 }
    );
  }
}
