import { IWritingPrompt } from '@/models/WritingPrompt';

interface AnalysisScores {
  grammar: number;
  vocabulary: number;
  coherence: number;
  style: number;
  overall: number;
}

interface AnalysisFeedback {
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

interface GrammarIssue {
  type: string;
  context: string;
  suggestion: string;
  explanation: string;
}

interface VocabularyAnalysis {
  uniqueWords: number;
  complexityScore: number;
  suggestions: Array<{
    original: string;
    alternatives: string[];
    context: string;
  }>;
}

interface SubmissionAnalysis {
  scores: AnalysisScores;
  feedback: AnalysisFeedback;
  grammarIssues: GrammarIssue[];
  vocabularyAnalysis: VocabularyAnalysis;
}

interface DetailedFeedback {
  detailed: string;
  summary: string;
  nextSteps: string[];
}

export class WritingAnalyzer {
  /**
   * Analyzes a writing submission and provides detailed feedback
   * @param params Object containing content, prompt, and level
   * @returns Analysis results including scores, feedback, and issues
   */
  async analyzeSubmission(params: {
    content: string;
    prompt: IWritingPrompt;
    level: string;
  }): Promise<SubmissionAnalysis> {
    const { content, prompt, level } = params;

    // Calculate word count
    const wordCount = this.countWords(content);

    // Check if the submission meets the minimum length requirement
    const meetsLengthRequirement =
      wordCount >= prompt.suggestedLength.min &&
      wordCount <= prompt.suggestedLength.max;

    // Analyze grammar
    const grammarIssues = await this.analyzeGrammar(content, level);

    // Calculate grammar score based on issues per word
    const grammarScore = this.calculateGrammarScore(
      grammarIssues.length,
      wordCount
    );

    // Analyze vocabulary
    const vocabularyAnalysis = await this.analyzeVocabulary(content, level);

    // Analyze coherence and style
    const coherenceScore = await this.analyzeCoherence(content, prompt.type);
    const styleScore = await this.analyzeStyle(content, prompt.type, level);

    // Calculate overall score
    const overall = this.calculateOverallScore({
      grammar: grammarScore,
      vocabulary: vocabularyAnalysis.complexityScore,
      coherence: coherenceScore,
      style: styleScore,
      lengthRequirement: meetsLengthRequirement ? 100 : 70,
    });

    // Generate feedback
    const feedback = await this.generateAnalysisFeedback(
      content,
      {
        grammar: grammarScore,
        vocabulary: vocabularyAnalysis.complexityScore,
        coherence: coherenceScore,
        style: styleScore,
        overall,
      },
      grammarIssues,
      vocabularyAnalysis,
      level
    );

    return {
      scores: {
        grammar: grammarScore,
        vocabulary: vocabularyAnalysis.complexityScore,
        coherence: coherenceScore,
        style: styleScore,
        overall,
      },
      feedback,
      grammarIssues,
      vocabularyAnalysis,
    };
  }

  /**
   * Generates detailed feedback based on the analysis
   * @param analysis Analysis results
   * @param level User's language level
   * @returns Detailed feedback with summary and next steps
   */
  async generateFeedback(
    analysis: SubmissionAnalysis,
    level: string
  ): Promise<DetailedFeedback> {
    // Generate detailed feedback
    const detailed = this.createDetailedFeedback(analysis, level);

    // Create a summary of the main points
    const summary = this.createFeedbackSummary(analysis);

    // Generate next steps for improvement
    const nextSteps = this.createNextSteps(analysis, level);

    return {
      detailed,
      summary,
      nextSteps,
    };
  }

  /**
   * Counts the number of words in a text
   * @param text The text to count words in
   * @returns Number of words
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  /**
   * Analyzes grammar issues in the text
   * @param content The text to analyze
   * @param level User's language level
   * @returns Array of grammar issues
   */
  private async analyzeGrammar(
    content: string,
    level: string
  ): Promise<GrammarIssue[]> {
    // This would typically use an external API or NLP library
    // For now, we'll return a placeholder implementation

    // Mock implementation - in a real app, this would use a grammar checking API
    const issues: GrammarIssue[] = [];

    // Simple regex patterns to detect common grammar issues
    const patterns = [
      {
        pattern: /\b(is|are|was|were)\s+(\w+ing)\b/gi,
        type: 'Progressive tense error',
        suggestion: 'Consider using the simple form of the verb',
        explanation:
          'In English, we typically use the simple form after is/are/was/were when describing actions.',
      },
      {
        pattern: /\b(a)\s+([aeiou]\w+)\b/gi,
        type: 'Article error',
        suggestion: 'Use "an" before words that start with vowel sounds',
        explanation:
          'The article "a" should be "an" when the following word begins with a vowel sound.',
      },
      // Add more patterns as needed
    ];

    // Check for each pattern
    patterns.forEach(({ pattern, type, suggestion, explanation }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        issues.push({
          type,
          context: content.substring(
            Math.max(0, match.index - 20),
            match.index + match[0].length + 20
          ),
          suggestion,
          explanation,
        });
      }
    });

