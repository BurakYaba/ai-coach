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
    const { audioData, speakingSessionId, messageIndex } = body;

    // Validate required fields
    if (!audioData || !speakingSessionId || messageIndex === undefined) {
      return NextResponse.json(
        { error: "Audio data, session ID, and message index are required" },
        { status: 400 }
      );
    }

    // Extract base64 data from data URL
    const base64Data = audioData.replace(/^data:audio\/[a-z]+;base64,/, "");

    // Create a unique public ID for this audio file
    const publicId = `ai-audio/${speakingSessionId}/message-${messageIndex}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:audio/mp3;base64,${base64Data}`,
      {
        resource_type: "video", // Use 'video' for audio files in Cloudinary
        public_id: publicId,
        folder: "ai-audio",
        tags: [`session-${speakingSessionId}`, "ai-response", "temporary"],
        overwrite: true, // Allow overwriting if the same message is stored again
      }
    );

    return NextResponse.json({
      success: true,
      audioUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Error storing AI audio:", error);
    return NextResponse.json(
      {
        error: "Failed to store audio",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
