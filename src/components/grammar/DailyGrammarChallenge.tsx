'use client';

import { format } from 'date-fns';
import { RotateCw, Award, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface DailyChallengeData {
  _id: string;
  issue: {
    type: string;
    text: string;
    correction: string;
    explanation: string;
  };
  category: string;
  ceferLevel: string;
  options: string[]; // Multiple choice options
  correctOption: number; // Index of correct option
}

export function DailyGrammarChallenge() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [challengeData, setChallengeData] = useState<DailyChallengeData | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDailyChallenge();
      fetchUserStreak();
    }
  }, [session?.user?.id]);

  const fetchDailyChallenge = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/grammar/challenge/daily');
      if (!response.ok) {
        throw new Error('Failed to fetch daily challenge');
      }
      const data = await response.json();
      setChallengeData(data.challenge);
      setHasCompletedToday(data.hasCompletedToday || false);
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      toast({
        title: 'Error',
        description: 'Failed to load daily grammar challenge',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStreak = async () => {
    try {
      const response = await fetch('/api/user/grammar-progress');
      if (!response.ok) {
        throw new Error('Failed to fetch user grammar progress');
      }
      const data = await response.json();
      setStreak(data.challengeStreak || 0);
    } catch (error) {
      console.error('Error fetching user streak:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || !challengeData) return;

    setIsSubmitting(true);

    try {
      // Determine if answer is correct
      const isAnswerCorrect =
        selectedOption === challengeData.options[challengeData.correctOption];
      setIsCorrect(isAnswerCorrect);

      // Update user's progress
      const response = await fetch('/api/grammar/challenge/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challengeData._id,
          isCorrect: isAnswerCorrect,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit challenge response');
      }

      const data = await response.json();
      setStreak(data.newStreak);
      setHasCompletedToday(true);

      if (isAnswerCorrect) {
        if (data.badgeEarned) {
          toast({
            title: '🏆 New Badge Earned!',
            description: `You've earned the "${data.badgeEarned.name}" badge!`,
          });
        } else {
          toast({
            title: 'Correct!',
            description: 'Great job! Keep up the good work!',
          });
        }
      } else {
        toast({
          title: 'Not quite right',
          description: 'Review the explanation and try again tomorrow!',
        });
      }
    } catch (error) {
      console.error('Error submitting challenge response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your answer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetChallenge = () => {
    fetchDailyChallenge();
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  if (!challengeData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daily Grammar Challenge</CardTitle>
          <CardDescription>
            No challenge available. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            We couldn&apos;t find any grammar issues to create a challenge for
            you. Complete some writing or speaking exercises to generate grammar
            issues.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/writing')}
          >
            Try Writing Practice
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle>Daily Grammar Challenge</CardTitle>
            <CardDescription>
              {hasCompletedToday
                ? "You've completed today's challenge!"
                : 'Solve a daily grammar challenge to improve your skills'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="flex gap-1 items-center">
              <TrendingUp className="h-3 w-3" />
              <span>Streak: {streak} days</span>
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {challengeData.ceferLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">
              Category: {challengeData.category}
            </h3>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              Issue Type: {challengeData.issue.type}
            </h3>
            <div className="p-3 bg-muted/50 rounded-md mb-4">
              <p className="text-muted-foreground mb-1">
                <span className="line-through">{challengeData.issue.text}</span>
              </p>
              {isCorrect !== null && (
                <p className="text-primary font-medium">
                  {challengeData.issue.correction}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Choose the correct version:</h3>
            <RadioGroup
              value={selectedOption || ''}
              onValueChange={setSelectedOption}
              disabled={isCorrect !== null || hasCompletedToday}
              className="space-y-3"
            >
              {challengeData.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 border rounded-md ${
                    isCorrect !== null && index === challengeData.correctOption
                      ? 'bg-green-50 border-green-200'
                      : isCorrect !== null &&
                          selectedOption === option &&
                          index !== challengeData.correctOption
                        ? 'bg-red-50 border-red-200'
                        : 'hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="mr-1"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer text-sm"
                  >
                    {option}
                  </label>
                  {isCorrect !== null &&
                    index === challengeData.correctOption && (
                      <span className="text-green-600 ml-2">✓</span>
                    )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {isCorrect !== null && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium mb-2">Explanation:</h3>
              <p className="text-sm">{challengeData.issue.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {!hasCompletedToday && isCorrect === null ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? 'Checking...' : 'Submit Answer'}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={resetChallenge} size="sm">
              <RotateCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <div className="text-xs text-muted-foreground">
              Next challenge available{' '}
              {format(new Date().setHours(0, 0, 0, 0) + 86400000, 'PPP')}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