    return issues;
  }

  /**
   * Analyzes vocabulary usage in the text
   * @param content The text to analyze
   * @param level User's language level
   * @returns Vocabulary analysis
   */
  private async analyzeVocabulary(
    content: string,
    level: string
  ): Promise<VocabularyAnalysis> {
    // This would typically use an external API or NLP library
    // For now, we'll return a placeholder implementation

    // Count unique words
    const words = content.toLowerCase().match(/\b(\w+)\b/g) || [];
    const uniqueWords = new Set(words).size;

    // Calculate complexity score (placeholder)
    // In a real implementation, this would consider word rarity, length, etc.
    const complexityScore = Math.min(
      100,
      Math.round((uniqueWords / words.length) * 100) + 50
    );

    // Mock vocabulary suggestions
    const suggestions = [
      {
        original: 'good',
        alternatives: ['excellent', 'outstanding', 'exceptional'],
        context: '...the results were good in most...',
      },
      {
        original: 'bad',
        alternatives: ['poor', 'inadequate', 'substandard'],
        context: '...considered bad for the environment...',
      },
    ];

    return {
      uniqueWords,
      complexityScore,
      suggestions:
        content.toLowerCase().includes('good') ||
        content.toLowerCase().includes('bad')
          ? suggestions
          : [],
    };
  }

