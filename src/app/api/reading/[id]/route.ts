import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import {
  getCacheHeaders,
  handleApiError,
  isValidObjectId,
  getCachedItem,
  setCacheItem,
} from "@/lib/reading-utils";
import ReadingSession from "@/models/ReadingSession";

// GET /api/reading/[id] - Get a specific reading session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!params.id || !isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid reading session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first
    const cacheKey = `reading_session_${params.id}_${session.user.id}`;
    const cachedSession = getCachedItem(cacheKey);
    if (cachedSession) {
      // Return cached response with cache headers
      return NextResponse.json(cachedSession, {
        headers: getCacheHeaders(300), // 5 minutes cache
      });
    }

    await dbConnect();

    // Use lean() for better performance and specify fields to reduce data transfer
    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    }).lean();

    if (!readingSession) {
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    // Cache the result
    setCacheItem(cacheKey, readingSession);

    // Return with cache headers
    return NextResponse.json(readingSession, {
      headers: getCacheHeaders(300), // 5 minutes cache
    });
  } catch (error) {
    return handleApiError(error, `Error fetching reading session ${params.id}`);
  }
}

// PATCH /api/reading/[id] - Update a reading session (primarily for updating progress)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!params.id || !isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid reading session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the session first to verify ownership
    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    // Parse the request body
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      "userProgress.timeSpent",
      "userProgress.questionsAnswered",
      "userProgress.correctAnswers",
      "userProgress.vocabularyReviewed",
      "userProgress.comprehensionScore",
      "userProgress.completionTime",
      "userProgress.userAnswers",
      "userProgress.vocabularyBankAdded",
    ];

    // Build update object
    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }

    // If no valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the session
    const updatedSession = await ReadingSession.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    // Clear cache for this session
    const cacheKey = `reading_session_${params.id}_${session.user.id}`;
    setCacheItem(cacheKey, null);

    return NextResponse.json(updatedSession);
  } catch (error) {
    return handleApiError(error, "Error updating reading session");
  }
}

// DELETE /api/reading/[id] - Delete a reading session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!params.id || !isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid reading session ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the session first to verify ownership
    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    // Delete the session
    await ReadingSession.findByIdAndDelete(params.id);

    // Clear cache for this session
    const cacheKey = `reading_session_${params.id}_${session.user.id}`;
    setCacheItem(cacheKey, null);

    return NextResponse.json({
      success: true,
      message: "Reading session deleted successfully",
    });
  } catch (error) {
    return handleApiError(error, "Error deleting reading session");
  }
}
