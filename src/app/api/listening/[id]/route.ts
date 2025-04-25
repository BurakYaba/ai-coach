import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { deleteCloudinaryFile } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import ListeningSession from "@/models/ListeningSession";

// Set default cache control headers
const DEFAULT_REVALIDATE_SECONDS = 60; // 1 minute

// GET /api/listening/[id] - Get a specific listening session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the request ID is valid
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Use lean() for better performance since we don't need instance methods
    const listeningSession = await ListeningSession.findById(params.id).lean();

    if (!listeningSession) {
      return NextResponse.json(
        { error: "Listening session not found" },
        { status: 404 }
      );
    }

    // Security check: ensure the session belongs to the current user
    if (
      listeningSession &&
      (listeningSession as any).userId.toString() !== session.user.id &&
      !(listeningSession as any).isPublic
    ) {
      return NextResponse.json(
        { error: "You do not have permission to access this session" },
        { status: 403 }
      );
    }

    // Set cache headers for better performance
    const headers = new Headers();
    headers.set("Cache-Control", `s-maxage=${DEFAULT_REVALIDATE_SECONDS}`);

    return NextResponse.json(listeningSession, { headers });
  } catch (error) {
    console.error("Error fetching listening session:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch listening session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/listening/[id] - Update a listening session (primarily for progress updates)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the request ID is valid
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the session first to verify ownership
    const listeningSession = await ListeningSession.findById(params.id);
    if (!listeningSession) {
      return NextResponse.json(
        { error: "Listening session not found" },
        { status: 404 }
      );
    }

    // Security check: ensure the session belongs to the current user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this session" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate update data
    if (!body) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    try {
      // Only allow specific fields to be updated for security
      const allowedUpdateFields = ["userProgress", "title", "notes"];
      const updates: Record<string, any> = {};

      // Extract only allowed fields for update
      for (const field of allowedUpdateFields) {
        if (field in body) {
          updates[field] = body[field];
        }
      }

      // If updating userProgress, merge with existing instead of overwriting
      if ("userProgress" in updates) {
        updates.userProgress = {
          ...listeningSession.userProgress,
          ...updates.userProgress,
        };
      }

      // Use findByIdAndUpdate for atomic update with validations
      const updatedSession = await ListeningSession.findByIdAndUpdate(
        params.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();

      return NextResponse.json(updatedSession);
    } catch (updateError) {
      console.error("Error updating listening session:", updateError);
      return NextResponse.json(
        {
          error: "Failed to update listening session",
          message:
            updateError instanceof Error
              ? updateError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PATCH listening session:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/listening/[id] - Delete a listening session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the request ID is valid
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the session first to verify ownership
    const listeningSession = await ListeningSession.findById(params.id);
    if (!listeningSession) {
      return NextResponse.json(
        { error: "Listening session not found" },
        { status: 404 }
      );
    }

    // Security check: ensure the session belongs to the current user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this session" },
        { status: 403 }
      );
    }

    // Check if this is a library item
    if (listeningSession.isLibrary) {
      return NextResponse.json(
        { error: "Library items cannot be deleted" },
        { status: 400 }
      );
    }

    // Delete the session
    await ListeningSession.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listening session:", error);
    return NextResponse.json(
      {
        error: "Failed to delete listening session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
