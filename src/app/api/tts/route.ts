import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Valid voice options from OpenAI
const VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export async function POST(req: Request) {
  console.log("TTS API: POST request received");

  try {
    // Parse request body
    const body = await req.json();
    const { text, voice = "onyx" } = body;

    console.log("TTS API: Request body parsed", {
      textLength: text?.length,
      voice,
    });

    // Validate inputs
    if (!text || typeof text !== "string") {
      console.log("TTS API: Invalid text input");
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate voice parameter
    if (!VALID_VOICES.includes(voice)) {
      console.log("TTS API: Invalid voice parameter", voice);
      return NextResponse.json(
        { error: `Voice must be one of: ${VALID_VOICES.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("TTS API: Calling OpenAI speech API...");

    // Generate speech from text using OpenAI
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any, // TypeScript type safety
      input: text,
    });

    console.log("TTS API: OpenAI response received");

    // Convert speech response to buffer
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    console.log("TTS API: Buffer created, size:", buffer.length);

    // Convert buffer to base64
    const base64Audio = buffer.toString("base64");
    console.log(
      "TTS API: Base64 conversion completed, length:",
      base64Audio.length
    );

    // Create a data URL for the audio
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log("TTS API: Returning audio URL");
    // Return the audio URL
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("TTS API: Error generating TTS:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
