import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { OpenAIWritingAnalyzer } from "@/lib/openai-writing-analyzer";
import GrammarIssue from "@/models/GrammarIssue";
import WritingSession, { IWritingSession } from "@/models/WritingSession";

// Set to force-dynamic to handle server-side requests properly
export const dynamic = "force-dynamic";

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
        { error: "You must be logged in to analyze a writing session" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const writingSession = await WritingSession.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    if (writingSession.status !== "submitted") {
      return NextResponse.json(
        { error: "Writing session must be submitted before analysis" },
        { status: 400 }
      );
    }

    // Set a controller to handle timeouts more gracefully
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 55000); // 55 second timeout

    try {
      const analysis = await analyzeWriting(writingSession);

      // Clear the timeout since the operation completed successfully
      clearTimeout(timeoutId);

      writingSession.analysis = analysis;
      writingSession.status = "analyzed";
      writingSession.analyzedAt = new Date();

      // Store any grammar issues identified in the analysis
      if (
        analysis &&
        analysis.details &&
        analysis.details.grammar &&
        analysis.details.grammar.errorList &&
        Array.isArray(analysis.details.grammar.errorList) &&
        analysis.details.grammar.errorList.length > 0
      ) {
        // Determine CEFR level based on vocabulary complexity or user level
        let ceferLevel = "B1"; // Default level

        // If vocabulary level is available in the analysis, use it
        if (analysis.details.vocabulary && analysis.details.vocabulary.level) {
          const vocabLevel = analysis.details.vocabulary.level.toUpperCase();
          if (["A1", "A2", "B1", "B2", "C1", "C2"].includes(vocabLevel)) {
            ceferLevel = vocabLevel;
          }
        }

        // Create grammar issues from the error list
        const grammarIssuePromises = analysis.details.grammar.errorList.map(
          (error: any) => {
            return GrammarIssue.create({
              userId: writingSession.userId,
              sourceModule: "writing",
              sourceSessionId: writingSession._id,
              issue: {
                type: error.type,
                text: error.context,
                correction: error.suggestion,
                explanation: error.explanation,
              },
              ceferLevel: ceferLevel,
              category: error.type.split(" ")[0].toLowerCase(), // Extract category from error type
              resolved: false,
            });
          }
        );

        await Promise.all(grammarIssuePromises);
      }

      await writingSession.save();

      return NextResponse.json({
        success: true,
        session: writingSession,
      });
    } catch (analysisError) {
      // Clear the timeout
      clearTimeout(timeoutId);

      console.error("Analysis error:", analysisError);

      // Check if the operation was aborted due to timeout
      if (controller.signal.aborted) {
        return NextResponse.json(
          {
            error:
              "Analysis timed out. The essay may be too long or our servers are experiencing high load.",
            retryable: true,
          },
          { status: 504 }
        );
      }

      // Return more specific error for other analysis failures
      return NextResponse.json(
        {
          error:
            analysisError instanceof Error
              ? analysisError.message
              : "Failed to analyze writing",
          retryable: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in writing analysis route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        retryable: true,
      },
      { status: 500 }
    );
  }
}

