import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import { OpenAIWritingAnalyzer } from '@/lib/openai-writing-analyzer';
import WritingSession, { IWritingSession } from '@/models/WritingSession';

// Initialize the OpenAI Analyzer
const openaiAnalyzer = new OpenAIWritingAnalyzer();

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

async function analyzeWriting(writingSession: IWritingSession) {
  // Extract content and prompt information
  const { submission, prompt } = writingSession;
  const content = submission.content || '';
  const promptType = prompt.type;
  const promptTopic = prompt.topic;
  const targetLength = prompt.targetLength || 0;
  const actualLength = submission.finalVersion?.wordCount || 0;

  console.log('Using OpenAI for writing analysis...');

  // Check for user's language level in their profile, fallback to 'intermediate'
  // In a real app, you would fetch this from the user's profile
  const userLevel = 'intermediate';

  // Pass the prompt structure in the format expected by the analyzer
  const writingPrompt = {
    text: prompt.text || '',
    type: promptType,
    topic: promptTopic,
    targetLength: targetLength,
    requirements: prompt.requirements || [],
    suggestedLength: {
      min: Math.max(50, targetLength * 0.8),
      max: targetLength * 1.2,
    },
  };

  // Call the OpenAI analyzer
  const openAIAnalysis = await openaiAnalyzer.analyzeSubmission({
    content,
    prompt: writingPrompt as any,
    level: userLevel,
  });

  console.log('OpenAI analysis successful');

  // Assessment of the length requirement
  const lengthAssessment = assessLength(actualLength, targetLength);

  // Complete writing analysis with all components
  return {
    // Scores
    overallScore: openAIAnalysis.overallScore,
    grammarScore: openAIAnalysis.grammarScore,
    vocabularyScore: openAIAnalysis.vocabularyScore,
    coherenceScore: openAIAnalysis.coherenceScore,
    styleScore: openAIAnalysis.styleScore,

    // Text feedback
    summaryFeedback: openAIAnalysis.feedback.overallAssessment,
    lengthAssessment,
    strengths: openAIAnalysis.feedback.strengths,
    improvements:
      openAIAnalysis.feedback.areasForImprovement ||
      openAIAnalysis.feedback.improvements,

    // Detailed analysis sections
    feedback: openAIAnalysis.feedback,
    grammarIssues: openAIAnalysis.grammarIssues,
    vocabularyAnalysis: openAIAnalysis.vocabularyAnalysis,

    // Required traditional format for backward compatibility
    details: {
      grammar: {
        score: openAIAnalysis.grammarScore,
        errorList: openAIAnalysis.grammarIssues,
        suggestions: openAIAnalysis.feedback.improvements.filter(
          item =>
            item.toLowerCase().includes('grammar') ||
            item.toLowerCase().includes('spelling') ||
            item.toLowerCase().includes('punctuation') ||
            item.toLowerCase().includes('sentence') ||
            item.toLowerCase().startsWith('grammar:')
        ),
        strengths: openAIAnalysis.feedback.strengths.filter(
          item =>
            item.toLowerCase().includes('grammar') ||
            item.toLowerCase().includes('spelling') ||
            item.toLowerCase().includes('punctuation') ||
            item.toLowerCase().includes('sentence') ||
            item.toLowerCase().startsWith('grammar strength')
        ),
        improvements: openAIAnalysis.feedback.improvements.filter(
          item =>
            item.toLowerCase().includes('grammar') ||
            item.toLowerCase().includes('spelling') ||
            item.toLowerCase().includes('punctuation') ||
            item.toLowerCase().includes('sentence') ||
            item.toLowerCase().startsWith('grammar:') ||
            item.toLowerCase().startsWith('grammar improvement')
        ),
      },
      vocabulary: {
        score: openAIAnalysis.vocabularyScore,
        level: openAIAnalysis.vocabularyAnalysis.level,
        // Use the dedicated vocabulary strengths/improvements from the vocabulary analysis
        strengths:
          openAIAnalysis.vocabularyAnalysis.strengths ||
          openAIAnalysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes('vocabulary') ||
              item.toLowerCase().includes('word') ||
              item.toLowerCase().includes('term') ||
              item.toLowerCase().startsWith('vocabulary strength')
          ),
        improvements:
          openAIAnalysis.vocabularyAnalysis.improvements ||
          openAIAnalysis.feedback.improvements.filter(
            item =>
              item.toLowerCase().includes('vocabulary') ||
              item.toLowerCase().includes('word') ||
              item.toLowerCase().includes('term') ||
              item.toLowerCase().startsWith('vocabulary:') ||
              item.toLowerCase().startsWith('vocabulary improvement')
          ),
        wordFrequency: openAIAnalysis.vocabularyAnalysis.wordFrequency,
      },
      structure: {
        score: openAIAnalysis.coherenceScore,
        strengths: openAIAnalysis.feedback.strengths.filter(
          item =>
            item.toLowerCase().includes('structure') ||
            item.toLowerCase().includes('organization') ||
            item.toLowerCase().includes('coherence') ||
            item.toLowerCase().includes('flow') ||
            item.toLowerCase().includes('paragraph') ||
            item.toLowerCase().startsWith('structure strength')
        ),
        improvements: openAIAnalysis.feedback.improvements.filter(
          item =>
            item.toLowerCase().includes('structure') ||
            item.toLowerCase().includes('organization') ||
            item.toLowerCase().includes('coherence') ||
            item.toLowerCase().includes('flow') ||
            item.toLowerCase().includes('paragraph') ||
            item.toLowerCase().startsWith('structure:') ||
            item.toLowerCase().startsWith('structure improvement')
        ),
      },
      content: {
        score: openAIAnalysis.styleScore,
        relevance: Math.min(100, openAIAnalysis.styleScore + 5),
        depth: Math.min(100, openAIAnalysis.vocabularyScore + 5),
        strengths: openAIAnalysis.feedback.strengths.filter(
          item =>
            item.toLowerCase().includes('content') ||
            item.toLowerCase().includes('idea') ||
            item.toLowerCase().includes('argument') ||
            item.toLowerCase().includes('point') ||
            item.toLowerCase().includes('topic') ||
            item.toLowerCase().startsWith('content strength')
        ),
        improvements: openAIAnalysis.feedback.improvements.filter(
          item =>
            item.toLowerCase().includes('content') ||
            item.toLowerCase().includes('idea') ||
            item.toLowerCase().includes('argument') ||
            item.toLowerCase().includes('point') ||
            item.toLowerCase().includes('topic') ||
            item.toLowerCase().startsWith('content:') ||
            item.toLowerCase().startsWith('content improvement')
        ),
      },
    },
    timestamp: new Date(),
  };
}

/**
 * Assesses whether the submission meets the length requirement
 */
function assessLength(
  actualLength: number,
  targetLength: number
): { assessment: string; feedback: string } {
  let assessment: string;
  let feedback: string;

  const percentDifference =
    ((actualLength - targetLength) / targetLength) * 100;

  if (percentDifference < -30) {
    assessment = 'too short';
    feedback = `Your submission is significantly shorter than the target length of approximately ${targetLength} words. Consider expanding your ideas with more details and examples.`;
  } else if (percentDifference < -10) {
    assessment = 'slightly short';
    feedback = `Your submission is slightly shorter than the target length of approximately ${targetLength} words. You might want to develop some of your points further.`;
  } else if (percentDifference < 10) {
    assessment = 'appropriate';
    feedback = `Your submission meets the target length requirement of approximately ${targetLength} words.`;
  } else if (percentDifference < 30) {
    assessment = 'slightly long';
    feedback = `Your submission is slightly longer than the target length of approximately ${targetLength} words, but still acceptable.`;
  } else {
    assessment = 'too long';
    feedback = `Your submission is significantly longer than the target length of approximately ${targetLength} words. Consider making your writing more concise by removing redundancies.`;
  }

  return { assessment, feedback };
}
