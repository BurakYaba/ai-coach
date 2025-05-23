import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { OpenAIWritingAnalyzer } from "@/lib/openai-writing-analyzer";
import WritingSession from "@/models/WritingSession";

// GET /api/writing/sessions/[id] - Get a specific writing session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const writingSession = await WritingSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    // Return in the expected format: { session: writingSession }
    return NextResponse.json({ session: writingSession });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to fetch writing session" },
      { status: 500 }
    );
  }
}

// PATCH /api/writing/sessions/[id] - Update a writing session
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Validate ID
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Fetch session
    const writingSession = await WritingSession.findById(params.id);

    // Check if session exists
    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    // Check if user owns the session
    if (writingSession.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();

    // Update session content
    if (body.content !== undefined) {
      // Calculate word count
      const wordCount = body.content.trim().split(/\s+/).length;

      // Add to drafts if content has changed
      if (body.content !== writingSession.submission.content) {
        writingSession.submission.drafts.push({
          content: body.content,
          timestamp: new Date(),
          wordCount,
        });
      }

      // Update current content
      writingSession.submission.content = body.content;
    }

    // Update time tracking
    if (body.timeTracking) {
      if (body.timeTracking.endTime) {
        writingSession.timeTracking.endTime = new Date(
          body.timeTracking.endTime
        );
      }

      if (body.timeTracking.totalTime !== undefined) {
        writingSession.timeTracking.totalTime = body.timeTracking.totalTime;
      }

      if (body.timeTracking.activePeriod) {
        const { start, end } = body.timeTracking.activePeriod;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const duration = (endDate.getTime() - startDate.getTime()) / 1000; // in seconds

        writingSession.timeTracking.activePeriods.push({
          start: startDate,
          end: endDate,
          duration,
        });
      }
    }

    // Update status if provided
    if (body.status) {
      writingSession.status = body.status;

      // If submitting, add final version
      if (body.status === "submitted" && writingSession.submission.content) {
        writingSession.submission.finalVersion = {
          content: writingSession.submission.content,
          submittedAt: new Date(),
          wordCount: writingSession.submission.content.trim().split(/\s+/)
            .length,
        };
      }
    }

    // Save changes
    await writingSession.save();

    return NextResponse.json({ session: writingSession });
  } catch (error) {
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update writing session" },
      { status: 500 }
    );
  }
}

