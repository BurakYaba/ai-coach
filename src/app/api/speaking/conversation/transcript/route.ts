import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpeakingSession from '@/models/SpeakingSession';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if the request is JSON or FormData
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // Handle JSON request (text transcript)
      const { speakingSessionId, role, text } = await req.json();

      // Validate required fields
      if (!speakingSessionId || !role || !text) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Find the speaking session
      const speakingSession = await SpeakingSession.findById(speakingSessionId);

      if (!speakingSession) {
        return NextResponse.json(
          { error: 'Speaking session not found' },
          { status: 404 }
        );
      }

      // Add transcript to session
      speakingSession.transcripts.push({
        role,
        text,
        timestamp: new Date(),
      });

      await speakingSession.save();

      return NextResponse.json({ success: true });
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData request (audio file)
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File;
      const speakingSessionId = formData.get('speakingSessionId') as string;

      if (!audioFile || !speakingSessionId) {
        return NextResponse.json(
          { error: 'Missing audio file or session ID' },
          { status: 400 }
        );
      }

      // Find the speaking session
      const speakingSession = await SpeakingSession.findById(speakingSessionId);

      if (!speakingSession) {
        return NextResponse.json(
          { error: 'Speaking session not found' },
          { status: 404 }
        );
      }

      // Convert File to buffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Transcribe audio using OpenAI Whisper API
      const transcription = await openai.audio.transcriptions.create({
        file: new File([buffer], 'audio.webm', { type: audioFile.type }),
        model: 'whisper-1',
        language: 'en', // Default to English
      });

      const transcribedText = transcription.text;

      // Add the transcription to the session
      speakingSession.transcripts.push({
        role: 'user',
        text: transcribedText,
        timestamp: new Date(),
      });

      await speakingSession.save();

      return NextResponse.json({
        success: true,
        text: transcribedText,
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error handling transcript:', error);
    return NextResponse.json(
      { error: 'Failed to process transcript', details: error.message },
      { status: 500 }
    );
  }
}
