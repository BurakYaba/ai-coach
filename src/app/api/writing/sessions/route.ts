import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import WritingSession from '@/models/WritingSession';

// GET /api/writing/sessions - Get all writing sessions for the user
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const writingSessions = await WritingSession.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(writingSessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch writing sessions' },
      { status: 500 }
    );
  }
}

// POST /api/writing/sessions - Create a new writing session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { prompt, level, topic, type } = body;

    if (!prompt || !level || !topic || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const writingSession = await WritingSession.create({
      userId: session.user.id,
      prompt,
      level,
      topic,
      type,
      status: 'in_progress',
      content: '',
      feedback: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(writingSession);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create writing session' },
      { status: 500 }
    );
  }
}