  /**
   * Analyzes coherence of the text
   * @param content The text to analyze
   * @param type The type of writing
   * @returns Coherence score (0-100)
   */
  private async analyzeCoherence(
    content: string,
    type: string
  ): Promise<number> {
    // This would typically use an external API or NLP library
    // For now, we'll return a placeholder implementation

    // Check for transition words that indicate coherence
    const transitionWords = [
      'however',
      'therefore',
      'consequently',
      'furthermore',
      'moreover',
      'in addition',
      'similarly',
      'likewise',
      'in contrast',
      'on the other hand',
      'for example',
      'specifically',
      'in conclusion',
      'to summarize',
    ];

    // Count transition words
    let transitionCount = 0;
    transitionWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        transitionCount += matches.length;
      }
    });

    // Calculate paragraphs
    const paragraphs = content.split(/\n\s*\n/).length;

    // Calculate coherence score based on transition words per paragraph
    // More sophisticated analysis would consider paragraph flow, topic consistency, etc.
    const ratio = transitionCount / Math.max(1, paragraphs);
    const baseScore = Math.min(100, Math.round(ratio * 25) + 60);

    return baseScore;
  }

  /**
   * Analyzes writing style
   * @param content The text to analyze
   * @param type The type of writing
   * @param level User's language level
   * @returns Style score (0-100)
   */
  private async analyzeStyle(
    content: string,
    type: string,
    level: string
  ): Promise<number> {
    // This would typically use an external API or NLP library
    // For now, we'll return a placeholder implementation

    // Calculate average sentence length
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength =
      sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) /
      Math.max(1, sentences.length);

    // Ideal sentence length varies by writing type
    let idealLength = 15; // Default
    if (type === 'essay' || type === 'argument') {
      idealLength = 20;
    } else if (type === 'story') {
      idealLength = 12;
    }

    // Calculate sentence length score
    const sentenceLengthScore =
      100 - Math.min(100, Math.abs(avgSentenceLength - idealLength) * 5);

    // Check for passive voice (simplified)
    const passivePattern = /\b(is|are|was|were|be|been|being)\s+(\w+ed)\b/gi;
    const passiveMatches = content.match(passivePattern) || [];
    const passiveRatio = passiveMatches.length / Math.max(1, sentences.length);

    // Calculate passive voice score (lower passive is better for most writing)
    const passiveScore = 100 - Math.min(100, passiveRatio * 100);

    // Overall style score
    return Math.round(sentenceLengthScore * 0.5 + passiveScore * 0.5);
  }

  /**
   * Calculates grammar score based on issues per word
   * @param issueCount Number of grammar issues
   * @param wordCount Total word count
   * @returns Grammar score (0-100)
   */
  private calculateGrammarScore(issueCount: number, wordCount: number): number {
    const issueRatio = issueCount / Math.max(1, wordCount);
    return Math.max(0, Math.round(100 - issueRatio * 1000));
  }

  /**
   * Calculates overall score based on individual scores
   * @param scores Object containing individual scores
   * @returns Overall score (0-100)
   */
  private calculateOverallScore(scores: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    style: number;
    lengthRequirement: number;
  }): number {
    return Math.round(
      scores.grammar * 0.25 +
        scores.vocabulary * 0.25 +
        scores.coherence * 0.2 +
        scores.style * 0.2 +
        scores.lengthRequirement * 0.1
    );
  }

  /**
   * Generates feedback based on analysis results
   * @param content The original content
   * @param scores Analysis scores
   * @param grammarIssues Grammar issues
   * @param vocabularyAnalysis Vocabulary analysis
   * @param level User's language level
   * @returns Feedback object
   */
  private async generateAnalysisFeedback(
    content: string,
    scores: AnalysisScores,
    grammarIssues: GrammarIssue[],
    vocabularyAnalysis: VocabularyAnalysis,
    level: string
  ): Promise<AnalysisFeedback> {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const suggestions: string[] = [];

    // Add strengths based on scores
    if (scores.grammar >= 90) {
      strengths.push('Excellent grammar with very few errors.');
    } else if (scores.grammar >= 80) {
      strengths.push('Good grammar overall with only minor errors.');
    }

    if (scores.vocabulary >= 90) {
      strengths.push('Rich and varied vocabulary usage.');
    } else if (scores.vocabulary >= 80) {
      strengths.push('Good vocabulary range with some advanced terms.');
    }

    if (scores.coherence >= 90) {
      strengths.push('Excellent text organization and flow between ideas.');
    } else if (scores.coherence >= 80) {
      strengths.push(
        'Good structure with clear connections between paragraphs.'
      );
    }

    if (scores.style >= 90) {
      strengths.push(
        'Excellent writing style appropriate for the content type.'
      );
    } else if (scores.style >= 80) {
      strengths.push('Good writing style with effective sentence variety.');
    }

    // Add improvements based on scores
    if (scores.grammar < 80) {
      improvements.push(
        'Work on reducing grammar errors, especially with verb tenses and articles.'
      );
    }

    if (scores.vocabulary < 80) {
      improvements.push(
        'Try to incorporate more varied and precise vocabulary.'
      );
    }

    if (scores.coherence < 80) {
      improvements.push(
        'Improve the flow between paragraphs using more transition words.'
      );
    }

    if (scores.style < 80) {
      improvements.push('Work on sentence variety and reducing passive voice.');
    }

    // Add specific suggestions
    if (grammarIssues.length > 0) {
      const uniqueTypes = new Set(grammarIssues.map(issue => issue.type));
      uniqueTypes.forEach(type => {
        suggestions.push(
          `Review ${type.toLowerCase()} rules and practice using them correctly.`
        );
      });
    }

    if (vocabularyAnalysis.suggestions.length > 0) {
      suggestions.push(
        'Consider using more precise alternatives for common words like "good" and "bad".'
      );
    }

    // Ensure we have at least one item in each category
    if (strengths.length === 0) {
      strengths.push(
        "You've made a good effort in completing this writing task."
      );
    }

    if (improvements.length === 0) {
      improvements.push(
        'Continue practicing to maintain your strong writing skills.'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Read examples of well-written texts in this genre to improve further.'
      );
    }

    return {
      strengths,
      improvements,
      suggestions,
    };
  }

  /**
   * Creates detailed feedback text
   * @param analysis Analysis results
   * @param level User's language level
   * @returns Detailed feedback text
   */
  private createDetailedFeedback(
    analysis: SubmissionAnalysis,
    level: string
  ): string {
    const { scores, feedback, grammarIssues } = analysis;

    let detailedFeedback = `## Writing Analysis\n\n`;

    // Overall assessment
    detailedFeedback += `### Overall Assessment\n`;
    detailedFeedback += `Your writing received an overall score of ${scores.overall}/100. `;

    if (scores.overall >= 90) {
      detailedFeedback += `This is an excellent result that demonstrates strong writing skills.\n\n`;
    } else if (scores.overall >= 80) {
      detailedFeedback += `This is a good result that shows solid writing abilities.\n\n`;
    } else if (scores.overall >= 70) {
      detailedFeedback += `This is a satisfactory result with room for improvement.\n\n`;
    } else {
      detailedFeedback += `This indicates several areas that need improvement.\n\n`;
    }

    // Strengths
    detailedFeedback += `### Strengths\n`;
    feedback.strengths.forEach(strength => {
      detailedFeedback += `- ${strength}\n`;
    });
    detailedFeedback += `\n`;

    // Areas for improvement
    detailedFeedback += `### Areas for Improvement\n`;
    feedback.improvements.forEach(improvement => {
      detailedFeedback += `- ${improvement}\n`;
    });
    detailedFeedback += `\n`;

    // Grammar issues
    if (grammarIssues.length > 0) {
      detailedFeedback += `### Grammar Issues\n`;
      grammarIssues.slice(0, 5).forEach(issue => {
        detailedFeedback += `- **${issue.type}**: "${issue.context}"\n`;
        detailedFeedback += `  - Suggestion: ${issue.suggestion}\n`;
        detailedFeedback += `  - Explanation: ${issue.explanation}\n\n`;
      });

      if (grammarIssues.length > 5) {
        detailedFeedback += `*Plus ${grammarIssues.length - 5} more issues not shown here.*\n\n`;
      }
    }

    // Suggestions
    detailedFeedback += `### Suggestions for Improvement\n`;
    feedback.suggestions.forEach(suggestion => {
      detailedFeedback += `- ${suggestion}\n`;
    });

    return detailedFeedback;
  }

  /**
   * Creates a summary of the feedback
   * @param analysis Analysis results
   * @returns Summary text
   */
  private createFeedbackSummary(analysis: SubmissionAnalysis): string {
    const { scores } = analysis;

    let summary = `Your writing received an overall score of ${scores.overall}/100. `;

    // Add score breakdown
    summary += `Score breakdown: Grammar (${scores.grammar}), Vocabulary (${scores.vocabulary}), `;
    summary += `Coherence (${scores.coherence}), Style (${scores.style}). `;

    // Add main strength and improvement
    if (analysis.feedback.strengths.length > 0) {
      summary += `Key strength: ${analysis.feedback.strengths[0]} `;
    }

    if (analysis.feedback.improvements.length > 0) {
      summary += `Main area to improve: ${analysis.feedback.improvements[0]}`;
    }

    return summary;
  }

  /**
   * Creates next steps for improvement
   * @param analysis Analysis results
   * @param level User's language level
   * @returns Array of next steps
   */
  private createNextSteps(
    analysis: SubmissionAnalysis,
    level: string
  ): string[] {
    const nextSteps: string[] = [];
    const { scores } = analysis;

    // Add specific next steps based on scores
    if (scores.grammar < 80) {
      nextSteps.push(
        'Review the grammar rules related to the issues identified in your writing.'
      );

      if (level === 'beginner') {
        nextSteps.push('Practice basic sentence structures and verb tenses.');
      } else if (level === 'intermediate') {
        nextSteps.push(
          'Work on more complex grammatical structures like conditionals and perfect tenses.'
        );
      } else {
        nextSteps.push(
          'Focus on nuanced grammar points like article usage and complex clause structures.'
        );
      }
    }

    if (scores.vocabulary < 80) {
      nextSteps.push(
        'Build your vocabulary by reading texts at your level and noting new words.'
      );

      if (level === 'beginner') {
        nextSteps.push(
          'Learn common synonyms for basic adjectives like "good," "bad," and "nice."'
        );
      } else if (level === 'intermediate') {
        nextSteps.push(
          'Practice using more precise and varied vocabulary in your writing.'
        );
      } else {
        nextSteps.push(
          'Incorporate more academic or specialized vocabulary appropriate to your topic.'
        );
      }
    }

    if (scores.coherence < 80) {
      nextSteps.push(
        'Practice organizing your ideas with clear paragraph structure.'
      );
      nextSteps.push(
        'Learn and use transition words to connect your ideas more effectively.'
      );
    }

    if (scores.style < 80) {
      nextSteps.push(
        'Vary your sentence structures to make your writing more engaging.'
      );
      nextSteps.push(
        'Practice writing in the active voice rather than passive voice when appropriate.'
      );
    }

    // Add general next steps
    nextSteps.push(
      'Read examples of well-written texts in this genre to learn from them.'
    );
    nextSteps.push(
      'Try rewriting this piece incorporating the feedback provided.'
    );

    return nextSteps;
  }
}
