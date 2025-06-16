import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // console.log("End speaking session endpoint called");
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // console.log("User authenticated:", session.user.id);

    // Connect to database
    await dbConnect();
    // console.log("Connected to database");

    // Get the speaking session ID from request body
    const { speakingSessionId, audioUrls } = await req.json();
    // console.log("Request body:", {
    //   speakingSessionId,
    //   audioUrls: audioUrls?.length || 0,
    // });

    // Ensure audioUrls is an array if provided
    const normalizedAudioUrls = Array.isArray(audioUrls)
      ? audioUrls
      : audioUrls
        ? [audioUrls]
        : [];

    if (!speakingSessionId) {
      // If no specific session ID provided, try to find the most recent active session
      // console.log(
      //   "No specific session ID provided, looking for latest active session"
      // );
      const latestSession = await SpeakingSession.findOne({
        user: session.user.id,
        status: "active",
      }).sort({ startTime: -1 });

      if (latestSession) {
        // console.log("Found latest active session:", latestSession._id);
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
        // console.log("Session marked as completed with duration:", duration);

        // Note: Gamification recording is now handled by the evaluate endpoint
        // to avoid duplicate activity records

        // Trigger evaluation process asynchronously
        triggerEvaluation(latestSession._id.toString(), normalizedAudioUrls);

        return NextResponse.json({
          success: true,
          message: "Conversation ended successfully",
          sessionId: latestSession._id,
          duration,
        });
      } else {
        // console.log("No active speaking session found");
        return NextResponse.json({
          success: false,
          message: "No active speaking session found",
        });
      }
    } else {
      // Update the specific session
      // console.log("Looking for specific session:", speakingSessionId);
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
      // console.log("Session marked as completed with duration:", duration);

      // Note: Gamification recording is now handled by the evaluate endpoint
      // to avoid duplicate activity records

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
    // console.log("Triggering evaluation for session:", sessionId);
    // console.log("Audio URLs available:", audioUrls.length);

    // Create an API key for server-to-server authentication
    // This helps bypass the NextAuth authentication for server-initiated requests
    const internalApiKey = process.env.NEXTAUTH_SECRET || "internal-api-key";
    // console.log("Internal API key available:", !!internalApiKey);

    // Log the API key's first and last few characters for debugging (safely)
    if (internalApiKey) {
      const safeKey = `${internalApiKey.substring(0, 3)}...${internalApiKey.substring(internalApiKey.length - 3)}`;
      // console.log("API key format check:", safeKey);
    }

    // Get base URL with fallback - ensure we use HTTPS for production
    let baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Make sure the URL has a protocol
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    const evaluateEndpoint = `${baseUrl}/api/speaking/evaluate`;

    // console.log(`Making API call to: ${evaluateEndpoint}`);
    // console.log("Headers being sent:", {
    //   "Content-Type": "application/json",
    //   "X-Internal-Api-Key": "present (value hidden)",
    // });

    // Make a request to the evaluate endpoint with proper error handling
    const response = await fetch(evaluateEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Api-Key": internalApiKey,
      },
      body: JSON.stringify({
        speakingSessionId: sessionId,
        audioUrls: audioUrls,
      }),
    });

    // Log the response details
    // console.log(`Evaluation API response status: ${response.status}`);
    // console.log(`Response type: ${response.type}`);
    // console.log(`Response URL: ${response.url}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Evaluation request failed:", response.status, errorText);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // console.log("Evaluation triggered successfully:", data);
  } catch (error) {
    console.error("Error triggering evaluation process:", error);
    // Don't throw - this is a background process and shouldn't affect the main flow
  }
}
