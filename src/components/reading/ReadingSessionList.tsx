"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { DeleteSessionButton } from "@/components/reading/DeleteSessionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface ReadingSession {
  _id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
  questions: any[];
  vocabulary: any[];
  userProgress: {
    questionsAnswered: number;
    vocabularyReviewed: string[];
    completionTime: string | null;
  };
}

interface ReadingSessionsResponse {
  sessions: ReadingSession[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

export function ReadingSessionList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    current: currentPage,
    limit: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/reading/sessions?page=${currentPage}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const data: ReadingSessionsResponse = await response.json();
        setSessions(data.sessions);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching reading sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load reading sessions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentPage]);

  if (loading) {
    return <ReadingSessionsSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            No reading sessions yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start your first reading session to begin learning.
          </p>
          <Button asChild>
            <Link href="/dashboard/reading/new">Create Your First Session</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sessions.map(session => (
          <Card key={session._id.toString()} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base mb-1">
                    {session.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {session.wordCount} words • {session.estimatedReadingTime}{" "}
                    min read
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    session.userProgress.completionTime
                      ? "secondary"
                      : "default"
                  }
                  className="text-xs"
                >
                  {session.userProgress.completionTime
                    ? "Completed"
                    : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pb-3">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        ((session.userProgress.questionsAnswered +
                          session.userProgress.vocabularyReviewed.length) /
                          (session.questions.length +
                            session.vocabulary.length)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      ((session.userProgress.questionsAnswered +
                        session.userProgress.vocabularyReviewed.length) /
                        (session.questions.length +
                          session.vocabulary.length)) *
                        100
                    )}
                    className="h-1"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {session.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {session.topic}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
              <Button asChild variant="secondary" className="w-full h-9">
                <Link href={`/dashboard/reading/${session._id.toString()}`}>
                  {session.userProgress.completionTime
                    ? "Review Session"
                    : "Continue Reading"}
                </Link>
              </Button>
              <DeleteSessionButton sessionId={session._id.toString()} />
            </CardFooter>
          </Card>
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {pagination.current > 1 && (
              <PaginationItem>
                <Link
                  href={`/dashboard/reading?page=${pagination.current - 1}`}
                >
                  <PaginationPrevious />
                </Link>
              </PaginationItem>
            )}
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              page => (
                <PaginationItem key={page}>
                  <Link href={`/dashboard/reading?page=${page}`}>
                    <PaginationLink isActive={page === pagination.current}>
                      {page}
                    </PaginationLink>
                  </Link>
                </PaginationItem>
              )
            )}
            {pagination.current < pagination.pages && (
              <PaginationItem>
                <Link
                  href={`/dashboard/reading?page=${pagination.current + 1}`}
                >
                  <PaginationNext />
                </Link>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

function ReadingSessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow pb-3">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
