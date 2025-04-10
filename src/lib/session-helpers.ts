import SpeakingSession from "@/models/SpeakingSession";

import dbConnect from "./db";

/**
 * Add an audio URL to a speaking session's metadata
 * @param sessionId The speaking session ID
 * @param audioUrl The audio URL to add
 * @returns True if successful, false otherwise
 */
export async function addAudioUrlToSession(
  sessionId: string,
  audioUrl: string
): Promise<boolean> {
  try {
    await dbConnect();

    // Find the session
    const session = await SpeakingSession.findById(sessionId);
    if (!session) {
      console.error(`Session not found: ${sessionId}`);
      return false;
    }

    // Initialize metadata if it doesn't exist
    if (!session.metadata) {
      session.metadata = {};
    }

    // Initialize audioUrls if it doesn't exist
    if (!session.metadata.audioUrls) {
      session.metadata.audioUrls = [];
    }

    // Add the URL if it's not already in the array
    if (!session.metadata.audioUrls.includes(audioUrl)) {
      session.metadata.audioUrls.push(audioUrl);
      await session.save();
      console.log(`Added audio URL to session ${sessionId}`);
    }

    return true;
  } catch (error) {
    console.error("Error adding audio URL to session:", error);
    return false;
  }
}

/**
 * Get all audio URLs associated with a speaking session
 * @param sessionId The speaking session ID
 * @returns Array of audio URLs or empty array if none found
 */
export async function getSessionAudioUrls(
  sessionId: string
): Promise<string[]> {
  try {
    await dbConnect();

    // Find the session
    const session = await SpeakingSession.findById(sessionId);
    if (!session || !session.metadata || !session.metadata.audioUrls) {
      return [];
    }

    return session.metadata.audioUrls;
  } catch (error) {
    console.error("Error getting session audio URLs:", error);
    return [];
  }
}
