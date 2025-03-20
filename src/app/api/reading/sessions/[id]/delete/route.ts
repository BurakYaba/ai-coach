import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ReadingSession from '@/models/ReadingSession';

// POST /api/reading/sessions/[id]/delete - Delete a reading session and redirect
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Processing DELETE request for reading session: ${params.id}`);

    // Validate session ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.warn(`Invalid session ID format: ${params.id}`);
      return NextResponse.redirect(
        new URL('/dashboard/reading?error=invalid-id', req.url)
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn('Unauthorized attempt to delete reading session');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Ensure we have a valid user ID
    const userId = session.user.id;
    if (!userId) {
      console.warn('User ID not found in session');
      return NextResponse.redirect(
        new URL('/dashboard/reading?error=user-not-found', req.url)
      );
    }

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await dbConnect();
    console.log(
      `Checking if reading session ${params.id} exists for user: ${userId}`
    );

    const readingSession = await ReadingSession.findOne({
      _id: params.id,
      userId: userObjectId,
    });

    if (!readingSession) {
      console.warn(
        `Reading session not found: ${params.id} for user: ${userId}`
      );
      return NextResponse.redirect(
        new URL('/dashboard/reading?error=not-found', req.url)
      );
    }

    console.log(`Deleting reading session: ${params.id}`);
    await ReadingSession.findByIdAndDelete(params.id);

    console.log(`Successfully deleted reading session: ${params.id}`);

    // Redirect back to the reading sessions page with a success message
    return NextResponse.redirect(
      new URL('/dashboard/reading?success=deleted', req.url)
    );
  } catch (error) {
    console.error(`Error deleting reading session ${params.id}:`, error);
    return NextResponse.redirect(
      new URL(`/dashboard/reading?error=delete-failed`, req.url)
    );
  }
}
