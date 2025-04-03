import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

type LevelKey = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await req.json();
    const { gameId, score, correctAnswers, totalQuestions, timeSpent, level } =
      body;

    // Validate required fields
    if (
      !gameId ||
      score === undefined ||
      correctAnswers === undefined ||
      totalQuestions === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new game result document
    // Note: In a real implementation, you would have a GameResult model
    // For now, we'll just update the user's progress with the game results

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's total points based on game score
    // This is a simplified implementation
    user.progress.totalPoints += score;

    // Update language level based on performance
    // This is just a simple example - in a real app, you'd have more sophisticated logic
    if (correctAnswers / totalQuestions > 0.8) {
      // If they got more than 80% correct on a higher level than their current level,
      // consider increasing their level
      const levelValues: Record<LevelKey, number> = {
        A1: 1,
        A2: 2,
        B1: 3,
        B2: 4,
        C1: 5,
        C2: 6,
      };
      const gameLevel =
        level === 'easy'
          ? 'A1'
          : level === 'medium'
            ? 'B1'
            : ('C1' as LevelKey);
      const currentLevel = user.languageLevel as LevelKey;

      if (levelValues[gameLevel] > levelValues[currentLevel]) {
        user.languageLevel = gameLevel;
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Game result saved successfully',
      data: {
        score,
        pointsEarned: score,
      },
    });
  } catch (error) {
    console.error('Error saving game result:', error);
    return NextResponse.json(
      { error: 'Failed to save game result' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we don't have a proper GameResult model, so we'll just return an empty array
    // In a real implementation, you would query the database for the user's game results

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Error fetching game results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game results' },
      { status: 500 }
    );
  }
}
