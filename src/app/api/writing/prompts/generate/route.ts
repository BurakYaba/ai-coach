import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import WritingPrompt from '@/models/WritingPrompt';

import { generatePrompt } from '../route';

// POST /api/writing/prompts/generate - Generate a writing prompt
export async function POST(req: NextRequest) {
  try {
    // Validate user authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { level, topic, type } = body;

    // Validate required fields
    if (!level || !topic || !type) {
      return NextResponse.json(
        {
          error: 'Missing required fields: level, topic, and type are required',
        },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['essay', 'letter', 'story', 'argument'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid writing type: ${type}. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        {
          error: `Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`,
        },
        { status: 400 }
      );
    }

    console.log(
      `Generating prompt with validated parameters: type=${type}, level=${level}, topic=${topic}`
    );

    // Generate prompt using the function from parent route file with parameters in the correct order:
    // generatePrompt(level: string, type: string, topic?: string)
    const generatedPrompt = await generatePrompt(level, type, topic);

    // Connect to the database and save the prompt
    try {
      await dbConnect();

      // Check if a similar prompt already exists to avoid duplicates
      const existingPrompt = await WritingPrompt.findOne({
        type: generatedPrompt.type,
        level: generatedPrompt.level,
        topic: generatedPrompt.topic,
        text: generatedPrompt.text,
      });

      if (existingPrompt) {
        // If a similar prompt exists, return it instead of creating a duplicate
        console.log(`Found existing prompt with ID: ${existingPrompt._id}`);
        return NextResponse.json({ prompt: existingPrompt });
      }

      // Save the generated prompt to the database
      const savedPrompt = await WritingPrompt.create(generatedPrompt);
      console.log(
        `Saved generated prompt to database with ID: ${savedPrompt._id}`
      );

      // Return the saved prompt (which now has an _id)
      return NextResponse.json({ prompt: savedPrompt });
    } catch (dbError) {
      console.error('Error saving prompt to database:', dbError);
      // If saving fails, still return the generated prompt to the user
      // so they can continue with their writing session
      return NextResponse.json({ prompt: generatedPrompt });
    }
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
