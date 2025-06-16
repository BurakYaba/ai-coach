import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import {
  analyzeSessionRecordings,
  SessionAnalysisResult,
} from "@/lib/azure-speech";
import { deleteCloudinaryFiles } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import { getSessionAudioUrls } from "@/lib/session-helpers";
import SpeakingSession from "@/models/SpeakingSession";
import {
  recordActivity,
  recordSpeakingCompletion,
} from "@/lib/gamification/activity-recorder";

// Dynamic route to avoid static optimization
export const dynamic = "force-dynamic";

// Custom process cache for tracking evaluation status
const processingCache: Record<string, boolean> = {};

// Interface for evaluation results
interface EvaluationResults {
  fluencyScore?: number;
  accuracyScore?: number;
  vocabularyScore?: number;
  pronunciationScore?: number;
  completenessScore?: number;
  overallScore?: number;
  strengths?: string[];
  areasForImprovement?: string[];
  suggestions?: string;
}

/**
 * POST /api/speaking/evaluate
 *
 * Evaluates a speaking session using two complementary technologies:
 * 1. Azure Speech Service - for pronunciation and fluency assessment from audio
 * 2. OpenAI GPT - for grammar and linguistic accuracy assessment from transcriptions
 *
 * Requires a speaking session ID. The system will retrieve all user audio from the session,
 * analyze it with both systems, and update the session with the combined results.
 */
