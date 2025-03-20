import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ReadingSession from '@/models/ReadingSession';

// GET /api/reading/[id] - Get a specific reading session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return NextResponse.json(
        { error: 'Reading session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(readingSession);
  } catch (error) {
    console.error(`Error fetching reading session ${params.id}:`, error);
    return NextResponse.json(
      {
        error: 'Failed to fetch reading session',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/reading/[id] - Update a reading session (primarily for updating progress)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      'userProgress.timeSpent',
      'userProgress.questionsAnswered',
      'userProgress.correctAnswers',
      'userProgress.vocabularyReviewed',
      'userProgress.comprehensionScore',
      'userProgress.completionTime',
    ];

    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }

    const updatedSession = await ReadingSession.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating reading session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/reading/[id] - Delete a reading session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await ReadingSession.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Reading session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reading session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
