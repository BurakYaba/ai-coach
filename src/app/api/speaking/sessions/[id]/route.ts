import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpeakingSession from '@/models/SpeakingSession';

// Dynamic route
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get session by ID
    const speakingSession = await SpeakingSession.findOne({
      _id: id,
      user: session.user.id,
    }).lean();

    if (!speakingSession) {
      return NextResponse.json(
        { error: 'Speaking session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: speakingSession,
    });
  } catch (error: any) {
    console.error('Error fetching speaking session:', error);

    // Check if error is due to invalid ID format
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
