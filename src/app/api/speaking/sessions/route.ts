import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpeakingSession from '@/models/SpeakingSession';

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get sessions
    const speakingSessions = await SpeakingSession.find({
      user: session.user.id,
    })
      .sort({ startTime: -1 }) // Most recent first
      .limit(20) // Limit to 20 sessions
      .lean(); // Convert to plain JS objects

    return NextResponse.json({
      success: true,
      sessions: speakingSessions,
    });
  } catch (error) {
    console.error('Error fetching speaking sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
