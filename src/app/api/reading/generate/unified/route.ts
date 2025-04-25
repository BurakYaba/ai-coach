import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAI } from "openai";

import {
  handleApiError,
  getReadingComplexityScore,
  getCachedItem,
  setCacheItem,
} from "@/lib/reading-utils";

// Add retry and timeout configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 45000, // 45 seconds timeout (lowered to avoid Vercel timeout issues)
  maxRetries: 3, // Retry failed requests up to 3 times
});

// Ongoing requests tracking to prevent duplicates
const activeGenerations = new Map();

// Types Definition
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
}

interface VocabularyItem {
  word: string;
  definition: string;
  context: string;
  examples: string[];
  difficulty: number;
}

interface GrammarPattern {
  pattern: string;
  explanation: string;
  examples: string[];
}

interface ContentResponse {
  title: string;
  content: string;
  metadata: {
    cefr_level: string;
    complexity: number;
    topicRelevance: number;
    grammarPatterns: string[];
    estimatedVocabularySize: number;
    wordCount: number;
    actualWordCount?: number;
    lengthCategory?: string;
  };
}

interface UnifiedResponse {
  content: ContentResponse;
  vocabulary: VocabularyItem[];
  grammar: GrammarPattern[];
  questions: Question[];
}

// CEFR level-specific instructions moved to a constant object
const levelInstructions: Record<Level, string> = {
  A1: `
    - Use only the most basic and frequent vocabulary (around 500-800 words)
    - Use very simple present tense sentences with simple connectors (and, but)
    - Keep sentences very short (5-8 words per sentence on average)
    - Use concrete, everyday topics and familiar contexts
    - Avoid all idioms, phrasal verbs, and complex grammar
    - Text should be suitable for absolute beginners
    - CEFR A1 (Breakthrough) level content
  `,
  A2: `
    - Use basic vocabulary (around 1000-1500 words)
    - Use simple sentences with basic past and future tenses
    - Keep sentences relatively short (8-10 words per sentence on average)
    - Include simple descriptions and narratives about daily routines
    - Use only a few very common phrasal verbs and expressions
    - Text should be suitable for elementary learners
    - CEFR A2 (Waystage) level content
  `,
  B1: `
    - Use moderate vocabulary (around 2000-2500 words)
    - Include a mix of simple and some complex sentences with various tenses
    - Average sentence length should be 10-15 words
    - Include some common idiomatic expressions (1-2 per paragraph)
    - Cover somewhat abstract topics but with clear explanations
    - Use some conditional structures and modals
    - Text should be suitable for intermediate learners
    - CEFR B1 (Threshold) level content
  `,
  B2: `
    - Use broader vocabulary (around 3500-4000 words)
    - Include complex sentences with various clause types
    - Average sentence length can be 15-20 words
    - Include a variety of tenses including perfect and continuous forms
    - Use several idiomatic expressions (2-3 per paragraph)
    - Include passive constructions and more complex conditionals
    - Text should be suitable for upper-intermediate learners
    - CEFR B2 (Vantage) level content
  `,
  C1: `
    - Use sophisticated vocabulary (around 5000-6000 words)
    - Include complex sentence structures with multiple clauses
    - No restrictions on sentence length but maintain readability
    - Include advanced grammatical structures (perfect modals, inversions)
    - Use various idiomatic expressions and colloquialisms naturally
    - Include nuanced opinions and hypothetical situations
    - Text should be suitable for advanced learners
    - CEFR C1 (Effective Operational Proficiency) level content
  `,
  C2: `
    - Use extensive vocabulary including specialized terms (8000+ words)
    - Include all grammatical structures including rare or literary forms
    - Use sophisticated rhetoric, metaphors, and cultural references
    - Include subtle humor, irony, and complex argumentation
    - No simplification of language or concepts
    - Text should be indistinguishable from content for educated native speakers
    - CEFR C2 (Mastery) level content
  `,
};

