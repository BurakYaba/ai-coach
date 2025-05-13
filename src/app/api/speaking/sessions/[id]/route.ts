import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";
import {
  recordActivity,
  recordSpeakingCompletion,
} from "@/lib/gamification/activity-recorder";

// Dynamic route
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get session by ID
    const speakingSession = await SpeakingSession.findOne({
      _id: id,
      user: session.user.id,
    }).lean();

    if (!speakingSession) {
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: speakingSession,
    });
  } catch (error: any) {
    console.error("Error fetching speaking session:", error);

    // Check if error is due to invalid ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/speaking/sessions/[id] - Delete a speaking session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Processing DELETE request for speaking session: ${params.id}`);

    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("Unauthorized attempt to delete speaking session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the session first to verify ownership
    const speakingSession = await SpeakingSession.findOne({
      _id: id,
      user: session.user.id,
    });

    if (!speakingSession) {
      console.warn(
        `Speaking session not found: ${id} for user: ${session.user.id}`
      );
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }

    // Delete the session
    await SpeakingSession.findByIdAndDelete(id);

    console.log(`Successfully deleted speaking session: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Speaking session deleted successfully",
    });
  } catch (error: any) {
    console.error(`Error deleting speaking session ${params.id}:`, error);

    // Check if error is due to invalid ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Add PATCH method to update speaking sessions
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Connect to database
    await dbConnect();

    // Get the current session state first
    const originalSession = await SpeakingSession.findOne({
      _id: id,
      user: session.user.id,
    });

    if (!originalSession) {
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, any> = {};

    // Handle various update fields
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.endTime !== undefined) {
      updateData.endTime = new Date(body.endTime);
    }

    if (body.duration !== undefined) {
      updateData.duration = body.duration;
    }

    // Check if we're updating the feedback
    if (body.feedback !== undefined) {
      updateData.feedback = {
        ...originalSession.feedback, // Keep existing feedback data
        ...body.feedback, // Update with new feedback data
      };
    }

    // Update the session
    const updatedSession = await SpeakingSession.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // Check if session update was successful and handle gamification
    if (updatedSession) {
      // Check if the session was just marked as completed (status transition)
      const wasJustCompleted =
        originalSession.status !== "completed" &&
        updatedSession.status === "completed";

      // Record gamification activity if the session was just completed
      if (wasJustCompleted) {
        try {
          const userId = session.user.id;
          const sessionId = id;
          const duration = updatedSession.duration || 300; // Default to 5 minutes

          // Determine if this was a conversation
          const isConversation =
            updatedSession.metadata?.mode === "realtime" ||
            updatedSession.metadata?.mode === "turn-based";

          if (isConversation) {
            // Record a conversation session (higher XP)
            await recordActivity(userId, "speaking", "conversation_session", {
              sessionId,
              duration,
              score: updatedSession.feedback?.overallScore || 0,
              transcriptCount: updatedSession.transcripts?.length || 0,
              timestamp: new Date().toISOString(),
            });
          } else {
            // Record a regular speaking session completion
            await recordSpeakingCompletion(userId, sessionId, duration);
          }

          console.log(
            `Recorded gamification activity for speaking session ${sessionId}`
          );
        } catch (gamificationError) {
          // Log but don't fail the overall request if gamification recording fails
          console.error(
            "Error recording gamification activity:",
            gamificationError
          );
          // Continue with the normal response
        }
      }
    }

    return NextResponse.json({
      success: true,
      session: updatedSession,
    });
  } catch (error: any) {
    console.error("Error updating speaking session:", error);

    // Check if error is due to invalid ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
