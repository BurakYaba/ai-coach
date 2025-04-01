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
    const searchTerm = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Add search filter if provided
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Fetch paginated users
    const users = await User.find(query)
      .select('_id name email image role createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // For each user, get their session stats
    const usersWithStats = await Promise.all(
      users.map(async user => {
        const userId = user._id.toString();

        // Total listening sessions
        const totalSessions = await ListeningSession.countDocuments({
          userId: userId,
        });

        // Completed sessions
        const completedSessions = await ListeningSession.countDocuments({
          userId: userId,
          isCompleted: true,
        });

        // Last active date - last session created
        const lastSession = await ListeningSession.findOne({
          userId: userId,
        }).sort({ createdAt: -1 });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          stats: {
            totalSessions,
            completedSessions,
            completionRate:
              totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
            lastActive: lastSession?.createdAt || user.createdAt,
          },
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
