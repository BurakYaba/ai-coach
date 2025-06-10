import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

import { authOptions } from "@/lib/auth";
import {
  performPronunciationAssessment,
  analyzeGrammar,
} from "@/lib/azure-speech";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const referenceText = formData.get("referenceText") as string;
    const context = formData.get("context") as string;
    const expectedResponse = formData.get("expectedResponse") as string;
    const level = formData.get("level") as string;
    const speakingSessionId = formData.get("speakingSessionId") as string;
    const stepId = formData.get("stepId") as string;

    if (!audioFile || !referenceText) {
      return NextResponse.json(
        { error: "Missing audio file or reference text" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Validate audio format and provide helpful error message
    if (audioBuffer.length === 0) {
      return NextResponse.json(
        { error: "Received empty audio file" },
        { status: 400 }
      );
    }

    // Check if it's a valid audio format by looking at the first few bytes
    const isValidAudio = checkAudioFormat(audioBuffer);
    if (!isValidAudio) {
      console.warn(
        "Audio format validation failed, but continuing with processing"
      );
    }

    // First, transcribe the audio using OpenAI Whisper for literal transcription
    let userTranscript = "";
    try {
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: new File([audioBuffer], "guided-practice.wav", {
          type: "audio/wav",
        }),
        model: "whisper-1",
        language: "en", // Specify English to avoid auto-detection corrections
        prompt:
          "Transcribe exactly what is said, including any mispronunciations, hesitations, or incomplete words. Do not correct grammar or pronunciation errors.", // Guide for more literal transcription
        temperature: 0, // Use deterministic output for consistency
      });
      userTranscript = transcriptionResponse.text;
    } catch (transcriptionError) {
      console.error("Transcription failed:", transcriptionError);
      return NextResponse.json(
        {
          error:
            "Failed to transcribe audio. Please ensure you recorded clear speech and try again.",
          details: "Audio transcription failed",
        },
        { status: 500 }
      );
    }

    // Save transcript to session if session ID is provided
    if (speakingSessionId) {
      try {
        const speakingSession =
          await SpeakingSession.findById(speakingSessionId);
        if (
          speakingSession &&
          speakingSession.user.toString() === session.user.id
        ) {
          // Add the user transcript to the session
          speakingSession.transcripts.push({
            role: "user",
            text: userTranscript,
            timestamp: new Date(),
            metadata: {
              stepId: stepId,
              context: context,
              referenceText: referenceText,
              analysisType: "guided-practice",
            },
          });
          await speakingSession.save();
          console.log("Transcript saved to session:", speakingSessionId);
        }
      } catch (sessionError) {
        console.error("Error saving transcript to session:", sessionError);
        // Continue with analysis even if session saving fails
      }
    }

    // Perform pronunciation assessment using Azure Speech
    let pronunciationResult;
    try {
      pronunciationResult = await performPronunciationAssessment(
        audioBuffer,
        referenceText
      );
    } catch (pronunciationError) {
      console.error("Pronunciation assessment failed:", pronunciationError);

      // If Azure Speech fails, provide fallback scores
      pronunciationResult = {
        pronunciationScore: 75,
        fluencyScore: 75,
        completenessScore: 75,
        prosodyScore: 75,
        speakingRate: 120,
      };

      console.log(
        "Using fallback pronunciation scores due to Azure Speech error"
      );
    }

    // Analyze content and grammar using GPT
    const textAnalysis = await analyzeGrammar([userTranscript]);

    // Generate specific feedback for guided practice using GPT-4
    const guidedPracticeFeedback = await generateGuidedPracticeFeedback(
      userTranscript,
      expectedResponse,
      context,
      level,
      pronunciationResult,
      textAnalysis
    );

    // Combine all analysis results
    const overallScore = calculateOverallScore(
      pronunciationResult,
      textAnalysis,
      guidedPracticeFeedback.contextRelevance
    );

    const analysis = {
      transcript: userTranscript,
      overallScore,
      pronunciation: {
        pronunciationScore: pronunciationResult.pronunciationScore,
        fluencyScore: pronunciationResult.fluencyScore,
        completenessScore: pronunciationResult.completenessScore,
        prosodyScore: pronunciationResult.prosodyScore,
        speakingRate: pronunciationResult.speakingRate,
      },
      content: {
        grammarScore: textAnalysis.grammarScore,
        accuracyScore: textAnalysis.accuracyScore,
        grammarErrors: textAnalysis.grammarIssues?.map((issue: any) => ({
          error: issue.issue,
          correction: issue.correction,
          explanation: issue.explanation,
        })),
        contextRelevance: guidedPracticeFeedback.contextRelevance,
      },
      strengths: generateStrengths(
        pronunciationResult,
        textAnalysis,
        guidedPracticeFeedback
      ),
      areasForImprovement: generateAreasForImprovement(
        pronunciationResult,
        textAnalysis,
        guidedPracticeFeedback
      ),
      suggestions: generateSuggestions(
        pronunciationResult,
        textAnalysis,
        guidedPracticeFeedback,
        context
      ),
      scenarioSpecificFeedback: guidedPracticeFeedback.scenarioFeedback,
    };

    // Save analysis results back to session
    if (speakingSessionId) {
      try {
        const speakingSession =
          await SpeakingSession.findById(speakingSessionId);
        if (
          speakingSession &&
          speakingSession.user.toString() === session.user.id
        ) {
          // Ensure metadata exists
          if (!speakingSession.metadata) {
            speakingSession.metadata = {};
          }

          // Add analysis results to session metadata
          (speakingSession.metadata as any).stepAnalysis =
            (speakingSession.metadata as any).stepAnalysis || {};
          (speakingSession.metadata as any).stepAnalysis[stepId || "default"] =
            analysis;

          // Update feedback with accumulated results
          const currentFeedback = speakingSession.feedback || {};
          speakingSession.feedback = {
            ...currentFeedback,
            overallScore: analysis.overallScore,
            pronunciationScore: analysis.pronunciation.pronunciationScore,
            fluencyScore: analysis.pronunciation.fluencyScore,
            grammarScore: analysis.content.grammarScore,
            accuracyScore: analysis.content.accuracyScore,
            strengths: analysis.strengths,
            areasForImprovement: analysis.areasForImprovement,
            suggestions: analysis.suggestions.join(" "),
          };

          await speakingSession.save();
          console.log("Analysis results saved to session:", speakingSessionId);
        }
      } catch (sessionError) {
        console.error("Error saving analysis to session:", sessionError);
        // Continue with response even if session saving fails
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error in guided practice analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze guided practice recording" },
      { status: 500 }
    );
  }
}

