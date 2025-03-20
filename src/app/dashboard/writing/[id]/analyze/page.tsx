'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface WritingSession {
  _id: string;
  prompt: {
    text: string;
    type: string;
    topic: string;
    targetLength: number;
  };
  submission: {
    content: string;
    finalVersion: {
      submittedAt: string;
      wordCount: number;
    };
  };
  status: 'draft' | 'submitted' | 'analyzed' | 'completed';
}

export default function AnalyzeWritingPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<WritingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/writing/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data.session);

        // If session is already analyzed, redirect to feedback page
        if (
          data.session.status === 'analyzed' ||
          data.session.status === 'completed'
        ) {
          router.push(`/dashboard/writing/${sessionId}/feedback`);
        }

        // If session is not submitted, redirect to writing page
        if (data.session.status !== 'submitted') {
          toast({
            title: 'Not Submitted',
            description:
              'This writing session has not been submitted for analysis yet.',
          });
          router.push(`/dashboard/writing/${sessionId}`);
        }
      } catch (error) {
        console.error('Error fetching writing session:', error);
        setError('Failed to load writing session');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId, router]);

  // Start analysis with progress simulation
  useEffect(() => {
    if (session?.status === 'submitted' && !analyzing && !error) {
      startAnalysis();
    }
  }, [session, analyzing, error]);

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (analyzing) {
      interval = setInterval(() => {
        setProgress(prev => {
          // Slow down progress as it gets closer to 100%
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 85 ? 1 : 0.5;
          const newProgress = Math.min(prev + increment, 95);

          // If we've reached 95%, perform the actual analysis
          if (newProgress >= 95 && prev < 95) {
            performAnalysis();
          }

          return newProgress;
        });
      }, 300);
    }

    return () => clearInterval(interval);
  }, [analyzing]);

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
  };

  const performAnalysis = async () => {
    try {
      const response = await fetch(
        `/api/writing/sessions/${sessionId}/analyze`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze writing');
      }

      // Set progress to 100% and redirect to feedback page
      setProgress(100);

      // Short delay before redirecting
      setTimeout(() => {
        router.push(`/dashboard/writing/${sessionId}/feedback`);
      }, 1000);
    } catch (error) {
      console.error('Error analyzing writing:', error);
      setError('Failed to analyze writing. Please try again.');
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              There was an error analyzing your writing. Please try again or go
              back to your writing.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/writing')}
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
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
            <Button onClick={() => router.push('/dashboard/writing')}>
              Back to Writing Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          Analyzing Your Writing
        </h1>
        <p className="text-muted-foreground">
          Please wait while our AI analyzes your writing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis in Progress</CardTitle>
          <CardDescription>
            {session.prompt.type}: {session.prompt.topic}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing your writing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${progress >= 20 ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <span
                className={
                  progress >= 20
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                Checking grammar and spelling
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${progress >= 40 ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <span
                className={
                  progress >= 40
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                Analyzing vocabulary usage
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${progress >= 60 ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <span
                className={
                  progress >= 60
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                Evaluating coherence and structure
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${progress >= 80 ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <span
                className={
                  progress >= 80
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                Generating personalized feedback
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${progress >= 100 ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <span
                className={
                  progress >= 100
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                Analysis complete
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>This may take a minute or two. Please don't close this page.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
