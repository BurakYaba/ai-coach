'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WordRelationships } from '@/components/vocabulary/WordRelationships';
import { useToast } from '@/hooks/use-toast';
import { useVocabularyBank, type VocabularyWord } from '@/hooks/use-vocabulary';

export default function WordDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const { data: vocabularyBank, isLoading, error } = useVocabularyBank();
  const [word, setWord] = useState<VocabularyWord | null>(null);

  // Find the word in the vocabulary bank
  useEffect(() => {
    if (vocabularyBank) {
      const foundWord = vocabularyBank.words.find(w => w._id === params.id);
      if (foundWord) {
        setWord(foundWord);
      } else {
        toast({
          title: 'Word not found',
          description:
            'The requested word could not be found in your vocabulary bank.',
          variant: 'destructive',
        });
        router.push('/dashboard/vocabulary');
      }
    }
  }, [vocabularyBank, params.id, router, toast]);

  const handleBackToDashboard = () => {
    router.push('/dashboard/vocabulary');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show error state
  if (error) {
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
          <h1 className="text-2xl font-bold">Word Details</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load vocabulary data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty state if word not found
  if (!word) {
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
          <h1 className="text-2xl font-bold">Word Details</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Word not found</CardTitle>
            <CardDescription>
              The requested word could not be found in your vocabulary bank.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToDashboard}>
              Back to Vocabulary Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">{word.word}</h1>
        <p className="text-muted-foreground">{word.definition}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    {word.word}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {word.partOfSpeech}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    word.mastery >= 90
                      ? 'default'
                      : word.mastery >= 50
                        ? 'secondary'
                        : 'outline'
                  }
                  className="text-lg px-3 py-1"
                >
                  {word.mastery}% Mastery
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Definition</h3>
                <p>{word.definition}</p>
              </div>

              {word.examples && word.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Examples</h3>
                  <ul className="space-y-2">
                    {word.examples.map((example, i) => (
                      <li key={i} className="italic text-muted-foreground">
                        &ldquo;{example}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {word.context && word.context.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Context</h3>
                  <ul className="space-y-2">
                    {word.context.map((context, i) => (
                      <li key={i} className="italic text-muted-foreground">
                        &ldquo;{context}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {word.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p>{word.notes}</p>
                </div>
              )}

              {word.tags && word.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {word.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
              <CardDescription>
                Your performance history for this word
              </CardDescription>
            </CardHeader>
            <CardContent>
              {word.reviewHistory && word.reviewHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 font-semibold text-sm border-b pb-2">
                    <div>Date</div>
                    <div>Performance</div>
                    <div>Context</div>
                  </div>
                  {word.reviewHistory.map((review, i) => (
                    <div key={i} className="grid grid-cols-3 text-sm">
                      <div>{new Date(review.date).toLocaleDateString()}</div>
                      <div>
                        <Badge
                          variant={
                            review.performance >= 4
                              ? 'default'
                              : review.performance >= 2
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {review.performance}/5
                        </Badge>
                      </div>
                      <div>{review.context}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No review history available for this word.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <WordRelationships
            wordId={word._id}
            word={word.word}
            existingRelationships={word.relationships}
          />

          <Card>
            <CardHeader>
              <CardTitle>Spaced Repetition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">
                  Last Reviewed:
                </div>
                <div>
                  {word.lastReviewed
                    ? new Date(word.lastReviewed).toLocaleDateString()
                    : 'Never'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">
                  Next Review:
                </div>
                <div>
                  {word.nextReview
                    ? new Date(word.nextReview).toLocaleDateString()
                    : 'Not scheduled'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">
                  Easiness Factor:
                </div>
                <div>{word.easinessFactor?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">
                  Repetitions:
                </div>
                <div>{word.repetitions || 0}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">
                  Interval (days):
                </div>
                <div>{word.interval || 0}</div>
              </div>
            </CardContent>
          </Card>

          {word.source && (
            <Card>
              <CardHeader>
                <CardTitle>Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Type:</div>
                  <div>{word.source.type}</div>
                </div>
                {word.source.title && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Title:</div>
                    <div>{word.source.title}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
