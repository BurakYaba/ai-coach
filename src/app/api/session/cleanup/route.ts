import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/session-manager";
import UserSession from "@/models/UserSession";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    // This is a development/admin endpoint - add basic protection
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get("key");

    // Simple protection - in production you'd want proper authentication
    if (adminKey !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Clean up expired sessions
    const expiredCount = await cleanupExpiredSessions();

    // Optionally, clean up ALL sessions (for development)
    const cleanAll = searchParams.get("all") === "true";
    let totalCleaned = expiredCount;

    if (cleanAll) {
      const result = await UserSession.updateMany(
        { isActive: true },
        {
          $set: {
            isActive: false,
            terminatedAt: new Date(),
            terminationReason: "forced",
          },
        }
      );
      totalCleaned = result.modifiedCount;
    }

    // Fix database indexes if requested
    const fixIndexes = searchParams.get("fix_indexes") === "true";
    let indexMessage = "";

    if (fixIndexes) {
      try {
        // Drop the collection and recreate it to fix index issues
        const collection = mongoose.connection.db.collection("usersessions");

        // Drop all documents and indexes
        await collection.drop().catch(() => {
          // Ignore error if collection doesn't exist
        });

        // The model will recreate the collection with correct indexes on next use
        indexMessage = " and fixed database indexes";
      } catch (indexError) {
        console.error("Error fixing indexes:", indexError);
        indexMessage = " (index fix failed)";
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${totalCleaned} session(s)${indexMessage}`,
      expiredSessions: expiredCount,
      totalCleaned,
    });
  } catch (error) {
    console.error("Session cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
}
