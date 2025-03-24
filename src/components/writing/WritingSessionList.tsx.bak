'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface WritingSession {
  _id: string;
  prompt: {
    text: string;
    type: string;
    topic: string;
    targetLength: number;
  };
  submission: {
    content: string;
    finalVersion?: {
      submittedAt: string;
      wordCount: number;
    };
  };
  status: 'draft' | 'submitted' | 'analyzed' | 'completed';
  analysis?: {
    overallScore: number;
  };
  timeTracking: {
    startTime: string;
    totalTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function WritingSessionList() {
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 8; // 2 rows x 4 columns

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/writing/sessions');
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        console.error('Error fetching writing sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load writing sessions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/writing/sessions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions(sessions.filter(session => session._id !== id));
      toast({
        title: 'Success',
        description: 'Writing session deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting writing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete writing session',
        variant: 'destructive',
      });
    } finally {
      setSessionToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'analyzed':
        return <Badge variant="default">Analyzed</Badge>;
      case 'completed':
        return <Badge>Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Card key={i} className="h-full flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Writing Sessions</CardTitle>
          <CardDescription>
            You haven't created any writing sessions yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Start a new writing session to practice your writing skills.</p>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/writing/new">
            <Button>Create New Session</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentSessions.map(session => (
          <Card key={session._id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="capitalize text-base">
                    {session.prompt.type}: {session.prompt.topic}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Created {format(new Date(session.createdAt), 'PPP')}
                  </CardDescription>
                </div>
                <div>{getStatusBadge(session.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-2 text-xs text-muted-foreground mb-2">
                {session.prompt.text}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div>
                  <span className="font-medium">Words: </span>
                  {session.submission.finalVersion?.wordCount ||
                    (session.submission.content
                      ? session.submission.content.trim().split(/\s+/).length
                      : 0)}
                </div>
                <div>
                  <span className="font-medium">Target: </span>
                  {session.prompt.targetLength} words
                </div>
                {session.analysis && (
                  <div>
                    <span className="font-medium">Score: </span>
                    {session.analysis.overallScore}/100
                  </div>
                )}
                <div>
                  <span className="font-medium">Time: </span>
                  {Math.floor(session.timeTracking.totalTime / 60)} min
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex gap-2">
                <Link href={`/dashboard/writing/${session._id}`}>
                  <Button variant="default" size="sm">
                    {session.status === 'draft' ? 'Continue' : 'View'}
                  </Button>
                </Link>
                {session.status === 'analyzed' && (
                  <Link href={`/dashboard/writing/${session._id}/feedback`}>
                    <Button variant="outline" size="sm">
                      Feedback
                    </Button>
                  </Link>
                )}
              </div>
              <AlertDialog
                open={sessionToDelete === session._id}
                onOpenChange={open => !open && setSessionToDelete(null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSessionToDelete(session._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this writing session and all
                      associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(session._id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {pageNumbers.map(number => (
              <PaginationItem key={number}>
                <PaginationLink
                  onClick={() => setCurrentPage(number)}
                  isActive={currentPage === number}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
