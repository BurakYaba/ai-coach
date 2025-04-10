import crypto from "crypto";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAI } from "openai";

import {
  createMultiSpeakerAudio,
  estimateAudioDuration,
} from "@/lib/audio-processor";
import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { generateQuestions, extractVocabulary } from "@/lib/question-generator";
import { normalizeQuestionType } from "@/lib/utils";
import ListeningSession from "@/models/ListeningSession";

// Force dynamic rendering to handle server-side requests properly
export const dynamic = "force-dynamic";

// Initialize OpenAI with improved timeout handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 55000, // 55 seconds timeout
  maxRetries: 3,
});

// POST /api/admin/library/generate - Generate library listening content as admin
export async function POST(req: NextRequest) {
  // Set a controller to handle timeouts more gracefully
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 55000); // 55 second timeout

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      clearTimeout(timeoutId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user is an admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      clearTimeout(timeoutId);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const userId = session.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const body = await req.json();
    const {
      level,
      topic,
      contentType,
      targetLength = "medium",
      category = "",
      isPublic = false,
    } = body;

    // Validate required fields
    if (!level || !topic || !contentType) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { error: "Missing required fields: level, topic, or contentType" },
        { status: 400 }
      );
    }

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

    // Content generation process
    try {
      // Step 1: Generate transcript using OpenAI
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
        return NextResponse.json(
          {
            error:
              "Operation timed out. Please try again with a shorter content length or a different topic.",
            retryable: true,
          },
          { status: 504 }
        );
      }

      // Step 2: Create multi-speaker audio from transcript
      const audioResult = await createMultiSpeakerAudio(transcript);

      // Check if operation was aborted due to timeout after audio generation
      if (controller.signal.aborted) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          {
            error:
              "Audio generation timed out. Please try again with a shorter content length.",
            retryable: true,
          },
          { status: 504 }
        );
      }

      // Step 3: Generate questions
      const questions = await generateQuestions(transcript, level);

      // Step 4: Extract vocabulary
      const vocabulary = await extractVocabulary(transcript, level);

      // Step 5: Generate title
      const title = await generateTitle(transcript, topic, level);

      // After generating the transcript and creating the audio
      // const segments = parseTranscriptBySpeaker(transcript);  // commented out as currently unused

      // Step 6: Create library item with careful error handling
      try {
        // Generate UUIDs for questions and prepare them with timestamps
        const timestampedQuestions = questions.map((q: any, index: number) => {
          // Ensure the question type is properly normalized
          const normalizedType = normalizeQuestionType(
            q.type || "multiple-choice"
          );

          // For debugging
          console.log(
            `Processing question ${index}: type=${normalizedType}, question="${q.question.substring(0, 30)}..."`
          );

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
            timestamp: Math.floor(Math.random() * audioResult.duration), // Random timestamp for now
          };
        });

        // Prepare vocabulary with timestamps and difficulty
        const timestampedVocabulary = vocabulary.map(
          (v: any, index: number) => {
            // For debugging
            console.log(
              `Processing vocabulary ${index}: word="${v.word}", examples=${Array.isArray(v.examples) ? v.examples.length : "none"}`
            );

            return {
              word: v.word || "",
              definition: v.definition || "",
              context: v.context || "No example provided",
              examples:
                Array.isArray(v.examples) && v.examples.length > 0
                  ? v.examples
                  : [
                      `Example: ${v.word} is commonly used in everyday conversation.`,
                      `Example: You can practice using ${v.word} in different contexts.`,
                    ],
              difficulty: Math.floor(Math.random() * 5) + 1, // Random difficulty between 1-5
              timestamp: Math.floor(Math.random() * audioResult.duration), // Random timestamp for now
            };
          }
        );

        // Calculate listening level based on CEFR level
        const listeningLevel = getLevelScore(level);

        // Get suggested next topics
        const suggestedTopics = await suggestNextTopics(topic, level);

        // Create a library item (which is a special type of listening session)
        const libraryItem = await ListeningSession.create({
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
          duration: audioResult.duration || estimateAudioDuration(transcript),
          questions: timestampedQuestions,
          vocabulary: timestampedVocabulary,
          // Library-specific fields
          isLibrary: true,
          isPublic,
          category,
          tags: suggestedTopics.slice(0, 3), // Use suggested topics as initial tags
          // User progress for tracking
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
            listeningLevel: listeningLevel,
            complexityScore: calculateComplexity(level),
            topicRelevance: 1, // Default value
            suggestedNextTopics: suggestedTopics,
          },
        });

        return NextResponse.json(libraryItem, { status: 201 });
      } catch (dbError) {
        console.error("Database error creating library item:", dbError);
        clearTimeout(timeoutId);
        return NextResponse.json(
          {
            error: "Failed to create library item",
            details: (dbError as Error).message,
            modelError: true,
            retryable: true,
          },
          { status: 400 }
        );
      }
    } catch (processingError) {
      clearTimeout(timeoutId);

      // Check if the operation was aborted due to timeout
      if (controller.signal.aborted) {
        return NextResponse.json(
          {
            error:
              "Content generation timed out. Please try again with simpler parameters.",
            details:
              "The operation took too long to complete. Try using a shorter content length or different topic.",
            retryable: true,
            stage: "timeout",
          },
          { status: 504 }
        );
      }

      console.error("Error processing content:", processingError);
      return NextResponse.json(
        {
          error: "Error generating content",
          details: (processingError as Error).message,
          stage: "content_processing",
          retryable: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error generating library item:", error);

    // Check if the operation was aborted due to timeout
    if (controller.signal.aborted) {
      return NextResponse.json(
        {
          error: "Operation timed out. Please try again.",
          details:
            "The request took too long to process. Try again or choose different parameters.",
          retryable: true,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "Error generating library item",
        details: (error as Error).message,
        retryable: true,
      },
      { status: 500 }
    );
  }
}

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
    return [`More about ${topic}`, "Related vocabulary", "Practice speaking"];
  } catch (error) {
    console.error("Error generating topic suggestions:", error);
    return [`More about ${topic}`, "Related vocabulary", "Practice speaking"];
  }
}

// Helper function to map CEFR level to numeric score
function getLevelScore(level: string): number {
  const levelScores: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };
  return levelScores[level] || 3;
}

// Helper function to calculate complexity score
function calculateComplexity(level: string): number {
  // Base complexity on CEFR level, weighted slightly higher for advanced levels
  switch (level) {
    case "A1":
      return 1.5;
    case "A2":
      return 2.5;
    case "B1":
      return 3.7;
    case "B2":
      return 5.2;
    case "C1":
      return 7.0;
    case "C2":
      return 9.0;
    default:
      return 4.0;
  }
}
