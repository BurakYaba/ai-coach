"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Play, CheckCircle, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";

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
  createdAt: string;
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
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

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

        const data: {
          sessions: ReadingSession[];
          pagination: {
            total: number;
            pages: number;
            current: number;
            limit: number;
          };
        } = await response.json();
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/reading/sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      setSessions(sessions.filter(session => session._id !== id));
      toast({
        title: "Success",
        description: "Reading session deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting reading session:", error);
      toast({
        title: "Error",
        description: "Failed to delete reading session",
        variant: "destructive",
      });
    } finally {
      setSessionToDelete(null);
    }
  };

  if (loading) {
    return <ReadingSessionsSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No reading sessions yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Start your first reading session to begin improving your
            comprehension skills.
          </p>
          <Link href="/dashboard/reading/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Your First Session
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sessions.map(session => {
          // Calculate progress
          const totalQuestions = session.questions?.length || 0;
          const totalVocab = session.vocabulary?.length || 0;
          const answeredQuestions =
            session.userProgress?.questionsAnswered || 0;
          const reviewedVocab =
            session.userProgress?.vocabularyReviewed?.length || 0;

          const progressPercentage =
            totalQuestions + totalVocab > 0
              ? Math.round(
                  ((answeredQuestions + reviewedVocab) /
                    (totalQuestions + totalVocab)) *
                    100
                )
              : 0;

          // Official completion status (has completionTime)
          const isCompleted = !!session.userProgress?.completionTime;

          // Get card styling based on completion status
          const getCardStyling = () => {
            if (isCompleted) {
              return "border-green-300 bg-green-50";
            } else {
              return "border-blue-300 bg-blue-50";
            }
          };

          return (
            <Card
              key={session._id}
              className={`border-2 hover:shadow-lg transition-all duration-300 group ${getCardStyling()}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {session.level}
                  </Badge>
                  {progressPercentage > 0 && (
                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-1.5 ml-3">
                      <div
                        className={`h-1.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                  {session.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{session.topic}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>{session.wordCount} words</span>
                  <span>•</span>
                  <span>{session.estimatedReadingTime} min read</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${isCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {progressPercentage}% Complete
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className={`flex-1 text-white group-hover:opacity-90 transition-colors ${isCompleted ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                      <Link href={`/dashboard/reading/${session._id}`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        )}
                      </Link>
                    </Button>
                    <AlertDialog
                      open={sessionToDelete === session._id}
                      onOpenChange={open => !open && setSessionToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          onClick={() => setSessionToDelete(session._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this reading session
                            and all associated data. This action cannot be
                            undone.
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
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {pagination.current > 1 && (
                <PaginationItem>
                  <Link
                    href={`/dashboard/reading?page=${pagination.current - 1}`}
                  >
                    <PaginationPrevious className="hover:bg-blue-50 hover:text-blue-700" />
                  </Link>
                </PaginationItem>
              )}
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                page => (
                  <PaginationItem key={page}>
                    <Link href={`/dashboard/reading?page=${page}`}>
                      <PaginationLink
                        isActive={page === pagination.current}
                        className={
                          page === pagination.current
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-50 hover:text-blue-700"
                        }
                      >
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
                    <PaginationNext className="hover:bg-blue-50 hover:text-blue-700" />
                  </Link>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}

// Skeleton loader for reading sessions
function ReadingSessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="border-2 bg-gray-50">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-1.5 w-20" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
