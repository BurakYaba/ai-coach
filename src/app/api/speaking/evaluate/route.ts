import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import {
  analyzeSessionRecordings,
  SessionAnalysisResult,
} from '@/lib/azure-speech';
import { deleteCloudinaryFiles } from '@/lib/cloudinary';
import dbConnect from '@/lib/db';
import { getSessionAudioUrls } from '@/lib/session-helpers';
import SpeakingSession from '@/models/SpeakingSession';

// Dynamic route to avoid static optimization
export const dynamic = 'force-dynamic';

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
    const internalApiKey = req.headers.get('X-Internal-Api-Key');
    const expectedApiKey = process.env.NEXTAUTH_SECRET || 'internal-api-key';

    // Authenticate using either the API key or the user session
    if (internalApiKey === expectedApiKey) {
      isInternalCall = true;
      // For internal calls, we'll extract the user ID from the session directly
    } else {
      // Authenticate user via NextAuth
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.id;
    }

    if (!speakingSessionId) {
      return NextResponse.json(
        { error: 'Missing speakingSessionId' },
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
        { error: 'Speaking session not found' },
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
        message: 'Evaluation already in progress for this session',
        alreadyProcessing: true,
      });
    }

    // Set a processing flag to prevent concurrent evaluations
    processingCache[processingKey] = true;

    try {
      // Extract user transcripts for reference text
      const userTranscripts = speakingSession.transcripts.filter(
        t => t.role === 'user'
      );

      if (userTranscripts.length === 0) {
        return NextResponse.json(
          { error: 'No user speech to evaluate' },
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
          console.error('Error retrieving session audio URLs:', error);
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
          { error: 'No audio available for analysis' },
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
    console.error('Error evaluating speaking session:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate session',
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
        { error: 'Azure Speech credentials not configured' },
        { status: 500 }
      );
    }

    // Using Azure speech utility to evaluate the audio
    // Download audio files from URLs
    const audioBuffers = await Promise.all(
      userTranscripts.map(async (transcript, index) => {
        // Be more flexible with index matching - use available URLs even if they don't match transcript count
        const audioUrl = audioUrls[index] || audioUrls[0] || '';
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

    // Filter out any null entries
    const validAudioBuffers = audioBuffers.filter(
      buffer => buffer !== null
    ) as Array<{
      buffer: Buffer;
      referenceText: string;
    }>;

    if (validAudioBuffers.length === 0) {
      return NextResponse.json(
        { error: 'No valid audio files to analyze' },
        { status: 400 }
      );
    }

    const results = await analyzeSessionRecordings(validAudioBuffers);

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
            throw new Error('Session no longer exists');
          }
        }

        speakingSession.feedback = results;
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
            'Failed to update session after multiple attempts:',
            saveError
          );
          throw saveError; // Re-throw on final attempt
        }
      }
    }

    // After successful evaluation, delete the audio files from Cloudinary
    try {
      console.log(
        'Deleting audio files from Cloudinary after successful evaluation'
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
            { 'metadata.audioUrls': remainingUrls },
            { new: true }
          );

          console.log('Updated session metadata to remove deleted audio URLs');
        } catch (updateError) {
          console.error('Error updating session metadata:', updateError);
          // Continue despite error - we've already deleted the files
        }
      }
    } catch (deletionError) {
      // Log error but continue - we don't want to fail the evaluation if deletion fails
      console.error('Error deleting audio files:', deletionError);
    }

    return NextResponse.json({
      success: true,
      sessionId: speakingSession._id.toString(),
      results,
    });
  } catch (analysisError: any) {
    console.error('Error during speech analysis:', analysisError);
    return NextResponse.json(
      {
        error: 'Failed to analyze speech recordings',
        details: analysisError.message,
      },
      { status: 500 }
    );
  }
}
