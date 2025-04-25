import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getCacheHeaders, handleApiError } from "@/lib/reading-utils";
import ReadingSession from "@/models/ReadingSession";
import { VocabularyBank } from "@/models/VocabularyBank";

// Ensure dynamic behavior for these API routes
export const dynamic = "force-dynamic";

// GET /api/reading - Get all reading sessions for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Parse query parameters with proper validation
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "8", 10))
    );
    const level = searchParams.get("level");
    const topic = searchParams.get("topic");

    // Build query with proper typing
    const query: mongoose.FilterQuery<typeof ReadingSession> = {
      userId: userObjectId,
    };

    // Add optional filters when present
    if (level) query.level = level;
    if (topic) query.topic = topic;

    // Execute queries in parallel for better performance
    const [totalSessions, sessions] = await Promise.all([
      ReadingSession.countDocuments(query),
      ReadingSession.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), // Use lean for better performance when we don't need Mongoose methods
    ]);

    // Set cache headers for better performance (1 minute cache)
    const headers = getCacheHeaders(60);

    return NextResponse.json(
      {
        sessions,
        pagination: {
          total: totalSessions,
          pages: Math.ceil(totalSessions / limit),
          current: page,
          limit,
        },
      },
      { headers }
    );
  } catch (error) {
    return handleApiError(error, "Error fetching reading sessions");
  }
}

// POST /api/reading - Create a new reading session
export async function POST(req: NextRequest) {
  try {
    // Connect to the database first
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const body = await req.json();
    const {
      title,
      content,
      level,
      topic,
      questions,
      vocabulary,
      grammarFocus,
      aiAnalysis,
    } = body;

    // Validate required fields
    if (!title || !content || !level || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, level, or topic" },
        { status: 400 }
      );
    }

    // Calculate word count and estimated reading time
    const words = content.trim().split(/\s+/);
    const wordCount = words.length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed of 200 words per minute

    // Create reading session with proper error handling
    const readingSession = await ReadingSession.create({
      userId: userObjectId,
      title,
      content,
      level,
      topic,
      wordCount,
      estimatedReadingTime,
      questions: questions || [],
      vocabulary: vocabulary || [],
      grammarFocus: grammarFocus || [],
      aiAnalysis: aiAnalysis || {
        readingLevel: 5,
        complexityScore: 5,
        topicRelevance: 10,
        suggestedNextTopics: [],
      },
      userProgress: {
        startTime: new Date(),
        timeSpent: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        vocabularyReviewed: [],
      },
    });

    return NextResponse.json(readingSession, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Error creating reading session");
  }
}
