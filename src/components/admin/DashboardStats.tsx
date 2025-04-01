'use client';

import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface StatsProps {
  variant?: 'default' | 'overview';
}

interface AdminStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    activeToday: number;
    activeThisWeek: number;
    activeThisMonth: number;
    growth: Array<{
      _id: { year: number; month: number };
      count: number;
    }>;
  };
  sessions: {
    total: number;
    createdToday: number;
    createdThisWeek: number;
    createdThisMonth: number;
    completedTotal: number;
    completedToday: number;
    completionRate: number;
    byLevel: Array<{ _id: string; count: number }>;
    byContentType: Array<{ _id: string; count: number }>;
  };
  library: {
    total: number;
    public: number;
    byLevel: Array<{ _id: string; count: number }>;
  };
}

export function DashboardStats({ variant = 'default' }: StatsProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load admin statistics');
        toast({
          title: 'Error',
          description: 'Failed to load admin statistics',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-4 text-red-500">
        {error || 'Failed to load statistics'}
      </div>
    );
  }

  // For overview variant, just show the primary metrics
  if (variant === 'overview') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.users.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {stats.users.newToday} new today
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Listening Sessions</CardDescription>
            <CardTitle className="text-3xl">{stats.sessions.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {stats.sessions.completionRate}% completion rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Library Items</CardDescription>
            <CardTitle className="text-3xl">{stats.library.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {stats.library.public} public items
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Today</CardDescription>
            <CardTitle className="text-3xl">
              {stats.users.activeToday}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {Math.round((stats.users.activeToday / stats.users.total) * 100)}%
              of users
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detailed stats for the full dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.users.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>New today:</span>
                <span className="font-medium">{stats.users.newToday}</span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>New this week:</span>
                <span className="font-medium">{stats.users.newThisWeek}</span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>New this month:</span>
                <span className="font-medium">{stats.users.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Listening Sessions</CardDescription>
            <CardTitle className="text-3xl">{stats.sessions.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs">Completion Rate</div>
              <Progress value={stats.sessions.completionRate} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {stats.sessions.completedTotal} completed (
                {stats.sessions.completionRate}%)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Library Items</CardDescription>
            <CardTitle className="text-3xl">{stats.library.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs">Public vs Private</div>
              <Progress
                value={(stats.library.public / stats.library.total) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Public:</span>
                <span className="font-medium">{stats.library.public}</span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Private:</span>
                <span className="font-medium">
                  {stats.library.total - stats.library.public}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>User Activity</CardDescription>
            <CardTitle className="text-3xl">
              {stats.users.activeThisMonth}
            </CardTitle>
            <CardDescription>active this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Active today:</span>
                <span className="font-medium">{stats.users.activeToday}</span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Active this week:</span>
                <span className="font-medium">
                  {stats.users.activeThisWeek}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Activity rate:</span>
                <span className="font-medium">
                  {Math.round(
                    (stats.users.activeThisMonth / stats.users.total) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Types</CardTitle>
            <CardDescription>
              Distribution of listening session content types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.sessions.byContentType.map(item => (
                <div key={item._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium capitalize">
                      {item._id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((item.count / stats.sessions.total) * 100)}%
                    </div>
                  </div>
                  <Progress
                    value={(item.count / stats.sessions.total) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CEFR Level Distribution</CardTitle>
            <CardDescription>
              Distribution of content by language level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => {
                const sessionsWithLevel =
                  stats.sessions.byLevel.find(item => item._id === level)
                    ?.count || 0;
                const libraryWithLevel =
                  stats.library.byLevel.find(item => item._id === level)
                    ?.count || 0;

                return (
                  <div key={level} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Level {level}</div>
                      <div className="text-sm text-muted-foreground">
                        {sessionsWithLevel} sessions / {libraryWithLevel}{' '}
                        library items
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-16 text-xs text-right">Sessions</div>
                      <Progress
                        value={
                          stats.sessions.total > 0
                            ? (sessionsWithLevel / stats.sessions.total) * 100
                            : 0
                        }
                        className="h-2 flex-1"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-16 text-xs text-right">Library</div>
                      <Progress
                        value={
                          stats.library.total > 0
                            ? (libraryWithLevel / stats.library.total) * 100
                            : 0
                        }
                        className="h-2 flex-1 bg-secondary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
