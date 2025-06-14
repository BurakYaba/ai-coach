"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IReadingSession } from "@/models/ReadingSession";
import { useRecordActivity } from "@/hooks/use-gamification";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

import { GrammarPanel } from "./GrammarPanel";
import { QuestionPanel } from "./QuestionPanel";
import { ReadingContent } from "./ReadingContent";
import { ReadingProgress } from "./ReadingProgress";
import { VocabularyPanel } from "./VocabularyPanel";

interface ReadingSessionProps {
  sessionId: string;
}

export function ReadingSession({ sessionId }: ReadingSessionProps) {
  const router = useRouter();
  const recordActivity = useRecordActivity();
  const [session, setSession] = useState<IReadingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("reading");
  const [progress, setProgress] = useState({
    timeSpent: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    vocabularyReviewed: [] as string[],
    comprehensionScore: 0,
    userAnswers: {} as Record<string, string>,
    vocabularyBankAdded: [] as string[],
  });

  // Flag to track if we should update progress
  const [shouldUpdateProgress, setShouldUpdateProgress] = useState(false);

  // Fetch session data - only run once when component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/reading/sessions/${sessionId}`);
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setSession(data);
        setProgress({
          timeSpent: data.userProgress.timeSpent || 0,
          questionsAnswered: data.userProgress.questionsAnswered || 0,
          correctAnswers: data.userProgress.correctAnswers || 0,
          vocabularyReviewed: data.userProgress.vocabularyReviewed || [],
          comprehensionScore: data.userProgress.comprehensionScore || 0,
          userAnswers: data.userProgress.userAnswers || {},
          vocabularyBankAdded: data.userProgress.vocabularyBankAdded || [],
        });
      } catch (error) {
        setError("Failed to load reading session");
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Timer for tracking reading time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session && !session.userProgress.completionTime) {
      interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));

        // Set flag to update progress every 30 seconds
        if ((progress.timeSpent + 1) % 30 === 0) {
          setShouldUpdateProgress(true);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session, progress.timeSpent]);

  // Update progress on the server only when needed
  useEffect(() => {
    if (!shouldUpdateProgress || !session) return;

    // Use a debounced function to avoid too many updates
    const saveProgress = async () => {
      try {
        console.log("Saving reading session progress...");
        const response = await fetch(`/api/reading/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "userProgress.timeSpent": progress.timeSpent,
            "userProgress.questionsAnswered": progress.questionsAnswered,
            "userProgress.correctAnswers": progress.correctAnswers,
            "userProgress.vocabularyReviewed": progress.vocabularyReviewed,
            "userProgress.comprehensionScore": progress.comprehensionScore,
            "userProgress.userAnswers": progress.userAnswers,
            "userProgress.vocabularyBankAdded": progress.vocabularyBankAdded,
          }),
        });
        if (!response.ok) throw new Error("Failed to save progress");

        // Reset the flag after saving
        setShouldUpdateProgress(false);
      } catch (error) {
        console.error("Error saving progress:", error);
        // Reset the flag even if there's an error
        setShouldUpdateProgress(false);
      }
    };

    // Debounce the save progress to avoid too many API calls
    const timeoutId = setTimeout(saveProgress, 2000); // Wait 2 seconds before saving
    return () => clearTimeout(timeoutId);
  }, [shouldUpdateProgress, session, sessionId, progress]);

  const handleComplete = useCallback(async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/reading/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "userProgress.completionTime": new Date().toISOString(),
          "userProgress.timeSpent": progress.timeSpent,
          "userProgress.questionsAnswered": progress.questionsAnswered,
          "userProgress.correctAnswers": progress.correctAnswers,
          "userProgress.vocabularyReviewed": progress.vocabularyReviewed,
          "userProgress.comprehensionScore": progress.comprehensionScore,
          "userProgress.userAnswers": progress.userAnswers,
          "userProgress.vocabularyBankAdded": progress.vocabularyBankAdded,
        }),
      });
      if (!response.ok) throw new Error("Failed to complete session");

      router.push("/dashboard/reading");
    } catch (error) {
      console.error("Error completing session:", error);
      setError("Failed to complete session");
    }
  }, [session, sessionId, progress, router]);

  // Handle word click - memoize to prevent unnecessary re-renders
  const handleWordClick = useCallback((word: string) => {
    setActiveTab("vocabulary");
    setProgress(prev => ({
      ...prev,
      vocabularyReviewed: Array.from(
        new Set([...prev.vocabularyReviewed, word])
      ),
    }));
  }, []);

  // Handle answer submit - memoize to prevent unnecessary re-renders
  const handleAnswerSubmit = useCallback(
    (correct: boolean, questionId: string, userAnswer: string) => {
      setProgress(prev => {
        const newQuestionsAnswered = prev.questionsAnswered + 1;
        const newCorrectAnswers = prev.correctAnswers + (correct ? 1 : 0);
        const newUserAnswers = {
          ...prev.userAnswers,
          [questionId]: userAnswer,
        };

        return {
          ...prev,
          questionsAnswered: newQuestionsAnswered,
          correctAnswers: newCorrectAnswers,
          comprehensionScore: Math.round(
            (newCorrectAnswers / newQuestionsAnswered) * 100
          ),
          userAnswers: newUserAnswers,
        };
      });

      // Set flag to update progress after a brief delay
      setShouldUpdateProgress(true);
    },
    []
  );

  // Handle vocabulary bank add - track words added to vocabulary bank
  const handleVocabularyBankAdd = useCallback((word: string) => {
    setProgress(prev => ({
      ...prev,
      vocabularyBankAdded: [...prev.vocabularyBankAdded, word],
    }));

    // Set flag to update progress
    setShouldUpdateProgress(true);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="text-gray-800 text-xl font-semibold mb-2">
          Session not found
        </div>
        <div className="text-gray-600">
          The reading session you're looking for doesn't exist.
        </div>
      </div>
    );
  }

  // Calculate completion requirements
  const allQuestionsAnswered =
    progress.questionsAnswered >= session.questions.length;
  const allVocabularyReviewed =
    progress.vocabularyReviewed.length >= session.vocabulary.length;
  const canComplete = allQuestionsAnswered; // Only require questions to be completed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/dashboard/reading"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reading dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {session.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {session.level}
          </Badge>
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {session.topic}
          </Badge>
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <BookOpen className="mr-2 h-4 w-4" />
            {session.wordCount} words
          </div>
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock className="mr-2 h-4 w-4" />
            {session.estimatedReadingTime} min read
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <ReadingProgress
          progress={progress}
          totalQuestions={session.questions.length}
          totalVocabulary={session.vocabulary.length}
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-none">
            <TabsTrigger
              value="reading"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Reading
            </TabsTrigger>
            <TabsTrigger
              value="vocabulary"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="grammar"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Grammar
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="reading" className="mt-0">
              <ReadingContent
                content={session.content}
                vocabulary={session.vocabulary}
                onWordClick={handleWordClick}
              />
            </TabsContent>

            <TabsContent value="vocabulary" className="mt-0">
              <VocabularyPanel
                vocabulary={session.vocabulary}
                reviewedWords={progress.vocabularyReviewed}
                onWordReviewed={handleWordClick}
                sessionId={sessionId}
                addedToBank={progress.vocabularyBankAdded}
                onAddToBank={handleVocabularyBankAdd}
              />
            </TabsContent>

            <TabsContent value="questions" className="mt-0">
              <QuestionPanel
                questions={session.questions}
                onAnswerSubmit={handleAnswerSubmit}
                answeredCount={progress.questionsAnswered}
                previousAnswers={progress.userAnswers}
              />
            </TabsContent>

            <TabsContent value="grammar" className="mt-0">
              <GrammarPanel grammarFocus={session.grammarFocus} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Completion Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            {!allVocabularyReviewed && allQuestionsAnswered && (
              <p className="text-amber-600 text-sm">
                Note: Not all vocabulary words have been reviewed, but you can
                still complete the session.
              </p>
            )}
            {!canComplete && (
              <p className="text-gray-600 text-sm">
                Complete all questions to finish this session.
              </p>
            )}
          </div>
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`px-6 py-3 ${
              canComplete
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-all duration-200`}
          >
            {canComplete ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Session
              </>
            ) : (
              "Complete Session"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
