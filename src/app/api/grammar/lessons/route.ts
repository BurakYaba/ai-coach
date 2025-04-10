import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GrammarIssue from '@/models/GrammarIssue';
import GrammarLesson from '@/models/GrammarLesson';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET /api/grammar/lessons - Get all grammar lessons for the user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const ceferLevel = url.searchParams.get('ceferLevel');
    const completed = url.searchParams.get('completed');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Build query
    const query: any = { userId: session.user.id };

    if (category) {
      query.category = category;
    }

    if (ceferLevel) {
      query.ceferLevel = ceferLevel;
    }

    if (completed !== null) {
      query.completed = completed === 'true';
    }

    // Execute query
    const lessons = await GrammarLesson.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ lessons });
  } catch (error: any) {
    console.error('Error fetching grammar lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar lessons', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/grammar/lessons/generate - Generate a new grammar lesson from issues
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.category || !body.ceferLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: category or ceferLevel' },
        { status: 400 }
      );
    }

    // If issueIds are provided, use them; otherwise, get issues by category and level
    let issues;
    if (
      body.issueIds &&
      Array.isArray(body.issueIds) &&
      body.issueIds.length > 0
    ) {
      issues = await GrammarIssue.find({
        _id: { $in: body.issueIds },
        userId: session.user.id,
      }).lean();
    } else {
      // Get issues based on category and CEFR level
      issues = await GrammarIssue.find({
        userId: session.user.id,
        category: body.category,
        ceferLevel: body.ceferLevel,
        resolved: false,
      })
        .limit(10) // Limit the number of issues to use for lesson generation
        .lean();
    }

    if (issues.length === 0) {
      return NextResponse.json(
        { error: 'No grammar issues found to generate lesson' },
        { status: 404 }
      );
    }

    // Generate lesson content using OpenAI
    const lessonContent = await generateLessonContent(
      issues,
      body.category,
      body.ceferLevel
    );

    // Create a new grammar lesson
    const grammarLesson = await GrammarLesson.create({
      userId: session.user.id,
      title: lessonContent.title,
      category: body.category,
      ceferLevel: body.ceferLevel,
      content: {
        explanation: lessonContent.explanation,
        examples: lessonContent.examples,
        exercises: lessonContent.exercises,
      },
      relatedIssues: issues.map(issue => issue._id),
      completed: false,
    });

    return NextResponse.json(
      { lesson: grammarLesson, message: 'Grammar lesson created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating grammar lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create grammar lesson', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/grammar/lessons/:id - Update a grammar lesson (mark as completed, update score)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Get the lesson ID from the URL or body
    let lessonId: string;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    lessonId = pathParts[pathParts.length - 1];

    if (!lessonId && body.lessonId) {
      lessonId = body.lessonId;
    }

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Find the lesson and ensure it belongs to the user
    const lesson = await GrammarLesson.findOne({
      _id: lessonId,
      userId: session.user.id,
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or access denied' },
        { status: 404 }
      );
    }

    // Update fields
    if (typeof body.completed === 'boolean') {
      lesson.completed = body.completed;
    }

    if (
      typeof body.score === 'number' &&
      body.score >= 0 &&
      body.score <= 100
    ) {
      lesson.score = body.score;
    }

    // Save the updated lesson
    await lesson.save();

    // If the lesson is marked as completed, also mark related issues as resolved
    if (body.completed === true && lesson.relatedIssues.length > 0) {
      await GrammarIssue.updateMany(
        {
          _id: { $in: lesson.relatedIssues },
          userId: session.user.id,
        },
        {
          $set: { resolved: true },
        }
      );
    }

    return NextResponse.json({
      message: 'Lesson updated successfully',
      lesson,
    });
  } catch (error: any) {
    console.error('Error updating grammar lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update grammar lesson', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to generate grammar lesson content using OpenAI
async function generateLessonContent(
  issues: any[],
  category: string,
  ceferLevel: string
) {
  // Extract relevant information from issues for prompt
  const issueExamples = issues.map(issue => ({
    type: issue.issue.type,
    incorrectText: issue.issue.text,
    correctedText: issue.issue.correction,
    explanation: issue.issue.explanation,
  }));

  // Create prompt for OpenAI
  const prompt = `You are an expert language teacher creating a grammar lesson for a ${ceferLevel} level English learner.
The lesson is about "${category}" grammar.

The learner has made the following errors:
${JSON.stringify(issueExamples, null, 2)}

Please create a comprehensive grammar lesson with the following components in valid JSON format:
{
  "title": "A clear, descriptive title for the lesson",
  "explanation": "A detailed explanation of the grammar rule(s) involved, appropriate for a ${ceferLevel} level learner. Include multiple paragraphs with clear explanations, usage rules, and exceptions.",
  "examples": [
    {
      "correct": "Example of correct usage",
      "incorrect": "Example of incorrect usage",
      "explanation": "Explanation of why the correct version is right and the incorrect version is wrong"
    },
    // Include at least 5 examples
  ],
  "exercises": [
    {
      "question": "A practice question for the learner",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Include this for multiple choice questions
      "correctAnswer": "The correct answer",
      "explanation": "Explanation of why this is the correct answer"
    },
    // Include at least 5 exercises of varying types (fill-in-the-blank, multiple choice, etc.)
  ]
}

Make sure to tailor the lesson to the specific errors the learner has made, but also cover the broader grammar concept thoroughly.`;

  // Call OpenAI to generate the lesson content
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert language teacher specializing in teaching English grammar.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  // Parse the response
  const responseContent = response.choices[0].message.content || '';

  try {
    // Extract JSON from the response - it might be wrapped in markdown code blocks
    const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseContent.match(/```\s*([\s\S]*?)\s*```/) || [
        null,
        responseContent,
      ];

    const jsonContent = jsonMatch[1] || responseContent;
    const lessonContent = JSON.parse(jsonContent);

    return {
      title: lessonContent.title,
      explanation: lessonContent.explanation,
      examples: lessonContent.examples || [],
      exercises: lessonContent.exercises || [],
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    console.log('Raw response:', responseContent);
    throw new Error('Failed to generate valid lesson content');
  }
}
