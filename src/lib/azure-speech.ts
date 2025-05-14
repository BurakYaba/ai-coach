import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // Reduce to 30 seconds to ensure we don't hit the function timeout
  maxRetries: 2, // Reduce retries to save time
});

// File system promises
const writeFilePromise = promisify(fs.writeFile);
const readFilePromise = promisify(fs.readFile);
const unlinkPromise = promisify(fs.unlink);
const mkdtempPromise = promisify(fs.mkdtemp);

// Azure Speech Service configuration
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "";

// Semaphore to limit concurrent Azure speech requests
// Most Azure tiers allow 3 concurrent transcriptions
const MAX_CONCURRENT_REQUESTS = 2; // Setting to 2 to be safe
let currentRequests = 0;
const requestQueue: (() => void)[] = [];

/**
 * Manages Azure speech requests to prevent exceeding concurrent request limits
 * @param fn - The function that performs the Azure speech request
 * @returns The result of the function
 */
async function withRequestLimit<T>(fn: () => Promise<T>): Promise<T> {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError: any = null;

  const executeWithRetry = async (): Promise<T> => {
    try {
      // If we can process the request immediately, do so
      if (currentRequests < MAX_CONCURRENT_REQUESTS) {
        currentRequests++;
        console.log(
          `Starting Azure speech request (${currentRequests}/${MAX_CONCURRENT_REQUESTS} active)`
        );
        try {
          return await fn();
        } finally {
          currentRequests--;
          console.log(
            `Completed Azure speech request (${currentRequests}/${MAX_CONCURRENT_REQUESTS} active)`
          );
          // Process next request in the queue if any
          if (requestQueue.length > 0) {
            console.log(
              `Processing next request from queue (${requestQueue.length} remaining)`
            );
            const nextRequest = requestQueue.shift();
            if (nextRequest) nextRequest();
          }
        }
      }

      // Otherwise, queue the request
      return new Promise<T>((resolve, reject) => {
        console.log(
          `Queuing Azure speech request (queue length: ${requestQueue.length})`
        );
        requestQueue.push(() => {
          currentRequests++;
          console.log(
            `Starting queued Azure speech request (${currentRequests}/${MAX_CONCURRENT_REQUESTS} active)`
          );
          fn().then(
            result => {
              currentRequests--;
              console.log(
                `Completed queued Azure speech request (${currentRequests}/${MAX_CONCURRENT_REQUESTS} active)`
              );
              // Process next request in the queue if any
              if (requestQueue.length > 0) {
                console.log(
                  `Processing next request from queue (${requestQueue.length} remaining)`
                );
                const nextRequest = requestQueue.shift();
                if (nextRequest) nextRequest();
              }
              resolve(result);
            },
            error => {
              currentRequests--;
              console.log(
                `Error in queued Azure speech request (${currentRequests}/${MAX_CONCURRENT_REQUESTS} active)`
              );
              // Process next request in the queue if any
              if (requestQueue.length > 0) {
                console.log(
                  `Processing next request from queue (${requestQueue.length} remaining)`
                );
                const nextRequest = requestQueue.shift();
                if (nextRequest) nextRequest();
              }
              reject(error);
            }
          );
        });

        // If we've just added the first item to an empty queue and we have room to process,
        // start processing it immediately
        if (
          requestQueue.length === 1 &&
          currentRequests < MAX_CONCURRENT_REQUESTS
        ) {
          console.log("Processing first queued request immediately");
          const nextRequest = requestQueue.shift();
          if (nextRequest) nextRequest();
        }
      });
    } catch (error: any) {
      // Detect if this is an Azure concurrent request limit error
      const isRateLimitError =
        error.message?.includes("concurrent") ||
        error.message?.includes("exceeded") ||
        error.message?.includes("parallel requests") ||
        error.message?.includes("rate limit");

      if (isRateLimitError && retryCount < maxRetries) {
        retryCount++;
        lastError = error;
        console.warn(
          `Azure rate limit hit. Retry attempt ${retryCount}/${maxRetries} after backoff`
        );

        // Implement exponential backoff
        const backoffMs = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));

        // Try again
        return executeWithRetry();
      }

      // If we've exhausted retries or it's not a rate limit error, rethrow
      throw error;
    }
  };

  return executeWithRetry();
}

