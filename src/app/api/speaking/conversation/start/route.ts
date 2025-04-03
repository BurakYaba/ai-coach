import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpeakingSession from '@/models/SpeakingSession';
import User from '@/models/User';

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
    const { voice = 'alloy' } = await req.json();

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: 'Invalid voice selected' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Request ephemeral key from OpenAI
    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-realtime-preview-2024-12-17',
          voice: voice,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create session with OpenAI' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check if client_secret is present
    if (!data.client_secret?.value) {
      return NextResponse.json(
        { error: 'No ephemeral key received from OpenAI' },
        { status: 500 }
      );
    }

    // Store session information in database
    const speakingSession = new SpeakingSession({
      user: user._id,
      voice: voice,
      modelName: 'gpt-4o-mini-realtime-preview-2024-12-17',
      status: 'active',
      startTime: new Date(),
      transcripts: [],
    });

    await speakingSession.save();

    // Store the session in the user's session to retrieve it later
    // @ts-expect-error - Custom property to store in session
    session.speakingSessionId = speakingSession._id.toString();

    return NextResponse.json({
      ephemeralKey: data.client_secret.value,
      expiresAt: data.client_secret.expires_at,
      sessionId: data.id,
      speakingSessionId: speakingSession._id.toString(),
    });
  } catch (error) {
    console.error('Error starting speaking session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
