import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Valid voice options from OpenAI
const VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { text, voice = 'onyx' } = body;

    // Validate inputs
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate voice parameter
    if (!VALID_VOICES.includes(voice)) {
      return NextResponse.json(
        { error: `Voice must be one of: ${VALID_VOICES.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate speech from text using OpenAI
    const speechResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any, // TypeScript type safety
      input: text,
    });

    // Convert speech response to buffer
    const buffer = Buffer.from(await speechResponse.arrayBuffer());

    // Convert buffer to base64
    const base64Audio = buffer.toString('base64');

    // Create a data URL for the audio
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // Return the audio URL
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error('Error generating TTS:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
