import { AlertCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { DeleteSessionButton } from '@/components/reading/DeleteSessionButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';

export const metadata: Metadata = {
  title: 'Reading Practice',
  description: 'Improve your English reading skills with AI-powered content.',
};

// Add dynamic = 'force-dynamic' to ensure page is not statically cached
export const dynamic = 'force-dynamic';

interface ReadingSession {
  _id: string | any;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
  questions: any[];
  vocabulary: any[];
  userProgress: {
    questionsAnswered: number;
    vocabularyReviewed: string[];
    completionTime: string | null;
  };
}

// Add a type definition for the MongoDB document
interface MongoReadingSession {
  _id: any;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
  questions: any[];
  vocabulary: any[];
  userProgress: {
    questionsAnswered: number;
    vocabularyReviewed: string[];
    completionTime: string | null;
  };
}

// Update the ReadingSessionsResponse type
interface ReadingSessionsResponse {
  sessions: any[]; // Use any[] for flexibility with Mongoose types
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

// Loading skeleton component for reading sessions
function ReadingSessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow pb-3">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function getReadingSessions(
  userId: string,
  page: number = 1
): Promise<ReadingSessionsResponse> {
  try {
    // Set the limit to 8 sessions per page (2 rows x 4 columns)
    const limit = 8;
    const skip = (page - 1) * limit;

    await dbConnect();

    // Import the ReadingSession model directly
    const ReadingSession = (await import('@/models/ReadingSession')).default;

    // Use lean() for better performance, only select fields we need
    const sessions = await ReadingSession.find({ userId })
      .select(
        'title level topic wordCount estimatedReadingTime questions vocabulary userProgress'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ReadingSession.countDocuments({ userId });
    const pages = Math.ceil(total / limit);

    return {
      sessions,
      pagination: {
        total,
        pages,
        current: page,
        limit,
      },
    };
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    // Return a default empty response
    return {
      sessions: [],
      pagination: { total: 0, pages: 1, current: 1, limit: 8 },
    };
  }
}

// Separate component for reading sessions list
async function ReadingSessionsList({
  userId,
  currentPage,
}: {
  userId: string;
  currentPage: number;
}) {
  const { sessions, pagination } = await getReadingSessions(
    userId,
    currentPage
  );

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            No reading sessions yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start your first reading session to begin learning.
          </p>
          <Button asChild>
            <Link href="/dashboard/reading/new">Create Your First Session</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sessions.map(session => (
          <Card key={session._id.toString()} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base mb-1">
                    {session.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {session.wordCount} words • {session.estimatedReadingTime}{' '}
                    min read
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    session.userProgress.completionTime
                      ? 'secondary'
                      : 'default'
                  }
                  className="text-xs"
                >
                  {session.userProgress.completionTime
                    ? 'Completed'
                    : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pb-3">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        ((session.userProgress.questionsAnswered +
                          session.userProgress.vocabularyReviewed.length) /
                          (session.questions.length +
                            session.vocabulary.length)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      ((session.userProgress.questionsAnswered +
                        session.userProgress.vocabularyReviewed.length) /
                        (session.questions.length +
                          session.vocabulary.length)) *
                        100
                    )}
                    className="h-1"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {session.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {session.topic}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
              <Button asChild variant="secondary" className="w-full h-9">
                <Link href={`/dashboard/reading/${session._id.toString()}`}>
                  {session.userProgress.completionTime
                    ? 'Review Session'
                    : 'Continue Reading'}
                </Link>
              </Button>
              <DeleteSessionButton sessionId={session._id.toString()} />
            </CardFooter>
          </Card>
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {pagination.current > 1 && (
              <PaginationItem>
                <Link
                  href={`/dashboard/reading?page=${pagination.current - 1}`}
                >
                  <PaginationPrevious />
                </Link>
              </PaginationItem>
            )}
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              page => (
                <PaginationItem key={page}>
                  <Link href={`/dashboard/reading?page=${page}`}>
                    <PaginationLink isActive={page === pagination.current}>
                      {page}
                    </PaginationLink>
                  </Link>
                </PaginationItem>
              )
            )}
            {pagination.current < pagination.pages && (
              <PaginationItem>
                <Link
                  href={`/dashboard/reading?page=${pagination.current + 1}`}
                >
                  <PaginationNext />
                </Link>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: { page?: string; error?: string; success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Get the current page from the URL query parameters
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // Handle success and error messages from URL parameters
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Set error message based on URL parameter
  if (searchParams.error) {
    switch (searchParams.error) {
      case 'invalid-id':
        errorMessage = 'Invalid session ID. Please try again.';
        break;
      case 'not-found':
        errorMessage = 'Reading session not found.';
        break;
      case 'delete-failed':
        errorMessage = 'Failed to delete reading session. Please try again.';
        break;
      default:
        errorMessage = 'An error occurred. Please try again.';
    }
  }

  // Set success message based on URL parameter
  if (searchParams.success === 'deleted') {
    successMessage = 'Reading session deleted successfully.';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reading Practice</h1>
          <p className="text-gray-600">
            Improve your reading comprehension with AI-generated content
            tailored to your level.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reading/new">Start New Session</Link>
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Suspense fallback={<ReadingSessionsSkeleton />}>
          <ReadingSessionsList
            userId={session.user.id}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