// Define result type for consistency
interface AssessmentResult {
  pronunciationScore: number;
  fluencyScore: number;
  completenessScore: number;
  accuracyScore: number; // We'll ignore this from Azure and use GPT's accuracy score instead
  prosodyScore?: number; // New: Prosody score for intonation and rhythm
  speakingRate?: number; // New: Speaking rate in words per minute
  wordLevelAssessment?: WordAssessment[]; // New: Word-level breakdown for pronunciation
}

// New interface for word-level assessment data
interface WordAssessment {
  word: string;
  pronunciationScore: number;
  offset: number; // Offset in milliseconds from the start of the audio
  duration: number; // Duration of the word in milliseconds
  phonemes?: {
    phoneme: string;
    score: number;
  }[];
}

// Define a grammar issue interface for detailed grammar analysis
export interface GrammarIssue {
  text: string;
  issue: string;
  correction: string;
  explanation: string;
}

// Define the return type for the analyzeSessionRecordings function
export interface SessionAnalysisResult {
  fluencyScore: number;
  accuracyScore: number;
  vocabularyScore?: number;
  pronunciationScore: number;
  completenessScore?: number;
  prosodyScore?: number; // New: Prosody score
  speakingRate?: number; // New: Speaking rate
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string;
  grammarIssues?: GrammarIssue[];
  grammarScore?: number;
  mispronunciations?: Array<{
    word: string;
    phonemes?: Array<{
      phoneme: string;
      score: number;
    }>;
    pronunciationScore: number;
    offset: number;
    duration: number;
  }>;
}

/**
 * Initialize the speech config with the Azure credentials
 */
function createSpeechConfig() {
  if (!SPEECH_KEY || !SPEECH_REGION) {
    throw new Error("Azure Speech Service credentials not configured");
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    SPEECH_KEY,
    SPEECH_REGION
  );
  speechConfig.speechRecognitionLanguage = "en-US";
  return speechConfig;
}

/**
 * Perform pronunciation assessment on an audio buffer
 * @param audioBuffer - Buffer containing the audio data
 * @param referenceText - The text that should have been spoken
 * @returns Pronunciation assessment results
 */
