import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import WritingSession, { IWritingSession } from '@/models/WritingSession';

interface WritingAnalysis {
  overallScore: number;
  summaryFeedback: string;
  lengthAssessment:
    | {
        assessment: string;
        feedback: string;
      }
    | string;
  strengths: string[];
  improvements: string[];
  details: {
    grammar: {
      score: number;
      errorList: Array<{
        type: string;
        context: string;
        suggestion: string;
        explanation: string;
      }>;
      suggestions: string[];
      strengths: string[];
      improvements: string[];
    };
    vocabulary: {
      score: number;
      level: string;
      strengths: string[];
      improvements: string[];
      wordFrequency: Array<{ word: string; count: number }>;
    };
    structure: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    content: {
      score: number;
      relevance: number;
      depth: number;
      strengths: string[];
      improvements: string[];
    };
  };
  timestamp: Date;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  styleScore: number;
  feedback?: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  grammarIssues?: Array<{
    type: string;
    context: string;
    suggestion: string;
    explanation: string;
  }>;
  vocabularyAnalysis?: {
    uniqueWords: number;
    complexityScore: number;
    suggestions: Array<{
      original: string;
      alternatives: string[];
      context: string;
    }>;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to analyze a writing session' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const writingSession = await WritingSession.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!writingSession) {
      return NextResponse.json(
        { error: 'Writing session not found' },
        { status: 404 }
      );
    }

    if (writingSession.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Writing session must be submitted before analysis' },
        { status: 400 }
      );
    }

    const analysis = await analyzeWriting(writingSession);

    writingSession.analysis = analysis;
    writingSession.status = 'analyzed';
    writingSession.analyzedAt = new Date();

    await writingSession.save();

    return NextResponse.json({
      success: true,
      session: writingSession,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Failed to analyze writing session' },
      { status: 500 }
    );
  }
}

