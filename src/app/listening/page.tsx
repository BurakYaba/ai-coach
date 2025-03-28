import { CircleCheck, Play, Plus, UserRound, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { ListeningStats } from '@/components/listening/ListeningStats';
import {
  SessionList,
  SessionSkeleton,
} from '@/components/listening/SessionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Listening Practice | Language Coach',
  description: 'Improve your listening skills with personalized audio content',
};

export default async function ListeningDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to access Listening Practice
          </h1>
          <p className="mt-4 text-gray-500">
            You need to be signed in to access this feature.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Listening Practice
          </h1>
          <p className="text-gray-500">
            Improve your listening skills with personalized content
          </p>
        </div>
        <Link href="/listening/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Practice
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Listening Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="h-[200px]">
                  <Skeleton className="h-full w-full" />
                </div>
              }
            >
              <ListeningStats />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/listening/create" className="h-full">
              <Card className="h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Create New Session</h3>
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Generate a new listening practice based on your level and
                    interests
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Suspense fallback={<SessionSkeleton count={5} />}>
              <SessionList filter="all" />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <Suspense fallback={<SessionSkeleton count={6} />}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SessionList filter="completed" />
            </div>
          </Suspense>
        </TabsContent>
        <TabsContent value="inprogress" className="mt-6">
          <Suspense fallback={<SessionSkeleton count={3} />}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SessionList filter="inprogress" />
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
