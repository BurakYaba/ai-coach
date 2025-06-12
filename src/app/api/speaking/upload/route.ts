import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { uploadAudioBuffer } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import { addAudioUrlToSession } from "@/lib/session-helpers";

// Dynamic route to avoid static optimization
export const dynamic = "force-dynamic";

/**
 * POST /api/speaking/upload
 *
 * Uploads an audio recording to Cloudinary
 * Requires authenticated user
 */
export async function POST(req: NextRequest) {
  console.log("Audio upload endpoint called");
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User authenticated:", session.user.id);

    // Get form data with audio file
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!audioFile || !sessionId) {
      console.error("Missing required fields:", {
        hasAudio: !!audioFile,
        hasSessionId: !!sessionId,
      });
      return NextResponse.json(
        { error: "Missing audio file or session ID" },
        { status: 400 }
      );
    }

    console.log(
      `Processing audio upload for session: ${sessionId}, file size: ${audioFile.size} bytes`
    );

    // Validate audio file
    if (audioFile.size === 0) {
      console.error("Empty audio file received");
      return NextResponse.json(
        { error: "Empty audio file received" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Converted audio to buffer, length: ${buffer.length} bytes`);

      // Upload to Cloudinary
      console.log("Uploading to Cloudinary...");
      const result = await uploadAudioBuffer(buffer, {
        folder: "speaking-assessments",
        filename: `speech-recording-${sessionId}-${Date.now()}`,
        resource_type: "video", // Cloudinary uses 'video' for audio files
        format: "wav", // Ensure format is compatible with Azure Speech Service
        // Not specifying audio_codec here to avoid conflicts with WAV format
      });

      console.log("Upload successful, URL:", result.url);
      await addAudioUrlToSession(sessionId, result.url);
      return NextResponse.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
      });
    } catch (conversionError: any) {
      console.error("Error processing audio:", conversionError);
      return NextResponse.json(
        {
          error: "Failed to process audio data",
          details: conversionError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error uploading audio:", error);
    return NextResponse.json(
      { error: "Failed to upload audio", details: error.message },
      { status: 500 }
    );
  }
}
