import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

export const dynamic = 'force-dynamic';

// POST /api/listening/session - Create a new listening session from a library item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const requiredFields = [
      'title',
      'level',
      'topic',
      'content',
      'contentType',
      'duration',
    ];

    // Validate required fields
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Create session
    const listeningSession = await ListeningSession.create({
      userId: userObjectId,
      title: body.title,
      level: body.level,
      topic: body.topic,
      content: body.content,
      contentType: body.contentType,
      duration: body.duration || 5,
      isLibrary: false,
      libraryItemId: body.libraryItemId || null,
      questions: body.questions || [],
      vocabulary: body.vocabulary || [],
      userProgress: {
        startTime: new Date(),
        timeSpent: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        vocabularyReviewed: [],
        listenedSegments: [],
        replays: [],
      },
      aiAnalysis: {
        listeningLevel: getLevelScore(body.level),
        complexityScore: calculateComplexity(body.level),
        topicRelevance: 10, // Default to maximum relevance
        suggestedNextTopics: [],
      },
    });

    return NextResponse.json(listeningSession);
  } catch (error) {
    console.error('Error creating listening session:', error);
    return NextResponse.json(
      { error: 'Failed to create listening session' },
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
