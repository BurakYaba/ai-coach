"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
  BookOpen,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { useWordsForReview, useUpdateWordReview } from "@/hooks/use-vocabulary";
import { PerformanceRating } from "@/lib/spaced-repetition";

export default function VocabularyReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  // Use React Query to fetch words for review
  const { data, isLoading, error: fetchError } = useWordsForReview();

  // Use React Query mutation for updating word reviews
  const updateWordReview = useUpdateWordReview();

  // Use local storage to persist review session state
  const [reviewSession, setReviewSession] = useLocalStorage<{
    currentIndex: number;
    reviewedWords: string[];
    improved: number;
    mastered: number;
    sessionId: string; // Add a unique session ID to track different review sessions
  }>("vocabulary-review-session", {
    currentIndex: 0,
    reviewedWords: [],
    improved: 0,
    mastered: 0,
    sessionId: new Date().toISOString(), // Initialize with a timestamp
  });

  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);

  // Compute words based on the filter
  const words = data || [];

  // Compute review stats
  const reviewStats = {
    total: words.length,
    reviewed: reviewSession.reviewedWords.length,
    improved: reviewSession.improved,
    mastered: reviewSession.mastered,
  };

  // Check if review is complete when words or currentIndex changes
  useEffect(() => {
    if (words.length > 0 && reviewSession.currentIndex >= words.length) {
      setReviewComplete(true);
    } else {
      setReviewComplete(false);
    }
  }, [words.length, reviewSession.currentIndex]);

  // Reset session if needed - either from URL param or on initial load
  useEffect(() => {
    const resetParam = searchParams?.get("reset");
    const shouldReset = resetParam === "true";

    // Check if we need to reset the session
    if (
      shouldReset ||
      (words.length > 0 && reviewSession.currentIndex >= words.length)
    ) {
      // Generate a new session ID to ensure we're tracking a fresh session
      const newSessionId = new Date().toISOString();

      setReviewSession({
        currentIndex: 0,
        reviewedWords: [],
        improved: 0,
        mastered: 0,
        sessionId: newSessionId,
      });

      setShowAnswer(false);
      setReviewComplete(false);

      // Remove the reset parameter from the URL if it exists
      if (shouldReset) {
        const newParams = new URLSearchParams(
          searchParams ? searchParams.toString() : ""
        );
        newParams.delete("reset");
        router.replace(`/dashboard/vocabulary/review?${newParams.toString()}`);
      }
    }
  }, [searchParams, router, setReviewSession, words.length]);

  // Handle user's performance rating
  const handlePerformanceRating = async (performance: PerformanceRating) => {
    if (reviewSession.currentIndex >= words.length) return;

    // Check if the user is authenticated
    if (status === "loading") {
      toast({
        title: "Please wait",
        description: "Checking your authentication status...",
        variant: "default",
      });
      return;
    }

    if (status !== "authenticated") {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update vocabulary words.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const currentWord = words[reviewSession.currentIndex];

    try {
      // Use the React Query mutation to update the word
      await updateWordReview.mutateAsync({
        wordId: currentWord._id,
        performance,
      });

      // Update local state for the review session
      setReviewSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        reviewedWords: [...prev.reviewedWords, currentWord._id],
        improved:
          performance > PerformanceRating.DIFFICULT
            ? prev.improved + 1
            : prev.improved,
        mastered:
          performance >= PerformanceRating.EASY && currentWord.mastery < 90
            ? prev.mastered + 1
            : prev.mastered,
      }));

      // Move to the next word
      if (reviewSession.currentIndex < words.length - 1) {
        setShowAnswer(false);
      } else {
        setReviewComplete(true);
      }
    } catch (err) {
      console.error("Failed to update word:", err);

      // Extract more detailed error message if available
      let errorMessage = "Failed to update word. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Error updating word review",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle showing the answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Handle going back to the vocabulary dashboard
  const handleBackToDashboard = () => {
    router.push("/dashboard/vocabulary");
  };

  // Handle starting a new review session
  const handleStartNewReview = () => {
    // Generate a new session ID
    const newSessionId = new Date().toISOString();

    // Reset the session state
    setReviewSession({
      currentIndex: 0,
      reviewedWords: [],
      improved: 0,
      mastered: 0,
      sessionId: newSessionId,
    });

    // Reset UI state
    setShowAnswer(false);
    setReviewComplete(false);

    // Force a refresh of the review data
    router.push("/dashboard/vocabulary/review?reset=true");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-center">
            <Skeleton className="h-96 w-full max-w-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Review
            </h1>
          </div>
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{fetchError.message}</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button
              onClick={handleBackToDashboard}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If there are no words to review, show a message
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Review
            </h1>
          </div>
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Words to Review
              </h3>
              <p className="text-gray-600 mb-2">
                You don&apos;t have any words that need review at this time.
              </p>
              <p className="text-gray-600 mb-6">
                Great job! You&apos;re all caught up with your vocabulary
                reviews.
              </p>
              <Button
                onClick={handleBackToDashboard}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show review complete state
  if (reviewComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Review
            </h1>
          </div>

          <div className="flex justify-center">
            <Card className="max-w-lg w-full border-2 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-800">
                  Review Complete!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  You&apos;ve reviewed {reviewStats.total} words in this
                  session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {reviewStats.improved}
                    </div>
                    <div className="text-sm text-blue-700">Improved</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {reviewStats.mastered}
                    </div>
                    <div className="text-sm text-green-700">Mastered</div>
                  </div>
                </div>
                <p className="text-center text-gray-700">
                  Great job! Continue practicing regularly to improve your
                  vocabulary mastery.
                </p>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={handleStartNewReview}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Review Again
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[reviewSession.currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Review
            </h1>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {reviewSession.currentIndex + 1} of {words.length}
          </div>
        </div>

        <Progress
          value={(reviewSession.currentIndex / words.length) * 100}
          className="h-3 bg-gray-200"
        />

        {currentWord && (
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl border-2 bg-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl text-gray-800">
                    {currentWord.word}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {currentWord.partOfSpeech}
                  </Badge>
                </div>
                {showAnswer && (
                  <CardDescription className="text-gray-600">
                    Current mastery: {currentWord.mastery}%
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {!showAnswer ? (
                  <div className="flex justify-center py-16">
                    <Button
                      onClick={handleShowAnswer}
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Show Definition
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-800">
                        Definition
                      </h3>
                      <p className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
                        {currentWord.definition}
                      </p>
                    </div>

                    {currentWord.context && currentWord.context.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-800">
                          Context
                        </h3>
                        <p className="text-gray-600 italic bg-blue-50 p-4 rounded-lg border border-blue-200">
                          &ldquo;{currentWord.context[0]}&rdquo;
                        </p>
                      </div>
                    )}

                    {currentWord.examples &&
                      currentWord.examples.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 text-gray-800">
                            Examples
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {currentWord.examples.map((example, i) => (
                              <li
                                key={i}
                                className="text-gray-600 bg-gray-50 p-2 rounded border"
                              >
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {currentWord.tags && currentWord.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-800">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentWord.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              {showAnswer && (
                <CardFooter className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    onClick={() =>
                      handlePerformanceRating(PerformanceRating.FORGOT)
                    }
                  >
                    <ThumbsDown className="mr-2 h-4 w-4 text-red-500" />
                    Forgot
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    onClick={() =>
                      handlePerformanceRating(PerformanceRating.DIFFICULT)
                    }
                  >
                    <X className="mr-2 h-4 w-4 text-orange-500" />
                    Difficult
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    onClick={() =>
                      handlePerformanceRating(PerformanceRating.HESITANT)
                    }
                  >
                    Hesitant
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                    onClick={() =>
                      handlePerformanceRating(PerformanceRating.EASY)
                    }
                  >
                    <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                    Easy
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
