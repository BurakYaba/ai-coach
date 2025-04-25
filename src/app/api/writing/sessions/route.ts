import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import WritingSession from "@/models/WritingSession";

// GET /api/writing/sessions - Get all writing sessions for the user
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // First, let's check if any writing sessions exist at all
    const allSessions = await WritingSession.find({}).lean();

    if (allSessions.length > 0) {
      // Try with string comparison if needed
      const userIdStr = session.user.id.toString();

      // Find sessions that match by string comparison (in case of ObjectId/string mismatch)
      const matchingSessions = allSessions.filter(s => {
        const sessionUserId = s.userId ? s.userId.toString() : "";
        return sessionUserId === userIdStr;
      });

      if (matchingSessions.length > 0) {
        // Sort the sessions with newest first
        const sortedSessions = matchingSessions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json({ sessions: sortedSessions });
      }
    }

    // Try with MongoDB ObjectId
    try {
      const objectId = new mongoose.Types.ObjectId(session.user.id);

      // Now let's try to get the user's sessions with the ObjectId
      const writingSessions = await WritingSession.find({
        userId: objectId,
      })
        .sort({ createdAt: -1 }) // Ensure sorting by createdAt in descending order
        .lean();

      return NextResponse.json({ sessions: writingSessions });
    } catch (error: any) {
      // Fallback to using the string ID directly
      const writingSessions = await WritingSession.find({
        userId: session.user.id,
      })
        .sort({ createdAt: -1 }) // Ensure sorting by createdAt in descending order
        .lean();

      return NextResponse.json({ sessions: writingSessions });
    }
  } catch (error: any) {
    console.error("Error fetching writing sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch writing sessions", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/writing/sessions - Create a new writing session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Handle prompt data
    const promptData = body.prompt;

    if (!promptData) {
      return NextResponse.json(
        { error: "Missing prompt data object" },
        { status: 400 }
      );
    }

    // Ensure all required fields exist
    if (
      !promptData.text ||
      !promptData.type ||
      !promptData.topic ||
      !promptData.targetLength
    ) {
      return NextResponse.json(
        { error: "Missing required fields in prompt" },
        { status: 400 }
      );
    }

    // Validate and potentially swap type and topic if they're mixed up
    let { type, topic } = promptData;
    const validTypes = ["essay", "letter", "story", "argument"];

    // If type is not valid but is actually a topic, and topic is a valid type, swap them
    if (!validTypes.includes(type) && validTypes.includes(topic)) {
      const tempType = type;
      type = topic; // Use the topic as type since it's a valid type
      topic = tempType; // Use the original type as topic
    }

    // If type is still invalid, default to essay
    if (!validTypes.includes(type)) {
      type = "essay";
    }

    // Ensure requirements is an array (even if empty)
    if (!promptData.requirements || !Array.isArray(promptData.requirements)) {
      promptData.requirements = [];
    } else {
      // Filter to ensure only strings in requirements
      promptData.requirements = promptData.requirements.filter(
        (r: any) => typeof r === "string"
      );
    }

    // Converting to mongoose-friendly format
    let userId;
    try {
      // Try to convert the user ID to a Mongoose ObjectId
      userId = new mongoose.Types.ObjectId(session.user.id);
    } catch (error: any) {
      userId = session.user.id; // Fallback to string ID
    }

    const sessionData = {
      userId,
      prompt: {
        text: promptData.text,
        type: type, // Use validated type
        topic: topic, // Use validated topic
        targetLength: Number(promptData.targetLength),
        requirements: promptData.requirements,
      },
      status: "draft",
      submission: {
        content: "",
        drafts: [],
      },
      timeTracking: {
        startTime: new Date(),
        totalTime: 0,
        activePeriods: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create the session
    const writingSession = await WritingSession.create(sessionData);

    return NextResponse.json(
      { session: writingSession, message: "Session created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create writing session", details: error.message },
      { status: 500 }
    );
  }
}