async function analyzeWriting(
  writingSession: IWritingSession
): Promise<WritingAnalysis> {
  // Extract content and prompt information
  const { submission, prompt } = writingSession;
  const content = submission.content || '';
  const promptType = prompt.type;
  const promptTopic = prompt.topic;
  const targetLength = prompt.targetLength || 0;
  const actualLength = submission.finalVersion?.wordCount || 0;

  // Analyze the actual content instead of using generic feedback

  // Grammar and spelling analysis
  const grammarErrors = generateMockGrammarErrors(content);
  const grammarScore = calculateScoreBasedOnErrors(grammarErrors, content);

  // Determine grammar strengths and improvements based on actual content
  const grammarStrengths = determineGrammarStrengths(content, grammarErrors);
  const grammarImprovements = determineGrammarImprovements(
    content,
    grammarErrors
  );

  const grammarAnalysis = {
    score: grammarScore,
    errorList: grammarErrors,
    suggestions: generateGrammarSuggestions(grammarErrors),
    strengths: grammarStrengths,
    improvements: grammarImprovements,
  };

  // Vocabulary analysis
  const wordFrequency = generateWordFrequency(content);
  const uniqueWords = countUniqueWords(content);
  const vocabularyLevel = determineVocabularyLevel(content);
  const vocabularyScore = calculateVocabularyScore(content, vocabularyLevel);

  const vocabularyStrengths = determineVocabularyStrengths(
    content,
    wordFrequency
  );
  const vocabularyImprovements = determineVocabularyImprovements(
    content,
    vocabularyLevel
  );

  const vocabularyAnalysis = {
    score: vocabularyScore,
    level: vocabularyLevel,
    strengths: vocabularyStrengths,
    improvements: vocabularyImprovements,
    wordFrequency: wordFrequency,
  };

  // Structure analysis
  const paragraphs = content
    .split(/\n+/)
    .filter((p: string) => p.trim().length > 0);
  const hasIntroduction = paragraphs.length > 0;
  const hasConclusion = paragraphs.length > 2;
  const hasClearParagraphs = paragraphs.length >= 3;

  const structureScore = calculateStructureScore(paragraphs);
  const structureStrengths = determineStructureStrengths(paragraphs);
  const structureImprovements = determineStructureImprovements(paragraphs);

  const structureAnalysis = {
    score: structureScore,
    strengths: structureStrengths,
    improvements: structureImprovements,
  };

  // Content analysis
  const relevanceScore = calculateRelevanceScore(content, promptTopic);
  const depthScore = calculateDepthScore(content);
  const contentScore = Math.round((relevanceScore + depthScore) / 2);

  const contentStrengths = determineContentStrengths(content, promptTopic);
  const contentImprovements = determineContentImprovements(content, promptType);

  const contentAnalysis = {
    score: contentScore,
    relevance: relevanceScore,
    depth: depthScore,
    strengths: contentStrengths,
    improvements: contentImprovements,
  };

  // Overall feedback
  const overallScore = Math.round(
    (grammarAnalysis.score +
      vocabularyAnalysis.score +
      structureAnalysis.score +
      contentAnalysis.score) /
      4
  );

  const lengthAssessment = assessLength(actualLength, targetLength);

  // Generate strengths and areas for improvement based on the highest and lowest scores
  const strengths = [
    ...getRandomSubset(grammarAnalysis.strengths, 1),
    ...getRandomSubset(vocabularyAnalysis.strengths, 1),
    ...getRandomSubset(structureAnalysis.strengths, 1),
    ...getRandomSubset(contentAnalysis.strengths, 1),
  ];

  const improvements = [
    ...getRandomSubset(grammarAnalysis.improvements, 1),
    ...getRandomSubset(vocabularyAnalysis.improvements, 1),
    ...getRandomSubset(structureAnalysis.improvements, 1),
    ...getRandomSubset(contentAnalysis.improvements, 1),
  ];

  // Generate summary feedback based on writing type and actual content
  let summaryFeedback = '';
  switch (promptType.toLowerCase()) {
    case 'essay':
      summaryFeedback = `Your essay on "${promptTopic}" demonstrates ${overallScore > 85 ? 'strong' : overallScore > 75 ? 'good' : 'developing'} academic writing skills. ${getRandomStrength(strengths)}. To improve, ${getRandomImprovement(improvements)}.`;
      break;
    case 'letter':
      summaryFeedback = `Your letter regarding "${promptTopic}" is ${overallScore > 85 ? 'very well' : overallScore > 75 ? 'well' : 'adequately'} structured. ${getRandomStrength(strengths)}. To make your letter more effective, ${getRandomImprovement(improvements)}.`;
      break;
    case 'story':
      summaryFeedback = `Your story about "${promptTopic}" shows ${overallScore > 85 ? 'excellent' : overallScore > 75 ? 'good' : 'developing'} narrative skills. ${getRandomStrength(strengths)}. To enhance your storytelling, ${getRandomImprovement(improvements)}.`;
      break;
    case 'argument':
      summaryFeedback = `Your argument on "${promptTopic}" presents ${overallScore > 85 ? 'compelling' : overallScore > 75 ? 'reasonable' : 'basic'} points. ${getRandomStrength(strengths)}. To strengthen your argument, ${getRandomImprovement(improvements)}.`;
      break;
    default:
      summaryFeedback = `Your writing on "${promptTopic}" shows ${overallScore > 85 ? 'excellent' : overallScore > 75 ? 'good' : 'developing'} skills. ${getRandomStrength(strengths)}. To improve, ${getRandomImprovement(improvements)}.`;
  }

  // Create the analysis object with the structure expected by the feedback page
  return {
    // Fields for the feedback page
    overallScore,
    summaryFeedback,
    lengthAssessment,
    strengths,
    improvements,
    details: {
      grammar: grammarAnalysis,
      vocabulary: vocabularyAnalysis,
      structure: structureAnalysis,
      content: contentAnalysis,
    },
    timestamp: new Date(),

    // Fields for the WritingSession model
    grammarScore: grammarAnalysis.score,
    vocabularyScore: vocabularyAnalysis.score,
    coherenceScore: structureAnalysis.score,
    styleScore: contentAnalysis.score,
    feedback: {
      strengths,
      improvements,
      suggestions: grammarAnalysis.suggestions,
    },
    grammarIssues: grammarErrors,
    vocabularyAnalysis: {
      uniqueWords,
      complexityScore: vocabularyAnalysis.score,
      suggestions: vocabularyAnalysis.wordFrequency
        .map(item => ({
          original: item.word,
          alternatives: generateWordAlternatives(item.word),
          context: `Example context using the word "${item.word}" in a sentence from your text.`,
        }))
        .slice(0, 3),
    },
  } as WritingAnalysis;
}

