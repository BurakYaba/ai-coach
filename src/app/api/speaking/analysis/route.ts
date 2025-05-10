import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { analyzeSessionRecordings } from "@/lib/azure-speech";
import GrammarIssue from "@/models/GrammarIssue";
import SpeakingSession from "@/models/SpeakingSession";

export async function POST(req: NextRequest) {
  try {
    const { audioBuffers, referenceTexts, sessionId, userLevel } =
      await req.json();

    if (
      !audioBuffers ||
      !Array.isArray(audioBuffers) ||
      audioBuffers.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid audio buffers" },
        { status: 400 }
      );
    }

    if (
      !referenceTexts ||
      !Array.isArray(referenceTexts) ||
      referenceTexts.length !== audioBuffers.length
    ) {
      return NextResponse.json(
        { error: "Missing or invalid reference texts" },
        { status: 400 }
      );
    }

    // Convert base64 strings to buffers
    const buffers = audioBuffers.map((base64: string) =>
      Buffer.from(base64.split(",")[1] || base64, "base64")
    );

    // Prepare audio and text pairs for analysis
    const recordings = buffers.map((buffer: Buffer, index: number) => ({
      buffer,
      referenceText: referenceTexts[index],
    }));

    // Analyze the recordings
    const analysisResult = await analyzeSessionRecordings(recordings);

    // Update the existing speaking session with feedback
    if (sessionId) {
      const speakingSession = await SpeakingSession.findById(sessionId);
      if (speakingSession) {
        speakingSession.feedback = {
          fluencyScore: analysisResult.fluencyScore,
          accuracyScore: analysisResult.accuracyScore,
          pronunciationScore: analysisResult.pronunciationScore,
          completenessScore: analysisResult.completenessScore,
          grammarScore: analysisResult.grammarScore,
          prosodyScore: analysisResult.prosodyScore,
          speakingRate: analysisResult.speakingRate,
          overallScore: analysisResult.overallScore,
          strengths: analysisResult.strengths,
          areasForImprovement: analysisResult.areasForImprovement,
          suggestions: analysisResult.suggestions,
          grammarIssues: analysisResult.grammarIssues,
          mispronunciations: analysisResult.mispronunciations,
        };
        await speakingSession.save();
      }
    }

    // No longer automatically store grammar issues - they will be added manually by the user
    // if (
    //   analysisResult &&
    //   analysisResult.grammarIssues &&
    //   Array.isArray(analysisResult.grammarIssues) &&
    //   analysisResult.grammarIssues.length > 0 &&
    //   sessionId
    // ) {
    //   const session = await getServerSession(authOptions);
    //   if (session?.user?.id) {
    //     // Create grammar issues from the error list
    //     const grammarIssuePromises = analysisResult.grammarIssues.map(
    //       (issue: any) => {
    //         return GrammarIssue.create({
    //           userId: session.user.id,
    //           sourceModule: 'speaking',
    //           sourceSessionId: sessionId,
    //           issue: {
    //             type: issue.issue || 'Grammar Error',
    //             text: issue.text,
    //             correction: issue.correction,
    //             explanation: issue.explanation,
    //           },
    //           ceferLevel: userLevel || 'B1', // Use the user's level or default to B1
    //           category: issue.issue?.includes(' ')
    //             ? issue.issue.split(' ')[0].toLowerCase()
    //             : 'grammar', // Extract category or use default
    //           resolved: false,
    //         });
    //       }
    //     );

    //     await Promise.all(grammarIssuePromises);
    //   }
    // }

    // Return the analysis results
    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (error: any) {
    console.error("Error in speech analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze speech", details: error.message },
      { status: 500 }
    );
  }
}