// Clean up function for the activeGenerations map
function cleanupActiveGenerations() {
  const now = Date.now();
  for (const [key, startTime] of Array.from(activeGenerations.entries())) {
    // Remove entries older than 5 minutes
    if (now - startTime > 5 * 60 * 1000) {
      activeGenerations.delete(key);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupActiveGenerations, 60 * 1000);

// Main API handler
export async function POST(req: NextRequest) {
  const generationKey = crypto.randomUUID();

  try {
    // Authentication check
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request data with validation
    const body = await req.json();
    let { level, topic, targetLength, questionTypes, questionCount = 5 } = body;

    // Validate required fields
    if (!level || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: level or topic" },
        { status: 400 }
      );
    }

    // Normalize targetLength if present, otherwise default to "medium"
    if (targetLength === undefined || targetLength === null) {
      targetLength = "medium";
    }

    // Validate level is a valid CEFR level
    if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(level)) {
      return NextResponse.json(
        { error: "Invalid CEFR level. Must be one of: A1, A2, B1, B2, C1, C2" },
        { status: 400 }
      );
    }

    // Create a cache key based on request parameters
    const cacheKey = `reading_gen_${level}_${topic}_${targetLength}_${questionCount}`;

    // Check cache first
    const cachedResponse = getCachedItem(cacheKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    // Check if there's already a similar request in progress
    const requestKey = `${level}_${topic}_${targetLength}`;
    if (activeGenerations.has(requestKey)) {
      return NextResponse.json(
        {
          error: "A similar generation request is already in progress",
          retryAfter: 15,
        },
        { status: 429 }
      );
    }

    // Mark request as in progress
    activeGenerations.set(requestKey, Date.now());

    // Get level instructions
    const instructions =
      levelInstructions[level as Level] || levelInstructions.B1;

    try {
      // Step 1: Generate the reading content first
      const contentData = await generateContent(
        level,
        topic,
        targetLength,
        instructions
      );

      // If content generation fails, return early
      if (!contentData) {
        activeGenerations.delete(requestKey);
        return NextResponse.json(
          { error: "Failed to generate reading content" },
          { status: 500 }
        );
      }

      // Step 2: Generate vocabulary, grammar, and questions in parallel
      // Limit requested question count
      const limitedQuestionCount = Math.min(10, Math.max(1, questionCount));

      // Use Promise.allSettled to continue even if some parts fail
      const [vocabularyResult, grammarResult, questionsResult] =
        await Promise.allSettled([
          generateVocabulary(contentData.content, level),
          generateGrammar(contentData.content, level),
          generateQuestions(
            contentData.content,
            level,
            questionTypes,
            limitedQuestionCount
          ),
        ]);

      // Extract results with fallbacks
      const vocabularyData =
        vocabularyResult.status === "fulfilled" ? vocabularyResult.value : [];

      const grammarData =
        grammarResult.status === "fulfilled" ? grammarResult.value : [];

      const questionsData =
        questionsResult.status === "fulfilled"
          ? questionsResult.value
          : generateDefaultQuestions(limitedQuestionCount);

      // Create the unified response
      const response: UnifiedResponse = {
        content: contentData,
        vocabulary: vocabularyData,
        grammar: grammarData,
        questions: questionsData,
      };

      // Cache the response for future use (valid for 24 hours)
      setCacheItem(cacheKey, response);

      // Remove from active generations
      activeGenerations.delete(requestKey);

      // Return the unified response
      return NextResponse.json(response);
    } catch (innerError) {
      // Remove from active generations in case of error
      activeGenerations.delete(requestKey);
      throw innerError; // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    return handleApiError(error, "Error in unified reading generation");
  }
}

// Function to generate content
async function generateContent(
  level: string,
  topic: string,
  targetLength: string | number,
  instructions: string
): Promise<ContentResponse | null> {
  try {
    // Define standardized length categories and multipliers
    const wordCountMultiplier: Record<string, number> = {
      short: 0.6,
      medium: 1.0,
      long: 1.5,
    };

    // Base word counts by level - these are calibrated to produce reasonable lengths
    const baseWordCounts: Record<string, number> = {
      A1: 150,
      A2: 200,
      B1: 250,
      B2: 300,
      C1: 400,
      C2: 500,
    };

    // Normalize the targetLength parameter to a standard string value
    let lengthCategory: string;

    if (typeof targetLength === "string") {
      // Convert to lowercase for case-insensitive matching
      const normalizedLength = targetLength.toLowerCase();
      // Check if it's one of our predefined categories
      if (["short", "medium", "long"].includes(normalizedLength)) {
        lengthCategory = normalizedLength;
      } else {
        // Default to medium if string is invalid
        console.warn(
          `Invalid targetLength string: "${targetLength}". Using "medium" instead.`
        );
        lengthCategory = "medium";
      }
    } else if (typeof targetLength === "number") {
      // For backward compatibility - normalize numeric values to categories
      if (targetLength <= 150) {
        lengthCategory = "short";
      } else if (targetLength <= 300) {
        lengthCategory = "medium";
      } else {
        lengthCategory = "long";
      }
    } else {
      // Default fallback
      lengthCategory = "medium";
    }

    // Get the base count for this level or use default
    const baseCount = baseWordCounts[level] || baseWordCounts.B1;

    // Apply the multiplier
    const multiplier = wordCountMultiplier[lengthCategory] || 1.0;

    // Calculate final target word count
    const targetWordCount = Math.round(baseCount * multiplier);

    // Log for debugging
    console.debug(
      `Generating ${level} ${lengthCategory} article: targeting ${targetWordCount} words`
    );

    // Create a prompt for OpenAI with strict word count emphasis
    const prompt = `
      Create an engaging ${level} level (CEFR) reading passage about "${topic}".
      
      IMPORTANT: The text MUST be EXACTLY ${targetWordCount} words (±10%). This is critical.
      
      Response format:
      1. Title: An engaging, concise title
      2. Content: The reading passage text
      
      Content guidelines:
      ${instructions}
      
      Length requirements:
      - The passage MUST be ${targetWordCount} words (±10%)
      - Count the words carefully before submitting
      - Do NOT go over or under this limit by more than 10%
      
      Additional requirements:
      - Include a clear beginning, middle, and end
      - Make it interesting and relevant to the topic
      - If appropriate, include dialogue with proper formatting
      - Do not include any meta information, just the title and content
      
      Remember this is for language learning, so the content should be rich but accessible for ${level} level students.
    `.trim();

    // Generate content with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert language educator who creates engaging, level-appropriate reading materials for language learners. You always follow word count instructions EXACTLY.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the response content
    const generatedText = response.choices[0].message.content || "";

    // Parse the response to extract title and content
    let title = "";
    let content = "";

    // Common title patterns in the response
    const titlePattern = /^(?:Title:|#)\s*(.+?)(?:\n|$)/m;
    const titleMatch = generatedText.match(titlePattern);

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      // Remove the title line from the content
      content = generatedText.replace(titlePattern, "").trim();
    } else {
      // If no title pattern found, use the first line as title
      const lines = generatedText.trim().split("\n");
      title = lines[0].replace(/^#\s*/, "").trim();
      content = lines.slice(1).join("\n").trim();
    }

    // Calculate actual word count
    const actualWordCount = content.split(/\s+/).filter(Boolean).length;

    // Create analysis metadata
    const metadata = {
      cefr_level: level,
      complexity: getReadingComplexityScore(level),
      topicRelevance: 10, // Default to maximum (could be improved with analysis)
      grammarPatterns: [], // Will be filled in by grammar generation
      estimatedVocabularySize: estimateVocabSize(level),
      wordCount: targetWordCount,
      actualWordCount,
      lengthCategory,
    };

    return {
      title,
      content,
      metadata,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

// Estimate vocabulary size based on CEFR level
function estimateVocabSize(level: string): number {
  const vocabSizes = {
    A1: 800,
    A2: 1500,
    B1: 2500,
    B2: 4000,
    C1: 6000,
    C2: 8000,
  };

  return vocabSizes[level as keyof typeof vocabSizes] || 2500;
}

// Function to generate vocabulary
async function generateVocabulary(
  content: string,
  level: string
): Promise<VocabularyItem[]> {
  try {
    const prompt = `Extract important vocabulary words from the following text that would be helpful for CEFR ${level} level English learners.

Text:
${content}

For each word, provide:
1. The word itself
2. A clear definition suitable for CEFR ${level} level learners
3. The context (sentence or phrase) where it appears in the text
4. 2-3 example sentences showing how to use the word
5. A difficulty rating (1-10)

Format your response as a JSON object with an array of vocabulary items:
{
  "vocabulary": [
    {
      "word": "vocabulary word",
      "definition": "clear definition",
      "context": "sentence from the text containing the word",
      "examples": ["example sentence 1", "example sentence 2"],
      "difficulty": 5
    },
    ...more words...
  ]
}

Guidelines for different CEFR levels:
- A1: Focus on the most basic concrete everyday words (200-500 word range)
- A2: Focus on common everyday expressions and very basic phrases (500-1000 word range)
- B1: Include common vocabulary related to familiar matters (1000-2000 word range)
- B2: Include more abstract vocabulary and idioms (3000-4000 word range)
- C1: Include sophisticated vocabulary, idioms, and colloquialisms (5000-6000 word range)
- C2: Include rare vocabulary, nuanced meanings, and specialized terms (8000+ word range)

IMPORTANT: Select approximately 10-15 words that are level-appropriate for CEFR ${level} learners.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an expert language teacher specializing in vocabulary instruction. Always respond with valid JSON that includes a "vocabulary" array.',
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");

    if (!response.vocabulary || !Array.isArray(response.vocabulary)) {
      // Return default vocabulary if response is invalid
      return [
        {
          word: "example",
          definition: "a representative sample of something",
          context: "This is an example sentence.",
          examples: ["This word is an example of a vocabulary item."],
          difficulty: 3,
        },
      ];
    }

    return response.vocabulary;
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    // Return default vocabulary on error
    return [
      {
        word: "example",
        definition: "a representative sample of something",
        context: "This is an example sentence.",
        examples: ["This word is an example of a vocabulary item."],
        difficulty: 3,
      },
    ];
  }
}

// Function to generate grammar patterns
async function generateGrammar(
  content: string,
  level: string
): Promise<GrammarPattern[]> {
  try {
    const prompt = `Analyze the grammar patterns in this text that would be relevant for CEFR ${level} level English learners.

Text:
${content}

Identify 3-5 important grammar patterns used in the text that are appropriate for CEFR ${level} level learners. For each pattern:
1. Name the grammar pattern
2. Provide a clear explanation of how it works
3. Extract 2-3 examples from the text that demonstrate this pattern

Format your response as a JSON object:
{
  "patterns": [
    {
      "pattern": "Present Perfect Tense",
      "explanation": "Used to describe past actions with present relevance or continuing situations",
      "examples": ["She has lived in Paris for ten years.", "They have never visited the museum."]
    },
    ...more patterns...
  ]
}

Guidelines for different CEFR levels:
- A1: Focus on basic present simple, common singular/plural forms, basic word order
- A2: Include present/past simple, basic future forms, simple connectors
- B1: Include present/past perfect, conditionals (types 0,1), modals, relative clauses
- B2: Include passive voice, reported speech, conditionals (types 2,3), more complex clauses
- C1: Include complex tense relationships, subjunctives, inversion, cleft sentences
- C2: Include highly complex grammatical structures, nuanced use of modals, specialized forms

IMPORTANT: Select grammar patterns that match the CEFR ${level} level - not too simple or too complex for the target learners.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an expert language teacher who specializes in grammar instruction and analysis. Always respond with valid JSON that includes a "patterns" array.',
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");

    if (!response.patterns || !Array.isArray(response.patterns)) {
      // Return default grammar patterns if response is invalid
      return [
        {
          pattern: "Simple Present Tense",
          explanation:
            "Used to describe habits, general truths, and current states",
          examples: [
            "Water boils at 100 degrees Celsius.",
            "She works in a bank.",
          ],
        },
      ];
    }

    return response.patterns;
  } catch (error) {
    console.error("Error generating grammar patterns:", error);
    // Return default grammar patterns on error
    return [
      {
        pattern: "Simple Present Tense",
        explanation:
          "Used to describe habits, general truths, and current states",
        examples: [
          "Water boils at 100 degrees Celsius.",
          "She works in a bank.",
        ],
      },
    ];
  }
}

// Function to generate questions
async function generateQuestions(
  content: string,
  level: string,
  questionTypes: any[] | undefined,
  questionCount: number
): Promise<Question[]> {
  try {
    // Generate question types text
    let questionTypeText = "";
    if (questionTypes && Array.isArray(questionTypes)) {
      const typeNames = questionTypes.map(t => {
        const typeName =
          t.type === "multiple-choice"
            ? "multiple-choice question"
            : t.type === "true-false"
              ? "true/false question"
              : t.type === "fill-blank"
                ? 'fill-in-the-blank question (use type "fill-blank")'
                : "question";

        return `- ${t.count || 1} ${typeName}${t.count > 1 ? "s" : ""}`;
      });

      if (typeNames.length > 0) {
        questionTypeText = `Include the following question types:\n${typeNames.join("\n")}\n\n`;
      }
    }

    const prompt = `Generate ${questionCount} reading comprehension questions for the following text.
The questions should be appropriate for CEFR ${level} level English learners.

${questionTypeText}
Text:
${content}

Each question should have:
- A clear question that tests understanding of the text
- Four answer options (A, B, C, D) for multiple-choice questions
- One correct answer (ALWAYS specify as "A", "B", "C", or "D" for multiple-choice and "A" for True or "B" for False)
- A brief explanation of why the answer is correct

Your response MUST be a valid JSON object with the following structure:
{
  "questions": [
    {
      "id": "1",
      "type": "multiple-choice",
      "question": "Question text here",
      "options": [
        {"id": "A", "text": "Option A text"},
        {"id": "B", "text": "Option B text"},
        {"id": "C", "text": "Option C text"},
        {"id": "D", "text": "Option D text"}
      ],
      "correctAnswer": "A",
      "explanation": "Explanation why A is correct"
    },
    {
      "id": "2",
      "type": "true-false",
      "question": "True/false question here",
      "options": [
        {"id": "A", "text": "True"},
        {"id": "B", "text": "False"}
      ],
      "correctAnswer": "A",
      "explanation": "Explanation why True is correct"
    }
  ]
}

IMPORTANT: 
1. The ONLY valid question types are: "multiple-choice", "true-false", and "fill-blank"
2. For multiple-choice, ALWAYS use options with IDs "A", "B", "C", "D"
3. For true-false, ALWAYS use "A" for True and "B" for False
4. ALWAYS specify correctAnswer as the LETTER (A, B, C, or D) not the text content
5. Generate exactly ${questionCount} questions, no more and no less
6. Ensure all questions are different - do not repeat the same question
7. Make sure questions test different aspects of the text

Make sure all questions refer specifically to information in the text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an expert language teacher specializing in creating reading comprehension questions. Always respond with valid JSON that includes a "questions" array with EXACTLY the number of questions requested, no more and no less.',
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");

    if (!response.questions || !Array.isArray(response.questions)) {
      // Return default questions if response is invalid
      return generateDefaultQuestions(questionCount);
    }

    // Limit to requested number and ensure proper formatting
    let validatedQuestions = response.questions
      .slice(0, questionCount)
      .map((question: any, index: number) => {
        // For true-false questions, ensure options are correctly formatted
        if (question.type === "true-false") {
          question.options = [
            { id: "A", text: "True" },
            { id: "B", text: "False" },
          ];
          // Normalize correctAnswer to A or B
          question.correctAnswer =
            question.correctAnswer.toLowerCase() === "true" ||
            question.correctAnswer === "A"
              ? "A"
              : "B";
        }

        // For multiple-choice, ensure IDs are A, B, C, D
        if (
          question.type === "multiple-choice" &&
          Array.isArray(question.options)
        ) {
          question.options = question.options.map(
            (opt: any, optIndex: number) => {
              const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
              return {
                id: letter,
                text:
                  typeof opt === "string"
                    ? opt
                    : opt.text || `Option ${letter}`,
              };
            }
          );

          // If correctAnswer isn't a letter (A-D), convert it to the corresponding letter
          if (!/^[A-D]$/i.test(question.correctAnswer)) {
            // Try to find by content match
            const optionIndex = question.options.findIndex(
              (opt: any) =>
                opt.text
                  .toLowerCase()
                  .includes(question.correctAnswer.toLowerCase()) ||
                question.correctAnswer
                  .toLowerCase()
                  .includes(opt.text.toLowerCase())
            );

            if (optionIndex !== -1) {
              question.correctAnswer = question.options[optionIndex].id;
            } else {
              // Default to A if no match found
              question.correctAnswer = "A";
            }
          }

          // Ensure correctAnswer is uppercase
          question.correctAnswer = question.correctAnswer.toUpperCase();
        }

        return {
          id: String(index + 1),
          type: question.type,
          question: question.question,
          options: question.options || [],
          correctAnswer: question.correctAnswer,
          explanation:
            question.explanation ||
            "This is the correct answer based on the text.",
        };
      });

    // Add default questions if we don't have enough
    if (validatedQuestions.length < questionCount) {
      const defaultQuestions = generateDefaultQuestions(
        questionCount - validatedQuestions.length
      );
      validatedQuestions = [...validatedQuestions, ...defaultQuestions];
    }

    return validatedQuestions;
  } catch (error) {
    console.error("Error generating questions:", error);
    // Return default questions on error
    return generateDefaultQuestions(questionCount);
  }
}

// Helper function to generate default questions if needed
function generateDefaultQuestions(count: number): Question[] {
  const questions: Question[] = [];

  const defaultQuestions = [
    "What is the main idea of this passage?",
    "What can be inferred from the passage?",
    "According to the text, which statement is accurate?",
    "What is the primary purpose of this text?",
    "What conclusion can be drawn from the passage?",
    "Which of the following best summarizes the text?",
    "What point is the author trying to make?",
    "How does the author develop the main argument?",
    "What evidence does the author provide to support the main claim?",
    "What would be an appropriate title for this passage?",
  ];

  for (let i = 0; i < count; i++) {
    const questionText = defaultQuestions[i % defaultQuestions.length];

    questions.push({
      id: String(i + 1),
      type: "multiple-choice",
      question: questionText,
      options: [
        {
          id: "A",
          text: "Option A - likely the correct answer based on context",
        },
        { id: "B", text: "Option B - a plausible but incorrect choice" },
        { id: "C", text: "Option C - an obviously wrong choice" },
        {
          id: "D",
          text: "Option D - a distracting option that seems possible",
        },
      ],
      correctAnswer: "A",
      explanation:
        "This is the most reasonable answer based on the information provided in the text.",
    });
  }

  return questions;
}
