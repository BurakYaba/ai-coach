import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";
import { recordSpeakingCompletion } from "@/lib/gamification/activity-recorder";

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

// Simple function to trigger evaluation asynchronously
async function triggerEvaluation(sessionId: string) {
  try {
    // Trigger evaluation in the background without waiting for response
    fetch(`${process.env.NEXTAUTH_URL}/api/speaking/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionId,
        audioUrls: [], // Guided practice handles audio differently
      }),
    }).catch(error => {
      console.error("Background evaluation failed:", error);
    });
    console.log("Evaluation triggered for session:", sessionId);
  } catch (error) {
    console.error("Error triggering evaluation:", error);
  }
}

export async function POST(req: NextRequest) {
  console.log("End guided practice session endpoint called");
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User authenticated:", session.user.id);

    // Connect to database
    await dbConnect();
    console.log("Connected to database");

    // Get the speaking session ID from request body
    const { speakingSessionId } = await req.json();
    console.log("Request body:", { speakingSessionId });

    if (!speakingSessionId) {
      console.error("Missing speakingSessionId");
      return NextResponse.json(
        { error: "Missing speakingSessionId" },
        { status: 400 }
      );
    }

    // Find the specific guided practice session
    console.log("Looking for guided practice session:", speakingSessionId);
    const speakingSession = await SpeakingSession.findOne({
      _id: speakingSessionId,
      user: session.user.id,
      "metadata.mode": "guided-practice",
    });

    if (!speakingSession) {
      console.error("Guided practice session not found");
      return NextResponse.json(
        { error: "Guided practice session not found" },
        { status: 404 }
      );
    }

    // Calculate duration
    const endTime = new Date();
    const duration = Math.round(
      (endTime.getTime() - speakingSession.startTime.getTime()) / 1000
    );

    // Update the session
    speakingSession.status = "completed";
    speakingSession.endTime = endTime;
    speakingSession.duration = duration;
    await speakingSession.save();
    console.log(
      "Guided practice session marked as completed with duration:",
      duration
    );

    // Record activity for gamification
    try {
      await recordSpeakingCompletion(
        session.user.id,
        speakingSession._id.toString(),
        duration
      );
      console.log("Successfully recorded speaking completion");
    } catch (error) {
      console.error("Error recording speaking completion:", error);
      // Don't fail the request if gamification fails
    }

    // Trigger evaluation process asynchronously
    triggerEvaluation(speakingSession._id.toString());

    return NextResponse.json({
      success: true,
      message: "Guided practice session ended successfully",
      sessionId: speakingSession._id,
      duration,
    });
  } catch (error) {
    console.error("Error ending guided practice session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