export async function performPronunciationAssessment(
  audioBuffer: Buffer,
  referenceText: string
): Promise<AssessmentResult> {
  return withRequestLimit(async () => {
    // Create a temporary file to store the audio
    const tempDir = await mkdtempPromise(
      path.join(os.tmpdir(), "azure-speech-")
    );
    const audioPath = path.join(tempDir, "audio.wav");

    try {
      // Write the audio buffer to a temporary file
      await writeFilePromise(audioPath, audioBuffer);

      // Create the speech config
      const speechConfig = createSpeechConfig();

      // Read the file back as a buffer for the audio config
      const fileBuffer = await readFilePromise(audioPath);

      // Create an audio config using the buffer
      const audioConfig = sdk.AudioConfig.fromWavFileInput(fileBuffer);

      // Create pronunciation assessment config with enhanced settings
      const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
        referenceText,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme, // Enable phoneme-level assessment
        true // Enable miscue detection
      );

      // Create speech recognizer
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      // Apply pronunciation assessment config
      pronunciationConfig.applyTo(recognizer);

      // Return a promise that resolves when recognition is complete
      return new Promise<AssessmentResult>((resolve, reject) => {
        // Store results
        let pronunciationResults: sdk.PronunciationAssessmentResult | null =
          null;
        let detailedResults: any = null;
        let recognizedText = "";
        const audioStartTime = Date.now(); // Track when audio processing started
        let audioEndTime: number;
        let wordCount = 0;

        // Recognition result handler
        recognizer.recognized = (
          _sender: unknown,
          e: sdk.SpeechRecognitionEventArgs
        ) => {
          if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
            // Store the recognized text for word count calculation
            recognizedText += " " + e.result.text;
            wordCount = recognizedText.trim().split(/\s+/).length;

            pronunciationResults = sdk.PronunciationAssessmentResult.fromResult(
              e.result
            );

            // Get detailed pronunciation results including word and phoneme level data
            try {
              // Access detailed assessment result properties (prosody, word-level, etc.)
              const resultJson = JSON.parse(
                e.result.properties.getProperty(
                  sdk.PropertyId.SpeechServiceResponse_JsonResult
                )
              );

              if (
                resultJson &&
                resultJson.NBest &&
                resultJson.NBest.length > 0
              ) {
                detailedResults = resultJson.NBest[0];
              }
            } catch (error) {
              console.warn(
                "Could not parse detailed pronunciation data:",
                error
              );
            }
          }
        };

        // Error handler
        recognizer.canceled = (
          _sender: unknown,
          e: sdk.SpeechRecognitionCanceledEventArgs
        ) => {
          if (e.reason === sdk.CancellationReason.Error) {
            reject(new Error(e.errorDetails));
          }
        };

        // Session stopped handler
        recognizer.sessionStopped = (
          _sender: unknown,
          _e: sdk.SessionEventArgs
        ) => {
          audioEndTime = Date.now(); // Track when audio processing ended
          const audioDurationMs = audioEndTime - audioStartTime;

          recognizer.stopContinuousRecognitionAsync(
            () => {
              if (pronunciationResults) {
                // Calculate speaking rate in words per minute if we have word count and duration
                const speakingRate =
                  wordCount > 0 && audioDurationMs > 0
                    ? Math.round((wordCount / (audioDurationMs / 1000)) * 60)
                    : undefined;

                // Extract word-level assessment if available
                let wordLevelAssessment: WordAssessment[] | undefined;

                if (detailedResults && detailedResults.Words) {
                  wordLevelAssessment = detailedResults.Words.map(
                    (word: any) => {
                      const wordAssessment: WordAssessment = {
                        word: word.Word,
                        pronunciationScore:
                          word.PronunciationAssessment?.AccuracyScore || 0,
                        offset: word.Offset,
                        duration: word.Duration,
                        phonemes: word.Phonemes?.map((p: any) => ({
                          phoneme: p.Phoneme,
                          score: p.PronunciationAssessment?.AccuracyScore || 0,
                        })),
                      };
                      return wordAssessment;
                    }
                  );
                }

                // Extract prosody score if available in detailed results
                let prosodyScore: number | undefined;
                if (
                  detailedResults &&
                  detailedResults.PronunciationAssessment &&
                  typeof detailedResults.PronunciationAssessment
                    .ProsodyScore === "number"
                ) {
                  prosodyScore =
                    detailedResults.PronunciationAssessment.ProsodyScore;
                }

                resolve({
                  pronunciationScore: pronunciationResults.pronunciationScore,
                  fluencyScore: pronunciationResults.fluencyScore,
                  completenessScore: pronunciationResults.completenessScore,
                  accuracyScore: pronunciationResults.accuracyScore, // We'll ignore this from Azure
                  prosodyScore: prosodyScore
                    ? Math.min(Math.round(prosodyScore), 100)
                    : undefined,
                  speakingRate,
                  wordLevelAssessment,
                });
              } else {
                reject(new Error("No pronunciation results returned"));
              }
            },
            (error: unknown) => reject(error)
          );
        };

        // Start recognition
        recognizer.startContinuousRecognitionAsync(
          () => {},
          (error: unknown) => reject(error)
        );
      });
    } finally {
      // Clean up temporary files
      try {
        if (fs.existsSync(audioPath)) {
          await unlinkPromise(audioPath);
        }
        // Try to remove the directory (will fail if not empty, which is fine)
        fs.rmdir(tempDir, () => {});
      } catch (cleanupError) {
        console.error("Error cleaning up temporary files:", cleanupError);
      }
    }
  });
}

/**
 * Analyze grammar and accuracy in the transcribed texts
 * @param transcripts - Array of transcripts to analyze for grammar and accuracy
 * @returns Grammar and accuracy analysis with scores
 */
