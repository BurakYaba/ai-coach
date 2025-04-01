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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardContent>
      </Card>
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-muted/20">
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-muted/20 transition-all duration-300 hover:shadow-md hover:border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-primary opacity-70"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary/90">
            {user.progress.totalPoints}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Keep earning points!
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-muted/20 transition-all duration-300 hover:shadow-md hover:border-secondary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-secondary opacity-70"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0v6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary/90">
            {user.progress.streak} days
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Keep up the momentum!
          </p>
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl backdrop-blur-sm border border-muted/10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, <span className="text-gradient">{userName}</span>!
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
