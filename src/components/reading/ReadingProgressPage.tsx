'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface ReadingStats {
  totalSessions: number;
  completedSessions: number;
  sessionsLastWeek: number;
  averageComprehension: number;
  comprehensionChange: number;
  totalWords: number;
  wordsLastMonth: number;
  topicsRead: {
    name: string;
    count: number;
  }[];
  streak: number;
  hasData: boolean;
}

export function ReadingProgressPage() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/reading/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch reading statistics');
        }

        const data = await response.json();
        setStats(data.stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reading statistics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your reading progress data',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <ReadingProgressSkeleton />;
  }

  if (!stats || !stats.hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>No Reading Data Available</CardTitle>
          <CardDescription>
            Complete some reading sessions to see your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-12 w-12 text-muted-foreground mb-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <h3 className="text-lg font-medium mt-2">No data to display yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Complete your first reading session to start tracking your
              progress. Your reading statistics will appear here once you have
              completed sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedSessions} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.sessionsLastWeek} sessions this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Comprehension Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageComprehension}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.comprehensionChange > 0 ? '+' : ''}
              {stats.comprehensionChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Words Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWords}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.wordsLastMonth} in the last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Topics Read */}
      <Card>
        <CardHeader>
          <CardTitle>Topics Read</CardTitle>
          <CardDescription>Distribution of reading topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topicsRead.map(topic => (
              <div key={topic.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{topic.name}</span>
                  <span>{topic.count} sessions</span>
                </div>
                <Progress
                  value={(topic.count / stats.totalSessions) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Tips</CardTitle>
          <CardDescription>
            Personalized suggestions to improve your reading skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li className="text-sm">
              Try reading texts from more diverse topics to expand your
              vocabulary.
            </li>
            <li className="text-sm">
              Consistency is key - aim for at least one reading session per day.
            </li>
            <li className="text-sm">
              Review vocabulary from your completed sessions to reinforce
              learning.
            </li>
            <li className="text-sm">
              Challenge yourself with slightly more difficult texts to improve
              comprehension.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadingProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