export async function analyzeGrammar(transcripts: string[]): Promise<{
  grammarIssues: GrammarIssue[];
  grammarScore: number;
  accuracyScore: number;
}> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not configured, skipping grammar analysis");
    return { grammarIssues: [], grammarScore: 0, accuracyScore: 0 };
  }

  try {
    console.log("Analyzing grammar and linguistic accuracy with OpenAI...");

    // Combine all transcripts into one text for analysis
    const combinedText = transcripts.join("\n");

    // Skip grammar analysis if text is too short
    if (combinedText.trim().length < 10) {
      console.log("Text too short for grammar analysis");
      return { grammarIssues: [], grammarScore: 5, accuracyScore: 5 }; // Neutral scores
    }

    // Create a prompt for GPT-4 to analyze grammar and accuracy
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a language assessment expert specializing in English grammar and linguistic accuracy analysis.
Analyze the provided speech transcription for grammar errors and linguistic accuracy.

By linguistic accuracy, we mean how correctly the speaker uses English vocabulary and grammar structures to convey meaning accurately.

Return a JSON object with the following structure:
{
  "grammarIssues": [
    {
      "text": "The incorrect text",
      "issue": "Brief description of the grammatical issue",
      "correction": "The corrected text",
      "explanation": "A brief explanation of the grammar rule"
    }
  ],
  "grammarScore": (a number from 1-10 rating the overall grammatical correctness, where 10 is perfect grammar),
  "accuracyScore": (a number from 1-10 rating the linguistic accuracy, where 10 is perfectly accurate language use)
}

If there are no grammar issues, return an empty array for grammarIssues and scores based on the quality of the grammar and accuracy.
Focus on grammar rules, sentence structure, and appropriate word usage.`,
        },
        {
          role: "user",
          content: `Here is the transcribed speech to analyze for grammar issues and linguistic accuracy:\n\n${combinedText}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    // Parse the response
    const analysisResult = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    console.log(
      `Analysis complete. Found ${
        analysisResult.grammarIssues?.length || 0
      } issues. Grammar score: ${analysisResult.grammarScore || "N/A"}, Accuracy score: ${analysisResult.accuracyScore || "N/A"}`
    );

    return {
      grammarIssues: analysisResult.grammarIssues || [],
      grammarScore: analysisResult.grammarScore || 5, // Default to neutral if not provided
      accuracyScore: analysisResult.accuracyScore || 5, // Default to neutral if not provided
    };
  } catch (error) {
    console.error("Error analyzing grammar and accuracy:", error);
    return { grammarIssues: [], grammarScore: 0, accuracyScore: 0 };
  }
}

/**
 * Analyze multiple audio recordings from a session to provide an overall assessment
 *
 * This function uses two evaluation systems:
 * 1. Azure Speech Services - for evaluating pronunciation and fluency from audio
 * 2. OpenAI GPT - for evaluating grammar and linguistic accuracy from transcribed text
 *
 * @param audioBuffers - Array of audio buffers with their reference texts
 * @returns Consolidated assessment results with scores from both systems
 */
