import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

import { normalizeQuestionType } from "@/lib/utils";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 55000, // 55 seconds timeout
  maxRetries: 2, // Reduce retries to avoid long wait times
});

// Simple in-memory cache for questions and vocabulary
// This will persist between requests but reset on server restart
interface CacheEntry {
  timestamp: number;
  data: any;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const questionCache = new Map<string, CacheEntry>();
const vocabularyCache = new Map<string, CacheEntry>();

// Cleanup function to remove old cache entries
function cleanupCache() {
  const now = Date.now();

  // Clean question cache
  Array.from(questionCache.entries()).forEach(([key, entry]) => {
    if (now - entry.timestamp > CACHE_TTL) {
      questionCache.delete(key);
    }
  });

  // Clean vocabulary cache
  Array.from(vocabularyCache.entries()).forEach(([key, entry]) => {
    if (now - entry.timestamp > CACHE_TTL) {
      vocabularyCache.delete(key);
    }
  });
}

// Run cleanup every hour
setInterval(cleanupCache, 60 * 60 * 1000);

/**
 * Generate listening comprehension questions based on a transcript and CEFR level
 * @param transcript The conversation transcript to generate questions for
 * @param level The CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns Array of questions with answers
 */
export async function generateQuestions(
  transcript: string,
  level: string
): Promise<
  Array<{
    id: string;
    type: "multiple-choice" | "true-false" | "fill-blank";
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    timestamp: number;
  }>
> {
  try {
    // Create a cache key based on first 100 chars of transcript + level
    // This is a good balance of uniqueness without being too specific
    const cacheKey = `${transcript.substring(0, 100).trim()}_${level}`;

    // Check cache first
    if (questionCache.has(cacheKey)) {
      const cached = questionCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    // Adjust question count and complexity based on level
    const questionCountByLevel = {
      A1: 3,
      A2: 4,
      B1: 5,
      B2: 6,
      C1: 7,
      C2: 8,
    };

    const questionCount =
      questionCountByLevel[level as keyof typeof questionCountByLevel] || 5;

    // Generate questions using OpenAI with improved error handling
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert language assessment creator specializing in ${level} level listening comprehension questions. Create questions that test different aspects of understanding including main ideas, specific details, inferences, and vocabulary in context. Your response should be in valid JSON format that can be parsed.`,
        },
        {
          role: "user",
          content: `Create ${questionCount} listening comprehension questions based on this transcript for ${level} level learners. Include a mix of multiple-choice, true-false, and fill-in-the-blank questions. For each question, provide a clear explanation of the answer.

The response should be a valid JSON array with objects having these properties:
- type: "multiple-choice", "true-false", or "fill-blank"
- question: The question text
- options: For multiple-choice, an array of 3-4 options (not needed for other types)
- correctAnswer: The correct answer
- explanation: A clear explanation of why this is the correct answer
- timestamp: Approximate position in the text (as a word count from the beginning) where the answer appears

Transcript:
${transcript}`,
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    let questions = [];
    try {
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.questions)) {
          questions = parsed.questions;
        } else {
          // Handle case where the response might have a different structure
          questions = parsed;
        }
      }
    } catch (parseError) {
      console.error("Error parsing questions JSON:", parseError);
      return [];
    }

    // Validate and assign IDs to each question
    const processedQuestions = questions.map((question: any) => {
      return {
        id: uuidv4(),
        type: normalizeQuestionType(question.type),
        question: question.question,
        options:
          normalizeQuestionType(question.type) === "multiple-choice"
            ? question.options || ["Option 1", "Option 2", "Option 3"]
            : undefined,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "No explanation provided",
        timestamp: question.timestamp || 0,
      };
    });

    // Save to cache
    questionCache.set(cacheKey, {
      timestamp: Date.now(),
      data: processedQuestions,
    });

    return processedQuestions;
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

/**
 * Extract vocabulary items from the transcript for language learning
 * @param transcript The conversation transcript
 * @param level The CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns Array of vocabulary items
 */
export async function extractVocabulary(
  transcript: string,
  level: string
): Promise<
  Array<{
    word: string;
    definition: string;
    context: string;
    examples: string[];
    difficulty: number;
    timestamp: number;
  }>
> {
  try {
    // Create a cache key based on first 100 chars of transcript + level
    const cacheKey = `${transcript.substring(0, 100).trim()}_${level}`;

    // Check cache first
    if (vocabularyCache.has(cacheKey)) {
      const cached = vocabularyCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    // Adjust vocabulary count based on level
    const vocabCountByLevel = {
      A1: 5,
      A2: 7,
      B1: 10,
      B2: 12,
      C1: 15,
      C2: 18,
    };

    const vocabCount =
      vocabCountByLevel[level as keyof typeof vocabCountByLevel] || 10;

    // Use a smaller transcript sample to improve performance for vocabulary extraction
    // We don't need the entire transcript for vocabulary analysis
    const transcriptSample =
      transcript.length > 2000
        ? transcript.substring(0, 2000) + "..."
        : transcript;

    // Extract vocabulary using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert language educator specializing in vocabulary selection for ${level} level learners. Extract appropriate vocabulary items that would be useful for a language learner to study. Your response should be in valid JSON format.`,
        },
        {
          role: "user",
          content: `Extract ${vocabCount} vocabulary items from this transcript that would be useful for ${level} level English learners. 

For each vocabulary item, provide:
- The word or phrase
- A clear definition
- The context from the transcript where it appears
- 2-3 example sentences using the word
- A difficulty rating (1-10)

Return as a JSON array of objects.

Transcript:
${transcriptSample}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    let vocabulary = [];
    try {
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.vocabulary)) {
          vocabulary = parsed.vocabulary;
        } else {
          vocabulary = parsed;
        }
      }
    } catch (parseError) {
      console.error("Error parsing vocabulary JSON:", parseError);
      return [];
    }

    // Process and validate vocabulary items
    const processedVocabulary = vocabulary.map((item: any) => ({
      word: item.word || "",
      definition: item.definition || "",
      context: item.context || "No context provided",
      examples: Array.isArray(item.examples)
        ? item.examples
        : [`Example: ${item.word} is commonly used in conversations.`],
      difficulty: item.difficulty || 5,
      timestamp: 0, // Will be calculated later when creating the listening session
    }));

    // Save to cache
    vocabularyCache.set(cacheKey, {
      timestamp: Date.now(),
      data: processedVocabulary,
    });

    return processedVocabulary;
  } catch (error) {
    console.error("Error extracting vocabulary:", error);
    return [];
  }
}
