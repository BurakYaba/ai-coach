import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("Start speaking session endpoint called");
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User authenticated:", session.user.id);

    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    const {
      voice = "alloy",
      mode = "realtime",
      scenario = "free",
      level = "b1",
    } = body;

    // Validate voice parameter
    const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    if (!validVoices.includes(voice)) {
      console.error("Invalid voice parameter:", voice);
      return NextResponse.json(
        { error: "Invalid voice parameter" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("Connecting to database");
    await dbConnect();

    // Create a new speaking session
    console.log("Creating speaking session with parameters:", {
      voice,
      mode,
      scenario,
      level,
    });
    const speakingSession = await SpeakingSession.create({
      user: session.user.id,
      startTime: new Date(),
      voice,
      modelName:
        mode === "realtime"
          ? "gpt-4o-mini-realtime-preview-2024-12-17"
          : "gpt-3.5-turbo", // Using gpt-3.5-turbo for turn-based mode for faster responses
      status: "active",
      metadata: {
        mode,
        scenario,
        level,
      },
      transcripts: [],
    });
    console.log("Speaking session created with ID:", speakingSession._id);

    // For realtime mode, generate an ephemeral key
    let ephemeralKey = null;

    if (mode === "realtime") {
      console.log("Requesting ephemeral key for realtime mode");
      // Request ephemeral key from OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-realtime-preview-2024-12-17",
            voice: voice,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API error:", errorData);
        return NextResponse.json(
          { error: "Failed to create session with OpenAI" },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("Received ephemeral key response from OpenAI");

      // Check if client_secret is present
      if (!data.client_secret?.value) {
        console.error("No client_secret.value in OpenAI response");
        return NextResponse.json(
          { error: "No ephemeral key received from OpenAI" },
          { status: 500 }
        );
      }

      ephemeralKey = data.client_secret.value;
      console.log("Successfully retrieved ephemeral key");
    }

    // Return speaking session ID and ephemeral key if available
    console.log(
      "Returning speaking session ID:",
      speakingSession._id.toString()
    );
    return NextResponse.json({
      speakingSessionId: speakingSession._id.toString(),
      ...(ephemeralKey && { ephemeralKey }),
    });
  } catch (error: any) {
    console.error("Error starting speaking session:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to start speaking session",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
