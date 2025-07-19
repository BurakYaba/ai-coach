"use client";

import {
  ArrowLeft,
  BookOpen,
  ChevronUp,
  List,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { formatTime } from "@/lib/utils";
import { useRecordActivity } from "@/hooks/use-gamification";
import { VocabularyPanel } from "@/components/reading/VocabularyPanel";
import { QuestionPanel } from "@/components/reading/QuestionPanel";

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
  const [feedback, setFeedback] = useState<{
    answers?: Record<number, any>;
    score?: number;
    overallFeedback?: string;
    feedbackItems?: any[];
  } | null>(null);

  // Add a state to track questions answered in the current session
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
      // setIsSubmitting(false); // This line was removed
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
      <div className="max-w-7xl mx-auto p-6">
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

          <TabsContent value="vocabulary" className="mt-0">
            <VocabularyPanel
              vocabulary={session.vocabulary}
              reviewedWords={session.userProgress?.vocabularyReviewed || []}
              onWordReviewed={async word => {
                // Mark word as reviewed and update progress
                const updatedReviewed = [
                  ...(session.userProgress?.vocabularyReviewed || []),
                  word,
                ];
                await updateSessionProgress(params.id, {
                  vocabularyReviewed: updatedReviewed,
                });
                setSession((prev: any) => ({
                  ...prev,
                  userProgress: {
                    ...prev.userProgress,
                    vocabularyReviewed: updatedReviewed,
                  },
                }));
              }}
              sessionId={params.id}
              addedToBank={session.userProgress?.vocabularyBankAdded || []}
              onAddToBank={async word => {
                // Add word to vocabulary bank and update progress
                const updatedBank = [
                  ...(session.userProgress?.vocabularyBankAdded || []),
                  word,
                ];
                await updateSessionProgress(params.id, {
                  vocabularyBankAdded: updatedBank,
                });
                setSession((prev: any) => ({
                  ...prev,
                  userProgress: {
                    ...prev.userProgress,
                    vocabularyBankAdded: updatedBank,
                  },
                }));
              }}
            />
          </TabsContent>

          <TabsContent value="questions" className="mt-0">
            <QuestionPanel
              questions={session.questions}
              onAnswerSubmit={async (correct, questionId, userAnswer) => {
                // Update user answers and progress
                const userAnswers = {
                  ...(session.userProgress?.userAnswers || {}),
                  [questionId]: userAnswer,
                };
                const questionsAnswered = Object.keys(userAnswers).length;
                const correctAnswers =
                  (session.userProgress?.correctAnswers || 0) +
                  (correct ? 1 : 0);
                await updateSessionProgress(params.id, {
                  userAnswers,
                  questionsAnswered,
                  correctAnswers,
                });
                setSession((prev: any) => ({
                  ...prev,
                  userProgress: {
                    ...prev.userProgress,
                    userAnswers,
                    questionsAnswered,
                    correctAnswers,
                  },
                }));
              }}
              answeredCount={session.userProgress?.questionsAnswered || 0}
              previousAnswers={session.userProgress?.userAnswers || {}}
            />
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