// Helper functions for content-specific analysis

function calculateScoreBasedOnErrors(errors: any[], content: string): number {
  // Calculate score based on number of errors relative to content length
  const contentLength = content.length;
  const errorRatio = errors.length / (contentLength / 100); // Errors per 100 characters

  // Fewer errors = higher score
  const score = 100 - Math.min(errorRatio * 20, 30); // Max 30 point deduction for errors

  return Math.round(Math.max(70, Math.min(score, 100))); // Score between 70-100
}

function determineGrammarStrengths(content: string, errors: any[]): string[] {
  const strengths = [];

  // Check for few spelling errors
  if (errors.filter(e => e.type === 'spelling').length <= 1) {
    strengths.push('Few spelling errors');
  }

  // Check for good punctuation
  if (errors.filter(e => e.type === 'punctuation').length <= 1) {
    strengths.push('Good use of punctuation');
  }

  // Check for good subject-verb agreement
  if (
    errors.filter(
      e => e.type === 'grammar' && e.explanation.includes('subject-verb')
    ).length === 0
  ) {
    strengths.push('Good subject-verb agreement');
  }

  // Check for appropriate sentence structure
  if (errors.filter(e => e.type === 'structure').length === 0) {
    strengths.push('Appropriate sentence structure');
  }

  // Check for active voice usage
  if (
    errors.filter(
      e => e.type === 'style' && e.explanation.includes('passive voice')
    ).length <= 1
  ) {
    strengths.push('Effective use of active voice');
  }

  // Add default strengths if none found
  if (strengths.length === 0) {
    strengths.push('Basic grammar fundamentals');
    strengths.push('Sentence variety');
  }

  return strengths;
}

function determineGrammarImprovements(
  content: string,
  errors: any[]
): string[] {
  const improvements = [];

  // Check for specific error types and suggest improvements
  if (
    errors.filter(
      e => e.type === 'grammar' && e.explanation.includes('subject-verb')
    ).length > 0
  ) {
    improvements.push('Check subject-verb agreement in complex sentences');
  }

  if (errors.filter(e => e.type === 'punctuation').length > 0) {
    improvements.push('Be careful with comma usage');
  }

  if (errors.filter(e => e.type === 'structure').length > 0) {
    improvements.push('Watch for run-on sentences');
  }

  if (
    errors.filter(
      e => e.type === 'style' && e.explanation.includes('passive voice')
    ).length > 0
  ) {
    improvements.push('Consider using more active voice for clarity');
  }

  if (errors.filter(e => e.type === 'spelling').length > 0) {
    improvements.push('Proofread carefully for spelling errors');
  }

  // Add default improvements if none found
  if (improvements.length === 0) {
    improvements.push('Consider varying sentence structure more');
    improvements.push('Review punctuation rules for academic writing');
  }

  return improvements;
}

function generateGrammarSuggestions(errors: any[]): string[] {
  const suggestions = [];

  // Generate suggestions based on error types
  if (errors.filter(e => e.type === 'grammar').length > 0) {
    suggestions.push(
      'Pay attention to subject-verb agreement in complex sentences'
    );
  }

  if (errors.filter(e => e.type === 'punctuation').length > 0) {
    suggestions.push(
      'Review comma usage rules, especially after introductory phrases'
    );
  }

  if (errors.filter(e => e.type === 'structure').length > 0) {
    suggestions.push(
      'Consider breaking long sentences into shorter ones for clarity'
    );
  }

  // Add default suggestions if needed
  if (suggestions.length < 3) {
    suggestions.push(
      'Consider using more varied punctuation to enhance readability'
    );
    suggestions.push(
      'Review your use of articles, especially with abstract nouns'
    );
  }

  return suggestions.slice(0, 3);
}

function countUniqueWords(content: string): number {
  // Count unique words in content
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/);

  const uniqueWords = new Set(words.filter(word => word.length > 1));
  return uniqueWords.size;
}