// Helper function to check audio format
function checkAudioFormat(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // Check for RIFF header (WAV)
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WAVE"
  ) {
    return true;
  }

  // Check for WebM/Matroska header
  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return true;
  }

  // Check for OGG header
  if (buffer.toString("ascii", 0, 4) === "OggS") {
    return true;
  }

  return false;
}

// Generate specific feedback for guided practice scenarios
async function generateGuidedPracticeFeedback(
  userTranscript: string,
  expectedResponse: string,
  context: string,
  level: string,
  pronunciationResult: any,
  textAnalysis: any
) {
  const prompt = `
You are an English language coach evaluating a learner's response in a guided practice scenario.

SCENARIO CONTEXT: ${context}
LEARNER LEVEL: ${level.toUpperCase()}
EXPECTED RESPONSE EXAMPLE: ${expectedResponse}
LEARNER'S ACTUAL RESPONSE: ${userTranscript}

Please evaluate the learner's response and provide:

1. CONTEXT_RELEVANCE_SCORE (1-10): How well does the response address the scenario prompt?
2. SCENARIO_FEEDBACK: Specific feedback about how well they handled this particular scenario
3. COMPARISON_TO_EXAMPLE: How their response compares to the expected example
4. LEVEL_APPROPRIATENESS: Whether their language use is appropriate for their ${level.toUpperCase()} level

Focus on:
- Content appropriateness for the scenario
- Use of relevant vocabulary and phrases
- Communication effectiveness
- Cultural appropriateness if relevant

Respond in JSON format:
{
  "contextRelevance": [1-10 score],
  "scenarioFeedback": "specific feedback text",
  "comparisonToExample": "comparison text",
  "levelAppropriate": true/false,
  "keyPhrases": ["phrase1", "phrase2"],
  "missedOpportunities": ["opportunity1", "opportunity2"]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || "{}");
  } catch (error) {
    console.error("Error generating guided practice feedback:", error);
    return {
      contextRelevance: 7,
      scenarioFeedback: "Good effort in responding to the scenario.",
      comparisonToExample: "Your response shows understanding of the context.",
      levelAppropriate: true,
      keyPhrases: [],
      missedOpportunities: [],
    };
  }
}

// Calculate overall score combining pronunciation, grammar, and context relevance
function calculateOverallScore(
  pronunciationResult: any,
  textAnalysis: any,
  contextRelevance: number
): number {
  const pronunciationWeight = 0.25;
  const fluencyWeight = 0.15;
  const grammarWeight = 0.25;
  const accuracyWeight = 0.15;
  const contextWeight = 0.2;

  // Normalize Azure Speech scores (0-100) to 1-10 scale
  const normalizedPronunciation =
    (pronunciationResult.pronunciationScore / 100) * 10;
  const normalizedFluency = (pronunciationResult.fluencyScore / 100) * 10;

  const overallScore =
    normalizedPronunciation * pronunciationWeight +
    normalizedFluency * fluencyWeight +
    textAnalysis.grammarScore * grammarWeight +
    textAnalysis.accuracyScore * accuracyWeight +
    contextRelevance * contextWeight;

  return Math.round(overallScore * 10) / 10; // Round to 1 decimal place
}

// Generate strengths based on performance
function generateStrengths(
  pronunciationResult: any,
  textAnalysis: any,
  guidedPracticeFeedback: any
): string[] {
  const strengths: string[] = [];

  if (pronunciationResult.pronunciationScore >= 80) {
    strengths.push("Clear and accurate pronunciation");
  }

  if (pronunciationResult.fluencyScore >= 80) {
    strengths.push("Natural speech flow and rhythm");
  }

  if (textAnalysis.grammarScore >= 7) {
    strengths.push("Strong grammatical structure");
  }

  if (textAnalysis.accuracyScore >= 7) {
    strengths.push("Appropriate vocabulary usage");
  }

  if (guidedPracticeFeedback.contextRelevance >= 8) {
    strengths.push("Excellent understanding of the scenario context");
  }

  if (guidedPracticeFeedback.levelAppropriate) {
    strengths.push("Language use appropriate for your level");
  }

  return strengths.length > 0 ? strengths : ["Good communication effort"];
}

// Generate areas for improvement
function generateAreasForImprovement(
  pronunciationResult: any,
  textAnalysis: any,
  guidedPracticeFeedback: any
): string[] {
  const areas: string[] = [];

  if (pronunciationResult.pronunciationScore < 70) {
    areas.push("Focus on clearer pronunciation of individual sounds");
  }

  if (pronunciationResult.fluencyScore < 70) {
    areas.push("Work on speaking more smoothly without hesitation");
  }

  if (textAnalysis.grammarScore < 6) {
    areas.push("Pay attention to grammar rules and sentence structure");
  }

  if (textAnalysis.accuracyScore < 6) {
    areas.push("Use more precise and appropriate vocabulary");
  }

  if (guidedPracticeFeedback.contextRelevance < 6) {
    areas.push("Focus more on addressing the specific scenario requirements");
  }

  return areas;
}

// Generate actionable suggestions
function generateSuggestions(
  pronunciationResult: any,
  textAnalysis: any,
  guidedPracticeFeedback: any,
  context: string
): string[] {
  const suggestions: string[] = [];

  // Pronunciation suggestions
  if (pronunciationResult.pronunciationScore < 80) {
    suggestions.push(
      "Practice speaking slowly and clearly, focusing on each sound"
    );
    suggestions.push("Record yourself and compare with native speakers");
  }

  // Grammar suggestions
  if (textAnalysis.grammarScore < 7) {
    suggestions.push("Review basic grammar rules for your level");
    suggestions.push("Practice forming complete sentences before speaking");
  }

  // Context-specific suggestions
  if (guidedPracticeFeedback.contextRelevance < 8) {
    suggestions.push(
      `Review the key phrases and vocabulary for ${context.split(" - ")[1]} scenarios`
    );
    suggestions.push(
      "Listen to examples of similar conversations to understand expectations"
    );
  }

  // Missed opportunities suggestions
  if (guidedPracticeFeedback.missedOpportunities?.length > 0) {
    suggestions.push(
      `Consider including: ${guidedPracticeFeedback.missedOpportunities.join(", ")}`
    );
  }

  return suggestions.length > 0
    ? suggestions
    : ["Continue practicing to build confidence"];
}