async function analyzeWriting(writingSession: IWritingSession) {
  // Extract content and prompt information
  const { submission, prompt } = writingSession;
  const content = submission.content || "";
  const promptType = prompt.type;
  const promptTopic = prompt.topic;
  const targetLength = prompt.targetLength || 0;
  const actualLength = submission.finalVersion?.wordCount || 0;

  console.log("Using OpenAI for writing analysis...");

  // Check for user's language level in their profile, fallback to 'intermediate'
  // In a real app, you would fetch this from the user's profile
  const userLevel = "intermediate";

  // Pass the prompt structure in the format expected by the analyzer
  const writingPrompt = {
    text: prompt.text || "",
    type: promptType,
    topic: promptTopic,
    targetLength: targetLength,
    requirements: prompt.requirements || [],
    suggestedLength: {
      min: Math.max(50, targetLength * 0.8),
      max: targetLength * 1.2,
    },
  };

  try {
    // Call the OpenAI analyzer
    const openAIAnalysis = await openaiAnalyzer.analyzeSubmission({
      content,
      prompt: writingPrompt as any,
      level: userLevel,
    });

    console.log("OpenAI analysis successful");

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
              item.toLowerCase().includes("grammar") ||
              item.toLowerCase().includes("spelling") ||
              item.toLowerCase().includes("punctuation") ||
              item.toLowerCase().includes("sentence") ||
              item.toLowerCase().startsWith("grammar:")
          ),
          strengths: openAIAnalysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("grammar") ||
              item.toLowerCase().includes("spelling") ||
              item.toLowerCase().includes("punctuation") ||
              item.toLowerCase().includes("sentence") ||
              item.toLowerCase().startsWith("grammar strength")
          ),
          improvements: (() => {
            // Filter grammar-related improvements
            const grammarImprovements = [
              // First try to get improvements from areasForImprovement (new format)
              ...(openAIAnalysis.feedback.areasForImprovement || []),
              // Then try from regular improvements (old format)
              ...(openAIAnalysis.feedback.improvements || []),
            ].filter(
              item =>
                item.toLowerCase().includes("grammar") ||
                item.toLowerCase().includes("spelling") ||
                item.toLowerCase().includes("punctuation") ||
                item.toLowerCase().includes("sentence") ||
                item.toLowerCase().includes("verb") ||
                item.toLowerCase().includes("tense") ||
                item.toLowerCase().includes("article") ||
                item.toLowerCase().includes("preposition") ||
                item.toLowerCase().startsWith("grammar:") ||
                item.toLowerCase().startsWith("grammar improvement")
            );

            // If no grammar improvements found, add default ones based on grammarIssues
            if (grammarImprovements.length === 0) {
              // Check if there are grammar issues to reference
              if (
                openAIAnalysis.grammarIssues &&
                openAIAnalysis.grammarIssues.length > 0
              ) {
                // Create improvements based on the top grammar issues
                return openAIAnalysis.grammarIssues
                  .slice(0, 3)
                  .map(
                    issue =>
                      `Grammar improvement: ${issue.type} - ${issue.explanation}`
                  );
              }

              // If no specific issues, return general grammar improvement suggestions
              return [
                "Grammar improvement: Review your use of punctuation, particularly commas and periods, to ensure proper sentence structure.",
                "Grammar improvement: Pay attention to subject-verb agreement throughout your writing.",
                "Grammar improvement: Check for consistent verb tense usage across paragraphs.",
              ];
            }

            return grammarImprovements;
          })(),
        },
        vocabulary: {
          score: openAIAnalysis.vocabularyScore,
          level: openAIAnalysis.vocabularyAnalysis.level,
          // Use the dedicated vocabulary strengths/improvements from the vocabulary analysis
          strengths:
            openAIAnalysis.vocabularyAnalysis.strengths ||
            openAIAnalysis.feedback.strengths.filter(
              item =>
                item.toLowerCase().includes("vocabulary") ||
                item.toLowerCase().includes("word") ||
                item.toLowerCase().includes("term") ||
                item.toLowerCase().startsWith("vocabulary strength")
            ),
          improvements:
            openAIAnalysis.vocabularyAnalysis.improvements ||
            openAIAnalysis.feedback.improvements.filter(
              item =>
                item.toLowerCase().includes("vocabulary") ||
                item.toLowerCase().includes("word") ||
                item.toLowerCase().includes("term") ||
                item.toLowerCase().startsWith("vocabulary:") ||
                item.toLowerCase().startsWith("vocabulary improvement")
            ),
          wordFrequency: openAIAnalysis.vocabularyAnalysis.wordFrequency,
        },
        structure: {
          score: openAIAnalysis.coherenceScore,
          strengths: openAIAnalysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("structure") ||
              item.toLowerCase().includes("organization") ||
              item.toLowerCase().includes("coherence") ||
              item.toLowerCase().includes("flow") ||
              item.toLowerCase().includes("paragraph") ||
              item.toLowerCase().startsWith("structure strength")
          ),
          improvements: openAIAnalysis.feedback.improvements.filter(
            item =>
              item.toLowerCase().includes("structure") ||
              item.toLowerCase().includes("organization") ||
              item.toLowerCase().includes("coherence") ||
              item.toLowerCase().includes("flow") ||
              item.toLowerCase().includes("paragraph") ||
              item.toLowerCase().startsWith("structure:") ||
              item.toLowerCase().startsWith("structure improvement")
          ),
        },
        content: {
          score: openAIAnalysis.styleScore,
          relevance: Math.min(100, openAIAnalysis.styleScore + 5),
          depth: Math.min(100, openAIAnalysis.vocabularyScore + 5),
          strengths: openAIAnalysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("content") ||
              item.toLowerCase().includes("idea") ||
              item.toLowerCase().includes("argument") ||
              item.toLowerCase().includes("point") ||
              item.toLowerCase().includes("topic") ||
              item.toLowerCase().startsWith("content strength")
          ),
          improvements: openAIAnalysis.feedback.improvements.filter(
            item =>
              item.toLowerCase().includes("content") ||
              item.toLowerCase().includes("idea") ||
              item.toLowerCase().includes("argument") ||
              item.toLowerCase().includes("point") ||
              item.toLowerCase().includes("topic") ||
              item.toLowerCase().startsWith("content:") ||
              item.toLowerCase().startsWith("content improvement")
          ),
        },
      },
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error during writing analysis:", error);
    throw new Error(
      `Failed to analyze writing: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
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
    assessment = "too short";
    feedback = `Your submission is significantly shorter than the target length of approximately ${targetLength} words. Consider expanding your ideas with more details and examples.`;
  } else if (percentDifference < -10) {
    assessment = "slightly short";
    feedback = `Your submission is slightly shorter than the target length of approximately ${targetLength} words. You might want to develop some of your points further.`;
  } else if (percentDifference < 10) {
    assessment = "appropriate";
    feedback = `Your submission meets the target length requirement of approximately ${targetLength} words.`;
  } else if (percentDifference < 30) {
    assessment = "slightly long";
    feedback = `Your submission is slightly longer than the target length of approximately ${targetLength} words, but still acceptable.`;
  } else {
    assessment = "too long";
    feedback = `Your submission is significantly longer than the target length of approximately ${targetLength} words. Consider making your writing more concise by removing redundancies.`;
  }

  return { assessment, feedback };
}
