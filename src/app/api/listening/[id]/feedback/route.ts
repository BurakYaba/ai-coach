import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { normalizeQuestionType } from '@/lib/utils';
import ListeningSession from '@/models/ListeningSession';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/listening/[id]/feedback - Submit answers and get feedback
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate session ID
    const { id } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get session by ID
    const listeningSession = await ListeningSession.findById(id);

    // Check if session exists
    if (!listeningSession) {
      return NextResponse.json(
        { error: 'Listening session not found' },
        { status: 404 }
      );
    }

    // Check if session belongs to the user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this session' },
        { status: 403 }
      );
    }

    // Get user answers from request body
    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Get questions from listening session
    const questions = listeningSession.questions || [];

    // Calculate results and generate feedback
    const questionFeedback = questions.map((question: any, index: number) => {
      const userAnswer = answers[index] || '';
      const correctAnswer = question.correctAnswer || '';
      const isCorrect = compareAnswers(
        userAnswer,
        correctAnswer,
        question.type
      );

      return {
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.explanation || 'No explanation provided',
      };
    });

    // Calculate overall score
    const correctCount = questionFeedback.filter(
      (item: any) => item.isCorrect
    ).length;
    const score =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;

    // Generate overall feedback based on score
    let overallFeedback = '';
    if (score >= 90) {
      overallFeedback =
        'Excellent work! You have a great understanding of the content.';
    } else if (score >= 70) {
      overallFeedback = 'Good job! You understood most of the content.';
    } else if (score >= 50) {
      overallFeedback =
        "You're making progress. Keep practicing to improve your comprehension.";
    } else {
      overallFeedback =
        'This was challenging. Try reviewing the transcript and vocabulary to better understand the content.';
    }

    // Update user progress in database
    const updatedProgress = {
      ...listeningSession.userProgress,
      questionsAnswered: questions.length,
      correctAnswers: correctCount,
      comprehensionScore: score,
      completionTime: new Date(),
      userAnswers: answers.reduce((obj, answer, index) => {
        obj[`q${index}`] = answer;
        return obj;
      }, {}),
    };

    await ListeningSession.findByIdAndUpdate(id, {
      $set: { userProgress: updatedProgress },
    });

    // Return feedback
    return NextResponse.json({
      score,
      correctCount,
      totalQuestions: questions.length,
      questionFeedback,
      overallFeedback,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to compare answers with different comparison logic based on question type
function compareAnswers(
  userAnswer: string,
  correctAnswer: string,
  type: string
): boolean {
  if (!userAnswer) return false;

  // Normalize the question type
  const questionType = normalizeQuestionType(type);

  // For multiple choice and true-false, do direct comparison
  if (questionType === 'multiple-choice' || questionType === 'true-false') {
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  }

  // For fill-blank, be more lenient with comparison
  if (questionType === 'fill-blank') {
    // Normalize answers by trimming, lowercasing, and removing extra spaces
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ');
    const normalizedCorrect = correctAnswer
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');

    // Check if answers match exactly after normalization
    if (normalizedUser === normalizedCorrect) return true;

    // Check if correct answer is contained in user answer
    if (normalizedUser.includes(normalizedCorrect)) return true;

    // Check if user answer is contained in correct answer
    if (normalizedCorrect.includes(normalizedUser)) return true;

    // Calculate similarity ratio (simple approach)
    const words1 = normalizedUser.split(' ');
    const words2 = normalizedCorrect.split(' ');
    const commonWords = words1.filter(word => words2.includes(word)).length;
    const totalWords = Math.max(words1.length, words2.length);

    // If 75% or more words match, consider it correct
    return commonWords / totalWords >= 0.75;
  }

  return false;
}

async function generateFeedback(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
  transcript: string
): Promise<string> {
  try {
    // Create a prompt for the AI to generate feedback
    const prompt = `
Question from listening exercise: "${question}"
User's answer: "${userAnswer}"
Correct answer: "${correctAnswer}"
Is the answer correct: ${isCorrect ? 'Yes' : 'No'}

Relevant part of the transcript: 
${extractRelevantTranscriptPart(transcript, question, correctAnswer)}

Please provide helpful, encouraging feedback for this answer. If the answer is incorrect, explain why and what the correct answer should be based on the transcript. Keep your feedback concise but instructive (maximum 3 sentences).
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful language learning assistant providing feedback on listening comprehension exercises.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      (isCorrect
        ? 'Correct answer!'
        : `Incorrect. The correct answer is: ${correctAnswer}`)
    );
  } catch (error) {
    console.error('Error generating individual feedback:', error);
    return isCorrect
      ? 'Correct answer!'
      : `Incorrect. The correct answer is: ${correctAnswer}`;
  }
}

async function generateOverallFeedback(
  feedbackItems: any[],
  score: number,
  level: string
): Promise<string> {
  try {
    // Summarize the feedback items
    const correctCount = feedbackItems.filter(item => item.isCorrect).length;
    const incorrectCount = feedbackItems.length - correctCount;

    const incorrectQuestions = feedbackItems
      .filter(item => !item.isCorrect)
      .map(item => item.question)
      .join('\n- ');

    // Create a prompt for the AI to generate overall feedback
    const prompt = `
The user has completed a listening comprehension exercise at ${level} level.
Score: ${score}% (${correctCount} correct answers out of ${feedbackItems.length} questions)

${
  incorrectCount > 0
    ? `Questions the user got wrong:
- ${incorrectQuestions}`
    : 'The user answered all questions correctly!'
}

Please provide encouraging overall feedback on their performance. Focus on their strengths but also provide specific advice on how they can improve their listening skills based on the types of questions they got wrong. Keep it to a maximum of 3-4 sentences.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful language learning assistant providing feedback on listening comprehension exercises.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      `You scored ${score}%. Keep practicing to improve your listening skills!`
    );
  } catch (error) {
    console.error('Error generating overall feedback:', error);
    return `You scored ${score}%. Keep practicing to improve your listening skills!`;
  }
}

function extractRelevantTranscriptPart(
  transcript: string,
  question: string,
  answer: string
): string {
  // Create a simplified version of the transcript for search
  const simplifiedTranscript = transcript.toLowerCase();
  const simplifiedAnswer = answer.toLowerCase();

  // Try to find the relevant part of the transcript containing the answer
  const answerIndex = simplifiedTranscript.indexOf(simplifiedAnswer);

  if (answerIndex >= 0) {
    // Extract a context window around the answer (100 characters before and after)
    const startIndex = Math.max(0, answerIndex - 100);
    const endIndex = Math.min(
      transcript.length,
      answerIndex + answer.length + 100
    );
    return transcript.substring(startIndex, endIndex) + '...';
  }

  // If we can't find the exact answer, return a short version of the transcript
  return transcript.length > 300
    ? transcript.substring(0, 300) + '...'
    : transcript;
}
