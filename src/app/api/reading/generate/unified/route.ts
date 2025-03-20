import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types Definition
type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
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
  };
}

interface UnifiedResponse {
  content: ContentResponse;
  vocabulary: VocabularyItem[];
  grammar: GrammarPattern[];
  questions: Question[];
}

// CEFR level-specific instructions
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

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request data
    const {
      level,
      topic,
      targetLength,
      questionTypes,
      questionCount = 5,
    } = await req.json();

    if (!level || !topic || !targetLength) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get level instructions
    const instructions =
      levelInstructions[level as Level] || levelInstructions.B1;

    // Step 1: Generate the reading content first
    console.log('Generating reading content...');
    const contentData = await generateContent(
      level,
      topic,
      targetLength,
      instructions
    );

    // If content generation fails, return early
    if (!contentData) {
      return NextResponse.json(
        { error: 'Failed to generate reading content' },
        { status: 500 }
      );
    }

    // Step 2: Generate vocabulary, grammar, and questions in parallel
    console.log('Generating vocabulary, grammar, and questions...');

    // Limit requested question count
    const limitedQuestionCount = Math.min(10, Math.max(1, questionCount));

    const [vocabularyData, grammarData, questionsData] = await Promise.all([
      generateVocabulary(contentData.content, level),
      generateGrammar(contentData.content, level),
      generateQuestions(
        contentData.content,
        level,
        questionTypes,
        limitedQuestionCount
      ),
    ]);

    // Return the unified response
    return NextResponse.json({
      content: contentData,
      vocabulary: vocabularyData,
      grammar: grammarData,
      questions: questionsData,
    } as UnifiedResponse);
  } catch (error) {
    console.error('Error in unified reading generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate reading session content' },
      { status: 500 }
    );
  }
}