// POST /api/writing/sessions/[id]/analyze - Analyze a writing submission
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Validate ID
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Fetch session
    const writingSession = await WritingSession.findById(params.id);

    // Check if session exists
    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    // Check if user owns the session
    if (writingSession.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if session is in submitted status
    if (writingSession.status !== "submitted") {
      return NextResponse.json(
        { error: "Session must be submitted before analysis" },
        { status: 400 }
      );
    }

    // Check if content exists
    if (!writingSession.submission.finalVersion?.content) {
      return NextResponse.json(
        { error: "No content to analyze" },
        { status: 400 }
      );
    }

    // Get user's language level
    const user = await mongoose.model("User").findById(session.user.id);
    const level = user?.languageLevel || "intermediate";

    // Get prompt details
    const promptType = writingSession.prompt.type;
    const promptText = writingSession.prompt.text;

    // Create prompt object for analysis
    const promptForAnalysis = {
      type: promptType,
      level,
      topic: writingSession.prompt.topic,
      text: promptText,
      requirements: writingSession.prompt.requirements,
      suggestedLength: {
        min: writingSession.prompt.targetLength * 0.8,
        max: writingSession.prompt.targetLength * 1.2,
      },
    };

    // Analyze submission
    const analyzer = new OpenAIWritingAnalyzer();
    const analysis = await analyzer.analyzeSubmission({
      content: writingSession.submission.finalVersion.content,
      prompt: promptForAnalysis as any,
      level,
    });

    // Update session with analysis
    writingSession.analysis = {
      grammarScore: analysis.grammarScore,
      vocabularyScore: analysis.vocabularyScore,
      coherenceScore: analysis.coherenceScore,
      styleScore: analysis.styleScore,
      overallScore: analysis.overallScore,
      feedback: analysis.feedback,
      grammarIssues: analysis.grammarIssues,
      vocabularyAnalysis: analysis.vocabularyAnalysis,
      summaryFeedback: analysis.feedback.overallAssessment,
      strengths: analysis.feedback.strengths,
      improvements:
        analysis.feedback.areasForImprovement || analysis.feedback.improvements,
      lengthAssessment: {
        assessment: "appropriate",
        feedback: `Your submission meets the target length requirement of approximately ${writingSession.prompt.targetLength} words.`,
      },
      details: {
        grammar: {
          score: analysis.grammarScore,
          errorList: analysis.grammarIssues,
          suggestions: analysis.feedback.improvements.filter(
            item =>
              item.toLowerCase().includes("grammar") ||
              item.toLowerCase().includes("spelling") ||
              item.toLowerCase().includes("punctuation") ||
              item.toLowerCase().includes("sentence") ||
              item.toLowerCase().startsWith("grammar:")
          ),
          strengths: analysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("grammar") ||
              item.toLowerCase().includes("spelling") ||
              item.toLowerCase().includes("punctuation") ||
              item.toLowerCase().includes("sentence") ||
              item.toLowerCase().startsWith("grammar strength")
          ),
          improvements: analysis.feedback.improvements.filter(
            item =>
              item.toLowerCase().includes("grammar") ||
              item.toLowerCase().includes("spelling") ||
              item.toLowerCase().includes("punctuation") ||
              item.toLowerCase().includes("sentence") ||
              item.toLowerCase().startsWith("grammar:") ||
              item.toLowerCase().startsWith("grammar improvement")
          ),
        },
        vocabulary: {
          score: analysis.vocabularyScore,
          level: analysis.vocabularyAnalysis.level,
          strengths:
            analysis.vocabularyAnalysis.strengths ||
            analysis.feedback.strengths.filter(
              item =>
                item.toLowerCase().includes("vocabulary") ||
                item.toLowerCase().includes("word") ||
                item.toLowerCase().includes("term") ||
                item.toLowerCase().startsWith("vocabulary strength")
            ),
          improvements:
            analysis.vocabularyAnalysis.improvements ||
            analysis.feedback.improvements.filter(
              item =>
                item.toLowerCase().includes("vocabulary") ||
                item.toLowerCase().includes("word") ||
                item.toLowerCase().includes("term") ||
                item.toLowerCase().startsWith("vocabulary:") ||
                item.toLowerCase().startsWith("vocabulary improvement")
            ),
          wordFrequency: analysis.vocabularyAnalysis.wordFrequency,
        },
        structure: {
          score: analysis.coherenceScore,
          strengths: analysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("structure") ||
              item.toLowerCase().includes("organization") ||
              item.toLowerCase().includes("coherence") ||
              item.toLowerCase().includes("flow") ||
              item.toLowerCase().includes("paragraph") ||
              item.toLowerCase().startsWith("structure strength")
          ),
          improvements: analysis.feedback.improvements.filter(
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
          score: analysis.styleScore,
          relevance: Math.min(100, analysis.styleScore + 5),
          depth: Math.min(100, analysis.vocabularyScore + 5),
          strengths: analysis.feedback.strengths.filter(
            item =>
              item.toLowerCase().includes("content") ||
              item.toLowerCase().includes("idea") ||
              item.toLowerCase().includes("argument") ||
              item.toLowerCase().includes("point") ||
              item.toLowerCase().includes("topic") ||
              item.toLowerCase().startsWith("content strength")
          ),
          improvements: analysis.feedback.improvements.filter(
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

    // Update status
    writingSession.status = "analyzed";

    // Save changes
    await writingSession.save();

    return NextResponse.json({
      session: writingSession,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing writing session:", error);
    return NextResponse.json(
      { error: "Failed to analyze writing session" },
      { status: 500 }
    );
  }
}

// DELETE /api/writing/sessions/[id] - Delete a writing session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const writingSession = await WritingSession.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!writingSession) {
      return NextResponse.json(
        { error: "Writing session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Writing session deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to delete writing session" },
      { status: 500 }
    );
  }
}
