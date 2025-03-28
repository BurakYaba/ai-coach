import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { deleteCloudinaryFile } from '@/lib/cloudinary';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

// GET /api/listening/[id] - Get a specific listening session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate session ID
    const { id } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get session by ID
    const listeningSession = await ListeningSession.findById(id);

    // Check if session exists
    if (!listeningSession) {
      return NextResponse.json(
        { error: 'Listening session not found' },
        { status: 404 }
      );
    }

    // Check if session belongs to the user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this session' },
        { status: 403 }
      );
    }

    return NextResponse.json(listeningSession);
  } catch (error) {
    console.error('Error fetching listening session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/listening/[id] - Update a listening session (primarily for progress updates)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate session ID
    const { id } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get session by ID
    const listeningSession = await ListeningSession.findById(id);

    // Check if session exists
    if (!listeningSession) {
      return NextResponse.json(
        { error: 'Listening session not found' },
        { status: 404 }
      );
    }

    // Check if session belongs to the user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this session' },
        { status: 403 }
      );
    }

    // Get update data from request body
    const updateData = await req.json();
    const { userProgress, completionTime } = updateData;

    // Update only allowed fields (primarily userProgress)
    const updateFields: any = {};

    if (userProgress) {
      // Merge with existing progress data instead of replacing
      updateFields['userProgress'] = {
        ...listeningSession.userProgress.toObject(),
        ...userProgress,
      };

      // If completionTime is provided, add it
      if (completionTime) {
        updateFields['userProgress'].completionTime = new Date(completionTime);
      }
    }

    // Update the session
    const updatedSession = await ListeningSession.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating listening session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/listening/[id] - Delete a listening session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate session ID
    const { id } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get session by ID
    const listeningSession = await ListeningSession.findById(id);

    // Check if session exists
    if (!listeningSession) {
      return NextResponse.json(
        { error: 'Listening session not found' },
        { status: 404 }
      );
    }

    // Check if session belongs to the user
    if (listeningSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this session' },
        { status: 403 }
      );
    }

    // Delete associated audio file from Cloudinary if it exists
    if (listeningSession.content.cloudinaryPublicId) {
      try {
        await deleteCloudinaryFile(
          listeningSession.content.cloudinaryPublicId,
          'video'
        );
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary file:', cloudinaryError);
        // Continue with session deletion even if Cloudinary delete fails
      }
    }

    // Delete the session
    await ListeningSession.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listening session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
