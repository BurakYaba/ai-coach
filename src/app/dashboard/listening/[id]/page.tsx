"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  List,
  Loader2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { cn, formatTime, normalizeQuestionType } from "@/lib/utils";
import { useRecordActivity } from "@/hooks/use-gamification";

// Fetch listening session from API
async function fetchListeningSession(id: string) {
  const response = await fetch(`/api/listening/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listening session");
  }
  return response.json();
}

// Update session progress
async function updateSessionProgress(id: string, progress: any) {
  const response = await fetch(`/api/listening/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userProgress: progress }),
  });

  if (!response.ok) {
    throw new Error("Failed to update session progress");
  }

  return response.json();
}

// Submit answers and get feedback
async function submitAnswers(id: string, answers: string[]) {
  const response = await fetch(`/api/listening/${id}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answers");
  }

  return response.json();
}

export default function ListeningSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordActivity = useRecordActivity();

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState("listen");

  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    answers?: Record<number, any>;
    score?: number;
    overallFeedback?: string;
    feedbackItems?: any[];
  } | null>(null);

  // Add a state to track questions answered in the current session
  const [currentSessionAnswers, setCurrentSessionAnswers] = useState<
    Set<string>
  >(new Set());

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Determine if we should record a gamification activity for vocabulary review
  const [shouldRecordVocabActivity, setShouldRecordVocabActivity] =
    useState(false);

  // Define the loadSession function outside useEffect to avoid strict mode issues
  const loadSession = async () => {
    try {
      const data = await fetchListeningSession(params.id);
      console.log("Loaded session data:", {
        title: data.title,
        questionTypes: data.questions
          ? data.questions.map((q: any) => q.type)
          : [],
        vocabCount: data.vocabulary ? data.vocabulary.length : 0,
        vocabExamples: data.vocabulary
          ? data.vocabulary.slice(0, 1).map((v: any) => ({
              word: v.word,
              exampleCount: v.examples?.length,
            }))
          : [],
      });

      setSession(data);
      // Initialize answers array with empty strings
      setAnswers(new Array(data.questions?.length || 0).fill(""));
    } catch (err) {
      console.error("Error loading session:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to load session")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load the session data
  useEffect(() => {
    loadSession();
  }, [params.id]);

  // Audio player event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume / 100;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle answer changes
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Submit answers and get feedback
  const handleSubmitAnswers = async () => {
    if (!answers[currentQuestionIndex]) return;

    setIsSubmitting(true);

    try {
      // Create an array with just the current question's answer
      const answersToSubmit = new Array(session.questions.length).fill("");
      answersToSubmit[currentQuestionIndex] = answers[currentQuestionIndex];

      const result = await submitAnswers(params.id, answersToSubmit);

      // Log the raw feedback result
      console.log("Feedback result:", JSON.stringify(result));

      // Extract the result for the current question
      const currentQuestionResult = result.answers?.[currentQuestionIndex];

      console.log(
        "Current question result:",
        JSON.stringify(currentQuestionResult)
      );

      // Update the feedback state
      setFeedback((prev: any) => ({
        ...prev,
        answers: {
          ...(prev?.answers || {}),
          [currentQuestionIndex]: currentQuestionResult,
        },
      }));

      // Build userAnswers object for updating server
      const userAnswersObj: Record<string, string> = {
        ...(session.userProgress?.userAnswers || {}),
      };

      // Add the current answer
      userAnswersObj[session.questions[currentQuestionIndex].id] =
        answers[currentQuestionIndex];

      // Calculate the new correct answers count
      const isCorrect = currentQuestionResult?.isCorrect || false;

      console.log(`Question is correct: ${isCorrect}`);

      const newCorrectAnswers =
        (session.userProgress?.correctAnswers || 0) + (isCorrect ? 1 : 0);

      // Calculate how many questions have been answered
      const answeredQuestionsCount = Object.keys(userAnswersObj).length;

      // Calculate comprehension score
      const comprehensionScore =
        answeredQuestionsCount > 0
          ? Math.round((newCorrectAnswers / answeredQuestionsCount) * 100)
          : 0;

      console.log(
        `Dashboard page calculating comprehensionScore: ${newCorrectAnswers}/${answeredQuestionsCount} = ${comprehensionScore}%`
      );

      // Check if this answers all questions and all vocabulary is reviewed
      const allQuestionsAnswered =
        answeredQuestionsCount === session.questions?.length;
      const allVocabularyReviewed =
        (session.userProgress?.vocabularyReviewed?.length || 0) ===
        session.vocabulary?.length;

      // Prepare update data
      const updateData: any = {
        questionsAnswered: answeredQuestionsCount,
        correctAnswers: newCorrectAnswers,
        comprehensionScore,
        userAnswers: userAnswersObj,
      };

      // If all content is complete, set completionTime
      if (
        allQuestionsAnswered &&
        allVocabularyReviewed &&
        !session.userProgress?.completionTime
      ) {
        updateData.completionTime = new Date().toISOString();
        console.log(
          "Setting completion time as all content has been completed"
        );
      }

      // Update session progress on the server
      await updateSessionProgress(params.id, updateData);

      // Update the session state locally
      setSession((prev: any) => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          questionsAnswered: answeredQuestionsCount,
          correctAnswers: newCorrectAnswers,
          comprehensionScore,
          userAnswers: userAnswersObj,
          ...(allQuestionsAnswered &&
          allVocabularyReviewed &&
          !prev.userProgress.completionTime
            ? { completionTime: new Date().toISOString() }
            : {}),
        },
      }));

      // Add the current question to the set of answered questions
      setCurrentSessionAnswers(prev => {
        const newSet = new Set(prev);
        newSet.add(session.questions[currentQuestionIndex].id);
        return newSet;
      });

      // Remove automatic advancement - user will click Next button manually
      // if (currentQuestionIndex < session.questions.length - 1) {
      //   // Find the next unanswered question
      //   const nextUnanswered = session.questions.findIndex(
      //     (q: any, idx: number) =>
      //       idx > currentQuestionIndex && !userAnswersObj[q.id]
      //   );

      //   if (nextUnanswered !== -1) {
      //     setTimeout(() => {
      //       setCurrentQuestionIndex(nextUnanswered);
      //     }, 1500); // Short delay before moving
      //   }
      // }
    } catch (err) {
      console.error("Error submitting answer:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect for recording vocabulary review gamification
  useEffect(() => {
    if (shouldRecordVocabActivity && session) {
      const vocabCount = session.userProgress?.vocabularyReviewed?.length || 0;

      // Only call this when there are vocabulary words to record
      if (vocabCount > 0) {
        console.log(
          `Recording ${vocabCount} vocabulary reviews for gamification`
        );
        recordActivity.mutate({
          module: "listening",
          activityType: "review_word",
          metadata: {
            sessionId: params.id,
            count: vocabCount,
            isPartOfCompletedSession: true, // Mark this as part of a completed session
          },
        });
      }

      // Reset the flag after recording
      setShouldRecordVocabActivity(false);
    }
  }, [shouldRecordVocabActivity, session, params.id, recordActivity]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>

        <div className="space-y-8">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load listening session
          </h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button onClick={() => router.refresh()} variant="outline">
              Try Again
            </Button>
            <Link href="/dashboard/listening">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No session data
  if (!session) {
    return (
      <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Listening session not found</h2>
          <p className="mt-2 text-gray-600">
            The session you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/listening">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard/listening"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listening dashboard
          </Link>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                  {session.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
                  >
                    {session.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 capitalize text-xs sm:text-sm"
                  >
                    {session.contentType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm"
                  >
                    {session.topic}
                  </Badge>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
                    <Volume2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {formatTime(session.duration || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mb-6 sm:mb-8">
          <audio
            ref={audioRef}
            src={session.content?.audioUrl}
            preload="metadata"
            onLoadedMetadata={() => {
              // Set initial duration when metadata is loaded
              if (audioRef.current) {
                const loadedDuration = audioRef.current.duration;
                setDuration(loadedDuration);
                console.log("Audio duration loaded:", {
                  loadedDuration,
                  isFinite: isFinite(loadedDuration),
                  formatted: formatTime(loadedDuration),
                  sessionDuration: session.duration,
                  formattedSession: formatTime(session.duration || 0),
                });
              }
            }}
            onTimeUpdate={() => {
              // Update current time during playback
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          >
            <track kind="captions" src="" label="English captions" />
            Your browser does not support the audio element.
          </audio>

          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
              <div className="text-sm font-medium text-gray-600 text-center sm:text-left">
                {formatTime(currentTime)} /{" "}
                {formatTime(
                  duration && isFinite(duration) && duration > 0
                    ? duration
                    : session?.duration &&
                        isFinite(session.duration) &&
                        session.duration > 0
                      ? session.duration
                      : 0
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-16 sm:w-20 lg:w-24"
                />
              </div>
            </div>

            <Slider
              value={[currentTime]}
              min={0}
              max={
                duration && isFinite(duration) && duration > 0
                  ? duration
                  : session?.duration &&
                      isFinite(session.duration) &&
                      session.duration > 0
                    ? session.duration
                    : 100
              }
              step={0.1}
              onValueChange={handleSeek}
              className="mb-4 sm:mb-6"
            />
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(
                    0,
                    audioRef.current.currentTime - 10
                  );
                }
              }}
              className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-gray-50"
            >
              <Repeat className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Repeat 10 seconds</span>
            </Button>

            <Button
              size="lg"
              variant="default"
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              ) : (
                <Play className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 pl-0.5" />
              )}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              className="hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4"
            >
              <BookOpen className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {showTranscript ? "Hide" : "Show"} Transcript
              </span>
              <span className="sm:hidden">
                {showTranscript ? "Hide" : "Show"}
              </span>
            </Button>
          </div>
        </div>

        {/* Transcript (Collapsible) */}
        <Collapsible open={showTranscript} className="mb-6 sm:mb-8">
          <CollapsibleContent>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Transcript
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(false)}
                  className="hover:bg-gray-100"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-48 sm:max-h-64 overflow-y-auto rounded-lg sm:rounded-xl bg-gray-50 p-4 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {session.content?.transcript}
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 sm:mb-8 grid w-full grid-cols-2 bg-white shadow-sm h-10 sm:h-12">
            <TabsTrigger
              value="vocabulary"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-xs sm:text-sm"
            >
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Vocabulary</span>
              <span className="sm:hidden">Vocab</span>
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              disabled={session.questions?.length === 0}
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-xs sm:text-sm"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Questions</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listen" className="space-y-6">
            {/* Audio player and transcript remain in this tab */}
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Vocabulary
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <Progress
                      value={
                        session.userProgress?.vocabularyReviewed?.length
                          ? Math.round(
                              (session.userProgress.vocabularyReviewed.length /
                                (session.vocabulary?.length || 1)) *
                                100
                            )
                          : 0
                      }
                      className="h-2 sm:h-3"
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium text-center sm:text-right whitespace-nowrap">
                    {session.userProgress?.vocabularyReviewed?.length || 0} of{" "}
                    {session.vocabulary?.length || 0} words reviewed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <Badge
                    variant="default"
                    className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm"
                  >
                    All ({session.vocabulary?.length || 0})
                  </Badge>
                </div>
              </div>

              <Accordion
                type="multiple"
                className="w-full space-y-3 sm:space-y-4"
                onValueChange={values => {
                  // Find newly opened accordions and mark words as reviewed
                  if (values.length > 0) {
                    const newlyOpenedItems = values.filter(value => {
                      const index = parseInt(value.replace("item-", ""));
                      if (
                        isNaN(index) ||
                        index < 0 ||
                        index >= session.vocabulary.length
                      )
                        return false;

                      const word = session.vocabulary[index].word;
                      return !session.userProgress?.vocabularyReviewed?.includes(
                        word
                      );
                    });

                    if (newlyOpenedItems.length > 0) {
                      const updatedReviewedWords = [
                        ...(session.userProgress?.vocabularyReviewed || []),
                      ];

                      newlyOpenedItems.forEach(item => {
                        const index = parseInt(item.replace("item-", ""));
                        if (
                          !isNaN(index) &&
                          index >= 0 &&
                          index < session.vocabulary.length
                        ) {
                          const word = session.vocabulary[index].word;
                          if (!updatedReviewedWords.includes(word)) {
                            updatedReviewedWords.push(word);
                          }
                        }
                      });

                      // Update session progress
                      if (
                        updatedReviewedWords.length >
                        (session.userProgress?.vocabularyReviewed?.length || 0)
                      ) {
                        // Check if this completes all vocabulary and all questions are answered
                        const allVocabularyReviewed =
                          updatedReviewedWords.length ===
                          session.vocabulary?.length;
                        const allQuestionsAnswered =
                          session.userProgress?.questionsAnswered ===
                          session.questions?.length;

                        // If all content is completed, set completionTime
                        const updateData: any = {
                          vocabularyReviewed: updatedReviewedWords,
                        };

                        if (
                          allVocabularyReviewed &&
                          allQuestionsAnswered &&
                          !session.userProgress?.completionTime
                        ) {
                          updateData.completionTime = new Date().toISOString();
                          console.log(
                            "Setting completion time as all content has been completed"
                          );

                          // Set flag to record vocabulary review in gamification
                          if (!session.userProgress?.completionTime) {
                            setShouldRecordVocabActivity(true);
                          }
                        }

                        updateSessionProgress(params.id, updateData).then(
                          () => {
                            setSession((prev: any) => ({
                              ...prev,
                              userProgress: {
                                ...prev.userProgress,
                                vocabularyReviewed: updatedReviewedWords,
                                ...(allVocabularyReviewed &&
                                allQuestionsAnswered &&
                                !prev.userProgress.completionTime
                                  ? { completionTime: new Date().toISOString() }
                                  : {}),
                              },
                            }));
                          }
                        );
                      }
                    }
                  }
                }}
              >
                {session.vocabulary && session.vocabulary.length > 0 ? (
                  session.vocabulary.map((item: any, index: number) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                          <span className="font-semibold text-gray-800 text-left text-sm sm:text-base">
                            {item.word}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${item.difficulty <= 3 ? "bg-green-100 text-green-800" : item.difficulty <= 7 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                            >
                              Level {item.difficulty}
                            </Badge>
                            {session.userProgress?.vocabularyReviewed?.includes(
                              item.word
                            ) && (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                              >
                                Reviewed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <div className="p-4 sm:p-6 bg-white rounded-lg space-y-3 sm:space-y-4 border border-gray-100">
                          <div>
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">
                              Definition:{" "}
                            </span>
                            <span className="text-gray-700 text-sm sm:text-base">
                              {item.definition}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">
                              Context:{" "}
                            </span>
                            <span className="italic text-gray-700 text-sm sm:text-base">
                              "{item.context}"
                            </span>
                          </div>
                          {item.examples && item.examples.length > 0 && (
                            <div>
                              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                Examples:
                              </span>
                              <ul className="list-disc pl-4 sm:pl-5 mt-2 space-y-1">
                                {item.examples.map(
                                  (example: string, i: number) => (
                                    <li
                                      key={i}
                                      className="text-gray-700 text-sm sm:text-base"
                                    >
                                      {example}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="py-8 sm:py-12 text-center text-gray-500">
                    <div className="text-base sm:text-lg font-medium mb-2">
                      No vocabulary items available for this session.
                    </div>
                    <p className="text-sm">
                      This session focuses on listening practice.
                    </p>
                  </div>
                )}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Comprehension Questions
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-center">
                    Question {currentQuestionIndex + 1} of{" "}
                    {session.questions?.length || 0}
                  </span>
                </div>
                <Progress
                  value={
                    session.questions?.length
                      ? Math.round(
                          ((session.userProgress?.questionsAnswered || 0) /
                            session.questions.length) *
                            100
                        )
                      : 0
                  }
                  className="h-2 sm:h-3"
                />
              </div>

              {session.questions && session.questions.length > 0 ? (
                <>
                  {/* Question number buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center sm:justify-start">
                    {Array.from(
                      { length: session.questions.length },
                      (_, idx: number) => {
                        const isAnswered =
                          session.userProgress?.userAnswers &&
                          session.userProgress.userAnswers[
                            session.questions[idx].id
                          ];

                        return (
                          <Button
                            key={idx}
                            variant={
                              currentQuestionIndex === idx
                                ? "default"
                                : isAnswered
                                  ? "outline"
                                  : "secondary"
                            }
                            size="sm"
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base ${
                              currentQuestionIndex === idx
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : isAnswered
                                  ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {idx + 1}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  {/* Current Question */}
                  <div className="space-y-6 sm:space-y-8">
                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
                      <div className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
                        {session.questions[currentQuestionIndex]?.question}
                      </div>
                    </div>

                    {/* Multiple choice options */}
                    {normalizeQuestionType(
                      session.questions[currentQuestionIndex]?.type
                    ) === "multiple-choice" && (
                      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                        <RadioGroup
                          value={answers[currentQuestionIndex] || ""}
                          onValueChange={value =>
                            handleAnswerChange(currentQuestionIndex, value)
                          }
                          disabled={
                            feedback &&
                            feedback.answers &&
                            feedback.answers[currentQuestionIndex]
                          }
                          className="space-y-3 sm:space-y-4"
                        >
                          {session.questions[
                            currentQuestionIndex
                          ]?.options?.map((option: string, optIdx: number) => {
                            const optionLetter = String.fromCharCode(
                              65 + optIdx
                            ); // A, B, C, D

                            return (
                              <div
                                key={`option-${optIdx}`}
                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={`q${currentQuestionIndex}-opt${optIdx}`}
                                  className="text-blue-500 mt-0.5 sm:mt-0"
                                />
                                <Label
                                  htmlFor={`q${currentQuestionIndex}-opt${optIdx}`}
                                  className="text-sm sm:text-base font-medium text-gray-700 cursor-pointer flex-1 leading-relaxed"
                                >
                                  <span className="font-semibold text-blue-600 mr-2">
                                    {optionLetter}.
                                  </span>
                                  {option}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    )}

                    {/* True/False options */}
                    {normalizeQuestionType(
                      session.questions[currentQuestionIndex]?.type
                    ) === "true-false" && (
                      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                        <RadioGroup
                          value={answers[currentQuestionIndex] || ""}
                          onValueChange={value =>
                            handleAnswerChange(currentQuestionIndex, value)
                          }
                          disabled={
                            feedback &&
                            feedback.answers &&
                            feedback.answers[currentQuestionIndex]
                          }
                          className="space-y-3 sm:space-y-4"
                        >
                          <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <RadioGroupItem
                              value="True"
                              id={`q${currentQuestionIndex}-opt-true`}
                              className="text-blue-500"
                            />
                            <Label
                              htmlFor={`q${currentQuestionIndex}-opt-true`}
                              className="text-sm sm:text-base font-medium text-gray-700 cursor-pointer flex-1"
                            >
                              <span className="font-semibold text-blue-600 mr-2">
                                A.
                              </span>{" "}
                              True
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <RadioGroupItem
                              value="False"
                              id={`q${currentQuestionIndex}-opt-false`}
                              className="text-blue-500"
                            />
                            <Label
                              htmlFor={`q${currentQuestionIndex}-opt-false`}
                              className="text-sm sm:text-base font-medium text-gray-700 cursor-pointer flex-1"
                            >
                              <span className="font-semibold text-blue-600 mr-2">
                                B.
                              </span>{" "}
                              False
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {/* Fill in the blank */}
                    {normalizeQuestionType(
                      session.questions[currentQuestionIndex]?.type
                    ) === "fill-blank" && (
                      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                        <Input
                          value={answers[currentQuestionIndex] || ""}
                          onChange={e =>
                            handleAnswerChange(
                              currentQuestionIndex,
                              e.target.value
                            )
                          }
                          placeholder="Fill in the blank..."
                          disabled={
                            feedback &&
                            feedback.answers &&
                            feedback.answers[currentQuestionIndex]
                          }
                          className="text-sm sm:text-base p-3 sm:p-4 h-10 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Current session feedback - show immediately after answering */}
                    {session.userProgress?.userAnswers &&
                      session.userProgress.userAnswers[
                        session.questions[currentQuestionIndex].id
                      ] &&
                      currentSessionAnswers.has(
                        session.questions[currentQuestionIndex].id
                      ) && (
                        <Alert
                          className={`border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 ${
                            session.userProgress.userAnswers[
                              session.questions[currentQuestionIndex].id
                            ] ===
                            session.questions[currentQuestionIndex]
                              .correctAnswer
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <AlertDescription>
                            <div className="space-y-3">
                              <div className="font-semibold text-base sm:text-lg">
                                {session.userProgress.userAnswers[
                                  session.questions[currentQuestionIndex].id
                                ] ===
                                session.questions[currentQuestionIndex]
                                  .correctAnswer
                                  ? "🎉 Correct!"
                                  : "❌ Incorrect"}
                              </div>
                              <div className="bg-white rounded-lg p-3 sm:p-4 border">
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Your answer:{" "}
                                </span>
                                <span className="text-gray-700 text-sm sm:text-base">
                                  {
                                    session.userProgress.userAnswers[
                                      session.questions[currentQuestionIndex].id
                                    ]
                                  }
                                </span>
                              </div>
                              <div className="bg-white rounded-lg p-3 sm:p-4 border">
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  The correct answer:{" "}
                                </span>
                                <span className="text-green-700 font-medium text-sm sm:text-base">
                                  {
                                    session.questions[currentQuestionIndex]
                                      .correctAnswer
                                  }
                                </span>
                              </div>
                              {session.questions[currentQuestionIndex]
                                .explanation && (
                                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                    Explanation:{" "}
                                  </span>
                                  <span className="text-blue-800 text-sm sm:text-base">
                                    {
                                      session.questions[currentQuestionIndex]
                                        .explanation
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                    {/* Previous answer feedback */}
                    {session.userProgress?.userAnswers &&
                      session.userProgress.userAnswers[
                        session.questions[currentQuestionIndex].id
                      ] &&
                      !currentSessionAnswers.has(
                        session.questions[currentQuestionIndex].id
                      ) && (
                        <Alert className="bg-blue-50 border-blue-200 border-2 rounded-lg sm:rounded-xl p-4 sm:p-6">
                          <AlertDescription>
                            <div className="space-y-3">
                              <div className="font-semibold text-base sm:text-lg text-blue-800">
                                📝 You've already answered this question
                              </div>
                              <div className="bg-white rounded-lg p-3 sm:p-4 border">
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Your answer:{" "}
                                </span>
                                <span className="text-gray-700 text-sm sm:text-base">
                                  {
                                    session.userProgress.userAnswers[
                                      session.questions[currentQuestionIndex].id
                                    ]
                                  }
                                </span>
                              </div>
                              <div className="bg-white rounded-lg p-3 sm:p-4 border">
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  The correct answer:{" "}
                                </span>
                                <span className="text-green-700 font-medium text-sm sm:text-base">
                                  {
                                    session.questions[currentQuestionIndex]
                                      .correctAnswer
                                  }
                                </span>
                              </div>
                              {session.questions[currentQuestionIndex]
                                .explanation && (
                                <div className="bg-blue-100 rounded-lg p-3 sm:p-4 border border-blue-300">
                                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                    Explanation:{" "}
                                  </span>
                                  <span className="text-blue-800 text-sm sm:text-base">
                                    {
                                      session.questions[currentQuestionIndex]
                                        .explanation
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.max(0, currentQuestionIndex - 1)
                        )
                      }
                      disabled={currentQuestionIndex === 0}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Previous
                    </Button>

                    {!(
                      session.userProgress?.userAnswers &&
                      session.userProgress.userAnswers[
                        session.questions[currentQuestionIndex].id
                      ]
                    ) && (
                      <Button
                        variant="default"
                        onClick={handleSubmitAnswers}
                        disabled={
                          !answers[currentQuestionIndex] || isSubmitting
                        }
                        className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Answer"
                        )}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.min(
                            session.questions.length - 1,
                            currentQuestionIndex + 1
                          )
                        )
                      }
                      disabled={
                        currentQuestionIndex === session.questions.length - 1
                      }
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8 sm:py-12 text-center text-gray-500">
                  <div className="text-base sm:text-lg font-medium mb-2">
                    No questions available for this session.
                  </div>
                  <p className="text-sm">
                    This session focuses on vocabulary and listening practice.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {feedback && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                      Your Results
                    </h2>
                    <div className="flex h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl sm:text-3xl lg:text-4xl font-bold text-white mx-auto shadow-lg">
                      {feedback.score}%
                    </div>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 leading-relaxed px-4">
                      {feedback.overallFeedback}
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {feedback.feedbackItems?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                            Question {index + 1}
                          </h3>
                          <Badge
                            variant={item.isCorrect ? "default" : "destructive"}
                            className={`w-fit text-xs sm:text-sm ${
                              item.isCorrect
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <p className="mb-3 sm:mb-4 text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                          {item.question}
                        </p>
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 mb-3 sm:mb-4">
                          <div className="bg-white rounded-lg p-3 sm:p-4 border">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              Your answer:
                            </p>
                            <p
                              className={`font-medium text-sm sm:text-base ${
                                item.isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.userAnswer || "(No answer)"}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 sm:p-4 border">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              Correct answer:
                            </p>
                            <p className="text-green-600 font-medium text-sm sm:text-base">
                              {item.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Link href="/dashboard/listening">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/listening?tab=library">
                    <Button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 text-sm sm:text-base">
                      Practice More
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