function determineVocabularyLevel(content: string): string {
  // Simple vocabulary level determination based on word complexity
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/);

  // Advanced words (simplified list)
  const advancedWords = [
    'analysis',
    'significant',
    'perspective',
    'fundamental',
    'consequently',
    'nevertheless',
    'furthermore',
    'implementation',
    'comprehensive',
    'subsequent',
    'facilitate',
    'demonstrate',
    'incorporate',
    'emphasize',
    'substantial',
  ];

  // Intermediate words
  const intermediateWords = [
    'improve',
    'develop',
    'consider',
    'provide',
    'require',
    'suggest',
    'create',
    'maintain',
    'increase',
    'reduce',
    'however',
    'therefore',
    'because',
    'although',
    'despite',
  ];

  const advancedCount = words.filter(word =>
    advancedWords.includes(word)
  ).length;
  const intermediateCount = words.filter(word =>
    intermediateWords.includes(word)
  ).length;

  const totalWords = words.length;
  const advancedRatio = advancedCount / totalWords;
  const intermediateRatio = intermediateCount / totalWords;

  if (advancedRatio > 0.05) return 'C1';
  if (advancedRatio > 0.02 || intermediateRatio > 0.1) return 'B2';
  if (intermediateRatio > 0.05) return 'B1';
  return 'A2';
}

function calculateVocabularyScore(content: string, level: string): number {
  // Calculate vocabulary score based on variety and complexity
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1);

  const uniqueWords = new Set(words);
  const uniqueRatio = uniqueWords.size / words.length;

  // Base score on vocabulary level
  let baseScore = 70;
  if (level === 'B1') baseScore = 80;
  if (level === 'B2') baseScore = 85;
  if (level === 'C1') baseScore = 90;

  // Adjust for word variety
  const varietyBonus = Math.min(uniqueRatio * 20, 10);

  return Math.round(Math.min(baseScore + varietyBonus, 100));
}

function determineVocabularyStrengths(
  content: string,
  wordFrequency: any[]
): string[] {
  const strengths = [];

  // Check for topic-specific vocabulary
  const topicWords = wordFrequency.filter(
    item => item.category === 'noun'
  ).length;
  if (topicWords >= 2) {
    strengths.push('Good use of topic-specific vocabulary');
  }

  // Check for transition words
  const transitionWords = [
    'however',
    'therefore',
    'also',
    'furthermore',
    'moreover',
    'consequently',
    'in addition',
  ];
  const hasTransitions = transitionWords.some(word =>
    content.toLowerCase().includes(word)
  );
  if (hasTransitions) {
    strengths.push('Effective use of transition words');
  }

  // Check for word variety
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1);

  const uniqueWords = new Set(words);
  const uniqueRatio = uniqueWords.size / words.length;

  if (uniqueRatio > 0.7) {
    strengths.push('Varied word choice');
  }

  // Add default strengths if none found
  if (strengths.length === 0) {
    strengths.push('Basic vocabulary appropriate to the topic');
    strengths.push('Clear word choices');
  }

  return strengths;
}

function determineVocabularyImprovements(
  content: string,
  level: string
): string[] {
  const improvements = [];

  // Suggest improvements based on vocabulary level
  if (level === 'A2' || level === 'B1') {
    improvements.push('Consider using more academic vocabulary');
    improvements.push('Try to incorporate more precise terms for key concepts');
  }

  if (level === 'B2') {
    improvements.push('Try to incorporate more idiomatic expressions');
    improvements.push(
      'Consider using more specialized vocabulary related to the topic'
    );
  }

  if (level === 'C1') {
    improvements.push(
      'Expand your range of adjectives for more vivid descriptions'
    );
    improvements.push(
      'Consider using more nuanced terms to express subtle differences'
    );
  }

  // Check for repetition
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Only check substantial words

  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordCounts)
    .filter(([_, count]) => count > 3)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    improvements.push(
      'Avoid repetition of the same words throughout your text'
    );
  }

  return improvements;
}

function calculateStructureScore(paragraphs: string[]): number {
  // Calculate structure score based on paragraph organization
  let score = 70; // Base score

  // Check for minimum number of paragraphs
  if (paragraphs.length >= 3) score += 10;

  // Check for introduction and conclusion
  if (paragraphs.length >= 3) {
    const hasIntro = paragraphs[0].length > 30;
    const hasConclusion = paragraphs[paragraphs.length - 1].length > 30;

    if (hasIntro) score += 5;
    if (hasConclusion) score += 5;
  }

  // Check for paragraph length balance
  const lengths = paragraphs.map(p => p.length);
  const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  const balanced = lengths.every(
    len => len > avgLength * 0.5 && len < avgLength * 1.5
  );

  if (balanced) score += 5;

  return Math.min(score, 100);
}

