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
  try {
    const body = await req.json();
    const { speakingSessionId, audioUrls } = body;

    let userId: string | undefined;
    let isInternalCall = false;

    // Check for internal API key for server-to-server authentication
    const internalApiKey = req.headers.get("X-Internal-Api-Key");
    const expectedApiKey = process.env.NEXTAUTH_SECRET || "internal-api-key";

    // Authenticate using either the API key or the user session
    if (internalApiKey === expectedApiKey) {
      isInternalCall = true;
      // For internal calls, we'll extract the user ID from the session directly
    } else {
      // Authenticate user via NextAuth
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
      console.log(
        `Evaluation already in progress for session ${speakingSessionId}, skipping duplicate call`
      );
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
        console.log(`Cleared processing flag for session ${speakingSessionId}`);
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

    // Using Azure speech utility to evaluate the audio
    // Download audio files from URLs
    const audioBuffers = await Promise.all(
      userTranscripts.map(async (transcript, index) => {
        // Be more flexible with index matching - use available URLs even if they don't match transcript count
        const audioUrl = audioUrls[index] || audioUrls[0] || "";
        if (!audioUrl) {
          return null;
        }

        try {
          const audioResponse = await fetch(audioUrl);
          if (!audioResponse.ok) {
            return null;
          }

          const audioBuffer = await audioResponse.arrayBuffer();

          return {
            buffer: Buffer.from(audioBuffer),
            referenceText: transcript.text,
          };
        } catch (downloadError) {
          return null;
        }
      })
    );

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

    // If we have many audio buffers, implement a batching strategy
    // Process at most 3 audio files at a time to reduce load on Azure
    let results: SessionAnalysisResult;

    if (validAudioBuffers.length > 3) {
      console.log(
        `Processing ${validAudioBuffers.length} audio files in smaller batches`
      );

      // Process first 3 files to get baseline results
      const initialBatch = validAudioBuffers.slice(0, 3);
      results = await analyzeSessionRecordings(initialBatch);

      // Update progress to 40% - first batch of audio files analyzed
      await SpeakingSession.findByIdAndUpdate(
        speakingSession._id,
        { evaluationProgress: 40 },
        { new: true }
      );

      // If there are more files, process them in a second batch
      if (validAudioBuffers.length > 3) {
        try {
          // Process remaining files (up to 3 more) after a delay
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

          const secondBatch = validAudioBuffers.slice(3, 6);
          console.log(`Processing second batch of ${secondBatch.length} files`);
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
          if (validAudioBuffers.length > 6) {
            console.log(
              `Skipping analysis of ${validAudioBuffers.length - 6} additional files to avoid overloading Azure`
            );
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
      // Process all files at once if there are 3 or fewer
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
          console.log(
            `Retrying session update (attempt ${attempts}/${maxAttempts})`
          );
          speakingSession = await SpeakingSession.findById(speakingSession._id);
          if (!speakingSession) {
            throw new Error("Session no longer exists");
          }
        }

        speakingSession.feedback = results;
        // Don't set evaluationProgress here as we'll update it to 100% after cleanup
        await speakingSession.save();
        updated = true;
        console.log(
          `Successfully updated session feedback (attempt ${attempts})`
        );
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
      console.log(
        "Deleting audio files from Cloudinary after successful evaluation"
      );
      const deletionResults = await deleteCloudinaryFiles(audioUrls);

      // Log results but don't fail if deletion has issues
      const successCount = deletionResults.filter(r => r.success).length;
      console.log(
        `Successfully deleted ${successCount}/${audioUrls.length} audio files`
      );

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

          console.log(
            "Updated session metadata to remove deleted audio URLs and marked evaluation as complete"
          );
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
