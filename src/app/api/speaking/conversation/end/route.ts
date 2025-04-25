import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("End speaking session endpoint called");
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
    const { speakingSessionId, audioUrls } = await req.json();
    console.log("Request body:", {
      speakingSessionId,
      audioUrls: audioUrls?.length || 0,
    });

    // Ensure audioUrls is an array if provided
    const normalizedAudioUrls = Array.isArray(audioUrls)
      ? audioUrls
      : audioUrls
        ? [audioUrls]
        : [];

    if (!speakingSessionId) {
      // If no specific session ID provided, try to find the most recent active session
      console.log(
        "No specific session ID provided, looking for latest active session"
      );
      const latestSession = await SpeakingSession.findOne({
        user: session.user.id,
        status: "active",
      }).sort({ startTime: -1 });

      if (latestSession) {
        console.log("Found latest active session:", latestSession._id);
        // Calculate duration
        const endTime = new Date();
        const duration = Math.round(
          (endTime.getTime() - latestSession.startTime.getTime()) / 1000
        );

        // Update the session
        latestSession.status = "completed";
        latestSession.endTime = endTime;
        latestSession.duration = duration;
        await latestSession.save();
        console.log("Session marked as completed with duration:", duration);

        // Trigger evaluation process asynchronously
        triggerEvaluation(latestSession._id.toString(), normalizedAudioUrls);

        return NextResponse.json({
          success: true,
          message: "Conversation ended successfully",
          sessionId: latestSession._id,
          duration,
        });
      } else {
        console.log("No active speaking session found");
        return NextResponse.json({
          success: false,
          message: "No active speaking session found",
        });
      }
    } else {
      // Update the specific session
      console.log("Looking for specific session:", speakingSessionId);
      const speakingSession = await SpeakingSession.findOne({
        _id: speakingSessionId,
        user: session.user.id,
      });

      if (!speakingSession) {
        console.error("Speaking session not found");
        return NextResponse.json(
          { error: "Speaking session not found" },
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
      console.log("Session marked as completed with duration:", duration);

      // Trigger evaluation process asynchronously
      triggerEvaluation(speakingSession._id.toString(), normalizedAudioUrls);

      return NextResponse.json({
        success: true,
        message: "Conversation ended successfully",
        sessionId: speakingSession._id,
        duration,
      });
    }
  } catch (error) {
    console.error("Error ending speaking session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Trigger the evaluation process for a completed speaking session
 * This is done asynchronously so the user doesn't have to wait for it
 */
async function triggerEvaluation(sessionId: string, audioUrls: string[] = []) {
  try {
    console.log("Triggering evaluation for session:", sessionId);
    console.log("Audio URLs available:", audioUrls.length);

    // Create an API key for server-to-server authentication
    // This helps bypass the NextAuth authentication for server-initiated requests
    const internalApiKey = process.env.NEXTAUTH_SECRET || "internal-api-key";

    // Make a non-blocking request to the evaluate endpoint
    fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/speaking/evaluate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Api-Key": internalApiKey,
        },
        body: JSON.stringify({
          speakingSessionId: sessionId,
          audioUrls: audioUrls,
        }),
      }
    ).catch(error => {
      console.error("Error triggering evaluation:", error);
    });

    console.log("Evaluation process triggered");
  } catch (error) {
    console.error("Error triggering evaluation process:", error);
    // Don't throw - this is a background process and shouldn't affect the main flow
  }
}
