'use client';

import { Calendar, Clock, Mic } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface SpeakingSession {
  _id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'active' | 'completed' | 'interrupted';
  voice: string;
}

export default function SpeakingDashboard() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SpeakingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/speaking/sessions');
        if (!response.ok) {
          throw new Error('Failed to fetch speaking sessions');
        }

        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        console.error('Error fetching speaking sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load speaking sessions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchSessions();
    }
  }, [session]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Speaking Practice</h1>
        <Link href="/speaking">
          <Button>
            <Mic className="mr-2 h-4 w-4" />
            Practice Speaking
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Your speaking practice statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Sessions:</span>
                <span className="font-bold">
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    sessions.length
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed Sessions:</span>
                <span className="font-bold">
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    sessions.filter(s => s.status === 'completed').length
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Total Practice Time:
                </span>
                <span className="font-bold">
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    formatDuration(
                      sessions.reduce(
                        (total, session) => total + (session.duration || 0),
                        0
                      )
                    )
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Recent Session</CardTitle>
            <CardDescription>
              Details about your last practice session
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(sessions[0].startTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Duration: {formatDuration(sessions[0].duration)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">
                    Status:{' '}
                    <span className="font-medium capitalize">
                      {sessions[0].status}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No sessions yet. Start practicing to see your stats!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Session History</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Session on{' '}
                      {new Date(session.startTime).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(session.startTime)} • Duration:{' '}
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : session.status === 'active'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}
                    >
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No speaking sessions found. Start practicing to see your history!
            </p>
            <div className="mt-4">
              <Link href="/speaking">
                <Button>Start Speaking Practice</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
