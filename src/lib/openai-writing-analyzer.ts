import { OpenAI } from "openai";

import { IWritingPrompt } from "@/models/WritingPrompt";

// Define interfaces for analysis results
interface AnalysisScores {
  grammar: number;
  vocabulary: number;
  coherence: number;
  style: number;
  overall: number;
}

interface GrammarIssue {
  type: string;
  context: string;
  suggestion: string;
  explanation: string;
}

interface VocabularySuggestion {
  original: string;
  alternatives: string[];
  context?: string;
}

interface VocabularyAnalysis {
  uniqueWords: number;
  wordFrequency: { word: string; count: number; category: string }[];
  suggestions: VocabularySuggestion[];
  level: string;
  strengths: string[];
  improvements: string[];
}

interface EnhancedFeedback {
  overallAssessment: string;
  assessment?: string; // For backward compatibility
  scoreBreakdown: {
    grammar: string;
    vocabulary: string;
    coherence: string;
    style: string;
    overall: string;
  };
  strengths: string[];
  areasForImprovement: string[];
  suggestionsForImprovement: string[];
  suggestions?: string[]; // For backward compatibility
  improvements: string[]; // For backward compatibility
  detailedAnalysis?: string;
  nextSteps?: string;
}

interface SubmissionAnalysis {
  scores: AnalysisScores;
  feedback: EnhancedFeedback;
  grammarIssues: GrammarIssue[];
  vocabularyAnalysis: VocabularyAnalysis;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  styleScore: number;
  overallScore: number;
}

export class OpenAIWritingAnalyzer {
  private openai: OpenAI;

