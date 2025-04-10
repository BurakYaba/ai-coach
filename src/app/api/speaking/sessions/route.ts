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

    // Parse pagination parameters
    const url = new URL(req.url);
    const pageParam = url.searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = 8; // 2 rows x 4 columns
    const skip = (page - 1) * limit;

    // Count total number of sessions for pagination
    const totalSessions = await SpeakingSession.countDocuments({
      user: session.user.id,
    });

    // Get paginated sessions
    const speakingSessions = await SpeakingSession.find({
      user: session.user.id,
    })
      .sort({ startTime: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JS objects

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalSessions / limit);

    return NextResponse.json({
      success: true,
      sessions: speakingSessions,
      pagination: {
        total: totalSessions,
        pages: totalPages,
        current: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching speaking sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
