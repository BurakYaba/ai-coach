"use client";

import { format } from "date-fns";
import { CircleCheck, Play, Trash2, Volume2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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
import { formatDuration } from "@/lib/utils";

interface ListeningSession {
  _id: string;
  title: string;
  level: string;
  topic: string;
  contentType: string;
  content: {
    transcript: string;
    audioUrl: string;
  };
  duration: number;
  questions: any[];
  vocabulary: any[];
  userProgress: {
    questionsAnswered: number;
    correctAnswers: number;
    vocabularyReviewed: string[];
    completionTime: string | null;
  };
  createdAt: string;
}

interface ListeningSessionsResponse {
  sessions: ListeningSession[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

interface SessionListProps {
  filter?: "all" | "completed" | "inprogress";
}

export function SessionList({ filter = "all" }: SessionListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const [sessions, setSessions] = useState<ListeningSession[]>([]);
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
          `/api/listening?page=${currentPage}&filter=${filter}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const data = await response.json();

        // Handle the API response format
        if (Array.isArray(data)) {
          // Current API returns a plain array
          setSessions(data);
          setPagination({
            total: data.length,
            pages: Math.ceil(data.length / 8),
            current: currentPage,
            limit: 8,
          });
        } else if (data.sessions) {
          // If API is updated to return pagination info
          setSessions(data.sessions);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching listening sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load listening sessions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentPage, filter]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/listening/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      setSessions(sessions.filter(session => session._id !== id));
      toast({
        title: "Success",
        description: "Listening session deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting listening session:", error);
      toast({
        title: "Error",
        description: "Failed to delete listening session",
        variant: "destructive",
      });
    } finally {
      setSessionToDelete(null);
    }
  };

  if (loading) {
    return <SessionSkeleton count={8} />;
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            {filter === "completed"
              ? "No completed sessions yet"
              : filter === "inprogress"
                ? "No sessions in progress"
                : "No listening sessions yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === "completed"
              ? "Complete listening sessions to see them here."
              : filter === "inprogress"
                ? "Start a session from the library to see it here."
                : "Browse the library tab to start your first listening session."}
          </p>
          <Button asChild>
            <Link href="/dashboard/listening?tab=library">
              Browse Listening Library
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // For client-side pagination when API doesn't support it yet
  const paginatedSessions = sessions.slice(
    (currentPage - 1) * pagination.limit,
    currentPage * pagination.limit
  );
  const displayedSessions =
    paginatedSessions.length > 0 ? paginatedSessions : sessions;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedSessions.map(session => {
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

          // A session is truly complete when progress is 100% (all questions answered and all vocabulary reviewed)
          const isFullyComplete = progressPercentage === 100;
          // Official completion status (has completionTime)
          const isMarkedComplete = !!session.userProgress?.completionTime;
          // Use the official status for display
          const isCompleted = isMarkedComplete;

          // Extract transcript snippet for description
          const transcript = session.content?.transcript || "";
          const description =
            transcript
              .split(/\.\s+/)
              .slice(0, 1)
              .join(". ")
              .substring(0, 100)
              .trim() + "...";

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
                  <span>{formatDuration(session.duration)}</span>
                  <span>•</span>
                  <span>{session.contentType}</span>
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
                      <Link href={`/dashboard/listening/${session._id}`}>
                        {isCompleted ? (
                          <>
                            <CircleCheck className="w-4 h-4 mr-2" />
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
                            This will permanently delete this listening session
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
        <Pagination className="mt-6">
          <PaginationContent>
            {pagination.current > 1 && (
              <PaginationItem>
                <Link
                  href={`/dashboard/listening?page=${pagination.current - 1}`}
                >
                  <PaginationPrevious />
                </Link>
              </PaginationItem>
            )}

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              page => (
                <PaginationItem key={page}>
                  <Link href={`/dashboard/listening?page=${page}`}>
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
                  href={`/dashboard/listening?page=${pagination.current + 1}`}
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

export function SessionSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
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
