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

    // Connect to database
    await dbConnect();

    // Get the speaking session ID from request body
    const { speakingSessionId } = await req.json();

    if (!speakingSessionId) {
      // If no specific session ID provided, try to find the most recent active session
      const latestSession = await SpeakingSession.findOne({
        user: session.user.id,
        status: 'active',
      }).sort({ startTime: -1 });

      if (latestSession) {
        // Calculate duration
        const endTime = new Date();
        const duration = Math.round(
          (endTime.getTime() - latestSession.startTime.getTime()) / 1000
        );

        // Update the session
        latestSession.status = 'completed';
        latestSession.endTime = endTime;
        latestSession.duration = duration;
        await latestSession.save();

        return NextResponse.json({
          success: true,
          message: 'Conversation ended successfully',
          sessionId: latestSession._id,
          duration,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'No active speaking session found',
        });
      }
    } else {
      // Update the specific session
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

      // Calculate duration
      const endTime = new Date();
      const duration = Math.round(
        (endTime.getTime() - speakingSession.startTime.getTime()) / 1000
      );

      // Update the session
      speakingSession.status = 'completed';
      speakingSession.endTime = endTime;
      speakingSession.duration = duration;
      await speakingSession.save();

      return NextResponse.json({
        success: true,
        message: 'Conversation ended successfully',
        sessionId: speakingSession._id,
        duration,
      });
    }
  } catch (error) {
    console.error('Error ending speaking session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
