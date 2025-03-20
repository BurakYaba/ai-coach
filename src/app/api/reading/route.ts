import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ReadingSession from '@/models/ReadingSession';
import { VocabularyBank } from '@/models/VocabularyBank';

// GET /api/reading - Get all reading sessions for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Replace console.log statements with more appropriate logging mechanism in production

    // Replace 'any' types with proper type annotations for parsedStats

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

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const level = searchParams.get('level');
    const topic = searchParams.get('topic');

    const query: any = { userId: userObjectId };
    if (level) query.level = level;
    if (topic) query.topic = topic;

    const totalSessions = await ReadingSession.countDocuments(query);
    const sessions = await ReadingSession.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      sessions,
      pagination: {
        total: totalSessions,
        pages: Math.ceil(totalSessions / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reading - Create a new reading session
export async function POST(req: NextRequest) {
  try {
    console.log('Processing POST request to /api/reading');

    // Connect to the database first
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn('Unauthorized attempt to create a reading session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      console.warn('User ID not found in session');
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log(`Creating reading session for user: ${userId}`);

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

    // Log vocabulary words for debugging
    console.log(
      `Reading session includes ${vocabulary?.length || 0} vocabulary words`
    );

    // Calculate word count and estimated reading time
    const words = content.trim().split(/\s+/);
    const wordCount = words.length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed of 200 words per minute

    const readingSession = await ReadingSession.create({
      userId: userObjectId,
      title,
      content,
      level,
      topic,
      wordCount,
      estimatedReadingTime,
      questions,
      vocabulary,
      grammarFocus,
      aiAnalysis,
      userProgress: {
        startTime: new Date(),
        timeSpent: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        vocabularyReviewed: [],
      },
    });

    console.log(`Created reading session with ID: ${readingSession._id}`);

    // Add new vocabulary words to the user's vocabulary bank
    if (vocabulary && vocabulary.length > 0) {
      // We're no longer automatically adding vocabulary to the bank
      // Users will add words manually from the VocabularyPanel
      console.log(
        `Reading session created with ${vocabulary.length} vocabulary words. Words can be added to vocabulary bank manually.`
      );
    } else {
      console.log('No vocabulary words to add from this reading session');
    }

    return NextResponse.json(readingSession, { status: 201 });
  } catch (error) {
    console.error('Error creating reading session:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