function determineStructureStrengths(paragraphs: string[]): string[] {
  const strengths = [];

  // Check for clear introduction
  if (paragraphs.length > 0 && paragraphs[0].length > 30) {
    strengths.push('Clear introduction that establishes the main topic');
  }

  // Check for logical progression
  if (paragraphs.length >= 3) {
    strengths.push('Logical progression of ideas');
  }

  // Check for conclusion
  if (paragraphs.length > 2 && paragraphs[paragraphs.length - 1].length > 30) {
    strengths.push('Effective conclusion that summarizes key points');
  }

  // Add default strengths if none found
  if (strengths.length === 0) {
    strengths.push('Basic paragraph structure');
    strengths.push('Attempt to organize ideas');
  }

  return strengths;
}

function determineStructureImprovements(paragraphs: string[]): string[] {
  const improvements = [];

  // Check for introduction issues
  if (paragraphs.length === 0 || paragraphs[0].length < 30) {
    improvements.push(
      'Consider strengthening the introduction with a clearer thesis statement'
    );
  } else {
    improvements.push('Consider strengthening the thesis statement');
  }

  // Check for paragraph focus
  if (paragraphs.some(p => p.length > 200)) {
    improvements.push(
      'Some paragraphs could be more focused on a single main idea'
    );
  }

  // Check for transitions
  if (paragraphs.length > 2) {
    improvements.push('Transitions between some paragraphs could be smoother');
  }

  // Add default improvements if none found
  if (improvements.length === 0) {
    improvements.push(
      'Consider adding more specific examples to support your points'
    );
    improvements.push('Try to create more balanced paragraph lengths');
  }

  return improvements;
}

function calculateRelevanceScore(content: string, topic: string): number {
  // Calculate relevance score based on topic presence
  const contentLower = content.toLowerCase();
  const topicLower = topic.toLowerCase();

  // Check if topic is mentioned
  const topicMentioned = contentLower.includes(topicLower);

  // Check for related terms (simplified)
  const relatedTerms: Record<string, string[]> = {
    technology: [
      'digital',
      'internet',
      'computer',
      'smartphone',
      'online',
      'electronic',
      'device',
    ],
    environment: [
      'climate',
      'pollution',
      'sustainable',
      'green',
      'nature',
      'eco',
      'planet',
    ],
    education: [
      'school',
      'learning',
      'student',
      'teacher',
      'classroom',
      'academic',
      'study',
    ],
    health: [
      'medical',
      'wellness',
      'disease',
      'doctor',
      'patient',
      'hospital',
      'treatment',
    ],
    'social media': [
      'facebook',
      'twitter',
      'instagram',
      'online',
      'post',
      'share',
      'platform',
    ],
  };

  const relatedToTopic = Object.entries(relatedTerms).find(
    ([key]) => topicLower.includes(key) || key.includes(topicLower)
  );

  let relatedTermsCount = 0;
  if (relatedToTopic) {
    relatedTermsCount = relatedToTopic[1].filter(term =>
      contentLower.includes(term)
    ).length;
  }

  // Calculate score
  let score = 70; // Base score
  if (topicMentioned) score += 10;
  score += Math.min(relatedTermsCount * 3, 20); // Up to 20 points for related terms

  return Math.min(score, 100);
}

function calculateDepthScore(content: string): number {
  // Calculate depth score based on content analysis
  const contentLength = content.length;
  const paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0);

  // Basic metrics
  let score = 70; // Base score

  // Length-based bonus (up to 10 points)
  score += Math.min(contentLength / 50, 10);

  // Paragraph count bonus (up to 10 points)
  score += Math.min(paragraphs.length * 2, 10);

  // Check for evidence of analysis (simplified)
  const analysisTerms = [
    'because',
    'therefore',
    'result',
    'cause',
    'effect',
    'impact',
    'consequence',
    'lead to',
  ];
  const analysisCount = analysisTerms.filter(term =>
    content.toLowerCase().includes(term)
  ).length;

  score += Math.min(analysisCount * 2, 10); // Up to 10 points for analysis terms

  return Math.min(score, 100);
}