  constructor() {
    // Initialize the OpenAI client with configuration
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 55000, // 55 seconds timeout (just under the 60 second Vercel function limit)
      maxRetries: 3, // Increase retry attempts to 3
    });
  }

  /**
   * Analyzes a writing submission using OpenAI
   * @param params Object containing content, prompt, and level
   * @returns Analysis results including scores, feedback, and issues
   */
  async analyzeSubmission(params: {
    content: string;
    prompt: IWritingPrompt;
    level: string;
  }): Promise<SubmissionAnalysis> {
    const { content, prompt, level } = params;

    // Calculate word count (we'll do this locally to save tokens)
    const wordCount = this.countWords(content);

    // Check if the submission meets the minimum length requirement
    const meetsLengthRequirement =
      wordCount >= prompt.suggestedLength.min &&
      wordCount <= prompt.suggestedLength.max;

    // Define our structured prompt for OpenAI with the simplified approach
    const systemPrompt = `You are an expert language teacher providing constructive writing feedback to a language learner.
Focus on helping the learner improve their writing. The writer's proficiency level is: ${level}.

Analyze the writing and return a detailed analysis structured EXACTLY as a valid JSON object with the following format:
{
  "scores": {
    "grammar": <score from 0-100>,
    "vocabulary": <score from 0-100>,
    "coherence": <score from 0-100>,
    "style": <score from 0-100>,
    "overall": <score from 0-100>
  },
  "feedback": {
    "overallAssessment": "<2-3 sentence overall assessment>",
    "scoreBreakdown": {
      "grammar": "<detailed explanation of grammar score with specific observations>",
      "vocabulary": "<detailed explanation of vocabulary score with specific observations>",
      "coherence": "<detailed explanation of coherence score with specific observations>",
      "style": "<detailed explanation of style score with specific observations>",
      "overall": "<detailed explanation of overall score summarizing key points>"
    },
    "strengths": [
      "Grammar strength: <specific strength related to grammar with examples from the text>",
      "Grammar strength: <another specific grammar strength with examples>",
      "Vocabulary strength: <specific strength related to vocabulary with examples from the text>", 
      "Vocabulary strength: <another specific vocabulary strength with examples>",
      "Structure strength: <specific strength related to organization or coherence with examples>",
      "Structure strength: <another specific strength about organization with examples>",
      "Content strength: <specific strength related to content quality with examples>",
      "Content strength: <another specific content strength with examples>"
    ],
    "areasForImprovement": [
      "Grammar improvement: <specific area to improve in grammar with examples from the text>",
      "Grammar improvement: <another specific grammar issue to improve with examples>",
      "Vocabulary improvement: <specific area to improve in vocabulary with examples from the text>",
      "Vocabulary improvement: <another specific vocabulary issue to improve with examples>",
      "Structure improvement: <specific area to improve in organization or coherence with examples>",
      "Structure improvement: <another specific organization issue to improve with examples>",
      "Content improvement: <specific area to improve in content quality with examples>",
      "Content improvement: <another specific content issue to improve with examples>"
    ],
    "suggestionsForImprovement": [
      "To enhance vocabulary: <detailed, actionable suggestion for vocabulary improvement with specific words to use>",
      "To enhance vocabulary: <another actionable vocabulary suggestion with specific examples>",
      "To strengthen structure: <detailed, actionable suggestion for organization improvement with implementation example>",
      "To strengthen structure: <another actionable organization suggestion with example>",
      "To develop content: <detailed, actionable suggestion for content improvement with implementation example>",
      "To develop content: <another actionable content suggestion with example>"
    ],
    "improvements": [
      "Vocabulary: <specific, detailed improvement suggestion for vocabulary with example of word replacements>",
      "Vocabulary: <another detailed vocabulary improvement with example>",
      "Structure: <specific, detailed improvement suggestion for structure with example paragraph restructuring>",
      "Structure: <another detailed structure improvement with example>",
      "Content: <specific, detailed improvement suggestion for content with example addition or modification>",
      "Content: <another detailed content improvement with example>"
    ],
    "detailedAnalysis": "<comprehensive paragraph about the writing, connecting all aspects of the analysis>",
    "nextSteps": "<specific, prioritized action items for what the student should focus on next>"
  },
  "grammarIssues": [
    {
      "type": "<issue type: e.g. 'Subject-verb agreement', 'Tense error'>",
      "context": "<text containing the error>",
      "suggestion": "<corrected text>",
      "explanation": "<explanation of the grammar rule>"
    },
    ...
  ],
  "vocabularyAnalysis": {
    "uniqueWords": <number of unique words>,
    "level": "<vocabulary level assessment: Basic, Intermediate, Advanced>",
    "wordFrequency": [
      {
        "word": "<word>",
        "count": <number of occurrences>,
        "category": "<category: e.g. Basic, Academic, Advanced>"
      },
      ...
    ],
    "suggestions": [
      {
        "original": "<original word>",
        "alternatives": ["<alternative 1>", "<alternative 2>", ...],
        "context": "<text surrounding the word>"
      },
      ...
    ],
    "strengths": [
      "<detailed strength about vocabulary usage with specific examples from the text>",
      "<another detailed strength about vocabulary range with examples>",
      "<specific observation about effective word choices with examples>"
    ],
    "improvements": [
      "<detailed, specific way to improve vocabulary with exact examples of words to replace/add>",
      "<another detailed suggestion for enhancing word choice with examples>",
      "<specific recommendation for vocabulary development with implementation examples>"
    ]
  }
}

IMPORTANT: Be extremely thorough in finding ALL grammar errors, even minor ones. Do not overlook any errors, including:
- Spelling mistakes and typos
- Punctuation errors (commas, periods, semicolons, etc.)
- Subject-verb agreement issues
- Verb tense consistency problems
- Article usage (a/an/the)
- Preposition errors
- Run-on sentences and sentence fragments
- Word order problems
- Pronoun errors (agreement, clarity, etc.)
- Misused words and phrases
- Capitalization errors

For each error found, include a complete entry in the "grammarIssues" array with all relevant information.

IMPORTANT ABOUT FEEDBACK QUALITY:
- Each strength, improvement, and suggestion should be detailed, specific, and include examples from the text
- Avoid generic, single-sentence feedback that lacks specificity
- Reference specific sentences or passages from the text when providing feedback
- For vocabulary suggestions, provide specific alternative words that would improve the text
- For grammar improvements, explain both the error and the reasoning behind the correction
- Where appropriate, provide "before and after" examples to illustrate improvements

Make sure all arrays have at least 3-5 items for each category (grammar, vocabulary, structure, content). Do not leave any arrays empty as students need comprehensive feedback in every category.

Scoring guidelines:
- Grammar (0-100): Accuracy of grammar usage, with points off for each error based on severity
- Vocabulary (0-100): Richness and appropriateness of vocabulary for the stated level
- Coherence (0-100): Flow of ideas, use of transitions, logical organization
- Style (0-100): Effectiveness of style for the writing type, clarity, conciseness
- Overall (0-100): Holistic assessment based on all factors and writing requirements

Provide comprehensive and constructive feedback that helps the student improve.`;

    const userPrompt = `Here is the writing to analyze:

Writing type: ${prompt.type}
Topic: ${prompt.topic}
Target length: ${prompt.suggestedLength.min}-${prompt.suggestedLength.max} words (actual: ${wordCount} words)
Requirements: ${prompt.requirements ? prompt.requirements.join(", ") : "None specified"}

CONTENT:
${content}`;

    // Call OpenAI API with our prompts
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    // Parse the JSON response
    const analysisData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Ensure all required fields exist with fallbacks
    const processedData = this.ensureCompleteAnalysis(analysisData);

    // Return the analysis with the structure expected by the application
    return {
      scores: processedData.scores,
      feedback: processedData.feedback,
      grammarIssues: processedData.grammarIssues,
      vocabularyAnalysis: processedData.vocabularyAnalysis,
      grammarScore: processedData.scores.grammar,
      vocabularyScore: processedData.scores.vocabulary,
      coherenceScore: processedData.scores.coherence,
      styleScore: processedData.scores.style,
      overallScore: processedData.scores.overall,
    };
  }

  /**
   * Ensures all required fields exist in the analysis data with sensible defaults
   */
  private ensureCompleteAnalysis(data: any): any {
    // Ensure scores exist
    const scores = data.scores || {};
    const defaultScore = 70; // Default score if missing

    const processedScores = {
      grammar: scores.grammar || defaultScore,
      vocabulary: scores.vocabulary || defaultScore,
      coherence: scores.coherence || defaultScore,
      style: scores.style || defaultScore,
      overall: scores.overall || defaultScore,
    };

    // Ensure feedback exists with all required fields
    const feedback = data.feedback || {};
    const processedFeedback = {
      overallAssessment:
        feedback.overallAssessment ||
        "This writing shows both strengths and areas for improvement.",
      assessment:
        feedback.overallAssessment ||
        "This writing shows both strengths and areas for improvement.",
      scoreBreakdown: feedback.scoreBreakdown || {
        grammar: "Grammar usage is satisfactory.",
        vocabulary: "Vocabulary usage is appropriate for the level.",
        coherence: "The writing has reasonable structure and flow.",
        style: "The writing style is adequate for the purpose.",
        overall:
          "Overall, this is a satisfactory piece of writing with room for improvement.",
      },
      strengths: this.ensureArrayWithPrefixes(feedback.strengths || [], [
        "Grammar strength",
        "Vocabulary strength",
        "Structure strength",
        "Content strength",
      ]),
      areasForImprovement: this.ensureArrayWithPrefixes(
        feedback.areasForImprovement || [],
        [
          "Grammar improvement",
          "Vocabulary improvement",
          "Structure improvement",
          "Content improvement",
        ]
      ),
      suggestionsForImprovement: this.ensureArrayWithPrefixes(
        feedback.suggestionsForImprovement || [],
        [
          "To enhance vocabulary",
          "To strengthen structure",
          "To develop content",
        ]
      ),
      improvements: this.ensureArrayWithPrefixes(feedback.improvements || [], [
        "Vocabulary:",
        "Structure:",
        "Content:",
      ]),
      suggestions: this.ensureArrayWithPrefixes(
        feedback.suggestionsForImprovement || [],
        [
          "To enhance vocabulary",
          "To strengthen structure",
          "To develop content",
        ]
      ),
      detailedAnalysis:
        feedback.detailedAnalysis ||
        "This writing demonstrates understanding of the topic with some areas that could be strengthened.",
      nextSteps:
        feedback.nextSteps ||
        "Focus on reviewing grammar rules and expanding vocabulary to improve your writing.",
    };

    // Ensure grammar issues exist
    const grammarIssues = data.grammarIssues || [];
    if (grammarIssues.length === 0) {
      // Add a placeholder if no issues found
      grammarIssues.push({
        type: "General feedback",
        context: "Your writing",
        suggestion:
          "Overall, your grammar is good with minor areas for improvement.",
        explanation:
          "Continue practicing grammar rules to further enhance your writing.",
      });
    }

    // Ensure vocabulary analysis exists with all required fields
    const vocabAnalysis = data.vocabularyAnalysis || {};
    const processedVocabAnalysis = {
      uniqueWords:
        vocabAnalysis.uniqueWords ||
        Math.floor(this.countWords(data.content || "") * 0.6),
      wordFrequency: vocabAnalysis.wordFrequency || [],
      suggestions: vocabAnalysis.suggestions || [],
      level: vocabAnalysis.level || "Intermediate",
      strengths: this.ensureNonEmptyArray(vocabAnalysis.strengths || [], [
        "You use a variety of vocabulary appropriate for your level.",
        "Your word choice effectively communicates your ideas.",
      ]),
      improvements: this.ensureNonEmptyArray(vocabAnalysis.improvements || [], [
        "Try incorporating more advanced vocabulary where appropriate.",
        "Consider using more specific and precise terms in your writing.",
      ]),
    };

    return {
      scores: processedScores,
      feedback: processedFeedback,
      grammarIssues: grammarIssues,
      vocabularyAnalysis: processedVocabAnalysis,
    };
  }

  /**
   * Ensures an array has at least a minimum number of items with prefixes
   */
  private ensureArrayWithPrefixes(
    array: string[],
    prefixes: string[]
  ): string[] {
    // If the array is empty or too short, create default items with prefixes
    if (array.length < prefixes.length) {
      const result = [...array]; // Copy existing items

      // For each missing prefix category, add a default item
      prefixes.forEach((prefix, index) => {
        // Check if we already have an item with this prefix
        const hasPrefix = result.some(item =>
          item.toLowerCase().startsWith(prefix.toLowerCase())
        );

        if (!hasPrefix) {
          // Add a default item with this prefix
          const defaults: { [key: string]: string } = {
            "Grammar strength":
              "You demonstrate understanding of basic grammar rules. For example, most of your sentences have correct subject-verb agreement and appropriate punctuation.",
            "Vocabulary strength":
              "You use vocabulary that is appropriate for your level. Your word choices effectively communicate your main ideas without relying too heavily on repetition.",
            "Structure strength":
              "Your writing has a logical structure with distinct paragraphs. You have organized your thoughts in a way that helps the reader follow your main points.",
            "Content strength":
              "You address the main topic in your writing with relevant ideas. You have included some supporting details that help develop your main points.",

            "Grammar improvement":
              "Pay closer attention to sentence structure and punctuation. For instance, some sentences would benefit from being split into shorter, clearer statements.",
            "Vocabulary improvement":
              "Try to incorporate more varied and precise vocabulary. Some words are repeated frequently, and using synonyms would make your writing more engaging.",
            "Structure improvement":
              'Work on stronger transitions between paragraphs. Adding linking phrases like "Furthermore," "In addition," or "On the other hand" would improve flow.',
            "Content improvement":
              "Develop your ideas with more specific examples and evidence. For instance, including statistics, quotations, or specific scenarios would strengthen your arguments.",

            "To enhance vocabulary":
              "Keep a vocabulary journal of new words you encounter in your reading. Try to incorporate at least 3-5 new words from this journal in each piece of writing you produce.",
            "To strengthen structure":
              "Create an outline before writing to organize your thoughts better. This would help you ensure each paragraph has a clear topic sentence and supporting details.",
            "To develop content":
              "Research your topic more thoroughly before writing and take notes on key facts and examples. This will give you more specific material to include in your essays.",

            "Vocabulary:":
              'Incorporate more academic terms relevant to your topic. Instead of using general words like "good" or "bad," try more precise terms like "beneficial," "advantageous," or "detrimental."',
            "Structure:":
              "Use clearer topic sentences at the beginning of each paragraph. For instance, your third paragraph begins with details before stating the main point, which can confuse readers.",
            "Content:":
              "Elaborate on your main ideas with more specific examples. In your discussion of environmental impacts, including specific statistics or case studies would strengthen your argument.",
          };

          result.push(
            defaults[prefix] ||
              `${prefix}: This area needs closer attention with specific examples.`
          );
        }
      });

      return result;
    }

    // Even if we have enough items, ensure there's at least one grammar improvement
    // specifically for the improvements array when it's being used for that purpose
    if (
      prefixes.includes("Vocabulary:") ||
      prefixes.includes("Structure:") ||
      prefixes.includes("Content:")
    ) {
      const hasGrammarItem = array.some(
        item =>
          item.toLowerCase().includes("grammar") ||
          item.toLowerCase().includes("spelling") ||
          item.toLowerCase().includes("punctuation") ||
          item.toLowerCase().includes("sentence") ||
          item.toLowerCase().startsWith("grammar:") ||
          item.toLowerCase().startsWith("grammar improvement")
      );

      if (!hasGrammarItem) {
        // Add a grammar improvement item
        array.push(
          "Grammar improvement: Pay attention to punctuation and sentence structure to enhance clarity and readability. Review your use of commas, periods, and other punctuation marks."
        );
      }
    }

    return array;
  }

  /**
   * Ensures an array has at least a minimum number of items
   */
  private ensureNonEmptyArray(array: string[], defaults: string[]): string[] {
    if (array.length === 0) {
      return defaults;
    }
    return array;
  }

  /**
   * Counts the number of words in a text
   * @param text The text to count words in
   * @returns Number of words
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}
