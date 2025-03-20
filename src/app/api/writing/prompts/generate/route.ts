import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

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

    // Generate prompt using the function from parent route file
    const prompt = await generatePrompt(level, topic, type);

    // Return the generated prompt
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
