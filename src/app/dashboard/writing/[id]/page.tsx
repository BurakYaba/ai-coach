'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
} from '@/components/ui/alert-dialog';
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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface WritingSession {
  _id: string;
  prompt: {
    text: string;
    type: string;
    topic: string;
    targetLength: number;
    requirements: string[];
  };
  submission: {
    content: string;
    finalVersion?: {
      submittedAt: string;
      wordCount: number;
    };
  };
  status: 'draft' | 'submitted' | 'analyzed' | 'completed';
  timeTracking: {
    startTime: string;
    endTime?: string;
    totalTime: number;
    activePeriods: Array<{
      start: string;
      end: string;
      duration: number;
    }>;
  };
}

export default function WritingSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<WritingSession | null>(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());
  const currentPeriodStartRef = useRef<number | null>(null);

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
        setContent(data.session.submission.content || '');
        setElapsedTime(data.session.timeTracking.totalTime || 0);

        // If session is not in draft status, don't start the timer
        if (data.session.status !== 'draft') {
          setIsActive(false);
        } else {
          // Start the timer automatically
          setIsActive(true);
          currentPeriodStartRef.current = Date.now();
        }
      } catch (error) {
        console.error('Error fetching writing session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load writing session',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Save time tracking when unmounting
      if (currentPeriodStartRef.current) {
        saveTimeTracking();
      }
    };
  }, [sessionId]);

  // Update word count when content changes
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = 30000; // 30 seconds

    const autoSave = async () => {
      if (
        Date.now() - lastSaveRef.current > autoSaveInterval &&
        content !== session?.submission.content
      ) {
        await saveContent();
      }
    };

    const interval = setInterval(autoSave, autoSaveInterval);

    return () => clearInterval(interval);
  }, [content, session]);

  // Save content to the server
  const saveContent = async () => {
    if (!session) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/writing/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      lastSaveRef.current = Date.now();

      toast({
        title: 'Saved',
        description: 'Your writing has been saved',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your writing',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Save time tracking
  const saveTimeTracking = async () => {
    if (!session || !currentPeriodStartRef.current) return;

    const now = Date.now();
    const periodDuration = Math.floor(
      (now - currentPeriodStartRef.current) / 1000
    );

    try {
      await fetch(`/api/writing/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeTracking: {
            totalTime: elapsedTime,
            activePeriod: {
              start: new Date(currentPeriodStartRef.current).toISOString(),
              end: new Date(now).toISOString(),
            },
          },
        }),
      });

      currentPeriodStartRef.current = null;
    } catch (error) {
      console.error('Error saving time tracking:', error);
    }
  };

  // Handle pause/resume
  const toggleTimer = async () => {
    if (isActive) {
      // Pause the timer
      setIsActive(false);
      if (currentPeriodStartRef.current) {
        await saveTimeTracking();
      }
    } else {
      // Resume the timer
      setIsActive(true);
      currentPeriodStartRef.current = Date.now();
    }
  };

  // Submit the writing
  const submitWriting = async () => {
    if (!session) return;

    setSubmitting(true);
    try {
      // First save the content
      await saveContent();

      // Save time tracking
      if (currentPeriodStartRef.current) {
        await saveTimeTracking();
      }

      // Update status to submitted
      const response = await fetch(`/api/writing/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'submitted',
          timeTracking: {
            endTime: new Date().toISOString(),
            totalTime: elapsedTime,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit writing');
      }

      const data = await response.json();
      setSession(data.session);
      setIsActive(false);

      // Navigate to analysis page
      router.push(`/dashboard/writing/${sessionId}/analyze`);

      toast({
        title: 'Submitted',
        description: 'Your writing has been submitted for analysis',
      });
    } catch (error) {
      console.error('Error submitting writing:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your writing',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-24" />
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
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
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

  const isEditable = session.status === 'draft';
  const progressPercentage = Math.min(
    100,
    Math.round((wordCount / session.prompt.targetLength) * 100)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {session.prompt.type}: {session.prompt.topic}
          </h1>
          <p className="text-muted-foreground">
            {isEditable ? 'Draft in progress' : 'Submitted for analysis'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium">Time</div>
            <div className="text-2xl tabular-nums">
              {formatTime(elapsedTime)}
            </div>
          </div>
          {isEditable && (
            <Button
              variant={isActive ? 'destructive' : 'default'}
              onClick={toggleTimer}
            >
              {isActive ? 'Pause' : 'Resume'}
            </Button>
          )}
        </div>
      </div>

      {/* Grid layout for prompt and writing area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Prompt Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Writing Prompt</CardTitle>
            <CardDescription>
              Target length: {session.prompt.targetLength} words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{session.prompt.text}</p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {session.prompt.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Writing Area Card */}
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                Word Count: <span className="font-medium">{wordCount}</span> /{' '}
                {session.prompt.targetLength}
              </div>
              <Badge
                variant={progressPercentage >= 100 ? 'default' : 'outline'}
              >
                {progressPercentage}%
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing here..."
            className="min-h-[300px] font-mono text-base flex-grow"
            disabled={!isEditable}
          />

          <div className="flex justify-between mt-auto">
            <Button
              variant="outline"
              onClick={saveContent}
              disabled={saving || !isEditable}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>

            {isEditable ? (
              <AlertDialog
                open={showSubmitDialog}
                onOpenChange={setShowSubmitDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button disabled={submitting || wordCount === 0}>
                    Submit for Analysis
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit your writing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {wordCount < session.prompt.targetLength ? (
                        <>
                          Your current word count ({wordCount}) is below the
                          target length ({session.prompt.targetLength}). Are you
                          sure you want to submit?
                        </>
                      ) : (
                        <>
                          Your writing will be submitted for analysis. You
                          won&apos;t be able to edit it after submission. Are
                          you sure you want to continue?
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={submitWriting}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                onClick={() =>
                  router.push(`/dashboard/writing/${sessionId}/feedback`)
                }
              >
                View Feedback
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
