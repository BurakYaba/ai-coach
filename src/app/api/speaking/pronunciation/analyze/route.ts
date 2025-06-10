import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { performPronunciationAssessment } from "@/lib/azure-speech";

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

    // Parse form data (expecting audio file and reference text)
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const referenceText = formData.get("referenceText") as string;
    const word = formData.get("word") as string;

    if (!audioFile || !referenceText) {
      return NextResponse.json(
        { error: "Missing audio file or reference text" },
        { status: 400 }
      );
    }

    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Perform pronunciation assessment using Azure Speech
    const assessmentResult = await performPronunciationAssessment(
      audioBuffer,
      referenceText
    );

    // Extract specific feedback for pronunciation practice
    const feedback = {
      overallScore: Math.round(assessmentResult.pronunciationScore * 10),
      fluencyScore: Math.round(assessmentResult.fluencyScore * 10),
      completenessScore: Math.round(assessmentResult.completenessScore * 10),
      wordLevelFeedback: assessmentResult.wordLevelAssessment?.map(
        wordAssessment => ({
          word: wordAssessment.word,
          pronunciationScore: Math.round(
            wordAssessment.pronunciationScore * 10
          ),
          phonemes: wordAssessment.phonemes?.map(phoneme => ({
            phoneme: phoneme.phoneme,
            score: Math.round(phoneme.score * 10),
            feedback: getPhoneFeedback(
              phoneme.phoneme,
              Math.round(phoneme.score * 10)
            ),
          })),
        })
      ),
      suggestions: generatePronunciationSuggestions(assessmentResult, word),
      strengths: generateStrengths(assessmentResult),
      areasForImprovement: generateAreasForImprovement(assessmentResult),
    };

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error in pronunciation analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze pronunciation" },
      { status: 500 }
    );
  }
}

// Helper function to generate phoneme-specific feedback
function getPhoneFeedback(phoneme: string, score: number): string {
  if (score >= 90) {
    return `Excellent pronunciation of ${phoneme}!`;
  } else if (score >= 80) {
    return `Good pronunciation of ${phoneme}, keep practicing!`;
  } else if (score >= 70) {
    return `${phoneme} needs some work. Focus on tongue/lip position.`;
  } else {
    return `${phoneme} needs significant improvement. Practice this sound more.`;
  }
}

// Generate specific suggestions based on assessment results
function generatePronunciationSuggestions(result: any, word: string): string[] {
  const suggestions: string[] = [];

  const pronunciationScore = Math.round(result.pronunciationScore * 10);
  const fluencyScore = Math.round(result.fluencyScore * 10);
  const completenessScore = Math.round(result.completenessScore * 10);

  if (pronunciationScore < 80) {
    suggestions.push(
      `Practice saying "${word}" slowly, focusing on each sound`
    );
    suggestions.push(
      "Record yourself and compare with the model pronunciation"
    );
  }

  if (fluencyScore < 80) {
    suggestions.push("Work on speaking more smoothly without hesitation");
    suggestions.push(
      "Practice the word in different sentences to improve fluency"
    );
  }

  if (completenessScore < 80) {
    suggestions.push("Make sure to pronounce the entire word clearly");
    suggestions.push("Don't drop sounds at the beginning or end of words");
  }

  // Add phoneme-specific suggestions based on common problems
  if (word.includes("th")) {
    suggestions.push("For 'th' sounds: put your tongue between your teeth");
  }

  if (word.includes("r") || word.includes("l")) {
    suggestions.push(
      "For R/L sounds: practice tongue position - R curled back, L touching roof"
    );
  }

  return suggestions.length > 0
    ? suggestions
    : ["Keep practicing! Your pronunciation is improving."];
}

// Generate strengths based on good scores
function generateStrengths(result: any): string[] {
  const strengths: string[] = [];

  const pronunciationScore = Math.round(result.pronunciationScore * 10);
  const fluencyScore = Math.round(result.fluencyScore * 10);
  const completenessScore = Math.round(result.completenessScore * 10);

  if (pronunciationScore >= 80) {
    strengths.push("Clear pronunciation of individual sounds");
  }

  if (fluencyScore >= 80) {
    strengths.push("Good speech flow and rhythm");
  }

  if (completenessScore >= 80) {
    strengths.push("Complete pronunciation of all word parts");
  }

  return strengths.length > 0
    ? strengths
    : ["Good effort! Keep practicing to see improvement."];
}

// Generate areas for improvement
function generateAreasForImprovement(result: any): string[] {
  const areas: string[] = [];

  const pronunciationScore = Math.round(result.pronunciationScore * 10);
  const fluencyScore = Math.round(result.fluencyScore * 10);
  const completenessScore = Math.round(result.completenessScore * 10);

  if (pronunciationScore < 80) {
    areas.push("Individual sound clarity");
  }

  if (fluencyScore < 80) {
    areas.push("Speech rhythm and flow");
  }

  if (completenessScore < 80) {
    areas.push("Complete word pronunciation");
  }

  return areas;
}