function determineContentStrengths(content: string, topic: string): string[] {
  const strengths = [];

  // Check for topic understanding
  if (content.toLowerCase().includes(topic.toLowerCase())) {
    strengths.push('Good understanding of the topic');
  }

  // Check for examples
  const exampleIndicators = [
    'for example',
    'such as',
    'instance',
    'like',
    'specifically',
  ];
  const hasExamples = exampleIndicators.some(term =>
    content.toLowerCase().includes(term)
  );

  if (hasExamples) {
    strengths.push('Effective use of examples to support points');
  }

  // Check for critical thinking
  const criticalThinkingTerms = [
    'however',
    'although',
    'despite',
    'nevertheless',
    'while',
    'balance',
    'consider',
  ];
  const criticalThinkingCount = criticalThinkingTerms.filter(term =>
    content.toLowerCase().includes(term)
  ).length;

  if (criticalThinkingCount >= 2) {
    strengths.push('Demonstrates critical thinking');
  }

  // Add default strengths if none found
  if (strengths.length === 0) {
    strengths.push('Addresses the basic requirements of the prompt');
    strengths.push('Attempts to engage with the topic');
  }

  return strengths;
}

function determineContentImprovements(
  content: string,
  promptType: string
): string[] {
  const improvements = [];

  // Check for counterarguments in essays and arguments
  if (
    (promptType === 'essay' || promptType === 'argument') &&
    !content.toLowerCase().includes('however') &&
    !content.toLowerCase().includes('although') &&
    !content.toLowerCase().includes('despite')
  ) {
    improvements.push('Consider exploring counterarguments more thoroughly');
  }

  // Check for evidence
  const evidenceTerms = [
    'research',
    'study',
    'evidence',
    'data',
    'statistics',
    'according',
  ];
  const hasEvidence = evidenceTerms.some(term =>
    content.toLowerCase().includes(term)
  );

  if (!hasEvidence) {
    improvements.push('Some claims could benefit from more evidence');
  }

  // Check for depth in middle paragraphs
  const paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 3) {
    const middleParagraphsLength = paragraphs
      .slice(1, -1)
      .reduce((sum, p) => sum + p.length, 0);
    const avgMiddleLength = middleParagraphsLength / (paragraphs.length - 2);

    if (avgMiddleLength < 100) {
      improvements.push('Deepen analysis in the middle section');
    }
  }

  // Add default improvements if none found
  if (improvements.length === 0) {
    improvements.push(
      'Consider adding more specific details to illustrate your points'
    );
    improvements.push(
      'Try to develop your ideas more fully with additional explanation'
    );
  }

  return improvements;
}

function generateWordAlternatives(word: string): string[] {
  // Simple word alternatives generator
  // In a real implementation, this would use a thesaurus API
  const commonAlternatives: Record<string, string[]> = {
    technology: ['innovation', 'advancement', 'tools', 'systems'],
    people: ['individuals', 'persons', 'citizens', 'humans'],
    important: ['significant', 'crucial', 'essential', 'vital'],
    good: ['positive', 'beneficial', 'favorable', 'advantageous'],
    bad: ['negative', 'harmful', 'unfavorable', 'detrimental'],
    help: ['assist', 'aid', 'support', 'facilitate'],
    make: ['create', 'produce', 'generate', 'form'],
    change: ['alter', 'modify', 'transform', 'adjust'],
    communication: ['interaction', 'exchange', 'dialogue', 'correspondence'],
    problem: ['issue', 'challenge', 'difficulty', 'obstacle'],
  };

  if (word in commonAlternatives) {
    return commonAlternatives[word];
  }

  // For words not in our dictionary, generate simple variations
  return [word + 's', word + 'ed', word + 'ing'].filter(w => w !== word);
}

// Helper functions for mock analysis

