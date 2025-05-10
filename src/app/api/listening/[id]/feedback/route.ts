import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { normalizeQuestionType } from "@/lib/utils";
import ListeningSession from "@/models/ListeningSession";
import { GamificationService } from "@/lib/gamification/gamification-service";

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Validate session ID
    const { id } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Get session by ID
    const listeningSession = await ListeningSession.findById(id);

    // Check if session exists
    if (!listeningSession) {
      return NextResponse.json(
        { error: "Listening session not found" },
        { status: 404 }
      );
    }

    // Check if session belongs to the user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have access to this session" },
        { status: 403 }
      );
    }

    // Get user answers from request body
    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    // Get questions from listening session
    const questions = listeningSession.questions || [];

    // Calculate results and generate feedback
    const questionFeedback = questions.map((question: any, index: number) => {
      const userAnswer = answers[index] || "";
      const correctAnswer = question.correctAnswer || "";

      // Add detailed debugging for answer evaluation
      console.log(`Evaluating question ${index + 1}:`);
      console.log(`- Question: ${question.question}`);
      console.log(`- Type: ${question.type}`);
      console.log(`- User answer: "${userAnswer}"`);
      console.log(`- Correct answer: "${correctAnswer}"`);

      const isCorrect = compareAnswers(
        userAnswer,
        correctAnswer,
        question.type
      );

      console.log(`- Is correct: ${isCorrect}`);

      return {
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.explanation || "No explanation provided",
      };
    });

    // Update user progress in database
    // First, extract existing user answers from the session
    // Convert Mongoose document to plain JavaScript object to avoid internal Mongoose properties
    const listeningSessionObj = listeningSession.toObject
      ? listeningSession.toObject()
      : listeningSession;

    // Extract existing user answers - ensuring it's a plain object
    const existingUserAnswers: Record<string, string> = {};
    // Check if userAnswers exists and is a Map
    if (
      listeningSessionObj.userProgress &&
      listeningSessionObj.userProgress.userAnswers
    ) {
      // If it's a Map object, convert it properly
      if (listeningSessionObj.userProgress.userAnswers instanceof Map) {
        for (const [
          key,
          value,
        ] of listeningSessionObj.userProgress.userAnswers.entries()) {
          existingUserAnswers[key] = value;
        }
      } else if (
        typeof listeningSessionObj.userProgress.userAnswers === "object"
      ) {
        // If it's already an object, copy it
        Object.assign(
          existingUserAnswers,
          listeningSessionObj.userProgress.userAnswers
        );
      }
    }

    const existingCorrectAnswers =
      listeningSessionObj.userProgress?.correctAnswers || 0;

    // Track which questions are being answered for the first time vs. re-answered
    let newCorrectAnswersCount = 0;
    let newIncorrectAnswersReplacingCorrect = 0;

    // Map to store all answers (existing + new)
    const updatedUserAnswers = { ...existingUserAnswers };

    // Process each answer in the current submission
    questionFeedback.forEach(
      (
        feedback: {
          userAnswer: string;
          isCorrect: boolean;
        },
        index: number
      ) => {
        const questionId = `q${index}`;
        const hasExistingAnswer = questionId in existingUserAnswers;
        const wasCorrect =
          hasExistingAnswer &&
          compareAnswers(
            existingUserAnswers[questionId],
            questions[index].correctAnswer,
            questions[index].type
          );

        // Only update if there's a new answer (not empty)
        if (feedback.userAnswer) {
          // Add this answer to the updated answers map
          updatedUserAnswers[questionId] = feedback.userAnswer;

          // Track correct/incorrect changes for XP calculation
          if (!hasExistingAnswer && feedback.isCorrect) {
            // New correct answer
            newCorrectAnswersCount++;
          } else if (hasExistingAnswer && wasCorrect && !feedback.isCorrect) {
            // User changed a previously correct answer to incorrect
            newIncorrectAnswersReplacingCorrect++;
          } else if (hasExistingAnswer && !wasCorrect && feedback.isCorrect) {
            // User changed a previously incorrect answer to correct
            newCorrectAnswersCount++;
          }
        }
      }
    );

    // Calculate the updated total of correct answers
    const totalCorrectAnswers = Math.max(
      0, // Ensure we never go below 0
      existingCorrectAnswers +
        newCorrectAnswersCount -
        newIncorrectAnswersReplacingCorrect
    );

    console.log("Correct answers calculation:", {
      existingCorrectAnswers,
      newCorrectAnswersCount,
      newIncorrectAnswersReplacingCorrect,
      totalCorrectAnswers,
    });

    // Count how many questions have answers
    const answeredQuestionsCount = Object.keys(updatedUserAnswers).length;

    // Calculate comprehension score based on total correct answers
    const comprehensionScore =
      answeredQuestionsCount > 0
        ? Math.round((totalCorrectAnswers / answeredQuestionsCount) * 100)
        : 0;

    // Generate overall feedback based on score
    let overallFeedback = "";
    if (comprehensionScore >= 90) {
      overallFeedback =
        "Excellent work! You have a great understanding of the content.";
    } else if (comprehensionScore >= 70) {
      overallFeedback = "Good job! You understood most of the content.";
    } else if (comprehensionScore >= 50) {
      overallFeedback =
        "You're making progress. Keep practicing to improve your comprehension.";
    } else {
      overallFeedback =
        "This was challenging. Try reviewing the transcript and vocabulary to better understand the content.";
    }

    // Update the progress object with the new calculations
    const updatedProgress = {
      ...listeningSessionObj.userProgress,
      questionsAnswered: answeredQuestionsCount,
      correctAnswers: totalCorrectAnswers,
      comprehensionScore: comprehensionScore,
      userAnswers: updatedUserAnswers,
    };

    // Only set completionTime if all questions are answered and all vocabulary items are reviewed
    const allQuestionsAnswered =
      updatedProgress.questionsAnswered === questions.length;
    const allVocabularyReviewed =
      updatedProgress.vocabularyReviewed?.length ===
      listeningSession.vocabulary?.length;

    // Check if this session is being completed now (wasn't completed before)
    const wasCompletedBefore =
      !!listeningSessionObj.userProgress.completionTime;

    // Set completionTime only when the session is 100% complete
    let isNowCompleted = false;
    if (allQuestionsAnswered && allVocabularyReviewed) {
      updatedProgress.completionTime = new Date();
      isNowCompleted = !wasCompletedBefore;
      console.log("Setting completion time as all content has been completed");
    } else {
      console.log(
        "Not setting completion time as content is not fully completed:",
        {
          questionsAnswered: updatedProgress.questionsAnswered,
          totalQuestions: questions.length,
          vocabularyReviewed: updatedProgress.vocabularyReviewed?.length || 0,
          totalVocabulary: listeningSession.vocabulary?.length || 0,
        }
      );
    }

    console.log(
      `Saving user progress with comprehensionScore: ${comprehensionScore}`
    );

    // For database update, we need to convert the userAnswers to a format MongoDB can handle
    // Create a clean object with only the data we want to update to avoid Mongoose issues
    interface CleanProgress {
      questionsAnswered: number;
      correctAnswers: number;
      comprehensionScore: number;
      userAnswers: Record<string, string>;
      completionTime?: Date;
      vocabularyReviewed?: string[];
    }

    const cleanUpdatedProgress: CleanProgress = {
      questionsAnswered: updatedProgress.questionsAnswered,
      correctAnswers: updatedProgress.correctAnswers,
      comprehensionScore: updatedProgress.comprehensionScore,
      // For MongoDB Map fields, convert JS object to Map entries
      userAnswers: Object.fromEntries(Object.entries(updatedUserAnswers)),
    };

    // Add completionTime only if it's needed
    if (updatedProgress.completionTime) {
      cleanUpdatedProgress.completionTime = updatedProgress.completionTime;
    }

    // Keep any vocabularyReviewed from the original progress
    if (listeningSessionObj.userProgress?.vocabularyReviewed) {
      cleanUpdatedProgress.vocabularyReviewed =
        listeningSessionObj.userProgress.vocabularyReviewed;
    }

    console.log(
      `Saving user progress with comprehensionScore: ${comprehensionScore}`
    );

    // Debug log the object being saved
    console.log("User progress object:", {
      questionsAnswered: cleanUpdatedProgress.questionsAnswered,
      correctAnswers: cleanUpdatedProgress.correctAnswers,
      comprehensionScore: cleanUpdatedProgress.comprehensionScore,
      completionTime: cleanUpdatedProgress.completionTime,
    });

    // Prepare update object for MongoDB
    const updateObj = {
      $set: {
        "userProgress.questionsAnswered":
          cleanUpdatedProgress.questionsAnswered,
        "userProgress.correctAnswers": cleanUpdatedProgress.correctAnswers,
        "userProgress.comprehensionScore":
          cleanUpdatedProgress.comprehensionScore,
        "userProgress.userAnswers": cleanUpdatedProgress.userAnswers,
      } as Record<string, any>,
    };

    // Add completionTime if needed
    if (cleanUpdatedProgress.completionTime) {
      updateObj.$set["userProgress.completionTime"] =
        cleanUpdatedProgress.completionTime;
    }

    // Add vocabularyReviewed if available
    if (cleanUpdatedProgress.vocabularyReviewed) {
      updateObj.$set["userProgress.vocabularyReviewed"] =
        cleanUpdatedProgress.vocabularyReviewed;
    }

    // Perform the update
    await ListeningSession.findByIdAndUpdate(id, updateObj);

    // Award XP for gamification if the session is completed now
    if (isNowCompleted) {
      console.log(`Session ${id} completed, awarding XP`);
      try {
        // Award XP for completing the session
        await GamificationService.awardXP(
          session.user.id,
          "listening",
          "complete_session",
          {
            sessionId: id,
            timeSpent: listeningSessionObj.userProgress.timeSpent || 0,
            score: comprehensionScore,
          }
        );

        // Award XP for correct answers - use the total correct answers from updatedProgress
        const totalCorrectAnswers = updatedProgress.correctAnswers || 0;
        if (totalCorrectAnswers > 0) {
          console.log(
            `Awarding XP for ${totalCorrectAnswers} total correct answers`
          );
          await GamificationService.awardXP(
            session.user.id,
            "listening",
            "correct_answer",
            {
              sessionId: id,
              count: totalCorrectAnswers,
              isPartOfCompletedSession: true,
            }
          );
        }

        // Award XP for vocabulary reviews if any exist
        const vocabCount =
          listeningSessionObj.userProgress.vocabularyReviewed?.length || 0;
        if (vocabCount > 0) {
          console.log(
            `Awarding XP for ${vocabCount} vocabulary reviews in listening session ${id}`
          );
          await GamificationService.awardXP(
            session.user.id,
            "listening",
            "review_word",
            {
              sessionId: id,
              count: vocabCount,
              isPartOfCompletedSession: true,
            }
          );
        }

        console.log(
          `Successfully awarded XP for completed listening session ${id}`
        );
      } catch (error) {
        console.error(`Error awarding XP for listening session ${id}:`, error);
        // Don't fail the request if gamification fails
      }
    }

    // Verify the update by fetching the updated document
    const updatedSession = await ListeningSession.findById(id);
    console.log(
      "Verified saved comprehensionScore:",
      updatedSession.userProgress.comprehensionScore
    );

    // Return feedback
    return NextResponse.json({
      score: comprehensionScore,
      correctCount: totalCorrectAnswers,
      totalQuestions: questions.length,
      answers: questionFeedback.map(
        (
          item: {
            question: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
            explanation: string;
          },
          index: number
        ) => ({
          question: item.question,
          userAnswer: item.userAnswer,
          correctAnswer: item.correctAnswer,
          isCorrect: item.isCorrect,
          explanation: item.explanation,
        })
      ),
      overallFeedback,
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
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

  // Add detailed debug logging
  console.log("COMPARE ANSWERS DEBUG:");
  console.log(`- User answer raw: "${userAnswer}"`);
  console.log(`- Correct answer raw: "${correctAnswer}"`);
  console.log(`- Question type: ${type}`);

  // Normalize the question type
  const questionType = normalizeQuestionType(type);
  console.log(`- Normalized question type: ${questionType}`);

  // For multiple choice, do direct comparison
  if (questionType === "multiple-choice") {
    const result = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    console.log(`- Multiple choice comparison result: ${result}`);
    return result;
  }

  // For true-false, be more flexible with comparison
  if (questionType === "true-false") {
    // Convert both answers to lowercase for consistent comparison
    const userAnswerLower = userAnswer.toLowerCase();
    const correctAnswerLower = correctAnswer.toLowerCase();

    // Normalize answers - check if they represent the same boolean value
    // regardless of format (true/false, True/False, A/B)
    const isUserTrue = userAnswerLower === "true" || userAnswerLower === "a";
    const isUserFalse = userAnswerLower === "false" || userAnswerLower === "b";
    const isCorrectTrue =
      correctAnswerLower === "true" || correctAnswerLower === "a";
    const isCorrectFalse =
      correctAnswerLower === "false" || correctAnswerLower === "b";

    console.log(`- Is user answer true? ${isUserTrue}`);
    console.log(`- Is user answer false? ${isUserFalse}`);
    console.log(`- Is correct answer true? ${isCorrectTrue}`);
    console.log(`- Is correct answer false? ${isCorrectFalse}`);

    // Compare the normalized values
    const result =
      (isUserTrue && isCorrectTrue) || (isUserFalse && isCorrectFalse);

    console.log(`- True/false comparison result: ${result}`);
    return result;
  }

  // For fill-blank, be more lenient with comparison
  if (questionType === "fill-blank") {
    // Normalize answers by trimming, lowercasing, and removing extra spaces
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/\s+/g, " ");
    const normalizedCorrect = correctAnswer
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    // Check if answers match exactly after normalization
    if (normalizedUser === normalizedCorrect) return true;

    // Check if correct answer is contained in user answer
    if (normalizedUser.includes(normalizedCorrect)) return true;

    // Check if user answer is contained in correct answer
    if (normalizedCorrect.includes(normalizedUser)) return true;

    // Calculate similarity ratio (simple approach)
    const words1 = normalizedUser.split(" ");
    const words2 = normalizedCorrect.split(" ");
    const commonWords = words1.filter(word => words2.includes(word)).length;
    const totalWords = Math.max(words1.length, words2.length);

    const similarityRatio = commonWords / totalWords;
    console.log(`- Fill-blank similarity ratio: ${similarityRatio}`);

    // If 75% or more words match, consider it correct
    return similarityRatio >= 0.75;
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
Is the answer correct: ${isCorrect ? "Yes" : "No"}

Relevant part of the transcript: 
${extractRelevantTranscriptPart(transcript, question, correctAnswer)}

Please provide helpful, encouraging feedback for this answer. If the answer is incorrect, explain why and what the correct answer should be based on the transcript. Keep your feedback concise but instructive (maximum 3 sentences).
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful language learning assistant providing feedback on listening comprehension exercises.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      (isCorrect
        ? "Correct answer!"
        : `Incorrect. The correct answer is: ${correctAnswer}`)
    );
  } catch (error) {
    console.error("Error generating individual feedback:", error);
    return isCorrect
      ? "Correct answer!"
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
      .join("\n- ");

    // Create a prompt for the AI to generate overall feedback
    const prompt = `
The user has completed a listening comprehension exercise at ${level} level.
Score: ${score}% (${correctCount} correct answers out of ${feedbackItems.length} questions)

${
  incorrectCount > 0
    ? `Questions the user got wrong:
- ${incorrectQuestions}`
    : "The user answered all questions correctly!"
}

Please provide encouraging overall feedback on their performance. Focus on their strengths but also provide specific advice on how they can improve their listening skills based on the types of questions they got wrong. Keep it to a maximum of 3-4 sentences.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful language learning assistant providing feedback on listening comprehension exercises.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      `You scored ${score}%. Keep practicing to improve your listening skills!`
    );
  } catch (error) {
    console.error("Error generating overall feedback:", error);
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
    return transcript.substring(startIndex, endIndex) + "...";
  }

  // If we can't find the exact answer, return a short version of the transcript
  return transcript.length > 300
    ? transcript.substring(0, 300) + "..."
    : transcript;
}
