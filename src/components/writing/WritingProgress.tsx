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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface WritingStats {
  totalSessions: number;
  completedSessions: number;
  sessionsLastWeek: number;
  averageScore: number;
  scoreChange: number;
  totalWords: number;
  wordsLastMonth: number;
  skillProgress: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    style: number;
  };
  streak: number;
  hasData: boolean;
}

export function WritingProgress() {
  const [stats, setStats] = useState<WritingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/writing/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch writing statistics');
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching writing statistics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your writing progress data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <WritingProgressSkeleton />;
  }

  if (!stats || !stats.hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>No Writing Data Available</CardTitle>
          <CardDescription>
            Complete some writing sessions to see your progress
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
              Submit your first writing session and get it analyzed to start
              tracking your progress. Your writing statistics will appear here
              once you have completed sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.sessionsLastWeek > 0
                ? `+${stats.sessionsLastWeek} from last week`
                : 'No new sessions this week'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 18V6m-8 6v6M8 6v4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.scoreChange > 0
                ? `+${stats.scoreChange}% from last month`
                : stats.scoreChange < 0
                  ? `${stats.scoreChange}% from last month`
                  : 'No change from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Written</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M6 9h12M6 12h12M6 15h12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalWords.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.wordsLastMonth > 0
                ? `+${stats.wordsLastMonth.toLocaleString()} from last month`
                : 'No new words this month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Writing Skills Progress</CardTitle>
          <CardDescription>
            Your progress across different writing skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Grammar</div>
                <div className="text-sm text-muted-foreground">
                  {stats.skillProgress.grammar}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stats.skillProgress.grammar}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Vocabulary</div>
                <div className="text-sm text-muted-foreground">
                  {stats.skillProgress.vocabulary}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stats.skillProgress.vocabulary}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Coherence</div>
                <div className="text-sm text-muted-foreground">
                  {stats.skillProgress.coherence}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stats.skillProgress.coherence}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Style</div>
                <div className="text-sm text-muted-foreground">
                  {stats.skillProgress.style}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stats.skillProgress.style}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Based on your last 5 writing sessions
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

function WritingProgressSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-4 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[180px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-[220px]" />
        </CardFooter>
      </Card>
    </>
  );
}
