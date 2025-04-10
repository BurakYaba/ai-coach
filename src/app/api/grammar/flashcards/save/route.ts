import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// POST /api/grammar/flashcards/save - Save or unsave a flashcard
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.flashcardId || typeof body.save !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: flashcardId or save' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize savedFlashcards if it doesn't exist
    if (!user.grammarProgress) {
      user.grammarProgress = {
        badges: [],
        mastery: [],
        challengeStreak: 0,
        savedFlashcards: [],
      };
    }

    if (!user.grammarProgress.savedFlashcards) {
      user.grammarProgress.savedFlashcards = [];
    }

    // Update saved flashcards
    if (body.save) {
      // Add to saved flashcards if not already saved
      if (!user.grammarProgress.savedFlashcards.includes(body.flashcardId)) {
        user.grammarProgress.savedFlashcards.push(body.flashcardId);
      }
    } else {
      // Remove from saved flashcards
      user.grammarProgress.savedFlashcards =
        user.grammarProgress.savedFlashcards.filter(
          id => id !== body.flashcardId
        );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      saved: body.save,
      savedFlashcards: user.grammarProgress.savedFlashcards,
    });
  } catch (error) {
    console.error('Error saving flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to save flashcard' },
      { status: 500 }
    );
  }
}

// GET /api/grammar/flashcards/saved - Get all saved flashcards
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return saved flashcard IDs
    return NextResponse.json({
      savedCardIds: user.grammarProgress?.savedFlashcards || [],
    });
  } catch (error) {
    console.error('Error fetching saved flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved flashcards' },
      { status: 500 }
    );
  }
}
