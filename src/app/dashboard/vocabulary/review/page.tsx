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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-center gap-2 mt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vocabulary Review</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError.message}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // If there are no words to review, show a message
  if (words.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vocabulary Review</h1>
        </div>
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>No Words to Review</CardTitle>
            <CardDescription>
              You don&apos;t have any words that need review at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Great job! You&apos;re all caught up with your vocabulary reviews.
            </p>
            <p className="mt-2">Check back later for more words to review.</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleBackToDashboard}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentWord = words[reviewSession.currentIndex];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vocabulary Review</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {reviewSession.currentIndex + 1} of {words.length}
        </div>
      </div>

      <Progress
        value={(reviewSession.currentIndex / words.length) * 100}
        className="h-2"
      />

      {currentWord && !reviewComplete ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{currentWord.word}</CardTitle>
              <Badge variant="outline">{currentWord.partOfSpeech}</Badge>
            </div>
            {showAnswer && (
              <CardDescription>
                Current mastery: {currentWord.mastery}%
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {!showAnswer ? (
              <div className="flex justify-center py-12">
                <Button onClick={handleShowAnswer} size="lg">
                  Show Definition
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Definition</h3>
                  <p className="text-lg">{currentWord.definition}</p>
                </div>

                {currentWord.context && currentWord.context.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Context</h3>
                    <p className="text-muted-foreground italic">
                      &ldquo;{currentWord.context[0]}&rdquo;
                    </p>
                  </div>
                )}

                {currentWord.examples && currentWord.examples.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Examples</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentWord.examples.map((example, i) => (
                        <li key={i} className="text-muted-foreground">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentWord.tags && currentWord.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {currentWord.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">
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
            <CardFooter className="flex justify-center gap-2 pt-2 pb-6">
              <Button
                variant="outline"
                size="lg"
                className="border-red-200 hover:bg-red-50 hover:text-red-600"
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
                className="border-orange-200 hover:bg-orange-50 hover:text-orange-600"
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
                onClick={() =>
                  handlePerformanceRating(PerformanceRating.HESITANT)
                }
              >
                Hesitant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-green-200 hover:bg-green-50 hover:text-green-600"
                onClick={() => handlePerformanceRating(PerformanceRating.EASY)}
              >
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Easy
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() =>
                  handlePerformanceRating(PerformanceRating.PERFECT)
                }
              >
                <ThumbsUp className="mr-2 h-4 w-4 text-emerald-500" />
                Perfect
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : reviewComplete ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Review Complete!</CardTitle>
            <CardDescription>
              You&apos;ve reviewed {reviewStats.reviewed} words.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                  <span>Improved words:</span>
                </div>
                <span className="font-bold">{reviewStats.improved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Newly mastered words:</span>
                </div>
                <span className="font-bold">{reviewStats.mastered}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button
              onClick={handleStartNewReview}
              className="flex items-center"
            >
              Start New Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
}
