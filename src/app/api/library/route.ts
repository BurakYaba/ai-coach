import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions, isAdmin } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const topic = searchParams.get('topic');
    const contentType = searchParams.get('contentType');
    const isPublic = searchParams.get('isPublic');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = { isLibrary: true };

    // Add filters if provided
    if (level) query.level = level;
    if (category) query.category = category;
    if (topic) query.topic = topic;
    if (contentType) query.contentType = contentType;

    // Filter by published status if specified
    if (isPublic === 'true') query.isPublic = true;
    if (isPublic === 'false') query.isPublic = false;

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Regular users can only see public library items
    const isUserAdmin = await isAdmin(session.user.id);
    if (!isUserAdmin) {
      query.isPublic = true;
    }

    // Get total count for pagination
    const total = await ListeningSession.countDocuments(query);

    // Fetch paginated sessions
    const sessions = await ListeningSession.find(query)
      .select(
        '_id title level topic contentType duration category tags isPublic createdAt'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      sessions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching library sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch library sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'content',
      'level',
      'topic',
      'contentType',
      'duration',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Set library-specific fields
    body.isLibrary = true;
    body.userId = session.user.id; // Associate with the admin who created it

    // Create the library item
    const libraryItem = await ListeningSession.create(body);

    return NextResponse.json(libraryItem, { status: 201 });
  } catch (error) {
    console.error('Error creating library item:', error);
    return NextResponse.json(
      { error: 'Failed to create library item' },
      { status: 500 }
    );
  }
}
