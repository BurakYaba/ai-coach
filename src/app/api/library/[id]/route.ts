import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions, isAdmin } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ListeningSession from '@/models/ListeningSession';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const libraryItem = await ListeningSession.findById(id);

    if (!libraryItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    // Check if user is admin or if the item is public
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin && !libraryItem.isPublic) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(libraryItem);
  } catch (error) {
    console.error('Error fetching library item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch library item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // Ensure the item exists
    const existingItem = await ListeningSession.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    // Ensure isLibrary field remains true
    body.isLibrary = true;

    // Update the item
    const updatedItem = await ListeningSession.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating library item:', error);
    return NextResponse.json(
      { error: 'Failed to update library item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Find and delete the item
    const deletedItem = await ListeningSession.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Library item deleted successfully' });
  } catch (error) {
    console.error('Error deleting library item:', error);
    return NextResponse.json(
      { error: 'Failed to delete library item' },
      { status: 500 }
    );
  }
}
