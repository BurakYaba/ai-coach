import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions, isAdmin } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    const level = searchParams.get('level');
    const isCompleted = searchParams.get('isCompleted');
    const isLibrary = searchParams.get('isLibrary');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Add filters if provided
    if (userId) query.userId = userId;
    if (level) query.level = level;
    if (isCompleted === 'true')
      query['userProgress.completionTime'] = { $ne: null };
    if (isCompleted === 'false') query['userProgress.completionTime'] = null;
    if (isLibrary === 'true') query.isLibrary = true;
    if (isLibrary === 'false') query.isLibrary = false;

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { contentType: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await ListeningSession.countDocuments(query);

    // Fetch paginated sessions
    const sessions = await ListeningSession.find(query)
      .select(
        '_id title level topic contentType duration userProgress.completionTime createdAt userId isLibrary isPublic'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get user info for each session
    const userIdSet = new Set(
      sessions.map(session => session.userId.toString())
    );
    const userIds = Array.from(userIdSet);
    const users = await User.find({ _id: { $in: userIds } }).select(
      '_id name email'
    );

    const userMap = users.reduce(
      (map, user) => {
        map[user._id.toString()] = {
          name: user.name,
          email: user.email,
        };
        return map;
      },
      {} as Record<string, { name: string; email: string }>
    );

    // Attach user info to sessions and transform data for the client
    const sessionsWithUserInfo = sessions.map(session => {
      const sessionObj = session.toObject();
      const userIdStr = sessionObj.userId.toString();

      // Check if completion time exists to determine if the session is completed
      const isCompleted = !!sessionObj.userProgress?.completionTime;

      return {
        ...sessionObj,
        isCompleted,
        completedAt: sessionObj.userProgress?.completionTime,
        user: userMap[userIdStr] || { name: 'Unknown', email: 'Unknown' },
      };
    });

    return NextResponse.json({
      sessions: sessionsWithUserInfo,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
