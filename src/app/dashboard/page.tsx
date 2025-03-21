import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const metadata: Metadata = {
  title: 'Dashboard - AI Language Learning Platform',
  description: 'Your learning dashboard',
};

// Add loading UI components
function UserStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

// User stats component to load asynchronously
async function UserStats({ userId }: { userId: string }) {
  await dbConnect();
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.progress.totalPoints}</div>
          <p className="text-xs text-muted-foreground">Keep earning points!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.progress.streak} days</div>
          <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  const userName = session.user.name || 'User';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your language learning progress
        </p>
      </div>

      <Suspense fallback={<UserStatsSkeleton />}>
        <UserStats userId={session.user.id} />
      </Suspense>
    </div>
  );
}
