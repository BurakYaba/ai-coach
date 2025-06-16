import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReadingSession from "@/models/ReadingSession";
import { GamificationService } from "@/lib/gamification/gamification-service";

// GET /api/reading/sessions/[id] - Get a specific reading session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.warn(`Invalid session ID format: ${params.id}`);
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("Unauthorized access attempt to reading session");
      return NextResponse.json(
        { error: "You must be logged in to access reading sessions" },
        { status: 401 }
      );
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      console.warn("User ID not found in session");
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await dbConnect();

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: userObjectId,
    });

    if (!readingSession) {
      console.warn(
        `Reading session not found: ${params.id} for user: ${userId}`
      );
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(readingSession);
  } catch (error) {
    console.error(`Error fetching reading session ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch reading session",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/reading/sessions/[id] - Update a reading session (primarily for updating progress)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.warn(`Invalid session ID format: ${params.id}`);
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("Unauthorized attempt to update reading session");
      return NextResponse.json(
        { error: "You must be logged in to update reading sessions" },
        { status: 401 }
      );
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      console.warn("User ID not found in session");
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await dbConnect();

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Invalid JSON in request body:", e);
      return NextResponse.json(
        { error: "Invalid request body - JSON parsing failed" },
        { status: 400 }
      );
    }

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: userObjectId,
    });

    if (!readingSession) {
      console.warn(
        `Reading session not found: ${params.id} for user: ${userId}`
      );
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    // Extract fields to update
    const fieldsToUpdate: Record<string, any> = {};
    const allowedFields = [
      "userProgress.timeSpent",
      "userProgress.questionsAnswered",
      "userProgress.correctAnswers",
      "userProgress.vocabularyReviewed",
      "userProgress.comprehensionScore",
      "userProgress.completionTime",
    ];

    // Extract changes from request body
    const updateFields = Object.keys(body).filter(key =>
      allowedFields.includes(key)
    );

    if (updateFields.length === 0) {
      console.warn("No valid fields to update");
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Handle special case for vocabularyReviewed to avoid duplicates
    if (body["userProgress.vocabularyReviewed"]) {
      const existingVocab =
        readingSession.userProgress.vocabularyReviewed || [];

      // Combine existing and new vocabulary words, ensuring no duplicates
      const newVocab = Array.isArray(body["userProgress.vocabularyReviewed"])
        ? body["userProgress.vocabularyReviewed"]
        : [];

      // Create a Set and convert back to array to remove duplicates
      const uniqueVocab = new Set([...existingVocab, ...newVocab]);
      fieldsToUpdate["userProgress.vocabularyReviewed"] =
        Array.from(uniqueVocab);
    }

    // Handle questionsAnswered - ensure it doesn't exceed the total number of questions
    if (body["userProgress.questionsAnswered"] !== undefined) {
      const requestedCount = body["userProgress.questionsAnswered"];
      const existingCount = readingSession.userProgress.questionsAnswered || 0;

      // Only increase questions if the new count is higher
      if (requestedCount > existingCount) {
        // Don't exceed total number of questions
        const totalQuestions = readingSession.questions.length;
        fieldsToUpdate["userProgress.questionsAnswered"] = Math.min(
          requestedCount,
          totalQuestions
        );
      } else {
        // Keep the existing count if new count isn't higher
        fieldsToUpdate["userProgress.questionsAnswered"] = existingCount;
      }
    }

    // Handle correctAnswers - ensure it doesn't exceed questionsAnswered
    if (body["userProgress.correctAnswers"] !== undefined) {
      const requestedCorrect = body["userProgress.correctAnswers"];
      const existingCorrect = readingSession.userProgress.correctAnswers || 0;

      // Only increase correct answers if the new count is higher
      if (requestedCorrect > existingCorrect) {
        // Don't exceed questions answered
        const questionsAnswered =
          fieldsToUpdate["userProgress.questionsAnswered"] ||
          readingSession.userProgress.questionsAnswered ||
          0;
        fieldsToUpdate["userProgress.correctAnswers"] = Math.min(
          requestedCorrect,
          questionsAnswered
        );
      } else {
        // Keep the existing count if new count isn't higher
        fieldsToUpdate["userProgress.correctAnswers"] = existingCorrect;
      }
    }

    // Handle other fields
    updateFields.forEach(field => {
      if (
        field !== "userProgress.vocabularyReviewed" &&
        field !== "userProgress.questionsAnswered" &&
        field !== "userProgress.correctAnswers" &&
        body[field] !== undefined
      ) {
        fieldsToUpdate[field] = body[field];
      }
    });

    // Update the reading session
    const updatedSession = await ReadingSession.findByIdAndUpdate(
      params.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    // Check if this update includes setting a completion time (which means the session is being completed)
    // Only trigger gamification if the session wasn't previously completed
    if (
      body["userProgress.completionTime"] &&
      !readingSession.userProgress.completionTime
    ) {
      try {
        // Award XP for completing the session
        await GamificationService.awardXP(
          userId,
          "reading",
          "complete_session",
          {
            sessionId: params.id,
            timeSpent: updatedSession.userProgress.timeSpent || 0,
            correctAnswers: updatedSession.userProgress.correctAnswers || 0,
            questionsAnswered:
              updatedSession.userProgress.questionsAnswered || 0,
            comprehensionScore:
              updatedSession.userProgress.comprehensionScore || 0,
          }
        );

        // If there were correct answers recorded, award XP for those too
        if (updatedSession.userProgress.correctAnswers > 0) {
          await GamificationService.awardXP(
            userId,
            "reading",
            "correct_answer",
            {
              sessionId: params.id,
              count: updatedSession.userProgress.correctAnswers,
              isPartOfCompletedSession: true,
            }
          );
        }

        // If vocabulary words were reviewed, award XP for those too
        const vocabCount = (
          updatedSession.userProgress.vocabularyReviewed || []
        ).length;
        if (vocabCount > 0) {
          await GamificationService.awardXP(userId, "reading", "review_word", {
            sessionId: params.id,
            count: vocabCount,
            isPartOfCompletedSession: true,
          });
        }
      } catch (error) {
        console.error(`Error awarding XP for session ${params.id}:`, error);
        // Don't fail the request if gamification fails
      }
    }

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error(`Error updating reading session ${params.id}:`, error);

    // Check for MongoDB validation errors
    if ((error as any).name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: (error as any).message,
          fields: Object.keys((error as any).errors || {}),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update reading session",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/reading/sessions/[id] - Delete a reading session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.warn(`Invalid session ID format: ${params.id}`);
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("Unauthorized attempt to delete reading session");
      return NextResponse.json(
        { error: "You must be logged in to delete reading sessions" },
        { status: 401 }
      );
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      console.warn("User ID not found in session");
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await dbConnect();

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: userObjectId,
    });

    if (!readingSession) {
      console.warn(
        `Reading session not found: ${params.id} for user: ${userId}`
      );
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    await ReadingSession.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting reading session ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to delete reading session",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
