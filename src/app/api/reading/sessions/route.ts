import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReadingSession from "@/models/ReadingSession";
import { VocabularyBank } from "@/models/VocabularyBank";

// Define interface for reading session request data
interface ReadingSessionData {
  title: string;
  content: string;
  level: string;
  topic: string;
  estimatedReadingTime: number;
  wordCount: number;
  vocabulary: Array<{
    word: string;
    definition: string;
    example: string;
    partOfSpeech?: string;
  }>;
  questions?: Array<{
    id: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    correctAnswer: string;
    explanation: string;
  }>;
  aiAnalysis?: {
    readingLevel: number;
    complexityScore: number;
    topicRelevance: number;
    suggestedNextTopics: string[];
  };
  grammarFocus?: Array<{
    pattern: string;
    explanation: string;
    examples: string[];
  }>;
}

// Define FilterOptions interface
interface FilterOptions {
  userId: string;
  status?: string | string[];
  level?: string;
  topic?: string;
}

// Cache responses for 10 seconds
export const revalidate = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "8");
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status");
    const level = url.searchParams.get("level");
    const topic = url.searchParams.get("topic");

    // Create filter based on query parameters
    const filter: FilterOptions = { userId: session.user.id };

    if (status) {
      filter.status = status.split(",");
    }

    if (level) {
      filter.level = level;
    }

    if (topic) {
      filter.topic = topic;
    }

    const skip = (page - 1) * limit;

    await dbConnect();

    // Use Promise.all for parallel queries
    const [sessions, total] = await Promise.all([
      ReadingSession.find(filter)
        .select(
          "title level topic wordCount estimatedReadingTime questions vocabulary userProgress createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReadingSession.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);

    // Set cache headers
    const headers = new Headers();
    headers.set("Cache-Control", "max-age=10");

    return NextResponse.json(
      {
        sessions,
        pagination: {
          total,
          pages,
          current: page,
          limit,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Error in GET /api/reading/sessions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reading sessions",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Replace console.log with proper logging in production

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = (await req.json()) as ReadingSessionData;

    // Validate required fields
    if (!data.title || !data.content || !data.level || !data.topic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Map CEFR level to model enum values
    const levelMap: Record<string, string> = {
      A1: "A1",
      A2: "A2",
      B1: "B1",
      B2: "B2",
      C1: "C1",
      C2: "C2",
    };

    // Calculate word count if not provided
    const wordCount = data.wordCount || data.content.split(/\s+/).length;

    // Calculate estimated reading time if not provided
    const estimatedReadingTime =
      data.estimatedReadingTime || Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

    // Ensure questions array exists
    const questions = data.questions
      ? data.questions.map((q: any) => {
          // Ensure the question has a valid type
          let questionType = q.type || "multiple-choice";

          // Fix the 'fill-in-the-blank' to match the enum value 'fill-blank'
          if (questionType === "fill-in-the-blank") {
            questionType = "fill-blank";
          }

          // Ensure options are correctly formatted as string array
          let options = null;
          if (q.options) {
            if (Array.isArray(q.options) && q.options.length > 0) {
              if (typeof q.options[0] === "object" && q.options[0] !== null) {
                options = q.options.map((opt: any) =>
                  typeof opt === "object" && opt.text ? opt.text : String(opt)
                );
              } else if (Array.isArray(q.options)) {
                options = q.options.map((opt: any) => String(opt));
              }
            }
          }

          // Ensure all required fields are present
          return {
            ...q,
            // Always provide required fields with default values if missing
            question: q.question || `Question about ${data.topic}`,
            // Ensure the type is one of the allowed enum values
            type:
              questionType === "fill-in-the-blank"
                ? "fill-blank"
                : questionType,
            // Properly format options as array of strings
            options: options || [],
            // Ensure correctAnswer is present
            correctAnswer: q.correctAnswer || "A",
            // Ensure explanation is present
            explanation: q.explanation || "Explanation not provided",
          };
        })
      : [];

    // Create default AI analysis if not provided
    const aiAnalysis = data.aiAnalysis || {
      readingLevel:
        levelMap[data.level] === "A1"
          ? 1
          : levelMap[data.level] === "A2"
            ? 2
            : levelMap[data.level] === "B1"
              ? 3
              : levelMap[data.level] === "B2"
                ? 5
                : levelMap[data.level] === "C1"
                  ? 7
                  : levelMap[data.level] === "C2"
                    ? 9
                    : 3,
      complexityScore:
        levelMap[data.level] === "A1"
          ? 1
          : levelMap[data.level] === "A2"
            ? 2
            : levelMap[data.level] === "B1"
              ? 4
              : levelMap[data.level] === "B2"
                ? 6
                : levelMap[data.level] === "C1"
                  ? 8
                  : levelMap[data.level] === "C2"
                    ? 10
                    : 4,
      topicRelevance: data.level === "A1" || data.level === "A2" ? 7 : 8,
      suggestedNextTopics: Array.isArray(data.topic)
        ? data.topic
        : [data.topic],
    };

    console.log(
      `Creating reading session for user: ${session.user.id}, title: ${data.title}`
    );

    // Log vocabulary information
    if (data.vocabulary && data.vocabulary.length > 0) {
      console.log(
        `Reading session includes ${data.vocabulary.length} vocabulary words`
      );
    } else {
      console.log("No vocabulary words included in this reading session");
    }

    // Ensure vocabulary items have all required fields
    const vocabulary = data.vocabulary
      ? data.vocabulary.map((word: any) => ({
          word: word.word,
          definition: word.definition,
          context: word.context || `Example context for "${word.word}".`,
          examples: Array.isArray(word.examples)
            ? word.examples
            : [`Example usage of "${word.word}".`],
          difficulty: typeof word.difficulty === "number" ? word.difficulty : 3,
        }))
      : [];

    const readingSession = await ReadingSession.create({
      userId: session.user.id,
      title: data.title,
      content: data.content,
      questions: questions,
      vocabulary: vocabulary,
      level: levelMap[data.level] || "B1", // Use CEFR level directly, default to B1 if mapping fails
      topic: data.topic || "General",
      wordCount: wordCount,
      estimatedReadingTime: estimatedReadingTime,
      status: "active",
      userProgress: {
        completed: false,
        timeSpent: 0,
        lastPosition: 0,
        questionsAnswered: 0,
        vocabularyReviewed: [],
        score: 0,
      },
      aiAnalysis: aiAnalysis,
      grammarFocus: data.grammarFocus || [],
    });

    console.log(
      `Successfully created reading session with ID: ${readingSession._id}`
    );

    // Add vocabulary words to the user's vocabulary bank
    if (data.vocabulary && data.vocabulary.length > 0) {
      // We're no longer automatically adding vocabulary to the bank
      // Users will add words manually from the VocabularyPanel
      console.log(
        `Reading session created with ${data.vocabulary.length} vocabulary words. Words can be added to vocabulary bank manually.`
      );
    }

    return NextResponse.json(readingSession);
  } catch (error) {
    console.error("Error in POST /api/reading/sessions:", error);

    // Check for MongoDB validation errors
    if ((error as any).name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: (error as any).message,
          fields: Object.keys((error as any).errors || {}),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create reading session",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
