import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GrammarIssue from "@/models/GrammarIssue";

// GET /api/grammar/issues - Get all grammar issues for the user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const ceferLevel = url.searchParams.get("ceferLevel");
    const resolved = url.searchParams.get("resolved");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    // Build query
    const query: any = { userId: session.user.id };

    if (category) {
      query.category = category;
    }

    if (ceferLevel) {
      query.ceferLevel = ceferLevel;
    }

    if (resolved !== null) {
      query.resolved = resolved === "true";
    }

    // Execute query
    const issues = await GrammarIssue.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ issues });
  } catch (error: any) {
    console.error("Error fetching grammar issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch grammar issues", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/grammar/issues - Create a new grammar issue
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.issue || !body.sourceModule || !body.sourceSessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create grammar issue
    const grammarIssue = await GrammarIssue.create({
      userId: session.user.id,
      sourceModule: body.sourceModule,
      sourceSessionId: body.sourceSessionId,
      issue: {
        type: body.issue.type || "Grammar Error",
        text: body.issue.text,
        correction: body.issue.correction,
        explanation: body.issue.explanation,
      },
      ceferLevel: body.ceferLevel || "B1",
      category: body.issue.type?.includes(" ")
        ? body.issue.type.split(" ")[0].toLowerCase()
        : "grammar",
      resolved: false,
    });

    return NextResponse.json(
      { success: true, issue: grammarIssue },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding grammar issue:", error);
    return NextResponse.json(
      { error: "Failed to add grammar issue", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/grammar/issues - Update multiple grammar issues (bulk update)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (
      !body.issueIds ||
      !Array.isArray(body.issueIds) ||
      body.issueIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid issueIds" },
        { status: 400 }
      );
    }

    // Validate that resolved is a boolean
    if (typeof body.resolved !== "boolean") {
      return NextResponse.json(
        { error: "resolved must be a boolean" },
        { status: 400 }
      );
    }

    // Update issues
    const result = await GrammarIssue.updateMany(
      {
        _id: { $in: body.issueIds },
        userId: session.user.id, // Ensure user can only update their own issues
      },
      {
        $set: { resolved: body.resolved },
      }
    );

    return NextResponse.json({
      message: `Updated ${result.modifiedCount} grammar issues`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("Error updating grammar issues:", error);
    return NextResponse.json(
      { error: "Failed to update grammar issues", details: error.message },
      { status: 500 }
    );
  }
}
