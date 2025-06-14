"use client";

import { format } from "date-fns";
import { CheckCircle, Play, Trash2, PenTool } from "lucide-react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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
  status: "draft" | "submitted" | "analyzed" | "completed";
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

  const fetchSessions = async () => {
    try {
      setLoading(true);

      // Use the regular API endpoint instead of debug endpoint
      const response = await fetch("/api/writing/sessions", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      const fetchedSessions = data.sessions || [];

      // No need to sort here since the API already returns sessions in reverse chronological order
      setSessions(fetchedSessions);
    } catch (error) {
      console.error("Error fetching writing sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load writing sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/writing/sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      setSessions(sessions?.filter(session => session._id !== id) || []);
      toast({
        title: "Success",
        description: "Writing session deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting writing session:", error);
      toast({
        title: "Error",
        description: "Failed to delete writing session",
        variant: "destructive",
      });
    } finally {
      setSessionToDelete(null);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil((sessions?.length || 0) / sessionsPerPage);
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions =
    sessions?.slice(indexOfFirstSession, indexOfLastSession) || [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Card key={i} className="border-2 bg-gray-50">
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

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <PenTool className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Writing Sessions
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            You haven't created any writing sessions yet. Start practicing your
            writing skills!
          </p>
          <Link href="/dashboard/writing/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <PenTool className="w-4 h-4 mr-2" />
              Create New Session
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSessions.map(session => {
          // Calculate progress based on word count
          const currentWordCount =
            session.submission.finalVersion?.wordCount ||
            (session.submission.content
              ? session.submission.content.trim().split(/\s+/).length
              : 0);
          const progressPercentage = Math.min(
            Math.round((currentWordCount / session.prompt.targetLength) * 100),
            100
          );

          // Determine completion status
          const isCompleted =
            session.status === "completed" || session.status === "analyzed";
          const isSubmitted = session.status === "submitted" || isCompleted;

          // Get card styling based on status
          const getCardStyling = () => {
            if (isCompleted) {
              return "border-green-300 bg-green-50";
            } else if (isSubmitted) {
              return "border-blue-300 bg-blue-50";
            } else {
              return "border-orange-300 bg-orange-50";
            }
          };

          return (
            <Card
              key={session._id}
              className={`border-2 hover:shadow-lg transition-all duration-300 group ${getCardStyling()}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold capitalize"
                  >
                    {session.prompt.type}
                  </Badge>
                  {progressPercentage > 0 && (
                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-1.5 ml-3">
                      <div
                        className={`h-1.5 rounded-full ${isCompleted ? "bg-green-500" : isSubmitted ? "bg-blue-500" : "bg-orange-500"}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                  {session.prompt.topic}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {session.prompt.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>{currentWordCount} words</span>
                  <span>•</span>
                  <span>Target: {session.prompt.targetLength}</span>
                  {session.analysis && (
                    <>
                      <span>•</span>
                      <span>Score: {session.analysis.overallScore}/100</span>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : isSubmitted
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isSubmitted
                          ? "Submitted"
                          : "Draft"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {progressPercentage}% Complete
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {Math.floor(session.timeTracking.totalTime / 60)} min
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className={`flex-1 text-white group-hover:opacity-90 transition-colors ${
                        isCompleted
                          ? "bg-green-500 hover:bg-green-600"
                          : isSubmitted
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      <Link href={`/dashboard/writing/${session._id}`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {session.status === "draft" ? "Continue" : "View"}
                          </>
                        )}
                      </Link>
                    </Button>

                    {session.status === "analyzed" && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="px-3 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <Link
                          href={`/dashboard/writing/${session._id}/feedback`}
                        >
                          Feedback
                        </Link>
                      </Button>
                    )}

                    <AlertDialog
                      open={sessionToDelete === session._id}
                      onOpenChange={open => !open && setSessionToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                          onClick={() => setSessionToDelete(session._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this writing session
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-50 hover:text-blue-700"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
