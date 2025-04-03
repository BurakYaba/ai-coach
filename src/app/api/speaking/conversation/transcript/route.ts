import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpeakingSession from '@/models/SpeakingSession';

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { speakingSessionId, role, text } = await req.json();

    // Validate required parameters
    if (!speakingSessionId || !role || !text) {
      return NextResponse.json(
        { error: 'Missing required parameters: speakingSessionId, role, text' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'user' && role !== 'assistant') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "assistant"' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the session
    const speakingSession = await SpeakingSession.findOne({
      _id: speakingSessionId,
      user: session.user.id,
    });

    if (!speakingSession) {
      return NextResponse.json(
        { error: 'Speaking session not found' },
        { status: 404 }
      );
    }

    // Add transcript
    speakingSession.transcripts.push({
      role,
      text,
      timestamp: new Date(),
    });

    await speakingSession.save();

    return NextResponse.json({
      success: true,
      message: 'Transcript added successfully',
    });
  } catch (error) {
    console.error('Error adding transcript:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
