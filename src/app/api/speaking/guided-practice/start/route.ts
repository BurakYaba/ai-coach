import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("Start guided practice session endpoint called");
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

    const { scenarioId, scenarioTitle, level = "a2" } = body;

    // Validate required fields
    if (!scenarioId || !scenarioTitle) {
      console.error("Missing required fields:", { scenarioId, scenarioTitle });
      return NextResponse.json(
        { error: "Missing required fields: scenarioId and scenarioTitle" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("Connecting to database");
    await dbConnect();

    // Create a new guided practice speaking session
    console.log("Creating guided practice session with parameters:", {
      scenarioId,
      scenarioTitle,
      level,
    });
    const speakingSession = await SpeakingSession.create({
      user: session.user.id,
      startTime: new Date(),
      voice: "alloy", // Default voice for guided practice
      modelName: "gpt-4o-mini", // Using regular GPT-4 for guided practice analysis
      status: "active",
      metadata: {
        mode: "guided-practice",
        scenario: scenarioId,
        scenarioTitle: scenarioTitle,
        level: level,
      },
      transcripts: [],
    });
    console.log(
      "Guided practice session created with ID:",
      speakingSession._id
    );

    // Return speaking session ID
    console.log(
      "Returning guided practice session ID:",
      speakingSession._id.toString()
    );
    return NextResponse.json({
      speakingSessionId: speakingSession._id.toString(),
    });
  } catch (error) {
    console.error("Error starting guided practice session:", error);
    return NextResponse.json(
      { error: "Failed to start guided practice session" },
      { status: 500 }
    );
  }
}