export async function analyzeSessionRecordings(
  audioBuffers: Array<{ buffer: Buffer; referenceText: string }>
): Promise<SessionAnalysisResult> {
  // Check if we have recordings to analyze
  if (audioBuffers.length === 0) {
    throw new Error("No recordings to analyze");
  }

  console.log(
    `Processing ${audioBuffers.length} audio recordings sequentially`
  );

  // OPTIMIZATION: Limit the amount of audio we process to avoid timeouts
  // If we have many files, only process the first few and focus on the largest ones
  // which are likely to have more speech content
  if (audioBuffers.length > 3) {
    // Sort by buffer size (descending) - larger files typically have more speech
    audioBuffers.sort((a, b) => b.buffer.length - a.buffer.length);

    // Take the top 3 largest files only
    console.log(
      `Limiting analysis to the ${Math.min(3, audioBuffers.length)} largest audio files to prevent timeout`
    );
    audioBuffers = audioBuffers.slice(0, 3);
  }

  // Process recordings sequentially instead of in parallel
  const results: AssessmentResult[] = [];
  for (let i = 0; i < audioBuffers.length; i++) {
    try {
      console.log(`Processing recording ${i + 1}/${audioBuffers.length}`);
      const { buffer, referenceText } = audioBuffers[i];
      const result = await performPronunciationAssessment(
        buffer,
        referenceText
      );
      results.push(result);
    } catch (error) {
      console.error(`Error processing recording ${i + 1}:`, error);
      // Add a placeholder result with neutral scores to maintain the array length
      results.push({
        pronunciationScore: 50,
        fluencyScore: 50,
        completenessScore: 50,
        accuracyScore: 50,
      });
    }

    // Reduce the delay between processing each recording
    if (i < audioBuffers.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduce delay from 300ms to 100ms
    }
  }

  // Extract all reference texts for grammar analysis
  const referenceTexts = audioBuffers.map(item => item.referenceText);

  // OPTIMIZATION: Limit the text analysis to prevent timeouts in longer sessions
  // Only take the first 500 characters of combined text
  const MAX_TEXT_LENGTH = 1000;
  const limitedTexts = referenceTexts.map(text => {
    if (text && text.length > MAX_TEXT_LENGTH) {
      console.log(
        `Trimming text from ${text.length} to ${MAX_TEXT_LENGTH} characters`
      );
      return text.substring(0, MAX_TEXT_LENGTH);
    }
    return text;
  });

  // Perform grammar and accuracy analysis on the transcribed texts
  const textAnalysis = await analyzeGrammar(limitedTexts);

  // Aggregate scores
  const aggregateScores = results.reduce(
    (
      acc: {
        pronunciationScoreSum: number;
        fluencyScoreSum: number;
        completenessScoreSum: number;
        prosodyScoreSum: number;
        prosodyScoreCount: number;
        speakingRateSum: number;
        speakingRateCount: number;
      },
      result: AssessmentResult
    ) => {
      acc.pronunciationScoreSum += result.pronunciationScore;
      acc.fluencyScoreSum += result.fluencyScore;
      acc.completenessScoreSum += result.completenessScore;

      // Process new metrics if available
      if (typeof result.prosodyScore === "number") {
        acc.prosodyScoreSum += result.prosodyScore;
        acc.prosodyScoreCount++;
      }

      if (typeof result.speakingRate === "number") {
        acc.speakingRateSum += result.speakingRate;
        acc.speakingRateCount++;
      }

      return acc;
    },
    {
      pronunciationScoreSum: 0,
      fluencyScoreSum: 0,
      completenessScoreSum: 0,
      prosodyScoreSum: 0,
      prosodyScoreCount: 0,
      speakingRateSum: 0,
      speakingRateCount: 0,
    }
  );

  const count = results.length;

  // Convert to 1-10 scale for consistency with your feedback schema
  const normalizeScore = (score: number) => Math.round((score / 100) * 10);

  // Calculate averages and normalize to 1-10 scale
  const avgPronunciation = normalizeScore(
    aggregateScores.pronunciationScoreSum / count
  );
  const avgFluency = normalizeScore(aggregateScores.fluencyScoreSum / count);
  const avgCompleteness = normalizeScore(
    aggregateScores.completenessScoreSum / count
  );

  // Calculate prosody score if available
  const avgProsody =
    aggregateScores.prosodyScoreCount > 0
      ? normalizeScore(
          aggregateScores.prosodyScoreSum / aggregateScores.prosodyScoreCount
        )
      : undefined;

  // Calculate average speaking rate if available (keep in WPM, don't normalize)
  const avgSpeakingRate =
    aggregateScores.speakingRateCount > 0
      ? Math.round(
          aggregateScores.speakingRateSum / aggregateScores.speakingRateCount
        )
      : undefined;

  // Use GPT's accuracy score directly (already on a 1-10 scale)
  const accuracyScore = textAnalysis.accuracyScore;

  // Collect all word-level pronunciation data for mispronunciations
  const mispronunciations = results.flatMap((result, index) => {
    // Skip if no word-level assessment is available
    if (!result.wordLevelAssessment) return [];

    // Filter words with pronunciation score below threshold (< 70%)
    return result.wordLevelAssessment
      .filter(word => word.pronunciationScore < 70)
      .map(word => ({
        word: word.word,
        pronunciationScore: word.pronunciationScore,
        offset: word.offset,
        duration: word.duration,
        phonemes: word.phonemes?.map(p => ({
          phoneme: p.phoneme,
          score: p.score,
        })),
      }));
  });

  // Calculate an overall score (weighted average), now including prosody if available
  const overallScore = Math.round(
    avgPronunciation * 0.25 +
      avgFluency * 0.15 +
      (avgProsody ? avgProsody * 0.1 : 0) +
      accuracyScore * 0.2 +
      textAnalysis.grammarScore * 0.3 +
      (avgProsody ? 0 : 0.1) // Redistribute weight if prosody not available
  );

  // Generate qualitative feedback based on scores
  const strengths = [];
  const areasForImprovement = [];

  if (avgPronunciation >= 7) {
    strengths.push("Clear pronunciation of sounds and words");
  } else if (avgPronunciation <= 4) {
    areasForImprovement.push(
      "Work on pronouncing individual sounds more clearly"
    );
  }

  if (avgFluency >= 7) {
    strengths.push("Good speech rhythm and natural flow");
  } else if (avgFluency <= 4) {
    areasForImprovement.push(
      "Practice speaking with more natural rhythm and flow"
    );
  }

  if (accuracyScore >= 7) {
    strengths.push("Accurate and appropriate word usage");
  } else if (accuracyScore <= 4) {
    areasForImprovement.push(
      "Focus on using words more accurately and appropriately"
    );
  }

  if (avgCompleteness >= 7) {
    strengths.push("Good completion of thoughts and sentences");
  } else if (avgCompleteness <= 4) {
    areasForImprovement.push("Try to complete your sentences fully");
  }

  // Add grammar-specific feedback
  if (textAnalysis.grammarScore >= 7) {
    strengths.push("Strong grammatical structure in your responses");
  } else if (textAnalysis.grammarScore <= 4) {
    areasForImprovement.push(
      "Pay more attention to grammar rules and sentence structure"
    );
  }

  // Add prosody-specific feedback
  if (avgProsody !== undefined) {
    if (avgProsody >= 7) {
      strengths.push("Excellent intonation and natural speech rhythm");
    } else if (avgProsody <= 4) {
      areasForImprovement.push(
        "Work on your intonation and speech rhythm to sound more natural"
      );
    }
  }

  // Add speaking rate feedback
  if (avgSpeakingRate !== undefined) {
    if (avgSpeakingRate > 160) {
      areasForImprovement.push(
        "Try to slow down your speaking pace for better clarity"
      );
    } else if (avgSpeakingRate < 100) {
      areasForImprovement.push(
        "Work on increasing your speaking speed for more natural conversation"
      );
    } else {
      strengths.push("Good conversational speaking pace");
    }
  }

  // Generate suggestions based on areas that need improvement
  let suggestions = "";
  if (
    areasForImprovement.includes(
      "Work on pronouncing individual sounds more clearly"
    )
  ) {
    suggestions +=
      "Practice specific sounds that are difficult for you using minimal pairs exercises. ";

    // Add specific phoneme suggestions if available
    if (mispronunciations.length > 0) {
      const commonMispronounced = mispronunciations
        .slice(0, 3)
        .map(m => m.word)
        .join(", ");
      suggestions += `Focus especially on words like: ${commonMispronounced}. `;
    }
  }

  if (
    areasForImprovement.includes(
      "Practice speaking with more natural rhythm and flow"
    )
  ) {
    suggestions +=
      "Try shadowing exercises where you speak along with native speakers to improve rhythm. ";
  }

  if (
    areasForImprovement.includes(
      "Focus on using words more accurately and appropriately"
    )
  ) {
    suggestions +=
      "Study word collocations and practice using new vocabulary in context. Keep a vocabulary journal. ";
  }

  if (
    areasForImprovement.includes(
      "Pay more attention to grammar rules and sentence structure"
    )
  ) {
    suggestions +=
      "Review basic grammar rules and practice constructing sentences with correct structure. ";
  }

  if (
    areasForImprovement.includes(
      "Work on your intonation and speech rhythm to sound more natural"
    )
  ) {
    suggestions +=
      "Listen to native speakers and practice mimicking their intonation patterns. Record yourself and compare. ";
  }

  if (
    areasForImprovement.includes(
      "Try to slow down your speaking pace for better clarity"
    )
  ) {
    suggestions +=
      "Practice speaking deliberately and pausing between sentences. Your current pace is too fast at about " +
      avgSpeakingRate +
      " words per minute. ";
  } else if (
    areasForImprovement.includes(
      "Work on increasing your speaking speed for more natural conversation"
    )
  ) {
    suggestions +=
      "Practice speaking at a slightly faster pace. Your current pace is slow at about " +
      avgSpeakingRate +
      " words per minute. ";
  }

  if (!suggestions) {
    suggestions =
      "Continue practicing regularly to maintain and improve your speaking skills.";
  }

  return {
    fluencyScore: avgFluency,
    accuracyScore: accuracyScore, // Using GPT's accuracy score
    pronunciationScore: avgPronunciation,
    completenessScore: avgCompleteness,
    prosodyScore: avgProsody,
    speakingRate: avgSpeakingRate,
    grammarScore: textAnalysis.grammarScore,
    grammarIssues: textAnalysis.grammarIssues,
    mispronunciations:
      mispronunciations.length > 0 ? mispronunciations : undefined,
    overallScore,
    strengths:
      strengths.length > 0 ? strengths : ["Good overall communication"],
    areasForImprovement:
      areasForImprovement.length > 0
        ? areasForImprovement
        : ["Continue practicing consistently"],
    suggestions,
  };
}
