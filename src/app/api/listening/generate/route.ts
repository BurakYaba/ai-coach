import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAI } from "openai";

import {
  createMultiSpeakerAudio,
  estimateAudioDuration,
  parseTranscriptBySpeaker,
} from "@/lib/audio-processor";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { generateQuestions, extractVocabulary } from "@/lib/question-generator";
import {
  normalizeQuestionType,
  getLevelScore,
  calculateComplexity,
} from "@/lib/utils";
import ListeningSession from "@/models/ListeningSession";

// Force dynamic rendering to handle server-side requests properly
export const dynamic = "force-dynamic";

// File system promisified functions
const mkdtemp = promisify(fs.mkdtemp);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

// Initialize OpenAI with improved timeout handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 55000, // 55 seconds timeout
  maxRetries: 3,
});

// Track ongoing generations to prevent duplicate requests
const ongoingGenerations = new Map();

// POST /api/listening/generate - Generate listening content
export async function POST(req: NextRequest) {
  // Set a controller to handle timeouts more gracefully
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 55000); // 55 second timeout

  // Create a temporary directory for processing files if needed
  let tempDir = null;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      clearTimeout(timeoutId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const body = await req.json();
    const { level, topic, contentType, targetLength = "medium" } = body;

    // Validate required fields
    if (!level || !topic || !contentType) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { error: "Missing required fields: level, topic, or contentType" },
        { status: 400 }
      );
    }

    // Create a generation key to prevent duplicate requests
    const generationKey = `${userId}-${level}-${topic}-${contentType}-${targetLength}`;

    // Check if this exact generation is already in progress
    if (ongoingGenerations.has(generationKey)) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          error: "A similar generation is already in progress",
          retryAfter: 30, // Suggest retry after 30 seconds
        },
        { status: 429 }
      );
    }

    // Mark this generation as in progress
    ongoingGenerations.set(generationKey, new Date());

    // Determine word count based on level and target length
    const wordCounts = {
      short: {
        A1: 150,
        A2: 200,
        B1: 250,
        B2: 300,
        C1: 350,
        C2: 400,
      },
      medium: {
        A1: 250,
        A2: 350,
        B1: 450,
        B2: 550,
        C1: 650,
        C2: 750,
      },
      long: {
        A1: 350,
        A2: 500,
        B1: 650,
        B2: 800,
        C1: 950,
        C2: 1100,
      },
    };

    const targetWordCount =
      wordCounts[targetLength as keyof typeof wordCounts]?.[
        level as keyof typeof wordCounts.medium
      ] || 400;

    // Determine number of speakers based on content type
    const speakerCountMap = {
      monologue: 1,
      dialogue: 2,
      interview: 3,
      news: 2,
    };

    const speakerCount =
      speakerCountMap[contentType as keyof typeof speakerCountMap] || 2;

    // Create temporary directory if needed for file operations
    tempDir = await mkdtemp(path.join(os.tmpdir(), "listening-"));

    // Content generation process with better error handling
    try {
      // Step 1: Generate transcript using OpenAI
      console.log(
        `Generating ${level} ${contentType} transcript on topic "${topic}"...`
      );
      const transcript = await generateTranscript(
        level,
        topic,
        contentType,
        targetWordCount,
        speakerCount
      );

      // Check if operation was aborted due to timeout
      if (controller.signal.aborted) {
        clearTimeout(timeoutId);
        ongoingGenerations.delete(generationKey);

        // Clean up temp dir if it exists
        if (tempDir) {
          await rmdir(tempDir, { recursive: true }).catch(console.error);
        }

        return NextResponse.json(
          {
            error:
              "Operation timed out. Please try again with a shorter content length or a different topic.",
            retryable: true,
          },
          { status: 504 }
        );
      }

      // Parse transcript to analyze speaker segments (optional enhancement)
      const segments = parseTranscriptBySpeaker(transcript);

      // Step 2: Create multi-speaker audio from transcript
      console.log("Generating audio from transcript...");
      const audioResult = await createMultiSpeakerAudio(transcript);

      // Check if operation was aborted due to timeout after audio generation
      if (controller.signal.aborted) {
        clearTimeout(timeoutId);
        ongoingGenerations.delete(generationKey);

        // Clean up temp dir if it exists
        if (tempDir) {
          await rmdir(tempDir, { recursive: true }).catch(console.error);
        }

        return NextResponse.json(
          {
            error:
              "Audio generation timed out. Please try again with a shorter content length.",
            retryable: true,
          },
          { status: 504 }
        );
      }

      // Run the following steps in parallel for better performance
      const [questionsPromise, vocabularyPromise, titlePromise] =
        await Promise.allSettled([
          // Step 3: Generate questions in parallel
          generateQuestions(transcript, level),

          // Step 4: Extract vocabulary in parallel
          extractVocabulary(transcript, level),

          // Step 5: Generate title in parallel
          generateTitle(transcript, topic, level),
        ]);

      // Extract results with fallbacks
      const questions =
        questionsPromise.status === "fulfilled" ? questionsPromise.value : [];

      const vocabulary =
        vocabularyPromise.status === "fulfilled" ? vocabularyPromise.value : [];

      const title =
        titlePromise.status === "fulfilled"
          ? titlePromise.value
          : `${topic} ${contentType} (${level})`;

      // Step 6: Create listening session with careful error handling
      try {
        // Generate UUIDs for questions and prepare them with timestamps
        const timestampedQuestions = questions.map((q: any, index: number) => {
          // Ensure the question type is properly normalized
          const normalizedType = normalizeQuestionType(
            q.type || "multiple-choice"
          );

          // Calculate a more informed timestamp based on word position if possible
          let timestamp = 0;
          try {
            // Find the first few words of the question in the transcript
            const questionWords = q.question
              .split(" ")
              .slice(0, 3)
              .join(" ")
              .toLowerCase();
            const transcriptLower = transcript.toLowerCase();
            const position = transcriptLower.indexOf(questionWords);

            if (position !== -1) {
              // Calculate approximate timestamp based on word position
              const wordsBefore = transcript
                .substring(0, position)
                .split(/\s+/).length;
              const totalWords = transcript.split(/\s+/).length;
              timestamp = Math.floor(
                (wordsBefore / totalWords) * audioResult.duration
              );
            } else {
              // Fallback to evenly distributed timestamps
              timestamp = Math.floor(
                (index / questions.length) * audioResult.duration
              );
            }
          } catch (err) {
            // Fallback to evenly distributed timestamps
            timestamp = Math.floor(
              (index / questions.length) * audioResult.duration
            );
          }

          return {
            id: crypto.randomUUID
              ? crypto.randomUUID()
              : `q-${Date.now()}-${index}`,
            type: normalizedType,
            question: q.question,
            options:
              normalizedType === "multiple-choice"
                ? q.options || []
                : undefined,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "Explanation not provided",
            timestamp: timestamp,
          };
        });

        // Prepare vocabulary with timestamps and difficulty
        const timestampedVocabulary = vocabulary.map(
          (v: any, index: number) => {
            // Try to find the word in the transcript for timestamp
            let timestamp = 0;
            try {
              const wordPosition = transcript
                .toLowerCase()
                .indexOf(v.word.toLowerCase());
              if (wordPosition !== -1) {
                // Calculate timestamp based on word position
                const wordsBefore = transcript
                  .substring(0, wordPosition)
                  .split(/\s+/).length;
                const totalWords = transcript.split(/\s+/).length;
                timestamp = Math.floor(
                  (wordsBefore / totalWords) * audioResult.duration
                );
              } else {
                // Fallback to evenly distributed timestamps
                timestamp = Math.floor(
                  (index / vocabulary.length) * audioResult.duration
                );
              }
            } catch (err) {
              // Fallback to evenly distributed timestamps
              timestamp = Math.floor(
                (index / vocabulary.length) * audioResult.duration
              );
            }

            return {
              ...v,
              timestamp,
              // Default difficulty based on level if not provided
              difficulty: v.difficulty || calculateComplexity(level) / 2,
            };
          }
        );

        // Step 7: Create the listening session
        const listeningSession = await ListeningSession.create({
          userId: userObjectId,
          title,
          content: {
            transcript,
            audioUrl: audioResult.url,
            cloudinaryPublicId: audioResult.publicId,
          },
          level,
          topic,
          contentType,
          duration: audioResult.duration,
          questions: timestampedQuestions,
          vocabulary: timestampedVocabulary,
          userProgress: {
            startTime: new Date(),
            timeSpent: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            vocabularyReviewed: [],
            listenedSegments: [],
            replays: [],
          },
          aiAnalysis: {
            listeningLevel: getLevelScore(level),
            complexityScore: calculateComplexity(level),
            topicRelevance: 10, // Default to maximum relevance
            suggestedNextTopics: [], // We could generate these in the future
          },
          // This is a user-generated session, not a library item
          isLibrary: false,
        });

        // Clean up
        clearTimeout(timeoutId);
        ongoingGenerations.delete(generationKey);

        // Clean up temp dir if it exists
        if (tempDir) {
          await rmdir(tempDir, { recursive: true }).catch(console.error);
        }

        return NextResponse.json(listeningSession);
      } catch (sessionError) {
        console.error("Error creating listening session:", sessionError);
        clearTimeout(timeoutId);
        ongoingGenerations.delete(generationKey);

        // Clean up temp dir if it exists
        if (tempDir) {
          await rmdir(tempDir, { recursive: true }).catch(console.error);
        }

        return NextResponse.json(
          {
            error: "Failed to save listening session",
            details:
              sessionError instanceof Error
                ? sessionError.message
                : "Unknown error",
            url: audioResult.url, // Still return the generated audio URL so it's not lost
          },
          { status: 500 }
        );
      }
    } catch (genError) {
      console.error("Content generation error:", genError);
      clearTimeout(timeoutId);
      ongoingGenerations.delete(generationKey);

      // Clean up temp dir if it exists
      if (tempDir) {
        await rmdir(tempDir, { recursive: true }).catch(console.error);
      }

      return NextResponse.json(
        {
          error: "Failed to generate content",
          details:
            genError instanceof Error ? genError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Top-level error in listening generation:", error);
    clearTimeout(timeoutId);

    // Clean up temp dir if it exists
    if (tempDir) {
      await rmdir(tempDir, { recursive: true }).catch(console.error);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Clean up old entries in the ongoingGenerations map
function cleanupOngoingGenerations() {
  const now = new Date();
  // Use Array.from to convert the Map entries to an array first
  Array.from(ongoingGenerations.entries()).forEach(([key, startTime]) => {
    // Remove entries older than 5 minutes
    if (now.getTime() - startTime.getTime() > 5 * 60 * 1000) {
      ongoingGenerations.delete(key);
    }
  });
}

// Run cleanup every minute
setInterval(cleanupOngoingGenerations, 60 * 1000);

// Helper function to generate transcript using OpenAI
async function generateTranscript(
  level: string,
  topic: string,
  contentType: string,
  targetWordCount: number,
  speakerCount: number
): Promise<string> {
  // Define a prompt template that requests diverse named speakers
  const promptTemplate = `
Create a natural, conversational ${contentType} in English about "${topic}" for a language learner at ${level} CEFR level.
Target word count: ${targetWordCount} words (important: keep it concise and within this limit)
Number of speakers: ${speakerCount}

IMPORTANT SPEAKER INSTRUCTIONS:
${
  contentType === "dialogue"
    ? 'Create a conversation between two people. Give each person a real name (like "Maria", "John", "Aisha", "Wei") instead of generic labels like "Speaker A".'
    : contentType === "interview"
      ? 'Create an interview with real names for both the interviewer and guest (like "Maria", "John", "Aisha", "Wei") instead of generic labels.'
      : contentType === "monologue"
        ? 'Create a speech by a person with a real name (like "Maria", "John", "Aisha", or "Wei") instead of generic "Speaker".'
        : 'Create a news report with real names for the anchor and any reporters (like "Maria", "John", "Aisha", "Wei") instead of generic labels.'
}

Format requirements:
1. Use culturally diverse names for speakers (e.g., "Maria:", "John:", "Aisha:", "Wei:")
2. Format each turn with the speaker's name followed by a colon at the beginning of their line (e.g., "Maria: Hello there.")
3. Choose gender-appropriate names that clearly indicate gender 
4. Keep consistent speech patterns appropriate for each speaker's background

Content rules:
1. Use language appropriate for ${level} level (vocabulary, grammar structures, idioms)
2. Make the conversation flow naturally with short, realistic exchanges
3. Include pauses, fillers, and hesitations to make it sound natural
4. Keep focused on the topic
5. Aim for exactly ${targetWordCount} words to fit the time constraints

Output ONLY the transcript without any other explanations or meta-information.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'You are an expert language education content creator specializing in creating authentic conversations with diverse speakers. Use real names instead of generic labels like "Speaker A" or "Speaker B".',
        },
        { role: "user", content: promptTemplate },
      ],
      temperature: 0.7,
      max_tokens: Math.min(4000, targetWordCount * 8), // Limit tokens based on target word count
    });

    if (!completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error(
        "Failed to generate transcript: OpenAI returned empty response"
      );
    }

    // Clean the transcript - remove any potential markdown or formatting
    let transcript = completion.choices[0].message.content.trim();

    // Remove any markdown headers or unnecessary formatting
    transcript = transcript
      .replace(/^#+ .*$/gm, "") // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
      .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting
      .replace(/^(Dialogue|Conversation):.+\n/gm, "") // Remove dialogue/conversation labels
      .replace(/^#{3}\s.*\n+/gm, "") // Remove any ### headers
      .trim();

    return transcript;
  } catch (error) {
    console.error("Error generating transcript:", error);

    // Check if it's a timeout error and provide more specific messaging
    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("timed out")
      ) {
        throw new Error(
          `Transcript generation timed out. Please try with a shorter length (${level} level, ${targetWordCount} words might be too complex).`
        );
      }
    }

    throw error;
  }
}

// Helper function to generate title
async function generateTitle(
  transcript: string,
  topic: string,
  level: string
): Promise<string> {
  try {
    // Generate a title using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise, engaging titles for language learning content.",
        },
        {
          role: "user",
          content: `Create a short, engaging title (maximum 8 words) for a ${level} level language learning listening exercise about ${topic} based on this transcript. Don't use quotes in the title:\n\n${transcript.substring(0, 1000)}...`,
        },
      ],
      temperature: 0.7,
      max_tokens: 30,
    });

    const title =
      response.choices[0].message.content?.trim() ||
      `Conversation about ${topic}`;
    return title.replace(/["']/g, ""); // Remove quotes if they exist
  } catch (error) {
    console.error("Error generating title:", error);
    return `Conversation about ${topic}`;
  }
}

// Helper function to suggest next topics
async function suggestNextTopics(
  topic: string,
  level: string
): Promise<string[]> {
  try {
    // Generate next topic suggestions using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a language learning expert who suggests related topics for learners to explore next.",
        },
        {
          role: "user",
          content: `Suggest 3 related topics that would be good for ${level} level English learners to explore after studying "${topic}". Return just a JSON array of strings with no additional text.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    try {
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.topics)) {
          return parsed.topics.slice(0, 3);
        } else if (Array.isArray(parsed)) {
          return parsed.slice(0, 3);
        }
      }
    } catch (parseError) {
      console.error("Error parsing topics JSON:", parseError);
    }

    // Default suggested topics if parsing fails
    return [
      `More about ${topic}`,
      `Advanced ${topic}`,
      `${topic} in different contexts`,
    ];
  } catch (error) {
    console.error("Error suggesting next topics:", error);
    return [
      `More about ${topic}`,
      `Advanced ${topic}`,
      `${topic} in different contexts`,
    ];
  }
}
