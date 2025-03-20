import { Metadata } from 'next';
import { ReadingSession } from '@/components/reading/ReadingSession';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ReadingSessionModel from '@/models/ReadingSession';

interface ReadingSessionPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Reading Session | AI Language Coach',
  description: 'Improve your reading skills with AI-powered reading sessions',
};

async function getReadingSession(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }

    await dbConnect();

    const readingSession = await ReadingSessionModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return null;
    }

    return JSON.parse(JSON.stringify(readingSession));
  } catch (error) {
    console.error('Error fetching reading session:', error);
    return null;
  }
}

export default async function ReadingSessionPage({
  params,
}: ReadingSessionPageProps) {
  const readingSession = await getReadingSession(params.id);

  if (!readingSession) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <ReadingSession sessionId={params.id} />
    </div>
  );
}
