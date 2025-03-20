'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IReadingSession } from '@/models/ReadingSession';

import { GrammarPanel } from './GrammarPanel';
import { QuestionPanel } from './QuestionPanel';
import { ReadingContent } from './ReadingContent';
import { ReadingProgress } from './ReadingProgress';
import { VocabularyPanel } from './VocabularyPanel';

interface ReadingSessionProps {
  sessionId: string;
}

export function ReadingSession({ sessionId }: ReadingSessionProps) {
  const router = useRouter();
  const [session, setSession] = useState<IReadingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('reading');
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
        if (!response.ok) throw new Error('Failed to fetch session');
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
        setError('Failed to load reading session');
        console.error('Error fetching session:', error);
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
        console.log('Saving reading session progress...');
        const response = await fetch(`/api/reading/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'userProgress.timeSpent': progress.timeSpent,
            'userProgress.questionsAnswered': progress.questionsAnswered,
            'userProgress.correctAnswers': progress.correctAnswers,
            'userProgress.vocabularyReviewed': progress.vocabularyReviewed,
            'userProgress.comprehensionScore': progress.comprehensionScore,
            'userProgress.userAnswers': progress.userAnswers,
            'userProgress.vocabularyBankAdded': progress.vocabularyBankAdded,
          }),
        });
        if (!response.ok) throw new Error('Failed to save progress');

        // Reset the flag after saving
        setShouldUpdateProgress(false);
      } catch (error) {
        console.error('Error saving progress:', error);
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'userProgress.completionTime': new Date().toISOString(),
          'userProgress.timeSpent': progress.timeSpent,
          'userProgress.questionsAnswered': progress.questionsAnswered,
          'userProgress.correctAnswers': progress.correctAnswers,
          'userProgress.vocabularyReviewed': progress.vocabularyReviewed,
          'userProgress.comprehensionScore': progress.comprehensionScore,
          'userProgress.userAnswers': progress.userAnswers,
          'userProgress.vocabularyBankAdded': progress.vocabularyBankAdded,
        }),
      });
      if (!response.ok) throw new Error('Failed to complete session');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing session:', error);
      setError('Failed to complete session');
    }
  }, [session, sessionId, progress, router]);

  // Handle word click - memoize to prevent unnecessary re-renders
  const handleWordClick = useCallback((word: string) => {
    setActiveTab('vocabulary');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>Session not found</div>;

  // Calculate completion requirements
  const allQuestionsAnswered =
    progress.questionsAnswered >= session.questions.length;
  const allVocabularyReviewed =
    progress.vocabularyReviewed.length >= session.vocabulary.length;
  const canComplete = allQuestionsAnswered; // Only require questions to be completed

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Level: {session.level}</span>
          <span>•</span>
          <span>Topic: {session.topic}</span>
          <span>•</span>
          <span>{session.wordCount} words</span>
          <span>•</span>
          <span>{session.estimatedReadingTime} min read</span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="space-y-4">
          <ReadingContent
            content={session.content}
            vocabulary={session.vocabulary}
            onWordClick={handleWordClick}
          />
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4">
          <VocabularyPanel
            vocabulary={session.vocabulary}
            reviewedWords={progress.vocabularyReviewed}
            onWordReviewed={handleWordClick}
            sessionId={sessionId}
            addedToBank={progress.vocabularyBankAdded}
            onAddToBank={handleVocabularyBankAdd}
          />
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <QuestionPanel
            questions={session.questions}
            onAnswerSubmit={handleAnswerSubmit}
            answeredCount={progress.questionsAnswered}
            previousAnswers={progress.userAnswers}
          />
        </TabsContent>

        <TabsContent value="grammar" className="space-y-4">
          <GrammarPanel grammarFocus={session.grammarFocus} />
        </TabsContent>
      </Tabs>

      <ReadingProgress
        progress={progress}
        totalQuestions={session.questions.length}
        totalVocabulary={session.vocabulary.length}
      />

      <div className="mt-8 flex justify-between">
        <div>
          {!allVocabularyReviewed && allQuestionsAnswered && (
            <p className="text-amber-600">
              Note: Not all vocabulary words have been reviewed, but you can
              still complete the session.
            </p>
          )}
        </div>
        <Button onClick={handleComplete} disabled={!canComplete}>
          Complete Session
        </Button>
      </div>
    </div>
  );
}
