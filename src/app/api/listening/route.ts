import mongoose, { FilterQuery } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { generateTitleFromTranscript } from '@/lib/audio-processor';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { generateQuestions, extractVocabulary } from '@/lib/question-generator';
import ListeningSession, { IListeningSession } from '@/models/ListeningSession';

// GET /api/listening - Get all listening sessions for the current user
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Parse filter from URL
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') || 'all';

    // Create query conditions based on filter
    const baseQuery = { userId: new mongoose.Types.ObjectId(session.user.id) };
    let query: FilterQuery<IListeningSession> = { ...baseQuery };

    if (filter === 'completed') {
      query = {
        ...baseQuery,
        'userProgress.completionTime': { $exists: true, $ne: null },
      };
    } else if (filter === 'inprogress') {
      query = {
        ...baseQuery,
        $and: [
          {
            $or: [
              { 'userProgress.completionTime': { $exists: false } },
              { 'userProgress.completionTime': null },
            ],
          },
          {
            $or: [
              { 'userProgress.timeSpent': { $gt: 0 } },
              { 'userProgress.questionsAnswered': { $gt: 0 } },
              { 'userProgress.listenedSegments': { $exists: true, $ne: [] } },
            ],
          },
        ],
      };
    }

    // Fetch sessions with the appropriate query
    const listeningSessions = await ListeningSession.find(query)
      .sort({ createdAt: -1 })
      .limit(30); // Limit to most recent 30 sessions

    return NextResponse.json(listeningSessions);
  } catch (error) {
    console.error('Error fetching listening sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate title
    const title = await generateTitleFromTranscript(transcript, topic);

    // Generate questions
    const questions = await generateQuestions(transcript, level);

    // Extract vocabulary
    const vocabulary = await extractVocabulary(transcript, level);

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
  } catch (error) {
    console.error('Error creating listening session:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Helper function to convert CEFR level to numeric score
function getLevelScore(level: string): number {
  const levelScores: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };
  return levelScores[level] || 3; // Default to B1 (3) if unknown
}

// Helper function to calculate complexity based on level
function calculateComplexity(level: string): number {
  const levelComplexity: Record<string, number> = {
    A1: 2,
    A2: 3,
    B1: 5,
    B2: 7,
    C1: 8,
    C2: 10,
  };
  return levelComplexity[level] || 5; // Default to B1 (5) if unknown
}
