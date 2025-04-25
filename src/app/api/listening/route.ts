import mongoose, { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { generateTitleFromTranscript } from "@/lib/audio-processor";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { generateQuestions, extractVocabulary } from "@/lib/question-generator";
import { getLevelScore, calculateComplexity } from "@/lib/utils";
import ListeningSession, { IListeningSession } from "@/models/ListeningSession";

// GET /api/listening - Get all listening sessions for the current user
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Parse filter and pagination from URL
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "all";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "30", 10);
    const skip = (page - 1) * limit;

    // Create query conditions based on filter
    const baseQuery = { userId: new mongoose.Types.ObjectId(session.user.id) };
    let query: FilterQuery<IListeningSession> = { ...baseQuery };

    if (filter === "completed") {
      query = {
        ...baseQuery,
        "userProgress.completionTime": { $exists: true, $ne: null },
        isLibrary: { $ne: true },
      };
    } else if (filter === "inprogress") {
      query = {
        ...baseQuery,
        isLibrary: { $ne: true },
        $and: [
          {
            $or: [
              { "userProgress.completionTime": { $exists: false } },
              { "userProgress.completionTime": null },
            ],
          },
          {
            $or: [
              { "userProgress.timeSpent": { $gt: 0 } },
              { "userProgress.questionsAnswered": { $gt: 0 } },
              { "userProgress.vocabularyReviewed": { $exists: true, $ne: [] } },
              { "userProgress.listenedSegments": { $exists: true, $ne: [] } },
            ],
          },
        ],
      };
    } else if (filter === "library") {
      query = {
        ...baseQuery,
        isLibrary: true,
      };
    }

    // Use lean() for better performance when we don't need full document features
    const listeningSessions = await ListeningSession.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await ListeningSession.countDocuments(query);

    return NextResponse.json({
      sessions: listeningSessions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching listening sessions:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/listening - Create a new listening session from an existing transcript
export async function POST(req: NextRequest) {
  try {
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
      transcript,
      audioUrl,
      cloudinaryPublicId,
      level,
      topic,
      contentType,
      duration,
    } = body;

    // Validate required fields
    if (
      !transcript ||
      !audioUrl ||
      !level ||
      !topic ||
      !contentType ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Generate title - Handle potential failures gracefully
      const title = await generateTitleFromTranscript(transcript, topic).catch(
        err => {
          console.error("Error generating title:", err);
          return `${topic} Listening Session`; // Fallback title
        }
      );

      // Generate questions - Handle potential failures gracefully
      const questions = await generateQuestions(transcript, level).catch(
        err => {
          console.error("Error generating questions:", err);
          return []; // Empty array as fallback
        }
      );

      // Extract vocabulary - Handle potential failures gracefully
      const vocabulary = await extractVocabulary(transcript, level).catch(
        err => {
          console.error("Error extracting vocabulary:", err);
          return []; // Empty array as fallback
        }
      );

      // Create listening session
      const listeningSession = await ListeningSession.create({
        userId: userObjectId,
        title,
        content: {
          transcript,
          audioUrl,
          cloudinaryPublicId,
        },
        level,
        topic,
        contentType,
        duration,
        questions,
        vocabulary,
        userProgress: {
          startTime: new Date(),
          timeSpent: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
          vocabularyReviewed: [],
        },
        aiAnalysis: {
          listeningLevel: getLevelScore(level),
          complexityScore: calculateComplexity(level),
          topicRelevance: 10, // Default to maximum relevance
          suggestedNextTopics: [],
        },
      });

      return NextResponse.json(listeningSession, { status: 201 });
    } catch (processingError) {
      console.error("Error processing listening content:", processingError);
      return NextResponse.json(
        {
          error: "Failed to process listening content",
          details:
            processingError instanceof Error
              ? processingError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating listening session:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
