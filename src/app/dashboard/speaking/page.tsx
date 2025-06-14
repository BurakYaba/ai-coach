"use client";

import { Calendar, Clock, Mic, MessageSquare, BarChart3 } from "lucide-react";
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
import SpeakingTourManager from "@/components/tours/SpeakingTourManager";
import SpeakingTourTrigger from "@/components/tours/SpeakingTourTrigger";

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
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Active
          </Badge>
        );
      case "interrupted":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
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

  const getCardStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "border-2 border-green-300 bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300";
      case "active":
        return "border-2 border-blue-300 bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300";
      case "interrupted":
        return "border-2 border-orange-300 bg-orange-50 shadow-lg hover:shadow-xl transition-all duration-300";
      default:
        return "border-2 border-gray-300 bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <SpeakingTourManager />

        {/* Header */}
        <div
          className="flex justify-between items-start mb-8"
          data-tour="speaking-header"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Speaking Practice
            </h1>
            <p className="text-gray-600">
              Practice speaking with AI conversation partners and get real-time
              feedback on pronunciation and fluency
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SpeakingTourTrigger />
            <Link href="/dashboard/speaking/practice">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                data-tour="practice-speaking-btn"
              >
                <Mic className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Practice Speaking</span>
                <span className="sm:hidden">Practice</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="border-2 bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
            data-tour="speaking-overview"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your speaking practice statistics
                  </CardDescription>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    Total Sessions:
                  </span>
                  <span className="font-bold text-gray-800">
                    {loading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      pagination.total || sessions.length
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    Completed Sessions:
                  </span>
                  <span className="font-bold text-gray-800">
                    {loading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      stats.completedSessions
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    Total Practice Time:
                  </span>
                  <span className="font-bold text-gray-800">
                    {loading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      formatDuration(stats.totalTime)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    Average Session Duration:
                  </span>
                  <span className="font-bold text-gray-800">
                    {loading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      formatDuration(Math.round(stats.avgDuration))
                    )}
                  </span>
                </div>
                {totalWords > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">
                      Total Words Spoken:
                    </span>
                    <span className="font-bold text-gray-800">
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

          <Card
            className="border-2 bg-green-50 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300"
            data-tour="recent-session"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Most Recent Session
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Details about your last practice session
                  </CardDescription>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
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
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(sessions[0].startTime)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Duration: {formatDuration(sessions[0].duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Status: {getStatusBadge(sessions[0].status, sessions[0])}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">
                      Type: {getSessionType(sessions[0])}
                    </span>
                  </div>
                  {sessions[0].metadata?.scenario && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">
                        Scenario:{" "}
                        {getScenarioName(sessions[0].metadata.scenario)}
                      </span>
                    </div>
                  )}
                  {sessions[0].transcripts && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">
                        Messages: {sessions[0].transcripts.length}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[120px] flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      No sessions yet
                    </p>
                    <p className="text-xs text-gray-500">
                      Start practicing to see your stats!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Session History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div
            className="flex justify-between items-center mb-6"
            data-tour="session-history-header"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Session History
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="border-2 bg-gray-50 shadow-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sessions.map((session, index) => (
                  <Card
                    key={session._id}
                    className={`h-full flex flex-col cursor-pointer ${getCardStyle(session.status)}`}
                    onClick={() => handleSessionClick(session._id)}
                    data-tour={index === 0 ? "session-card" : undefined}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base mb-1 text-gray-800">
                            {getSessionType(session)}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-600">
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
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium text-gray-800">
                              {formatDuration(session.duration)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {session.metadata?.scenario && (
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300"
                            >
                              {getScenarioName(session.metadata.scenario)}
                            </Badge>
                          )}
                          {session.metadata?.level && (
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300"
                            >
                              Level: {session.metadata.level.toUpperCase()}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-300"
                          >
                            Voice: {session.voice}
                          </Badge>
                        </div>
                        {session.transcripts && (
                          <div className="text-xs text-gray-500">
                            {session.transcripts.length} messages
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        className="w-full hover:bg-gray-200 transition-colors"
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
                <div
                  className="mt-8 flex justify-center"
                  data-tour="speaking-pagination"
                >
                  <Pagination>
                    <PaginationContent>
                      {pagination.current > 1 && (
                        <PaginationItem>
                          <Link
                            href={`/dashboard/speaking?page=${pagination.current - 1}`}
                          >
                            <PaginationPrevious className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
                          </Link>
                        </PaginationItem>
                      )}
                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map(page => (
                        <PaginationItem key={page}>
                          <Link href={`/dashboard/speaking?page=${page}`}>
                            <PaginationLink
                              isActive={page === pagination.current}
                              className="hover:bg-blue-50 hover:text-blue-700 transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                            >
                              {page}
                            </PaginationLink>
                          </Link>
                        </PaginationItem>
                      ))}
                      {pagination.current < pagination.pages && (
                        <PaginationItem>
                          <Link
                            href={`/dashboard/speaking?page=${pagination.current + 1}`}
                          >
                            <PaginationNext className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
                          </Link>
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div
              className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50"
              data-tour="no-sessions-card"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Speaking Sessions Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Start practicing to see your history! Your speaking sessions
                  will appear here once you begin.
                </p>
                <Link href="/dashboard/speaking/practice">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Speaking Practice
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
