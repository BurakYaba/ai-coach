import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File system promises
const writeFilePromise = promisify(fs.writeFile);
const unlinkPromise = promisify(fs.unlink);
const mkdtempPromise = promisify(fs.mkdtemp);

// This tells Next.js that this is a dynamic route that shouldn't be statically optimized
export const dynamic = "force-dynamic";

/**
 * Detect common grammar errors in a transcription
 * This helps identify errors even if Whisper auto-corrects them
 */
async function detectPotentialGrammarErrors(text: string): Promise<{
  originalText: string;
  markedText: string;
  potentialErrors: Array<{
    pattern: string;
    possibleError: string;
    correctedForm: string;
  }>;
}> {
  // Common grammar patterns to check
  const errorPatterns = [
    // Subject-verb agreement
    {
      regex: /\b(I|we|they)\s+(has|is|was)\b/gi,
      correction: (match: string) => {
        if (match.toLowerCase().startsWith("i "))
          return match.replace(/\b(has|is|was)\b/i, "have");
        if (match.toLowerCase().startsWith("we "))
          return match.replace(/\b(has|is|was)\b/i, "have");
        if (match.toLowerCase().startsWith("they "))
          return match.replace(/\b(has|is|was)\b/i, "have");
        return match;
      },
    },
    {
      regex: /\b(he|she|it)\s+(have|are|were)\b/gi,
      correction: (match: string) => {
        if (match.toLowerCase().startsWith("he "))
          return match.replace(/\b(have|are|were)\b/i, "has");
        if (match.toLowerCase().startsWith("she "))
          return match.replace(/\b(have|are|were)\b/i, "has");
        if (match.toLowerCase().startsWith("it "))
          return match.replace(/\b(have|are|were)\b/i, "has");
        return match;
      },
    },
    // Article usage
    {
      regex: /\ba\s+([aeiou])/gi,
      correction: (match: string) => `an ${match.substring(2)}`,
    },
    // Preposition errors
    { regex: /\barrived\s+to\b/gi, correction: () => "arrived at" },
    { regex: /\bdepend\s+of\b/gi, correction: () => "depend on" },
    // Double negatives
    {
      regex: /\bdon't\s+.*?\s+nothing\b/gi,
      correction: (match: string) => match.replace("nothing", "anything"),
    },
    // Irregular plurals
    {
      regex: /\b(childs|mans|womans|foots|tooths)\b/gi,
      correction: (match: string) => {
        const corrections: { [key: string]: string } = {
          childs: "children",
          mans: "men",
          womans: "women",
          foots: "feet",
          tooths: "teeth",
        };
        return corrections[match.toLowerCase()] || match;
      },
    },
  ];

  let markedText = text;
  const potentialErrors = [];

  // Check for each pattern
  for (const pattern of errorPatterns) {
    const matches = text.match(pattern.regex);
    if (matches) {
      for (const match of matches) {
        const corrected = pattern.correction(match);
        if (corrected !== match) {
          // Mark the text with [ERROR] tag
          markedText = markedText.replace(match, `[ERROR: ${match}]`);

          potentialErrors.push({
            pattern: match,
            possibleError: `Incorrect grammar: "${match}"`,
            correctedForm: corrected,
          });
        }
      }
    }
  }

  return {
    originalText: text,
    markedText,
    potentialErrors,
  };
}

/**
 * Transcribe audio using Azure Speech-to-Text API
 * This provides more verbatim options than Whisper
 */
