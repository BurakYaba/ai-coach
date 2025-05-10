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
    <div className="container mx-auto p-4 md:p-8 pb-24">
      <div className="mb-6">
        <Link
          href="/dashboard/listening"
          className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to listening dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {session.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{session.level}</Badge>
              <Badge variant="outline" className="capitalize">
                {session.contentType}
              </Badge>
              <Badge variant="outline">{session.topic}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Volume2 className="mr-1 h-4 w-4" />
                {formatTime(session.duration || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
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

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
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
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
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
          >
            <Repeat className="h-5 w-5" />
            <span className="sr-only">Repeat 10 seconds</span>
          </Button>

          <Button
            size="lg"
            variant="default"
            className="h-14 w-14 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 pl-1" />
            )}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {showTranscript ? "Hide" : "Show"} Transcript
          </Button>
        </div>
      </div>

      {/* Transcript (Collapsible) */}
      <Collapsible open={showTranscript} className="mb-8">
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Transcript
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(false)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto rounded-md bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {session.content?.transcript}
                </p>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="vocabulary">
            <BookOpen className="mr-2 h-4 w-4" />
            Vocabulary
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            disabled={session.questions?.length === 0}
          >
            <List className="mr-2 h-4 w-4" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listen" className="space-y-6">
          {/* Audio player and transcript remain in this tab */}
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">Vocabulary</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
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
                    className="h-2"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {session.userProgress?.vocabularyReviewed?.length || 0} of{" "}
                  {session.vocabulary?.length || 0} words reviewed
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                <Badge variant="default" className="cursor-pointer">
                  All ({session.vocabulary?.length || 0})
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Reviewed (
                  {session.userProgress?.vocabularyReviewed?.length || 0})
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Remaining (
                  {(session.vocabulary?.length || 0) -
                    (session.userProgress?.vocabularyReviewed?.length || 0)}
                  )
                </Badge>
              </div>
            </div>

            <Accordion
              type="multiple"
              className="w-full"
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

                      updateSessionProgress(params.id, updateData).then(() => {
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
                      });
                    }
                  }
                }
              }}
            >
              {session.vocabulary && session.vocabulary.length > 0 ? (
                session.vocabulary.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{item.word}</span>
                        <Badge
                          variant="secondary"
                          className={`${item.difficulty <= 3 ? "bg-green-100 text-green-800" : item.difficulty <= 7 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                        >
                          Level {item.difficulty}
                        </Badge>
                        {session.userProgress?.vocabularyReviewed?.includes(
                          item.word
                        ) && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800"
                          >
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-muted/20 rounded-md space-y-3">
                        <div>
                          <span className="font-semibold">Definition: </span>
                          <span>{item.definition}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Context: </span>
                          <span className="italic">"{item.context}"</span>
                        </div>
                        {item.examples && item.examples.length > 0 && (
                          <div>
                            <span className="font-semibold">Examples:</span>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {item.examples.map(
                                (example: string, i: number) => (
                                  <li key={i}>{example}</li>
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
                <div className="py-4 text-center text-gray-500">
                  No vocabulary items available for this session.
                </div>
              )}
            </Accordion>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Comprehension Questions</h2>
                <span className="text-sm text-gray-600">
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
                className="h-2"
              />
            </div>

            {session.questions && session.questions.length > 0 ? (
              <>
                {/* Question number buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
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
                          className={`w-10 h-10 p-0 ${isAnswered ? "border-green-500" : ""}`}
                        >
                          {idx + 1}
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* Current Question */}
                <div className="space-y-6">
                  <div className="text-lg font-medium">
                    {session.questions[currentQuestionIndex]?.question}
                  </div>

                  {/* Multiple choice options */}
                  {normalizeQuestionType(
                    session.questions[currentQuestionIndex]?.type
                  ) === "multiple-choice" && (
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
                    >
                      {session.questions[currentQuestionIndex]?.options?.map(
                        (option: string, optIdx: number) => {
                          const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                          return (
                            <div
                              key={`option-${optIdx}`}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`q${currentQuestionIndex}-opt${optIdx}`}
                              />
                              <Label
                                htmlFor={`q${currentQuestionIndex}-opt${optIdx}`}
                                className="text-base"
                              >
                                {optionLetter}. {option}
                              </Label>
                            </div>
                          );
                        }
                      )}
                    </RadioGroup>
                  )}

                  {/* True/False options */}
                  {normalizeQuestionType(
                    session.questions[currentQuestionIndex]?.type
                  ) === "true-false" && (
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
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="True"
                          id={`q${currentQuestionIndex}-opt-true`}
                        />
                        <Label htmlFor={`q${currentQuestionIndex}-opt-true`}>
                          A. True
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="False"
                          id={`q${currentQuestionIndex}-opt-false`}
                        />
                        <Label htmlFor={`q${currentQuestionIndex}-opt-false`}>
                          B. False
                        </Label>
                      </div>
                    </RadioGroup>
                  )}

                  {/* Fill in the blank */}
                  {normalizeQuestionType(
                    session.questions[currentQuestionIndex]?.type
                  ) === "fill-blank" && (
                    <Input
                      value={answers[currentQuestionIndex] || ""}
                      onChange={e =>
                        handleAnswerChange(currentQuestionIndex, e.target.value)
                      }
                      placeholder="Fill in the blank..."
                      disabled={
                        feedback &&
                        feedback.answers &&
                        feedback.answers[currentQuestionIndex]
                      }
                    />
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
                        className={`border mt-4 ${
                          session.userProgress.userAnswers[
                            session.questions[currentQuestionIndex].id
                          ] ===
                          session.questions[currentQuestionIndex].correctAnswer
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <AlertDescription>
                          <div className="font-semibold mb-2">
                            {session.userProgress.userAnswers[
                              session.questions[currentQuestionIndex].id
                            ] ===
                            session.questions[currentQuestionIndex]
                              .correctAnswer
                              ? "Correct!"
                              : "Incorrect"}
                          </div>
                          <div>
                            <span className="font-semibold">Your answer: </span>
                            {
                              session.userProgress.userAnswers[
                                session.questions[currentQuestionIndex].id
                              ]
                            }
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">
                              The correct answer:{" "}
                            </span>
                            {
                              session.questions[currentQuestionIndex]
                                .correctAnswer
                            }
                          </div>
                          {session.questions[currentQuestionIndex]
                            .explanation && (
                            <div className="mt-2">
                              <span className="font-semibold">
                                Explanation:{" "}
                              </span>
                              {
                                session.questions[currentQuestionIndex]
                                  .explanation
                              }
                            </div>
                          )}
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
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription>
                          <div className="font-semibold mb-2">
                            You've already answered this question
                          </div>
                          <div>
                            <span className="font-semibold">Your answer: </span>
                            {
                              session.userProgress.userAnswers[
                                session.questions[currentQuestionIndex].id
                              ]
                            }
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">
                              The correct answer:{" "}
                            </span>
                            {
                              session.questions[currentQuestionIndex]
                                .correctAnswer
                            }
                          </div>
                          {session.questions[currentQuestionIndex]
                            .explanation && (
                            <div className="mt-2">
                              <span className="font-semibold">
                                Explanation:{" "}
                              </span>
                              {
                                session.questions[currentQuestionIndex]
                                  .explanation
                              }
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
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
                      disabled={!answers[currentQuestionIndex] || isSubmitting}
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
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">
                No questions available for this session.
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {feedback && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                      {feedback.score}%
                    </div>
                    <p className="mt-4 text-center text-gray-700">
                      {feedback.overallFeedback}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {feedback.feedbackItems?.map((item: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2">{item.question}</p>
                          <div className="mb-3 grid gap-3 md:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs text-gray-500">
                                Your answer:
                              </p>
                              <p
                                className={
                                  item.isCorrect
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {item.userAnswer || "(No answer)"}
                              </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs text-gray-500">
                                Correct answer:
                              </p>
                              <p className="text-green-600">
                                {item.correctAnswer}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-sm text-blue-800">
                              {item.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Link href="/dashboard/listening">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
                <Link href="/dashboard/listening/create">
                  <Button>Practice More</Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
