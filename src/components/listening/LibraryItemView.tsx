'use client';

import {
  PlayCircle,
  ArrowLeft,
  Clock,
  BookOpen,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import { formatDuration } from '@/lib/utils';

import { Badge } from '../ui/badge';

interface LibraryItemProps {
  id: string;
}

interface LibraryItem {
  _id: string;
  title: string;
  level: string;
  topic: string;
  contentType: string;
  duration: number;
  content:
    | string
    | {
        transcript: string;
        audioUrl: string;
        cloudinaryPublicId?: string;
      };
  category?: string;
  tags?: string[];
  createdAt: string;
  questions?: Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation?: string;
    timestamp?: number;
  }>;
  vocabulary?: Array<{
    word: string;
    definition: string;
    context?: string;
    examples?: string[];
    timestamp?: number;
    difficulty?: number;
  }>;
}

export function LibraryItemView({ id }: LibraryItemProps) {
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingSession, setStartingSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchLibraryItem() {
      try {
        const response = await fetch(`/api/library/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch library item');
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error('Error fetching library item:', err);
        setError('Failed to load the listening exercise');
      } finally {
        setLoading(false);
      }
    }

    fetchLibraryItem();
  }, [id]);

  const startSession = async () => {
    if (!item) return;

    setStartingSession(true);
    try {
      // Create a new session from the library item
      const response = await fetch('/api/listening/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          level: item.level,
          topic: item.topic,
          content: item.content,
          contentType: item.contentType,
          duration: item.duration,
          fromLibrary: true,
          libraryItemId: item._id,
          // Explicitly include questions and vocabulary if they exist on the item
          questions: (item as any).questions || [],
          vocabulary: (item as any).vocabulary || [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();

      // Redirect to the new session with the inprogress tab active
      router.push(`/dashboard/listening/${data._id}`);

      // This is optional but helps ensure the dashboard page is refreshed
      // when navigating back to it in the future
      router.prefetch('/dashboard/listening?tab=inprogress');
    } catch (err) {
      console.error('Error starting session:', err);
      toast({
        title: 'Error',
        description: 'Failed to start the listening session',
        variant: 'destructive',
      });
      setStartingSession(false);
    }
  };

  // Function to get badge color based on level
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: 'bg-green-100 text-green-800',
      A2: 'bg-green-200 text-green-800',
      B1: 'bg-blue-100 text-blue-800',
      B2: 'bg-blue-200 text-blue-800',
      C1: 'bg-purple-100 text-purple-800',
      C2: 'bg-purple-200 text-purple-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Error Loading Exercise</h3>
        <p className="text-muted-foreground mb-6">
          {error || 'Item not found'}
        </p>
        <Button asChild>
          <Link href="/dashboard/listening?tab=library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>
    );
  }

  // Preview the first 50 words of content
  const contentPreview =
    typeof item.content === 'string'
      ? item.content.split(' ').slice(0, 50).join(' ') + '...'
      : item.content.transcript.split(' ').slice(0, 50).join(' ') + '...';

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/listening?tab=library"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <p className="text-muted-foreground">{item.topic}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <Badge className={getLevelColor(item.level)}>
                  Level: {item.level}
                </Badge>
                <Badge variant="outline">{item.contentType}</Badge>
              </div>
              <CardTitle>About this exercise</CardTitle>
              <CardDescription>Preview of the content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{contentPreview}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {item.tags &&
                  item.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Duration: {formatDuration(item.duration)}</span>
              </div>
              {item.category && (
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Category: {item.category}</span>
                </div>
              )}
              <div className="flex items-center">
                <Headphones className="mr-2 h-4 w-4" />
                <span>Type: {item.contentType}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={startSession}
                disabled={startingSession}
                className="w-full"
              >
                {startingSession ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Session
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
