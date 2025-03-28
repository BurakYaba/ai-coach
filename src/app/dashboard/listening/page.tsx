import { AlertCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { ListeningStats } from '@/components/listening/ListeningStats';
import {
  SessionList,
  SessionSkeleton,
} from '@/components/listening/SessionList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Listening Practice | Language Coach',
  description: 'Improve your listening skills with personalized audio content',
};

export default async function ListeningDashboardPage({
  searchParams,
}: {
  searchParams: { page?: string; error?: string; success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

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
        errorMessage = 'Listening session not found.';
        break;
      case 'delete-failed':
        errorMessage = 'Failed to delete listening session. Please try again.';
        break;
      default:
        errorMessage = 'An error occurred. Please try again.';
    }
  }

  // Set success message based on URL parameter
  if (searchParams.success === 'deleted') {
    successMessage = 'Listening session deleted successfully.';
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Listening Practice
          </h1>
          <p className="text-muted-foreground">
            Improve your listening skills with personalized audio content
          </p>
        </div>
        <Link href="/dashboard/listening/create">
          <Button size="lg">Start New Practice</Button>
        </Link>
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

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Suspense fallback={<SessionSkeleton count={8} />}>
            <SessionList filter="all" />
          </Suspense>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Suspense
            fallback={
              <div className="h-[200px]">
                <div className="h-full w-full bg-muted/10 animate-pulse rounded-lg"></div>
              </div>
            }
          >
            <ListeningStats />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
