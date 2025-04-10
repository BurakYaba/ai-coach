'use client';

import {
  ArrowLeft,
  BarChart,
  CalendarIcon,
  ClockIcon,
  Download,
  Loader2,
  MicIcon,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  GraduationCap,
  AudioLines,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SpeakingSessionDetailsProps {
  sessionId: string;
}

interface Transcript {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SpeakingSession {
  _id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'active' | 'completed' | 'interrupted';
  voice: string;
  modelName: string;
  transcripts: Transcript[];
  metadata?: {
    mode?: 'realtime' | 'turn-based';
    scenario?: string;
    level?: string;
  };
  feedback?: {
    fluencyScore: number;
    pronunciationScore?: number;
    vocabularyScore?: number;
    accuracyScore: number;
    grammarScore?: number;
    prosodyScore?: number;
    speakingRate?: number;
    completenessScore?: number;
    overallScore: number;
    strengths?: string[];
    areasForImprovement?: string[];
    suggestions?: string;
    grammarIssues?: Array<{
      text: string;
      issue: string;
      correction: string;
      explanation: string;
    }>;
    mispronunciations?: Array<{
      word: string;
      phonemes?: Array<{
        phoneme: string;
        score: number;
      }>;
      pronunciationScore: number;
      offset: number;
      duration: number;
    }>;
  };
}

export function SpeakingSessionDetails({
  sessionId,
}: SpeakingSessionDetailsProps) {
  const router = useRouter();
  const [session, setSession] = useState<SpeakingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('conversation');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentGrammarIssueIndex, setCurrentGrammarIssueIndex] = useState(0);
  const [currentMispronunciationIndex, setCurrentMispronunciationIndex] =
    useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [analytics, setAnalytics] = useState<{
    userWordCount: number;
    assistantWordCount: number;
    userMessageCount: number;
    assistantMessageCount: number;
    userUniqueWords: number;
    avgUserMessageLength: number;
    topUserWords: Array<{ word: string; count: number }>;
  }>({
    userWordCount: 0,
    assistantWordCount: 0,
    userMessageCount: 0,
    assistantMessageCount: 0,
    userUniqueWords: 0,
    avgUserMessageLength: 0,
    topUserWords: [],
  });
  const [grammarDrawerOpen, setGrammarDrawerOpen] = useState(false);
  const [pronunciationDrawerOpen, setPronunciationDrawerOpen] = useState(false);

  // Function to go to the previous grammar issue
  const prevGrammarIssue = () => {
    if (!session?.feedback?.grammarIssues?.length) return;
    setCurrentGrammarIssueIndex(prev =>
      prev === 0 ? session.feedback!.grammarIssues!.length - 1 : prev - 1
    );
  };

  // Function to go to the next grammar issue
  const nextGrammarIssue = () => {
    if (!session?.feedback?.grammarIssues?.length) return;
    setCurrentGrammarIssueIndex(prev =>
      prev === session.feedback!.grammarIssues!.length - 1 ? 0 : prev + 1
    );
  };

  // Function to go to the previous mispronunciation
  const prevMispronunciation = () => {
    if (!session?.feedback?.mispronunciations?.length) return;
    setCurrentMispronunciationIndex(prev =>
      prev === 0 ? session.feedback!.mispronunciations!.length - 1 : prev - 1
    );
  };

  // Function to go to the next mispronunciation
  const nextMispronunciation = () => {
    if (!session?.feedback?.mispronunciations?.length) return;
    setCurrentMispronunciationIndex(prev =>
      prev === session.feedback!.mispronunciations!.length - 1 ? 0 : prev + 1
    );
  };

  // Fetch the speaking session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/speaking/sessions/${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }

        const data = await response.json();
        setSession(data.session);

        // Calculate analytics if we have transcripts
        if (data.session.transcripts && data.session.transcripts.length > 0) {
          calculateAnalytics(data.session.transcripts);
        }
      } catch (error) {
        console.error('Error fetching speaking session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load speaking session details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // Calculate conversation analytics
  const calculateAnalytics = (transcripts: Transcript[]) => {
    const userTranscripts = transcripts.filter(t => t.role === 'user');
    const assistantTranscripts = transcripts.filter(
      t => t.role === 'assistant'
    );

    // Count words
    const userWords = userTranscripts.flatMap(t =>
      t.text.split(/\s+/).filter(Boolean)
    );
    const assistantWords = assistantTranscripts.flatMap(t =>
      t.text.split(/\s+/).filter(Boolean)
    );

    // Get unique words from user
    const uniqueUserWords = new Set(userWords.map(w => w.toLowerCase()));

    // Calculate average message length
    const avgUserLength =
      userTranscripts.length > 0
        ? userWords.length / userTranscripts.length
        : 0;

    // Find top words used by user (excluding common words)
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'is',
      'are',
      'to',
      'of',
      'for',
      'in',
      'on',
      'at',
      'by',
      'with',
      'about',
      'that',
      'this',
      'i',
      'you',
      'we',
      'they',
      'it',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'can',
      'could',
      'will',
      'would',
      'yes',
      'no',
    ]);
    const wordCount: Record<string, number> = {};

    userWords.forEach(word => {
      const normalizedWord = word.toLowerCase().replace(/[^\w\s]|_/g, '');
      if (normalizedWord && !commonWords.has(normalizedWord)) {
        wordCount[normalizedWord] = (wordCount[normalizedWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    setAnalytics({
      userWordCount: userWords.length,
      assistantWordCount: assistantWords.length,
      userMessageCount: userTranscripts.length,
      assistantMessageCount: assistantTranscripts.length,
      userUniqueWords: uniqueUserWords.size,
      avgUserMessageLength: Math.round(avgUserLength * 10) / 10, // round to 1 decimal
      topUserWords: topWords,
    });
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper function to get a descriptive session type
  const getSessionType = (): string => {
    if (!session) return 'Speaking Practice';

    if (session.metadata?.mode === 'turn-based') {
      return 'Turn-Based Conversation';
    } else if (session.metadata?.mode === 'realtime') {
      return 'Realtime Conversation';
    }
    return 'Speaking Practice';
  };

  // Helper function to get a formatted scenario name
  const getScenarioName = (scenario?: string): string => {
    if (!scenario || scenario === 'free') return 'Free Conversation';

    // Capitalize first letter and add spaces
    return scenario
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Completed
          </Badge>
        );
      case 'active':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Active
          </Badge>
        );
      case 'interrupted':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Interrupted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to download transcripts as text file
  const downloadTranscripts = () => {
    if (!session || !session.transcripts || session.transcripts.length === 0)
      return;

    const content = session.transcripts
      .map(transcript => {
        const role = transcript.role === 'user' ? 'You' : 'AI';
        const time = new Date(transcript.timestamp).toLocaleTimeString();
        return `[${time}] ${role}: ${transcript.text}`;
      })
      .join('\n\n');

    const title = `Speaking Practice - ${formatDate(session.startTime)}`;
    const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speaking-session-${session._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add a function to play pronunciation using OpenAI's TTS API
  const playPronunciation = async (word: string) => {
    if (isPlayingAudio || isLoadingAudio) return;

    try {
      setIsLoadingAudio(true);

      // Fetch the audio from our API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: word,
          voice: 'onyx', // Using a clear, neutral voice
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const data = await response.json();

      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();

        // Set up event handlers for the audio element
        audioRef.current.onplay = () => setIsPlayingAudio(true);
        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          toast({
            title: 'Error',
            description: 'Could not play the pronunciation',
            variant: 'destructive',
          });
        };
      }

      // Set the audio source and play
      audioRef.current.src = data.audioUrl;
      audioRef.current.play();
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      toast({
        title: 'Error',
        description: 'Could not load the pronunciation',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>

        <Skeleton className="h-10 w-full" />

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No session found
  if (!session) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Session Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The speaking session you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>
        <Button asChild>
          <Link href="/dashboard/speaking">Back to Speaking Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{getSessionType()}</h1>
          <p className="text-muted-foreground">
            {formatDate(session.startTime)}
          </p>
        </div>
      </div>

      {/* Session overview card */}
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>
            Details about your speaking practice session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Date:</span>
                <span>{formatDate(session.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Duration:</span>
                <span>{formatDuration(session.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <span>{getStatusBadge(session.status)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MicIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Voice:</span>
                <span className="capitalize">{session.voice}</span>
              </div>
              {session.metadata?.scenario && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Scenario:</span>
                  <span>{getScenarioName(session.metadata.scenario)}</span>
                </div>
              )}
              {session.metadata?.level && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Level:</span>
                  <span>CEFR {session.metadata.level.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={downloadTranscripts}
            className="flex items-center gap-2 ml-auto"
            disabled={!session.transcripts || session.transcripts.length === 0}
          >
            <Download className="h-4 w-4" />
            Download Transcript
          </Button>
        </CardFooter>
      </Card>

      {/* Tabs for conversation and analytics */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Conversation tab content */}
        <TabsContent value="conversation" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {session.transcripts && session.transcripts.length > 0 ? (
                <div className="space-y-6">
                  {session.transcripts.map((transcript, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex',
                        transcript.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg p-4 relative',
                          transcript.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {transcript.role === 'user' ? 'You' : 'AI'} •{' '}
                          {new Date(transcript.timestamp).toLocaleTimeString()}
                        </div>
                        <p className="whitespace-pre-wrap">{transcript.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No conversation transcripts available for this session.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics tab content */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Speaking Analytics</CardTitle>
              <CardDescription>
                Statistics about your speaking practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Word and message counts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Message Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Your Messages:</span>
                      <span className="font-medium">
                        {analytics.userMessageCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Messages:</span>
                      <span className="font-medium">
                        {analytics.assistantMessageCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Words You Spoke:</span>
                      <span className="font-medium">
                        {analytics.userWordCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unique Words Used:</span>
                      <span className="font-medium">
                        {analytics.userUniqueWords}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Message Length:</span>
                      <span className="font-medium">
                        {analytics.avgUserMessageLength} words
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Top words used */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Your Top Words</h3>
                    {analytics.topUserWords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analytics.topUserWords.map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.word} ({item.count})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Not enough data to analyze your vocabulary.
                      </p>
                    )}
                  </div>
                </div>

                {/* Pronunciation assessment section */}
                {session?.feedback ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          Pronunciation Assessment
                        </h3>
                        <Popover>
                          <PopoverTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">About assessment</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            side="top"
                            className="w-80 p-4"
                          >
                            <div className="space-y-2">
                              <h4 className="font-semibold">
                                About this Assessment
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Your speech has been analyzed using advanced
                                speech recognition technology to evaluate
                                multiple aspects of your pronunciation and
                                speaking skills:
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                <li>
                                  <strong>Fluency</strong>: How smoothly you
                                  speak without hesitation
                                </li>
                                <li>
                                  <strong>Pronunciation</strong>: How accurately
                                  you pronounce sounds
                                </li>
                                {session?.feedback?.prosodyScore && (
                                  <li>
                                    <strong>Prosody</strong>: Your intonation,
                                    rhythm, and stress patterns
                                  </li>
                                )}
                                {session?.feedback?.speakingRate && (
                                  <li>
                                    <strong>WPM</strong>: Words per minute -
                                    your speaking pace
                                  </li>
                                )}
                                <li>
                                  <strong>Grammar</strong>: Correct sentence
                                  structure and grammar rules
                                </li>
                                <li>
                                  <strong>Accuracy</strong>: Appropriate word
                                  usage and meaning
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Move drawer buttons here, before the scores */}
                    <div className="flex gap-2 my-4">
                      {session?.feedback?.grammarIssues &&
                        session.feedback.grammarIssues.length > 0 && (
                          <Drawer
                            open={grammarDrawerOpen}
                            onOpenChange={setGrammarDrawerOpen}
                          >
                            <DrawerTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <GraduationCap className="h-4 w-4" />
                                Grammar Correction
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Grammar Correction</DrawerTitle>
                                <DrawerDescription>
                                  Review grammar issues identified in your
                                  speech.
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="px-4 py-2">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      Issue {currentGrammarIssueIndex + 1} of{' '}
                                      {session.feedback.grammarIssues.length}
                                    </span>
                                  </div>
                                  <Card className="p-3">
                                    <div className="space-y-1 text-sm">
                                      <div className="flex items-center text-red-500">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        <span className="font-medium">
                                          Issue:{' '}
                                        </span>
                                        <span className="ml-1">
                                          {
                                            session.feedback.grammarIssues[
                                              currentGrammarIssueIndex
                                            ].text
                                          }
                                        </span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        <span className="font-medium">
                                          Correction:{' '}
                                        </span>
                                        <span className="ml-1">
                                          {
                                            session.feedback.grammarIssues[
                                              currentGrammarIssueIndex
                                            ].correction
                                          }
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">
                                          Explanation:{' '}
                                        </span>
                                        {
                                          session.feedback.grammarIssues[
                                            currentGrammarIssueIndex
                                          ].explanation
                                        }
                                      </div>
                                    </div>
                                  </Card>

                                  {/* Slider navigation buttons */}
                                  <div className="flex justify-between mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={prevGrammarIssue}
                                      disabled={
                                        session.feedback.grammarIssues.length <=
                                        1
                                      }
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                      Previous
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={nextGrammarIssue}
                                      disabled={
                                        session.feedback.grammarIssues.length <=
                                        1
                                      }
                                    >
                                      Next
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        )}

                      {session?.feedback?.mispronunciations &&
                        session.feedback.mispronunciations.length > 0 && (
                          <Drawer
                            open={pronunciationDrawerOpen}
                            onOpenChange={setPronunciationDrawerOpen}
                          >
                            <DrawerTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <AudioLines className="h-4 w-4" />
                                Pronunciation
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>
                                  Word-level Pronunciation Analysis
                                </DrawerTitle>
                                <DrawerDescription>
                                  We&apos;ve identified specific words that
                                  could use improvement in your pronunciation.
                                  Each word is analyzed down to the phoneme
                                  level (individual sounds).
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="px-4 py-2">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      Word {currentMispronunciationIndex + 1} of{' '}
                                      {
                                        session.feedback.mispronunciations
                                          .length
                                      }
                                    </span>
                                  </div>
                                  <Card className="p-3">
                                    <div className="space-y-1 text-sm">
                                      <div className="flex items-center text-red-500">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        <span className="font-medium">
                                          Word:{' '}
                                        </span>
                                        <span className="ml-1">
                                          {
                                            session.feedback.mispronunciations[
                                              currentMispronunciationIndex
                                            ].word
                                          }
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="ml-2 h-6 w-6 p-0"
                                          disabled={
                                            isPlayingAudio || isLoadingAudio
                                          }
                                          onClick={() => {
                                            if (
                                              session?.feedback
                                                ?.mispronunciations?.[
                                                currentMispronunciationIndex
                                              ]
                                            ) {
                                              playPronunciation(
                                                session.feedback
                                                  .mispronunciations[
                                                  currentMispronunciationIndex
                                                ].word
                                              );
                                            }
                                          }}
                                        >
                                          {isLoadingAudio ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Volume2
                                              className={cn(
                                                'h-4 w-4',
                                                isPlayingAudio
                                                  ? 'text-primary animate-pulse'
                                                  : ''
                                              )}
                                            />
                                          )}
                                          <span className="sr-only">
                                            Listen to pronunciation
                                          </span>
                                        </Button>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium">
                                          Score:{' '}
                                        </span>
                                        <span className="ml-1">
                                          {Math.round(
                                            session.feedback.mispronunciations[
                                              currentMispronunciationIndex
                                            ].pronunciationScore
                                          )}
                                          /100
                                        </span>
                                      </div>
                                      {session.feedback.mispronunciations[
                                        currentMispronunciationIndex
                                      ]?.phonemes &&
                                        session.feedback.mispronunciations[
                                          currentMispronunciationIndex
                                        ]?.phonemes?.length > 0 && (
                                          <div>
                                            <span className="font-medium">
                                              Phonemes:{' '}
                                            </span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {session.feedback.mispronunciations[
                                                currentMispronunciationIndex
                                              ].phonemes!.map(
                                                (phoneme, idx) => (
                                                  <Badge
                                                    key={idx}
                                                    variant={
                                                      phoneme.score < 70
                                                        ? 'destructive'
                                                        : 'outline'
                                                    }
                                                  >
                                                    {phoneme.phoneme} (
                                                    {Math.round(phoneme.score)})
                                                  </Badge>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      <div className="text-xs text-muted-foreground mt-2">
                                        <span className="font-medium">
                                          Tip:{' '}
                                        </span>
                                        Listen to native speakers pronounce this
                                        word and practice the specific sounds
                                        that are difficult for you.
                                      </div>
                                    </div>
                                  </Card>

                                  {/* Slider navigation buttons */}
                                  <div className="flex justify-between mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={prevMispronunciation}
                                      disabled={
                                        session.feedback.mispronunciations
                                          .length <= 1
                                      }
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                      Previous
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={nextMispronunciation}
                                      disabled={
                                        session.feedback.mispronunciations
                                          .length <= 1
                                      }
                                    >
                                      Next
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        )}
                    </div>

                    {/* Score cards */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      <Card className="p-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {session.feedback.fluencyScore || 'N/A'}
                            {session.feedback.fluencyScore ? '/10' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Fluency
                          </div>
                        </div>
                      </Card>
                      <Card className="p-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {session.feedback.pronunciationScore ||
                              session.feedback.vocabularyScore ||
                              'N/A'}
                            {session.feedback.pronunciationScore ||
                            session.feedback.vocabularyScore
                              ? '/10'
                              : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pronunciation
                          </div>
                        </div>
                      </Card>
                      <Card className="p-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {session.feedback.accuracyScore || 'N/A'}
                            {session.feedback.accuracyScore ? '/10' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Accuracy
                          </div>
                        </div>
                      </Card>
                      <Card className="p-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {session.feedback.grammarScore || 'N/A'}
                            {session.feedback.grammarScore ? '/10' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Grammar
                          </div>
                        </div>
                      </Card>
                      {session.feedback.prosodyScore && (
                        <Card className="p-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {session.feedback.prosodyScore}/10
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Prosody
                            </div>
                          </div>
                        </Card>
                      )}
                      {session.feedback.speakingRate && (
                        <Card className="p-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {session.feedback.speakingRate}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              WPM
                            </div>
                          </div>
                        </Card>
                      )}
                      <Card className="p-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {session.feedback.overallScore || 'N/A'}
                            {session.feedback.overallScore ? '/10' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Overall
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Remove this duplicated section */}
                    {/* Add back the Strengths and improvements sections that were removed */}
                    <div className="space-y-4 mt-6">
                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Strengths:</h4>
                        {session.feedback.strengths &&
                        session.feedback.strengths.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm">
                            {session.feedback.strengths.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No strengths data available.
                          </p>
                        )}
                      </div>

                      {/* Areas for Improvement */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                          Areas for Improvement:
                        </h4>
                        {session.feedback.areasForImprovement &&
                        session.feedback.areasForImprovement.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm">
                            {session.feedback.areasForImprovement.map(
                              (item, index) => (
                                <li key={index}>{item}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No improvement data available.
                          </p>
                        )}
                      </div>

                      {/* Suggestions */}
                      {session.feedback.suggestions ? (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Suggestions:</h4>
                          <p className="text-sm">
                            {session.feedback.suggestions}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Pronunciation Assessment
                      </h3>
                    </div>

                    <Card className="p-6">
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-2">
                          No pronunciation assessment available for this
                          session.
                        </p>
                        {session.status === 'completed' && (
                          <p className="text-sm text-muted-foreground">
                            Click the "Run Evaluation" button above to analyze
                            your speaking performance.
                          </p>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
