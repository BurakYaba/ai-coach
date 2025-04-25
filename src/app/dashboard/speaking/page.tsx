"use client";

import { Calendar, Clock, Mic } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { DeleteSpeakingSessionButton } from "@/components/speaking/DeleteSpeakingSessionButton";
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

interface SpeakingSession {
  _id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: "active" | "completed" | "interrupted";
  voice: string;
  modelName: string;
  transcripts?: Array<{
    role: "user" | "assistant";
    text: string;
    timestamp: Date;
  }>;
  metadata?: {
    mode?: "realtime" | "turn-based";
    scenario?: string;
    level?: string;
  };
  feedback?: {
    fluencyScore?: number;
    accuracyScore?: number;
    vocabularyScore?: number;
    pronunciationScore?: number;
    completenessScore?: number;
    grammarScore?: number;
    prosodyScore?: number;
    speakingRate?: number;
    overallScore?: number;
    strengths?: string[];
    areasForImprovement?: string[];
    suggestions?: string;
    grammarIssues?: Array<{
      text: string;
      issue: string;
      correction: string;
      explanation: string;
    }>;
    mispronunciations?: Array<{
      word: string;
      phonemes?: Array<{
        phoneme: string;
        score: number;
      }>;
      pronunciationScore: number;
      offset: number;
      duration: number;
    }>;
  };
}

export default function SpeakingDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SpeakingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    current: currentPage,
    limit: 8,
  });

  // Function to fetch sessions data
  const fetchSessions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/speaking/sessions?page=${currentPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch speaking sessions");
      }

      const data = await response.json();
      setSessions(data.sessions);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching speaking sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load speaking sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or page changes
  useEffect(() => {
    if (session?.user) {
      fetchSessions();
    }
  }, [session, currentPage]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "N/A";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string, session: SpeakingSession) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Active
          </Badge>
        );
      case "interrupted":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Interrupted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get a more descriptive session type
  const getSessionType = (session: SpeakingSession): string => {
    if (session.metadata?.mode === "turn-based") {
      return "Turn-Based Conversation";
    } else if (session.metadata?.mode === "realtime") {
      return "Realtime Conversation";
    }
    return "Speaking Practice";
  };

  // Helper function to get a formatted scenario name
  const getScenarioName = (scenario?: string): string => {
    if (!scenario || scenario === "free") return "Free Conversation";

    // Capitalize first letter and add spaces
    return scenario
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Handler for when a card is clicked
  const handleSessionClick = (sessionId: string) => {
    router.push(`/dashboard/speaking/${sessionId}`);
  };

  // Calculate total stats for all sessions
  const calculateStats = () => {
    if (!sessions.length)
      return {
        totalTime: 0,
        avgDuration: 0,
        totalSessions: 0,
        completedSessions: 0,
      };

    const totalTime = sessions.reduce(
      (total, session) => total + (session.duration || 0),
      0
    );
    const completedSessions = sessions.filter(
      s => s.status === "completed"
    ).length;
    const avgDuration = totalTime / sessions.length;

    return {
      totalTime,
      avgDuration,
      totalSessions: sessions.length,
      completedSessions,
    };
  };

  const stats = calculateStats();

  // Count total words in transcripts (if available)
  const countTotalWords = () => {
    let totalWords = 0;

    sessions.forEach(session => {
      if (session.transcripts) {
        session.transcripts.forEach(transcript => {
          if (transcript.role === "user" && transcript.text) {
            // Count words in user transcripts
            totalWords += transcript.text.split(/\s+/).filter(Boolean).length;
          }
        });
      }
    });

    return totalWords;
  };

  const totalWords = countTotalWords();

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
                    pagination.total || sessions.length
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed Sessions:</span>
                <span className="font-bold">
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    stats.completedSessions
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
                    formatDuration(stats.totalTime)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Average Session Duration:
                </span>
                <span className="font-bold">
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    formatDuration(Math.round(stats.avgDuration))
                  )}
                </span>
              </div>
              {totalWords > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Total Words Spoken:
                  </span>
                  <span className="font-bold">
                    {loading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      totalWords.toLocaleString()
                    )}
                  </span>
                </div>
              )}
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
                  <span className="text-sm font-medium">
                    {formatDate(sessions[0].startTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Duration: {formatDuration(sessions[0].duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Status: {getStatusBadge(sessions[0].status, sessions[0])}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">
                    Type: {getSessionType(sessions[0])}
                  </span>
                </div>
                {sessions[0].metadata?.scenario && (
                  <div className="flex items-center">
                    <span className="text-sm">
                      Scenario: {getScenarioName(sessions[0].metadata.scenario)}
                    </span>
                  </div>
                )}
                {sessions[0].transcripts && (
                  <div className="flex items-center">
                    <span className="text-sm">
                      Messages: {sessions[0].transcripts.length}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No sessions yet. Start practicing to see your stats!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Session History</h2>
      </div>

      {loading ? (
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
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sessions.map(session => (
              <Card
                key={session._id}
                className="h-full flex flex-col hover:border-primary cursor-pointer"
                onClick={() => handleSessionClick(session._id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base mb-1">
                        {getSessionType(session)}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(session.startTime)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(session.status, session)}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pb-3 pt-0">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Duration</span>
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session.metadata?.scenario && (
                        <Badge variant="outline" className="text-xs">
                          {getScenarioName(session.metadata.scenario)}
                        </Badge>
                      )}
                      {session.metadata?.level && (
                        <Badge variant="outline" className="text-xs">
                          Level: {session.metadata.level.toUpperCase()}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Voice: {session.voice}
                      </Badge>
                    </div>
                    {session.transcripts && (
                      <div className="text-xs text-muted-foreground">
                        {session.transcripts.length} messages
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={e => {
                      e.stopPropagation();
                      handleSessionClick(session._id);
                    }}
                  >
                    View Details
                  </Button>
                  <DeleteSpeakingSessionButton sessionId={session._id} />
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
                      href={`/dashboard/speaking?page=${pagination.current - 1}`}
                    >
                      <PaginationPrevious />
                    </Link>
                  </PaginationItem>
                )}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  page => (
                    <PaginationItem key={page}>
                      <Link href={`/dashboard/speaking?page=${page}`}>
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
                      href={`/dashboard/speaking?page=${pagination.current + 1}`}
                    >
                      <PaginationNext />
                    </Link>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
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