export async function POST(req: NextRequest) {
  // console.log("Speaking evaluation endpoint called");

  try {
    const body = await req.json();
    const { speakingSessionId, audioUrls } = body;

    // console.log(`Evaluation request for session ID: ${speakingSessionId}`);
    // console.log(`Audio URLs provided: ${audioUrls?.length || 0}`);

    let userId: string | undefined;
    let isInternalCall = false;

    // Check for internal API key for server-to-server authentication
    const internalApiKey = req.headers.get("X-Internal-Api-Key");
    const expectedApiKey = process.env.NEXTAUTH_SECRET || "internal-api-key";

    // Log the headers for debugging (safely)
    // console.log("Headers received:", {
    //   "content-type": req.headers.get("content-type"),
    //   "x-internal-api-key": internalApiKey
    //     ? "present (value hidden)"
    //     : "missing",
    //   "other-headers": Array.from(req.headers.keys()).filter(
    //     key =>
    //       !["content-type", "x-internal-api-key"].includes(key.toLowerCase())
    //   ),
    // });

    // Log API key details (safely)
    // console.log("Expected API key available:", !!expectedApiKey);
    if (expectedApiKey) {
      const safeExpectedKey = `${expectedApiKey.substring(0, 3)}...${expectedApiKey.substring(expectedApiKey.length - 3)}`;
      // console.log("Expected API key format:", safeExpectedKey);
    }

    if (internalApiKey) {
      const safeReceivedKey = `${internalApiKey.substring(0, 3)}...${internalApiKey.substring(internalApiKey.length - 3)}`;
      // console.log("Received API key format:", safeReceivedKey);
      // console.log("API keys match:", internalApiKey === expectedApiKey);
    }

    // Authenticate using either the API key or the user session
    if (internalApiKey === expectedApiKey) {
      isInternalCall = true;
      // console.log("Internal API key authentication successful");
      // For internal calls, we'll extract the user ID from the session directly
    } else {
      // Authenticate user via NextAuth
      // console.log("Attempting to authenticate via NextAuth session");
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        console.error("User session authentication failed - no valid session");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // console.log(
      //   `User session authentication successful for user: ${session.user.id}`
      // );
      userId = session.user.id;
    }

    if (!speakingSessionId) {
      return NextResponse.json(
        { error: "Missing speakingSessionId" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Retrieve the speaking session
    const query: any = { _id: speakingSessionId };
    if (userId) {
      // Only filter by user if we're using session auth and not an internal call
      query.user = userId;
    }

    const speakingSession = await SpeakingSession.findOne(query);

    if (!speakingSession) {
      return NextResponse.json(
        { error: "Speaking session not found" },
        { status: 404 }
      );
    }

    // Check if the session is already being evaluated (prevent duplicate processing)
    const processingKey = `evaluation-in-progress-${speakingSessionId}`;
    const processingFlag = processingCache[processingKey];

    if (processingFlag) {
      // console.log(
      //   `Evaluation already in progress for session ${speakingSessionId}, skipping duplicate call`
      // );
      return NextResponse.json({
        message: "Evaluation already in progress for this session",
        alreadyProcessing: true,
      });
    }

    // Set a processing flag to prevent concurrent evaluations
    processingCache[processingKey] = true;

    try {
      // Extract user transcripts for reference text
      const userTranscripts = speakingSession.transcripts.filter(
        t => t.role === "user"
      );

      if (userTranscripts.length === 0) {
        return NextResponse.json(
          { error: "No user speech to evaluate" },
          { status: 400 }
        );
      }

      // Check if we have audio URLs to evaluate
      let urlsToProcess: string[] = [];

      if (audioUrls && Array.isArray(audioUrls) && audioUrls.length > 0) {
        urlsToProcess = audioUrls;
      } else {
        // Check if we have audio URLs in the session metadata
        try {
          const sessionAudioUrls = await getSessionAudioUrls(speakingSessionId);
          if (sessionAudioUrls.length > 0) {
            urlsToProcess = sessionAudioUrls;
          }
        } catch (error) {
          console.error("Error retrieving session audio URLs:", error);
        }

        // Check metadata audio URLs
        const metadataAudioUrls = speakingSession.metadata?.audioUrls;
        if (
          !urlsToProcess.length &&
          metadataAudioUrls &&
          Array.isArray(metadataAudioUrls) &&
          metadataAudioUrls.length > 0
        ) {
          urlsToProcess = metadataAudioUrls;
        }
      }

      if (!urlsToProcess.length) {
        return NextResponse.json(
          { error: "No audio available for analysis" },
          { status: 400 }
        );
      }

      return await processAudioEvaluation(
        urlsToProcess,
        userTranscripts,
        speakingSession
      );
    } finally {
      // Clear the processing flag regardless of outcome
      setTimeout(() => {
        delete processingCache[processingKey];
        // console.log(`Cleared processing flag for session ${speakingSessionId}`);
      }, 30000); // Keep flag for 30 seconds to prevent rapid re-requests
    }
  } catch (error: any) {
    console.error("Error evaluating speaking session:", error);
    return NextResponse.json(
      {
        error: "Failed to evaluate session",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Process audio evaluation with provided URLs and transcript data
 */
async function processAudioEvaluation(
  audioUrls: string[],
  userTranscripts: any[],
  speakingSession: any
) {
  try {
    // Check if Azure credentials are configured
    const hasAzureCredentials =
      !!process.env.AZURE_SPEECH_KEY && !!process.env.AZURE_SPEECH_REGION;

    if (!hasAzureCredentials) {
      return NextResponse.json(
        { error: "Azure Speech credentials not configured" },
        { status: 500 }
      );
    }

    // Set initial progress to 10% - evaluation has started
    await SpeakingSession.findByIdAndUpdate(
      speakingSession._id,
      { evaluationProgress: 10 },
      { new: true }
    );

    // OPTIMIZATION: Download audio files more efficiently in parallel
    // console.log(`Starting to download ${audioUrls.length} audio files...`);
    const downloadPromises = userTranscripts.map(async (transcript, index) => {
      // Be more flexible with index matching - use available URLs even if they don't match transcript count
      const audioUrl = audioUrls[index] || audioUrls[0] || "";
      if (!audioUrl) {
        return null;
      }

      try {
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
          console.error(
            `Failed to download audio at ${audioUrl}: ${audioResponse.status}`
          );
          return null;
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        return {
          buffer: Buffer.from(audioBuffer),
          referenceText: transcript.text,
        };
      } catch (downloadError) {
        console.error(`Error downloading audio: ${downloadError}`);
        return null;
      }
    });

    // Wait for all downloads to complete
    const audioBuffers = await Promise.all(downloadPromises);

    // Update progress to 20% - audio files downloaded
    await SpeakingSession.findByIdAndUpdate(
      speakingSession._id,
      { evaluationProgress: 20 },
      { new: true }
    );

    // Filter out any null entries
    const validAudioBuffers = audioBuffers.filter(
      buffer => buffer !== null
    ) as Array<{
      buffer: Buffer;
      referenceText: string;
    }>;

    if (validAudioBuffers.length === 0) {
      return NextResponse.json(
        { error: "No valid audio files to analyze" },
        { status: 400 }
      );
    }

    // OPTIMIZATION: Process smaller batches more efficiently
    let results: SessionAnalysisResult;

    // Maximum batch size - process fewer files at once to avoid timeouts
    const MAX_BATCH_SIZE = 2;

    if (validAudioBuffers.length > MAX_BATCH_SIZE) {
      // console.log(
      //   `Processing ${validAudioBuffers.length} audio files in smaller batches of ${MAX_BATCH_SIZE}`
      // );

      // Process first batch
      const initialBatch = validAudioBuffers.slice(0, MAX_BATCH_SIZE);
      // console.log(`Processing first batch of ${initialBatch.length} files`);
      results = await analyzeSessionRecordings(initialBatch);

      // Update progress to 40% - first batch of audio files analyzed
      await SpeakingSession.findByIdAndUpdate(
        speakingSession._id,
        { evaluationProgress: 40 },
        { new: true }
      );

      // If there are more files, process them in subsequent batches
      if (validAudioBuffers.length > MAX_BATCH_SIZE) {
        try {
          // OPTIMIZATION: Use fewer remaining files to avoid timeouts
          // Just take 1-2 more files from the remaining ones for evaluation
          const maxRemainingToProcess = Math.min(
            MAX_BATCH_SIZE,
            validAudioBuffers.length - MAX_BATCH_SIZE
          );
          const secondBatch = validAudioBuffers.slice(
            MAX_BATCH_SIZE,
            MAX_BATCH_SIZE + maxRemainingToProcess
          );

          // console.log(`Processing second batch of ${secondBatch.length} files`);
          const secondResults = await analyzeSessionRecordings(secondBatch);

          // Update progress to 60% - second batch of audio files analyzed
          await SpeakingSession.findByIdAndUpdate(
            speakingSession._id,
            { evaluationProgress: 60 },
            { new: true }
          );

          // Combine results by averaging scores
          results = combineAnalysisResults(results, secondResults);

          // If there are still more files, log that we're skipping them
          if (validAudioBuffers.length > MAX_BATCH_SIZE * 2) {
            // console.log(
            //   `Skipping analysis of ${validAudioBuffers.length - MAX_BATCH_SIZE * 2} additional files to avoid timeout`
            // );
          }
        } catch (batchError) {
          console.error(
            "Error processing second batch, continuing with first batch results:",
            batchError
          );
          // Continue with just the first batch results
        }
      }
    } else {
      // Process all files at once if there are fewer than or equal to MAX_BATCH_SIZE
      results = await analyzeSessionRecordings(validAudioBuffers);

      // Update progress to 60% - all audio files analyzed in a single batch
      await SpeakingSession.findByIdAndUpdate(
        speakingSession._id,
        { evaluationProgress: 60 },
        { new: true }
      );
    }

    // Update progress to 80% - analysis complete, saving results
    await SpeakingSession.findByIdAndUpdate(
      speakingSession._id,
      { evaluationProgress: 80 },
      { new: true }
    );

    // Update the session with assessment results
    // Use a retry approach to handle potential version conflicts
    let updated = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!updated && attempts < maxAttempts) {
      attempts++;
      try {
        // Get a fresh copy of the session if this is a retry
        if (attempts > 1) {
          // console.log(
          //   `Retrying session update (attempt ${attempts}/${maxAttempts})`
          // );
          speakingSession = await SpeakingSession.findById(speakingSession._id);
          if (!speakingSession) {
            throw new Error("Session no longer exists");
          }
        }

        speakingSession.feedback = results;
        // Don't set evaluationProgress here as we'll update it to 100% after cleanup
        await speakingSession.save();
        updated = true;
        // console.log(
        //   `Successfully updated session feedback (attempt ${attempts})`
        // );
      } catch (saveError: any) {
        if (attempts < maxAttempts) {
          console.warn(
            `Save attempt ${attempts} failed, retrying: ${saveError.message}`
          );
          await new Promise(resolve => setTimeout(resolve, 500 * attempts)); // Exponential backoff
        } else {
          console.error(
            "Failed to update session after multiple attempts:",
            saveError
          );
          throw saveError; // Re-throw on final attempt
        }
      }
    }

    // After successful evaluation, delete the audio files from Cloudinary
    try {
      // console.log(
      //   "Deleting audio files from Cloudinary after successful evaluation"
      // );
      const deletionResults = await deleteCloudinaryFiles(audioUrls);

      // Log results but don't fail if deletion has issues
      const successCount = deletionResults.filter(r => r.success).length;
      // console.log(
      //   `Successfully deleted ${successCount}/${audioUrls.length} audio files`
      // );

      // Remove the audio URLs from the session metadata since they've been deleted
      if (
        successCount > 0 &&
        speakingSession.metadata &&
        speakingSession.metadata.audioUrls
      ) {
        try {
          // Get list of URLs that were successfully deleted
          const successfullyDeletedUrls = deletionResults
            .filter(r => r.success)
            .map(r => r.url);

          // Keep only the URLs that weren't successfully deleted
          const remainingUrls = speakingSession.metadata.audioUrls.filter(
            (url: string) => !successfullyDeletedUrls.includes(url)
          );

          // Use findByIdAndUpdate to avoid version conflicts
          await SpeakingSession.findByIdAndUpdate(
            speakingSession._id,
            {
              "metadata.audioUrls": remainingUrls,
              evaluationProgress: 100, // Set to 100% - evaluation fully complete
            },
            { new: true }
          );

          // console.log(
          //   "Updated session metadata to remove deleted audio URLs and marked evaluation as complete"
          // );
        } catch (updateError) {
          console.error("Error updating session metadata:", updateError);
          // Still mark as complete even if metadata update fails
          await SpeakingSession.findByIdAndUpdate(
            speakingSession._id,
            { evaluationProgress: 100 },
            { new: true }
          );
        }
      } else {
        // Mark as complete even if no URLs were deleted
        await SpeakingSession.findByIdAndUpdate(
          speakingSession._id,
          { evaluationProgress: 100 },
          { new: true }
        );
      }
    } catch (deletionError) {
      // Log error but continue - we don't want to fail the evaluation if deletion fails
      console.error("Error deleting audio files:", deletionError);
      // Still mark as complete even if deletion fails
      await SpeakingSession.findByIdAndUpdate(
        speakingSession._id,
        { evaluationProgress: 100 },
        { new: true }
      );
    }

    // After updating the session document, add gamification recording
    // This should be after the final update when the session is completed

    // Assuming the final result looks something like this
    const sessionResults = {
      feedback: {
        fluencyScore: results.fluencyScore,
        accuracyScore: results.accuracyScore,
        vocabularyScore: results.vocabularyScore,
        pronunciationScore: results.pronunciationScore,
        grammarScore: results.grammarScore,
        overallScore: results.overallScore,
        strengths: results.strengths,
        areasForImprovement: results.areasForImprovement,
        suggestions: results.suggestions,
        grammarIssues: results.grammarIssues,
        mispronunciations: results.mispronunciations,
      },
      status: "completed",
      evaluationProgress: 100,
      endTime: new Date(),
    };

    // Update the session document with the evaluation results
    const updatedSession = await SpeakingSession.findByIdAndUpdate(
      speakingSession._id,
      {
        $set: sessionResults,
      },
      { new: true }
    );

    // Add gamification integration after successfully updating the session
    try {
      // Check if we have what we need to record the activity
      if (
        updatedSession &&
        updatedSession.status === "completed" &&
        updatedSession.user
      ) {
        const userId = updatedSession.user.toString();
        const sessionId = updatedSession._id.toString();
        const duration = updatedSession.duration || 300;

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

        // console.log(
        //   `Recorded gamification activity for speaking session ${sessionId}`
        // );
      }
    } catch (gamificationError) {
      // Log but don't fail the overall request if gamification recording fails
      console.error(
        "Error recording gamification activity:",
        gamificationError
      );
      // Continue with the normal response
    }

    return NextResponse.json({
      success: true,
      sessionId: speakingSession._id.toString(),
      results,
    });
  } catch (analysisError: any) {
    console.error("Error during speech analysis:", analysisError);
    // Mark evaluation as failed with progress at -1
    try {
      await SpeakingSession.findByIdAndUpdate(
        speakingSession._id,
        { evaluationProgress: -1 }, // Use -1 to indicate error
        { new: true }
      );
    } catch (updateError) {
      console.error(
        "Error updating evaluation progress on failure:",
        updateError
      );
    }
    return NextResponse.json(
      {
        error: "Failed to analyze speech recordings",
        details: analysisError.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to combine multiple analysis results
function combineAnalysisResults(
  result1: SessionAnalysisResult,
  result2: SessionAnalysisResult
): SessionAnalysisResult {
  // Combine arrays without using Set spreading
  const combinedStrengths = [
    ...(result1.strengths || []),
    ...(result2.strengths || []),
  ].filter((value, index, self) => self.indexOf(value) === index);

  const combinedAreasForImprovement = [
    ...(result1.areasForImprovement || []),
    ...(result2.areasForImprovement || []),
  ].filter((value, index, self) => self.indexOf(value) === index);

  return {
    fluencyScore: Math.round((result1.fluencyScore + result2.fluencyScore) / 2),
    accuracyScore: Math.round(
      (result1.accuracyScore + result2.accuracyScore) / 2
    ),
    vocabularyScore:
      result1.vocabularyScore && result2.vocabularyScore
        ? Math.round((result1.vocabularyScore + result2.vocabularyScore) / 2)
        : result1.vocabularyScore || result2.vocabularyScore,
    pronunciationScore: Math.round(
      (result1.pronunciationScore + result2.pronunciationScore) / 2
    ),
    completenessScore:
      result1.completenessScore && result2.completenessScore
        ? Math.round(
            (result1.completenessScore + result2.completenessScore) / 2
          )
        : result1.completenessScore || result2.completenessScore,
    prosodyScore:
      result1.prosodyScore && result2.prosodyScore
        ? Math.round((result1.prosodyScore + result2.prosodyScore) / 2)
        : result1.prosodyScore || result2.prosodyScore,
    speakingRate:
      result1.speakingRate && result2.speakingRate
        ? Math.round((result1.speakingRate + result2.speakingRate) / 2)
        : result1.speakingRate || result2.speakingRate,
    overallScore: Math.round((result1.overallScore + result2.overallScore) / 2),
    // Use the filtered arrays
    strengths: combinedStrengths,
    areasForImprovement: combinedAreasForImprovement,
    suggestions: result1.suggestions || result2.suggestions || "",
    // Take the most grammar issues from either result
    grammarIssues:
      (result1.grammarIssues?.length || 0) >
      (result2.grammarIssues?.length || 0)
        ? result1.grammarIssues
        : result2.grammarIssues,
    grammarScore:
      result1.grammarScore && result2.grammarScore
        ? Math.round((result1.grammarScore + result2.grammarScore) / 2)
        : result1.grammarScore || result2.grammarScore || 0,
    // Take mispronunciations from first result
    mispronunciations: result1.mispronunciations || result2.mispronunciations,
  };
}