// Function to generate content
async function generateContent(
  level: string,
  topic: string,
  targetLength: number,
  instructions: string
): Promise<ContentResponse | null> {
  try {
    // Define word count range based on target length
    let minWords: number;
    let maxWords: number;

    if (targetLength === 150) {
      // Short
      minWords = 100;
      maxWords = 150;
    } else if (targetLength === 200) {
      // Medium
      minWords = 150;
      maxWords = 200;
    } else if (targetLength === 300) {
      // Long
      minWords = 250;
      maxWords = 300;
    } else if (targetLength === 400) {
      // Very Long
      minWords = 300;
      maxWords = 400;
    } else {
      // Default fallback
      minWords = Math.floor(targetLength * 0.8);
      maxWords = targetLength;
    }

    // Create the prompt
    const prompt = `Generate an engaging reading passage about ${topic}.

IMPORTANT: Generate text between ${minWords} and ${maxWords} words. The content MUST be within this word count range.

IMPORTANT: This content MUST strictly conform to CEFR ${level} language level specifications.

${instructions}

Target length: ${minWords}-${maxWords} words. DO NOT end the passage until you've reached at least ${minWords} words.

The passage should be informative, engaging, and suitable for language learners at EXACTLY the CEFR ${level} level.
Include a title for the passage.

Format the response as a VALID JSON object with:
{
  "title": "The title of the passage",
  "content": "The main text content which must be between ${minWords} and ${maxWords} words",
  "metadata": {
    "cefr_level": "${level}",
    "complexity": 7, // A number from 1-10 indicating text complexity
    "topicRelevance": 9, // A number from 1-10 indicating how well it matches the requested topic
    "grammarPatterns": ["Present Simple", "Past Simple", "Comparative Adjectives"], // List of main grammar patterns used
    "estimatedVocabularySize": "Approximate number of unique words required to understand this text",
    "wordCount": 180 // The actual number of words in your generated text (count them!)
  }
}`;

    // Get model response
    const model =
      process.env.USE_GPT4_FOR_CONTENT === 'true' ? 'gpt-4o' : 'gpt-3.5-turbo';
    console.log(`Using model: ${model} for content generation`);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert language teacher who creates engaging reading passages for language learners. You are extremely precise about following length requirements.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    // Extract and validate response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from AI');
    }

    const response = JSON.parse(content) as ContentResponse;

    // Validate required fields
    if (!response.title || !response.content || !response.metadata) {
      throw new Error('Invalid content format received from AI');
    }

    // Calculate actual word count
    const actualWordCount = response.content
      .split(/\s+/)
      .filter(word => word.length > 0).length;
    response.metadata.actualWordCount = actualWordCount;

    return response;
  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert language teacher specializing in vocabulary instruction. Always respond with valid JSON that includes a "vocabulary" array.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    if (!response.vocabulary || !Array.isArray(response.vocabulary)) {
      // Return default vocabulary if response is invalid
      return [
        {
          word: 'example',
          definition: 'a representative sample of something',
          context: 'This is an example sentence.',
          examples: ['This word is an example of a vocabulary item.'],
          difficulty: 3,
        },
      ];
    }

    return response.vocabulary;
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    // Return default vocabulary on error
    return [
      {
        word: 'example',
        definition: 'a representative sample of something',
        context: 'This is an example sentence.',
        examples: ['This word is an example of a vocabulary item.'],
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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert language teacher who specializes in grammar instruction and analysis. Always respond with valid JSON that includes a "patterns" array.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    if (!response.patterns || !Array.isArray(response.patterns)) {
      // Return default grammar patterns if response is invalid
      return [
        {
          pattern: 'Simple Present Tense',
          explanation:
            'Used to describe habits, general truths, and current states',
          examples: [
            'Water boils at 100 degrees Celsius.',
            'She works in a bank.',
          ],
        },
      ];
    }

    return response.patterns;
  } catch (error) {
    console.error('Error generating grammar patterns:', error);
    // Return default grammar patterns on error
    return [
      {
        pattern: 'Simple Present Tense',
        explanation:
          'Used to describe habits, general truths, and current states',
        examples: [
          'Water boils at 100 degrees Celsius.',
          'She works in a bank.',
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
    let questionTypeText = '';
    if (questionTypes && Array.isArray(questionTypes)) {
      const typeNames = questionTypes.map(t => {
        const typeName =
          t.type === 'multiple-choice'
            ? 'multiple-choice question'
            : t.type === 'true-false'
              ? 'true/false question'
              : t.type === 'fill-blank'
                ? 'fill-in-the-blank question (use type "fill-blank")'
                : 'question';

        return `- ${t.count || 1} ${typeName}${t.count > 1 ? 's' : ''}`;
      });

      if (typeNames.length > 0) {
        questionTypeText = `Include the following question types:\n${typeNames.join('\n')}\n\n`;
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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert language teacher specializing in creating reading comprehension questions. Always respond with valid JSON that includes a "questions" array with EXACTLY the number of questions requested, no more and no less.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    if (!response.questions || !Array.isArray(response.questions)) {
      // Return default questions if response is invalid
      return generateDefaultQuestions(questionCount);
    }

    // Limit to requested number and ensure proper formatting
    let validatedQuestions = response.questions
      .slice(0, questionCount)
      .map((question: any, index: number) => {
        // For true-false questions, ensure options are correctly formatted
        if (question.type === 'true-false') {
          question.options = [
            { id: 'A', text: 'True' },
            { id: 'B', text: 'False' },
          ];
          // Normalize correctAnswer to A or B
          question.correctAnswer =
            question.correctAnswer.toLowerCase() === 'true' ||
            question.correctAnswer === 'A'
              ? 'A'
              : 'B';
        }

        // For multiple-choice, ensure IDs are A, B, C, D
        if (
          question.type === 'multiple-choice' &&
          Array.isArray(question.options)
        ) {
          question.options = question.options.map(
            (opt: any, optIndex: number) => {
              const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
              return {
                id: letter,
                text:
                  typeof opt === 'string'
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
              question.correctAnswer = 'A';
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
            'This is the correct answer based on the text.',
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
    console.error('Error generating questions:', error);
    // Return default questions on error
    return generateDefaultQuestions(questionCount);
  }
}

// Helper function to generate default questions if needed
function generateDefaultQuestions(count: number): Question[] {
  const questions: Question[] = [];

  const defaultQuestions = [
    'What is the main idea of this passage?',
    'What can be inferred from the passage?',
    'According to the text, which statement is accurate?',
    'What is the primary purpose of this text?',
    'What conclusion can be drawn from the passage?',
    'Which of the following best summarizes the text?',
    'What point is the author trying to make?',
    'How does the author develop the main argument?',
    'What evidence does the author provide to support the main claim?',
    'What would be an appropriate title for this passage?',
  ];

  for (let i = 0; i < count; i++) {
    const questionText = defaultQuestions[i % defaultQuestions.length];

    questions.push({
      id: String(i + 1),
      type: 'multiple-choice',
      question: questionText,
      options: [
        {
          id: 'A',
          text: 'Option A - likely the correct answer based on context',
        },
        { id: 'B', text: 'Option B - a plausible but incorrect choice' },
        { id: 'C', text: 'Option C - an obviously wrong choice' },
        {
          id: 'D',
          text: 'Option D - a distracting option that seems possible',
        },
      ],
      correctAnswer: 'A',
      explanation:
        'This is the most reasonable answer based on the information provided in the text.',
    });
  }

  return questions;
}
