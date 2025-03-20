import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const metadata: Metadata = {
  title: 'Dashboard - AI Language Learning Platform',
  description: 'Your learning dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const user = await User.findById(session?.user.id);

  if (!user) {
    throw new Error('User not found');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your language learning progress
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.progress.totalPoints}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep earning points!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.progress.streak} days
            </div>
            <p className="text-xs text-muted-foreground">
              Keep up the momentum!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.progress.readingLevel}
            </div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Writing Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.progress.writingLevel}
            </div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Goal</CardTitle>
            <CardDescription>
              You&apos;ve set a goal of {user.learningPreferences.dailyGoal}{' '}
              minutes per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Add progress bar component */}
            <div className="h-4 w-full rounded-full bg-secondary">
              <div
                className="h-4 rounded-full bg-primary"
                style={{ width: '60%' }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Focus</CardTitle>
            <CardDescription>Your preferred topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.learningPreferences.topics.map(topic => (
                <div
                  key={topic}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {topic}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