function generateMockGrammarErrors(content: string) {
  // Create a more realistic grammar analysis by looking for common patterns
  const errors = [];

  // Split content into sentences for analysis
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Analyze a subset of sentences (to keep performance reasonable)
  const samplesToAnalyze = Math.min(sentences.length, 10);

  for (let i = 0; i < samplesToAnalyze; i++) {
    const sentence = sentences[i].trim();

    // Check for missing commas after introductory phrases
    if (
      /^(However|Therefore|Nevertheless|Consequently|In addition|For example|Moreover|Furthermore|As a result)[a-z]/i.test(
        sentence
      )
    ) {
      errors.push({
        type: 'punctuation',
        context: sentence,
        suggestion: sentence.replace(
          /^(However|Therefore|Nevertheless|Consequently|In addition|For example|Moreover|Furthermore|As a result)(\s+)([a-z])/i,
          '$1,$2$3'
        ),
        explanation:
          'A comma should follow introductory words or phrases at the beginning of a sentence.',
      });
    }

    // Check for subject-verb agreement issues with common patterns
    if (/\b(they|we|you) (was|is)\b/i.test(sentence)) {
      errors.push({
        type: 'grammar',
        context: sentence,
        suggestion: sentence.replace(/\b(they|we|you) (was|is)\b/i, match => {
          if (/was/i.test(match)) return match.replace(/was/i, 'were');
          if (/is/i.test(match)) return match.replace(/is/i, 'are');
          return match;
        }),
        explanation:
          'Subject-verb agreement error. Plural subjects like "they," "we," or "you" require plural verb forms.',
      });
    }

    // Check for common spelling errors
    const commonMisspellings = {
      accomodate: 'accommodate',
      acheive: 'achieve',
      accross: 'across',
      agressive: 'aggressive',
      apparant: 'apparent',
      begining: 'beginning',
      beleive: 'believe',
      definately: 'definitely',
      dissapoint: 'disappoint',
      embarass: 'embarrass',
      enviroment: 'environment',
      existance: 'existence',
      foriegn: 'foreign',
      goverment: 'government',
      happend: 'happened',
      independant: 'independent',
      occured: 'occurred',
      posession: 'possession',
      recieve: 'receive',
      seperate: 'separate',
      succesful: 'successful',
      tommorow: 'tomorrow',
      untill: 'until',
      wierd: 'weird',
      sentense: 'sentence',
    };

    for (const [misspelled, correct] of Object.entries(commonMisspellings)) {
      if (new RegExp(`\\b${misspelled}\\b`, 'i').test(sentence)) {
        errors.push({
          type: 'spelling',
          context: sentence,
          suggestion: correct,
          explanation: `The word "${misspelled}" is misspelled. The correct spelling is "${correct}".`,
        });
      }
    }

    // Check for run-on sentences (simplified check based on length and conjunctions)
    if (
      sentence.length > 100 &&
      /\band\b|\bbut\b|\bor\b|\bso\b/g.test(sentence)
    ) {
      const count = (sentence.match(/\band\b|\bbut\b|\bor\b|\bso\b/g) || [])
        .length;
      if (count >= 3) {
        errors.push({
          type: 'structure',
          context: sentence,
          suggestion:
            'Consider breaking this into multiple sentences or using semicolons.',
          explanation:
            'This appears to be a run-on sentence. Long sentences with multiple conjunctions can be difficult to read and understand.',
        });
      }
    }

    // Check for passive voice (simplified detection)
    if (/\b(is|are|was|were|be|been|being) [a-z]+ed\b/i.test(sentence)) {
      errors.push({
        type: 'style',
        context: sentence,
        suggestion: 'Consider using active voice',
        explanation:
          'This sentence uses passive voice. Active voice often creates stronger, more direct statements.',
      });
    }

    // Check for articles missing before singular nouns
    if (
      /\b(is|are|was|were) [a-z]+\b/i.test(sentence) &&
      !/\b(the|a|an) [a-z]+\b/i.test(sentence)
    ) {
      const match = sentence.match(/\b(is|are|was|were) ([a-z]+)\b/i);
      if (
        match &&
        match[2] &&
        !['I', 'you', 'we', 'they', 'he', 'she', 'it'].includes(
          match[2].toLowerCase()
        )
      ) {
        errors.push({
          type: 'grammar',
          context: sentence,
          suggestion: sentence.replace(
            new RegExp(`\\b(is|are|was|were) ${match[2]}\\b`, 'i'),
            `$1 a ${match[2]}`
          ),
          explanation:
            'Consider adding an article before singular nouns when appropriate.',
        });
      }
    }
  }

  // Analyze the entire content for additional errors

  // Check for subject-verb agreement with technology (singular)
  if (/\btechnology are\b|\btechnologies is\b/i.test(content)) {
    errors.push({
      type: 'grammar',
      context:
        content.match(
          /[^.!?]*\b(technology are|technologies is)\b[^.!?]*/i
        )?.[0] || '',
      suggestion: content.match(/[^.!?]*\b(technology are)\b[^.!?]*/i)
        ? 'technology is'
        : 'technologies are',
      explanation:
        'Subject-verb agreement error. "Technology" is singular and requires "is", while "technologies" is plural and requires "are".',
    });
  }

  // Check for tense consistency
  const presentTenseCount = (
    content.match(/\b(is|are|has|have|do|does)\b/g) || []
  ).length;
  const pastTenseCount = (content.match(/\b(was|were|had|did)\b/g) || [])
    .length;

  if (
    presentTenseCount > 0 &&
    pastTenseCount > 0 &&
    Math.min(presentTenseCount, pastTenseCount) /
      Math.max(presentTenseCount, pastTenseCount) >
      0.3
  ) {
    errors.push({
      type: 'grammar',
      context: 'Throughout the essay',
      suggestion: 'Maintain consistent verb tense throughout your essay',
      explanation:
        "Your essay switches between present and past tense. For academic writing, it's generally better to maintain consistent tense unless there's a specific reason to change.",
    });
  }

  // Return all found errors without adding generic ones
  return errors;
}

