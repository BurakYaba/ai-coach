"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface WritingSession {
  _id: string;
  prompt: {
    text: string;
    type: string;
    topic: string;
    targetLength: number;
    requirements: string[];
  };
  submission: {
    content: string;
    finalVersion?: {
      submittedAt: string;
      wordCount: number;
    };
  };
  status: "draft" | "submitted" | "analyzed" | "completed";
  timeTracking: {
    startTime: string;
    endTime?: string;
    totalTime: number;
    activePeriods: Array<{
      start: string;
      end: string;
      duration: number;
    }>;
  };
}

export default function WritingSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<WritingSession | null>(null);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());
  const currentPeriodStartRef = useRef<number | null>(null);

  // Fetch session data
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/writing/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        setSession(data.session);
        setContent(data.session.submission.content || "");
        setElapsedTime(data.session.timeTracking.totalTime || 0);

        // If session is not in draft status, don't start the timer
        if (data.session.status !== "draft") {
          setIsActive(false);
        } else {
          // Start the timer automatically
          setIsActive(true);
          currentPeriodStartRef.current = Date.now();
        }
      } catch (error) {
        console.error("Error fetching writing session:", error);
        toast({
          title: "Error",
          description: "Failed to load writing session",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Save time tracking when unmounting
      if (currentPeriodStartRef.current) {
        saveTimeTracking();
      }
    };
  }, [sessionId]);

  // Update word count when content changes
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = 30000; // 30 seconds

    const autoSave = async () => {
      if (
        Date.now() - lastSaveRef.current > autoSaveInterval &&
        content !== session?.submission.content
      ) {
        await saveContent();
      }
    };

    const interval = setInterval(autoSave, autoSaveInterval);

    return () => clearInterval(interval);
  }, [content, session]);

  // Save content to the server
  const saveContent = async () => {
    if (!session) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/writing/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      lastSaveRef.current = Date.now();

      toast({
        title: "Saved",
        description: "Your writing has been saved",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save your writing",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Save time tracking
  const saveTimeTracking = async () => {
    if (!session || !currentPeriodStartRef.current) return;

    const now = Date.now();
    const periodDuration = Math.floor(
      (now - currentPeriodStartRef.current) / 1000
    );

    try {
      await fetch(`/api/writing/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeTracking: {
            totalTime: elapsedTime,
            activePeriod: {
              start: new Date(currentPeriodStartRef.current).toISOString(),
              end: new Date(now).toISOString(),
            },
          },
        }),
      });

      currentPeriodStartRef.current = null;
    } catch (error) {
      console.error("Error saving time tracking:", error);
    }
  };

  // Handle pause/resume
  const toggleTimer = async () => {
    if (isActive) {
      // Pause the timer
      setIsActive(false);
      if (currentPeriodStartRef.current) {
        await saveTimeTracking();
      }
    } else {
      // Resume the timer
      setIsActive(true);
      currentPeriodStartRef.current = Date.now();
    }
  };

  // Submit the writing
  const submitWriting = async () => {
    if (!session) return;

    setSubmitting(true);
    try {
      // First save the content
      await saveContent();

      // Save time tracking
      if (currentPeriodStartRef.current) {
        await saveTimeTracking();
      }

      // Update status to submitted
      const response = await fetch(`/api/writing/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "submitted",
          timeTracking: {
            endTime: new Date().toISOString(),
            totalTime: elapsedTime,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit writing");
      }

      const data = await response.json();
      setSession(data.session);
      setIsActive(false);

      // Navigate to analysis page
      router.push(`/dashboard/writing/${sessionId}/analyze`);

      toast({
        title: "Submitted",
        description: "Your writing has been submitted for analysis",
      });
    } catch (error) {
      console.error("Error submitting writing:", error);
      toast({
        title: "Error",
        description: "Failed to submit your writing",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Not Found</CardTitle>
            <CardDescription>
              The writing session you&apos;re looking for doesn&apos;t exist or
              you don&apos;t have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check the URL or go back to your writing dashboard.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/writing")}>
              Back to Writing Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isEditable = session.status === "draft";
  const progressPercentage = Math.min(
    100,
    Math.round((wordCount / session.prompt.targetLength) * 100)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/dashboard/writing")}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Writing Session
              </h1>
              <p className="text-gray-600">
                {session.prompt.type}: {session.prompt.topic}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Elapsed</div>
              <div className="text-lg font-semibold text-gray-800">
                {formatTime(elapsedTime)}
              </div>
            </div>
            <Button
              variant={isActive ? "destructive" : "default"}
              onClick={toggleTimer}
              disabled={session.status !== "draft"}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isActive ? "Pause" : "Start"} Timer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Writing Prompt Card */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Writing Prompt
              </CardTitle>
              <CardDescription className="text-gray-600">
                Target length: {session.prompt.targetLength} words
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700 leading-relaxed">
                {session.prompt.text}
              </p>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  Requirements:
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {session.prompt.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Writing Area Card */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Your Writing
              </CardTitle>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Word Count:{" "}
                    <span className="font-medium text-gray-800">
                      {wordCount}
                    </span>{" "}
                    / {session.prompt.targetLength}
                  </div>
                  <Badge
                    variant={progressPercentage >= 100 ? "default" : "outline"}
                    className={
                      progressPercentage >= 100
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {progressPercentage}%
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing here..."
                className="min-h-[300px] font-mono text-base flex-grow border-2 focus:border-blue-300 transition-colors"
                disabled={!isEditable}
                data-tour="writing-editor"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={saveContent}
                disabled={saving || !isEditable}
                className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              {isEditable ? (
                <AlertDialog
                  open={showSubmitDialog}
                  onOpenChange={setShowSubmitDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={wordCount === 0 || submitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {submitting ? "Submitting..." : "Submit for Analysis"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Submit Writing for Analysis?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Once you submit your writing, you won't be able to edit
                        it anymore. Your writing will be analyzed and you'll
                        receive detailed feedback. Are you sure you want to
                        continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Writing</AlertDialogCancel>
                      <AlertDialogAction onClick={submitWriting}>
                        Yes, Submit for Analysis
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href={`/dashboard/writing/${sessionId}/feedback`}>
                    View Feedback
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