async function transcribeWithAzure(audioBuffer: Buffer): Promise<string> {
  if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
    throw new Error("Azure Speech credentials not configured");
  }

  // Create a temporary file for the audio
  const tempDir = await mkdtempPromise(path.join(os.tmpdir(), "speech-"));
  const tempFile = path.join(tempDir, "audio.wav");

  try {
    // Write the buffer to a temporary file
    await writeFilePromise(tempFile, audioBuffer);

    // Create Azure speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    // Set to English
    speechConfig.speechRecognitionLanguage = "en-US";

    // Very important: Set profanity option to raw and output format to detailed
    // This provides the most verbatim transcription
    speechConfig.setProfanity(sdk.ProfanityOption.Raw);
    speechConfig.outputFormat = sdk.OutputFormat.Detailed;

    // Enable verbatim mode if available
    try {
      // We need to use a different approach since this is an undocumented feature
      const propertyId = "speechcontext-PhraseDetection.VerbatimMode";
      const propertyValue = "true";
      const channel = sdk.ServicePropertyChannel.UriQueryParameter;

      // Use the method but silence TypeScript errors since it's undocumented
      (speechConfig as any).setServiceProperty(
        propertyId,
        propertyValue,
        channel
      );
    } catch (e) {
      console.warn("Failed to set verbatim mode:", e);
    }

    // Create audio config from the temp file
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(tempFile)
    );

    // Create speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Return a promise that resolves with the transcription
    return new Promise((resolve, reject) => {
      // Collect all recognition results
      let transcription = "";

      recognizer.recognized = (_, event) => {
        // Append the recognized text
        if (event.result.reason === sdk.ResultReason.RecognizedSpeech) {
          transcription += event.result.text + " ";
        }
      };

      recognizer.canceled = (_, event) => {
        if (event.reason === sdk.CancellationReason.Error) {
          reject(
            new Error(`Speech recognition canceled: ${event.errorDetails}`)
          );
        }
      };

      recognizer.sessionStopped = () => {
        recognizer.stopContinuousRecognitionAsync(
          () => {
            recognizer.close();
            resolve(transcription.trim());
          },
          err => reject(err)
        );
      };

      // Start recognition
      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Azure continuous recognition started");
        },
        err => reject(err)
      );
    });
  } finally {
    // Clean up temporary file
    try {
      await unlinkPromise(tempFile);
      fs.rmdir(tempDir, () => {}); // Best effort clean up of temp dir
    } catch (e) {
      console.error("Failed to clean up temp file:", e);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if the request is JSON or FormData
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Handle JSON request (text transcript)
      const { speakingSessionId, role, text } = await req.json();

      // Validate required fields
      if (!speakingSessionId || !role || !text) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Find the speaking session
      const speakingSession = await SpeakingSession.findById(speakingSessionId);

      if (!speakingSession) {
        return NextResponse.json(
          { error: "Speaking session not found" },
          { status: 404 }
        );
      }

      // Add transcript to session
      speakingSession.transcripts.push({
        role,
        text,
        timestamp: new Date(),
      });

      await speakingSession.save();

      return NextResponse.json({ success: true });
    } else if (contentType.includes("multipart/form-data")) {
      // Handle FormData request (audio file)
      const formData = await req.formData();
      const audioFile = formData.get("audio") as File;
      const speakingSessionId = formData.get("speakingSessionId") as string;

      if (!audioFile || !speakingSessionId) {
        return NextResponse.json(
          { error: "Missing audio file or session ID" },
          { status: 400 }
        );
      }

      // Find the speaking session
      const speakingSession = await SpeakingSession.findById(speakingSessionId);

      if (!speakingSession) {
        return NextResponse.json(
          { error: "Speaking session not found" },
          { status: 404 }
        );
      }

      // Convert File to buffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine which transcription service to use
      // Use Azure if PREFER_AZURE_TRANSCRIPTION is set and Azure credentials are available
      const useAzure =
        process.env.PREFER_AZURE_TRANSCRIPTION === "true" &&
        process.env.AZURE_SPEECH_KEY &&
        process.env.AZURE_SPEECH_REGION;

      let transcribedText;

      if (useAzure) {
        console.log("Using Azure Speech-to-Text for verbatim transcription");
        try {
          transcribedText = await transcribeWithAzure(buffer);
        } catch (azureError) {
          console.error(
            "Azure transcription failed, falling back to Whisper:",
            azureError
          );
          // Fall back to Whisper if Azure fails
          try {
            // Create a proper File object from the buffer
            const blob = new Blob([buffer], { type: audioFile.type });
            const file = new File([blob], "audio.webm", {
              type: audioFile.type,
            });

            // Use same prompt logic as main Whisper path
            const isAdvancedLevel =
              speakingSession.metadata?.level &&
              ["b2", "c1", "c2"].includes(
                speakingSession.metadata.level.toLowerCase()
              );

            const prompt = isAdvancedLevel
              ? "Transcribe exactly as spoken including errors and hesitations."
              : "Transcribe exactly as spoken. Preserve all grammatical errors, filler words, and hesitations. Do not correct grammar or improve fluency.";

            const whisperTranscription =
              await openai.audio.transcriptions.create({
                file: file,
                model: "whisper-1",
                language: "en",
                prompt: prompt,
                temperature: 0.0,
                // OPTIMIZATION: Use JSON response format for faster parsing
                response_format: "json",
              });
            transcribedText = whisperTranscription.text;
          } catch (whisperError) {
            console.error("Whisper transcription also failed:", whisperError);
            throw new Error("All transcription services failed");
          }
        }
      } else {
        // Use OpenAI Whisper API
        console.log("Using OpenAI Whisper for transcription");

        // OPTIMIZATION: Choose prompt based on learning context
        // For advanced learners, speed matters more; for beginners, error preservation is critical
        const isAdvancedLevel =
          speakingSession.metadata?.level &&
          ["b2", "c1", "c2"].includes(
            speakingSession.metadata.level.toLowerCase()
          );

        const prompt = isAdvancedLevel
          ? "Transcribe exactly as spoken including errors and hesitations."
          : "Transcribe exactly as spoken. Preserve all grammatical errors, filler words, and hesitations. Do not correct grammar or improve fluency.";

        console.log(
          `Using ${isAdvancedLevel ? "simplified" : "detailed"} prompt for level: ${speakingSession.metadata?.level || "unknown"}`
        );

        const transcription = await openai.audio.transcriptions.create({
          file: new File([buffer], "audio.webm", { type: audioFile.type }),
          model: "whisper-1",
          language: "en",
          prompt: prompt,
          temperature: 0.0,
          // OPTIMIZATION: Use JSON response format for faster parsing
          response_format: "json",
        });
        transcribedText = transcription.text;
      }

      // OPTIMIZATION: Run grammar analysis and database operations in parallel
      console.log(
        "Running parallel processing for grammar analysis and database save"
      );

      const [errorAnalysis] = await Promise.all([
        // Grammar analysis (async)
        detectPotentialGrammarErrors(transcribedText),

        // Database save (async) - save transcription first
        (async () => {
          speakingSession.transcripts.push({
            role: "user",
            text: transcribedText,
            timestamp: new Date(),
          });
          return speakingSession.save();
        })(),
      ]);

      // Update the saved transcript with grammar metadata (quick operation)
      const lastTranscript =
        speakingSession.transcripts[speakingSession.transcripts.length - 1];
      if (lastTranscript) {
        lastTranscript.metadata = {
          potentialGrammarErrors: errorAnalysis.potentialErrors,
          markedText: errorAnalysis.markedText,
        };
        // Save again with metadata (this is fast since it's just updating one field)
        await speakingSession.save();
      }

      // Return both the transcription and potential errors
      return NextResponse.json({
        success: true,
        text: transcribedText,
        potentialGrammarErrors: errorAnalysis.potentialErrors,
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error handling transcript:", error);
    return NextResponse.json(
      { error: "Failed to process transcript", details: error.message },
      { status: 500 }
    );
  }
}