function generateWordFrequency(content: string) {
  // Analyze the actual content for word frequency
  const words = content
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/);

  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    // Skip very short words and common articles/prepositions
    if (
      word.length <= 1 ||
      [
        'the',
        'a',
        'an',
        'in',
        'on',
        'at',
        'to',
        'for',
        'of',
        'and',
        'or',
        'but',
      ].includes(word)
    ) {
      return;
    }

    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Take top 5 words

  // Assign categories (simplified)
  return sortedWords.map(item => {
    let category = 'other';

    // Very simple categorization - would be more sophisticated in a real implementation
    if (
      [
        'is',
        'are',
        'was',
        'were',
        'has',
        'have',
        'do',
        'does',
        'make',
        'change',
        'help',
        'talk',
        'find',
        'spend',
        'meet',
      ].includes(item.word)
    ) {
      category = 'verb';
    } else if (
      [
        'important',
        'good',
        'bad',
        'positive',
        'negative',
        'helpful',
        'easier',
        'faster',
        'free',
        'social',
        'real',
      ].includes(item.word)
    ) {
      category = 'adjective';
    } else if (
      [
        'technology',
        'people',
        'communication',
        'internet',
        'smartphones',
        'machines',
        'ai',
        'information',
        'time',
        'life',
        'work',
        'study',
        'friends',
        'family',
        'communities',
        'schools',
        'workplaces',
        'events',
      ].includes(item.word)
    ) {
      category = 'noun';
    }

    return {
      ...item,
      category,
    };
  });
}

function assessLength(actual: number, target: number) {
  const percentage = (actual / target) * 100;

  if (percentage < 70) {
    return {
      assessment: 'too short',
      feedback: `Your response is significantly shorter than the target length. Consider expanding your ideas with more details, examples, or explanations.`,
    };
  } else if (percentage < 90) {
    return {
      assessment: 'slightly short',
      feedback: `Your response is a bit shorter than the target length. You could add a few more details or examples to reach the expected length.`,
    };
  } else if (percentage <= 110) {
    return {
      assessment: 'appropriate',
      feedback: `Your response meets the target length requirement well.`,
    };
  } else if (percentage <= 130) {
    return {
      assessment: 'slightly long',
      feedback: `Your response is a bit longer than the target length, but still acceptable. For future writing, try to be more concise.`,
    };
  } else {
    return {
      assessment: 'too long',
      feedback: `Your response is significantly longer than the target length. Work on being more concise and focused in your writing.`,
    };
  }
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomSubset<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomStrength(strengths: string[]): string {
  return getRandomElement(strengths);
}

function getRandomImprovement(improvements: string[]): string {
  return getRandomElement(improvements);
}
