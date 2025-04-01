import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    type: 'multiple-choice' | 'true-false' | 'fill-blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    timestamp: number;
  }>
> {
  try {
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

    // Generate questions using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert language assessment creator specializing in ${level} level listening comprehension questions. Create questions that test different aspects of understanding including main ideas, specific details, inferences, and vocabulary in context. Your response should be in valid JSON format that can be parsed.`,
        },
        {
          role: 'user',
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
      response_format: { type: 'json_object' },
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
      console.error('Error parsing questions JSON:', parseError);
      return [];
    }

    // Validate and assign IDs to each question
    return questions.map((question: any) => {
      // Add more debug information
      console.log(
        'Processing question from API:',
        JSON.stringify({
          raw_type: question.type,
          normalized_type: validateQuestionType(question.type),
          has_options: !!question.options,
          option_count: question.options?.length,
        })
      );

      return {
        id: uuidv4(),
        type: validateQuestionType(question.type),
        question: question.question,
        options:
          validateQuestionType(question.type) === 'multiple-choice'
            ? question.options || ['Option 1', 'Option 2', 'Option 3']
            : undefined,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || 'No explanation provided',
        timestamp: question.timestamp || 0,
      };
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}

/**
 * Validate and normalize question type
 * @param type The question type from the API
 * @returns Normalized question type
 */
function validateQuestionType(
  type: string
): 'multiple-choice' | 'true-false' | 'fill-blank' {
  const normalizedType = type.toLowerCase().trim();

  if (
    normalizedType === 'multiple-choice' ||
    normalizedType === 'multiple choice' ||
    normalizedType === 'multiplechoice'
  ) {
    return 'multiple-choice';
  }

  if (
    normalizedType === 'true-false' ||
    normalizedType === 'true/false' ||
    normalizedType === 'truefalse'
  ) {
    return 'true-false';
  }

  if (
    normalizedType === 'fill-blank' ||
    normalizedType === 'fill-in-the-blank' ||
    normalizedType === 'fillblank' ||
    normalizedType === 'fill in the blank'
  ) {
    return 'fill-blank';
  }

  // Default to multiple-choice if unrecognized
  return 'multiple-choice';
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

    // Create a normalized version of the transcript for word validation
    const normalizedTranscript = transcript.toLowerCase();
    // Create a word list from the transcript
    const transcriptWords = new Set(
      normalizedTranscript
        .replace(/[^\w\s']|_/g, ' ') // Remove punctuation except apostrophes
        .split(/\s+/)
        .map(word => word.toLowerCase().trim())
        .filter(word => word.length > 2) // Keep words longer than 2 chars
    );

    console.log(`Transcript contains ${transcriptWords.size} unique words`);

    // Generate vocabulary items using OpenAI with a more explicit prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert language teacher specializing in vocabulary acquisition for ${level} level learners. Your task is to extract vocabulary items that appear EXACTLY in the transcript provided.`,
        },
        {
          role: 'user',
          content: `Extract ${vocabCount} vocabulary items from this transcript that would be valuable for ${level} level English learners. 

VERY IMPORTANT: You MUST ONLY select words or short phrases that appear EXACTLY in the transcript - do not invent, modify, or suggest words that are not present in the exact transcript text.

Focus on words that are:
- Actually present in the transcript (this is the most important criterion)
- Appropriate for ${level} level
- Useful in everyday contexts
- Representative of different parts of speech
- Include some challenging but attainable words

For each vocabulary item, provide:
- word: The vocabulary word or phrase EXACTLY as it appears in the transcript
- definition: A clear, concise definition suitable for ${level} level
- context: The EXACT sentence from the transcript containing the word
- examples: 2 additional example sentences using the word
- difficulty: A number from 1-10 indicating difficulty (relative to the ${level} level)
- timestamp: Approximate position in the text (as a word count from the beginning)

Return the data as a valid JSON object with a 'vocabulary' array containing the vocabulary items.

Transcript:
${transcript}`,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    let vocabulary = [];
    try {
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.vocabulary)) {
          vocabulary = parsed.vocabulary;
        } else if (parsed && Array.isArray(parsed)) {
          vocabulary = parsed;
        } else {
          // Try to find any array in the response
          const possibleArrays = Object.values(parsed).filter(
            (value: unknown) => Array.isArray(value) && value.length > 0
          ) as any[][];

          if (possibleArrays.length > 0) {
            // Use the first array found
            vocabulary = possibleArrays[0];
          } else {
            console.warn(
              'No vocabulary array found in response, using empty array'
            );
            vocabulary = [];
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing vocabulary JSON:', parseError);
      return [];
    }

    // Ensure vocabulary is an array before mapping
    if (!Array.isArray(vocabulary)) {
      console.warn('Vocabulary is not an array, returning empty array');
      return [];
    }

    // Validate each vocabulary item and ensure the word is in the transcript
    const validatedVocabulary = vocabulary
      .map((item: any) => {
        const word = item.word || '';
        const normalizedWord = word.toLowerCase().trim();

        // Check if word appears in transcript
        const wordAppears = normalizedTranscript.includes(normalizedWord);

        console.log(
          `Vocabulary word "${word}" ${wordAppears ? 'found' : 'NOT FOUND'} in transcript`
        );

        // Only include words that actually appear in the transcript
        if (!wordAppears) {
          return null;
        }

        return {
          word: word,
          definition: item.definition || '',
          context: item.context || '',
          examples: Array.isArray(item.examples) ? item.examples : [],
          difficulty: Number(item.difficulty) || 5,
          timestamp: item.timestamp || 0,
        };
      })
      .filter(
        (
          item
        ): item is {
          word: string;
          definition: string;
          context: string;
          examples: string[];
          difficulty: number;
          timestamp: number;
        } => item !== null
      ); // Remove null items

    console.log(
      `Validated ${validatedVocabulary.length} vocabulary items from ${vocabulary.length} suggested`
    );

    return validatedVocabulary;
  } catch (error) {
    console.error('Error extracting vocabulary:', error);
    return [];
  }
}
