import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { v2 as cloudinary } from "cloudinary";

import { authOptions } from "@/lib/auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { speakingSessionId } = body;

    // Validate required fields
    if (!speakingSessionId) {
      return NextResponse.json(
        { error: "Speaking session ID is required" },
        { status: 400 }
      );
    }

    try {
      // Delete all AI audio files for this session
      const deleteResult = await cloudinary.api.delete_resources_by_tag(
        `session-${speakingSessionId}`,
        { resource_type: "video" } // Audio files are stored as 'video' type in Cloudinary
      );

      console.log(
        `Cleaned up AI audio for session ${speakingSessionId}:`,
        deleteResult
      );

      return NextResponse.json({
        success: true,
        deletedCount: Object.keys(deleteResult.deleted || {}).length,
        message: `Cleaned up AI audio files for session ${speakingSessionId}`,
      });
    } catch (cloudinaryError: any) {
      // Log the error but don't fail the request - cleanup is not critical
      console.warn("Cloudinary cleanup warning:", cloudinaryError.message);

      return NextResponse.json({
        success: true,
        warning: "Some audio files may not have been cleaned up",
        message: "Session cleanup completed with warnings",
      });
    }
  } catch (error: any) {
    console.error("Error cleaning up AI audio:", error);
    return NextResponse.json(
      {
        error: "Failed to cleanup audio files",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
