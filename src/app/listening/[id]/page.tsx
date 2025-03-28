'use client';

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  List,
  Loader2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatTime, normalizeQuestionType } from '@/lib/utils';

// Fetch listening session from API
async function fetchListeningSession(id: string) {
  const response = await fetch(`/api/listening/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch listening session');
  }
  return response.json();
}

// Update session progress
async function updateSessionProgress(id: string, progress: any) {
  const response = await fetch(`/api/listening/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userProgress: progress }),
  });

  if (!response.ok) {
    throw new Error('Failed to update session progress');
  }

  return response.json();
}

// Submit answers and get feedback
async function submitAnswers(id: string, answers: string[]) {
  const response = await fetch(`/api/listening/${id}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit answers');
  }

  return response.json();
}

export default function ListeningSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState('listen');

  // For segmented audio playback (when FFmpeg isn't available)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [audioSegments, setAudioSegments] = useState<any[]>([]);
  const [isSegmentedAudio, setIsSegmentedAudio] = useState(false);
  const segmentRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  // Load the session data
  useEffect(() => {
    async function loadSession() {
      try {
        const data = await fetchListeningSession(params.id);
        console.log('Loaded session data:', {
          title: data.title,
          questionTypes: data.questions
            ? data.questions.map((q: any) => q.type)
            : [],
          vocabCount: data.vocabulary ? data.vocabulary.length : 0,
          vocabExamples: data.vocabulary
            ? data.vocabulary.slice(0, 1).map((v: any) => ({
                word: v.word,
                exampleCount: v.examples?.length,
              }))
            : [],
          isSegmented: !!data.content?.isSegmented,
          segmentsCount: data.content?.segments?.length || 0,
        });

        setSession(data);

        // Handle segmented audio (when FFmpeg isn't available on server)
        if (data.content?.isSegmented && Array.isArray(data.content.segments)) {
          console.log(
            'Loading segmented audio:',
            data.content.segments.length,
            'segments'
          );
          setIsSegmentedAudio(true);
          setAudioSegments(data.content.segments);
          // Initialize refs array for each segment
          segmentRefs.current = data.content.segments.map(() => null);
        }

        // Initialize answers array with empty strings
        setAnswers(new Array(data.questions?.length || 0).fill(''));
      } catch (err) {
        console.error('Error loading session:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to load session')
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [params.id]);

  // Audio player event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (isSegmentedAudio) {
        // For segmented audio, calculate the global time by adding up previous segments
        const previousSegmentsDuration = audioSegments
          .slice(0, currentSegmentIndex)
          .reduce((sum, segment) => sum + (segment.duration || 0), 0);

        const currentSegmentTime =
          segmentRefs.current[currentSegmentIndex]?.currentTime || 0;
        setCurrentTime(previousSegmentsDuration + currentSegmentTime);
      } else {
        // Normal single audio file
        setCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (isSegmentedAudio) {
        // For segmented audio, use the total duration from all segments
        const totalDuration = audioSegments.reduce(
          (sum, segment) => sum + (segment.duration || 0),
          0
        );
        setDuration(totalDuration);
      } else {
        // Normal single audio file
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isSegmentedAudio) {
        // If there are more segments, play the next one
        if (currentSegmentIndex < audioSegments.length - 1) {
          setCurrentSegmentIndex(currentSegmentIndex + 1);

          // Play the next segment after a small delay
          setTimeout(() => {
            const nextSegment = segmentRefs.current[currentSegmentIndex + 1];
            if (nextSegment) {
              nextSegment.play().catch(console.error);
            }
          }, 100);
        } else {
          // Reached the end of all segments
          setIsPlaying(false);
        }
      } else {
        // Normal behavior for single audio file
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isSegmentedAudio, currentSegmentIndex, audioSegments]);

  // Handle play/pause
  const togglePlay = () => {
    if (isSegmentedAudio) {
      if (isPlaying) {
        // Pause the current segment
        const currentSegment = segmentRefs.current[currentSegmentIndex];
        if (currentSegment) {
          currentSegment.pause();
        }
      } else {
        // Play the current segment
        const currentSegment = segmentRefs.current[currentSegmentIndex];
        if (currentSegment) {
          currentSegment.play().catch(console.error);
        }
      }
    } else {
      // Normal single audio file
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
    }

    setIsPlaying(!isPlaying);
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];

    if (isSegmentedAudio) {
      // Find which segment contains the seek time
      let timeAccumulated = 0;
      let targetSegmentIndex = 0;
      let timeWithinTargetSegment = seekTime;

      for (let i = 0; i < audioSegments.length; i++) {
        const segmentDuration = audioSegments[i].duration || 0;

        if (timeAccumulated + segmentDuration > seekTime) {
          // This segment contains our seek position
          targetSegmentIndex = i;
          timeWithinTargetSegment = seekTime - timeAccumulated;
          break;
        }

        timeAccumulated += segmentDuration;
      }

      // Pause all segments
      segmentRefs.current.forEach(segment => {
        if (segment) segment.pause();
      });

      // Update the current segment index
      setCurrentSegmentIndex(targetSegmentIndex);

      // Set the current time within the target segment
      const targetSegment = segmentRefs.current[targetSegmentIndex];
      if (targetSegment) {
        targetSegment.currentTime = timeWithinTargetSegment;

        // If already playing, play the new segment
        if (isPlaying) {
          targetSegment.play().catch(console.error);
        }
      }

      // Update the displayed time
      setCurrentTime(seekTime);
    } else {
      // Normal single audio behavior
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];

    if (isSegmentedAudio) {
      // Apply the volume to all segments
      segmentRefs.current.forEach(segment => {
        if (segment) segment.volume = newVolume / 100;
      });
    } else {
      // Normal single audio behavior
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = newVolume / 100;
    }

    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isSegmentedAudio) {
      // Apply mute/unmute to all segments
      segmentRefs.current.forEach(segment => {
        if (segment) {
          segment.volume = isMuted ? volume / 100 : 0;
        }
      });
    } else {
      // Normal single audio behavior
      const audio = audioRef.current;
      if (!audio) return;

      if (isMuted) {
        audio.volume = volume / 100;
      } else {
        audio.volume = 0;
      }
    }

    setIsMuted(!isMuted);
  };

  // Handle answer changes
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Submit answers for feedback
  const handleSubmitAnswers = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitAnswers(params.id, answers);
      setFeedback(result);
      setActiveTab('results'); // Switch to results tab

      toast({
        title: 'Answers submitted successfully',
        description: `Your score: ${result.score}%`,
      });
    } catch (err) {
      console.error('Error submitting answers:', err);
      toast({
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to submit answers',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>

        <div className="space-y-8">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load listening session
          </h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button onClick={() => router.refresh()} variant="outline">
              Try Again
            </Button>
            <Link href="/listening">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No session data
  if (!session) {
    return (
      <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Listening session not found</h2>
          <p className="mt-2 text-gray-600">
            The session you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <div className="mt-6">
            <Link href="/listening">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 pb-24">
      <div className="mb-6">
        <Link
          href="/listening"
          className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to listening dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {session.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{session.level}</Badge>
              <Badge variant="outline" className="capitalize">
                {session.contentType}
              </Badge>
              <Badge variant="outline">{session.topic}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Volume2 className="mr-1 h-4 w-4" />
                {formatTime(session.duration || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
        {isSegmentedAudio ? (
          /* Segmented Audio Player (hidden audio elements for each segment) */
          <div className="hidden">
            {audioSegments.map((segment, index) => (
              <audio
                key={`segment-${index}`}
                ref={el => {
                  segmentRefs.current[index] = el;
                }}
                src={segment.url}
                preload="metadata"
                onLoadedMetadata={() => {
                  // Update total duration when segment metadata is loaded
                  const totalDuration = audioSegments.reduce(
                    (sum, segment, i) => {
                      const segmentDuration =
                        segmentRefs.current[i]?.duration ||
                        segment.duration ||
                        0;
                      return sum + segmentDuration;
                    },
                    0
                  );
                  setDuration(totalDuration);

                  if (index === 0) {
                    console.log(
                      `Segmented audio loaded: ${audioSegments.length} segments, total duration: ${totalDuration}s`
                    );
                  }
                }}
                onTimeUpdate={() => {
                  if (index === currentSegmentIndex) {
                    // Update current time during playback
                    const previousSegmentsDuration = audioSegments
                      .slice(0, index)
                      .reduce(
                        (sum, segment, i) =>
                          sum +
                          (segmentRefs.current[i]?.duration ||
                            segment.duration ||
                            0),
                        0
                      );

                    const segmentTime =
                      segmentRefs.current[index]?.currentTime || 0;
                    setCurrentTime(previousSegmentsDuration + segmentTime);
                  }
                }}
                onEnded={() => {
                  if (index === currentSegmentIndex) {
                    // If there are more segments, play the next one
                    if (index < audioSegments.length - 1) {
                      setCurrentSegmentIndex(index + 1);
                      const nextSegment = segmentRefs.current[index + 1];
                      if (nextSegment) {
                        setTimeout(() => {
                          nextSegment.play().catch(console.error);
                        }, 100);
                      }
                    } else {
                      // End of all segments
                      setIsPlaying(false);
                    }
                  }
                }}
              >
                <track kind="captions" src="" label="English captions" />
                Your browser does not support the audio element.
              </audio>
            ))}
          </div>
        ) : (
          /* Standard Audio Player */
          <audio
            ref={audioRef}
            src={session.content?.audioUrl}
            preload="metadata"
            onLoadedMetadata={() => {
              // Set initial duration when metadata is loaded
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
                console.log(
                  'Audio duration loaded:',
                  audioRef.current.duration
                );
              }
            }}
            onTimeUpdate={() => {
              // Update current time during playback
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          >
            <track kind="captions" src="" label="English captions" />
            Your browser does not support the audio element.
          </audio>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              {formatTime(currentTime)} /{' '}
              {formatTime(duration || session.duration || 0)}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>

          <Slider
            value={[currentTime]}
            min={0}
            max={duration || session.duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(
                  0,
                  audioRef.current.currentTime - 10
                );
              }
            }}
          >
            <Repeat className="h-5 w-5" />
            <span className="sr-only">Repeat 10 seconds</span>
          </Button>

          <Button
            size="lg"
            variant="default"
            className="h-14 w-14 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 pl-1" />
            )}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </Button>
        </div>
      </div>

      {/* Transcript (Collapsible) */}
      <Collapsible open={showTranscript} className="mb-8">
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Transcript
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(false)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto rounded-md bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {session.content?.transcript}
                </p>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="listen">
            <Play className="mr-2 h-4 w-4" />
            Listen & Practice
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            disabled={session.questions?.length === 0}
          >
            <List className="mr-2 h-4 w-4" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listen" className="space-y-6">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Key Vocabulary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session.vocabulary && session.vocabulary.length > 0 ? (
                <div className="space-y-4">
                  {session.vocabulary.map((item: any, index: number) => (
                    <Collapsible key={index}>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h4 className="font-medium">{item.word}</h4>
                          <p className="text-sm text-gray-500">
                            {item.definition}
                          </p>
                        </div>
                        <CollapsibleTrigger
                          className="rounded-full p-2 hover:bg-muted/50"
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLButtonElement>
                          ) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const button =
                                e.currentTarget as HTMLButtonElement;
                              button.click();
                            }
                          }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2">
                          <div className="rounded-lg bg-muted/50 p-3 text-sm">
                            <p className="mb-2 italic">"{item.context}"</p>
                            {Array.isArray(item.examples) &&
                              item.examples.length > 0 && (
                                <>
                                  <h5 className="mt-3 font-medium">
                                    Examples:
                                  </h5>
                                  <ul className="mt-1 space-y-1 pl-4">
                                    {item.examples.map(
                                      (example: string, i: number) => (
                                        <li key={i}>{example}</li>
                                      )
                                    )}
                                  </ul>
                                </>
                              )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No vocabulary items available for this session.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Comprehension Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session.questions && session.questions.length > 0 ? (
                <div className="space-y-6">
                  {session.questions.map((question: any, index: number) => {
                    // Normalize question type to handle variations
                    const rawType = question.type || 'multiple-choice';
                    const questionType = normalizeQuestionType(rawType);

                    console.log(
                      `Question ${index + 1}: raw type '${rawType}', normalized type '${questionType}'`
                    );

                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-start">
                          <span className="mr-2 font-semibold">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{question.question}</p>
                            <div className="mt-3">
                              {questionType === 'multiple-choice' &&
                                question.options &&
                                Array.isArray(question.options) && (
                                  <div className="space-y-2">
                                    {question.options.map(
                                      (option: string, optIndex: number) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center space-x-2"
                                        >
                                          <input
                                            type="radio"
                                            id={`q${index}-opt${optIndex}`}
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() =>
                                              handleAnswerChange(index, option)
                                            }
                                            className="h-4 w-4 text-primary"
                                          />
                                          <label
                                            htmlFor={`q${index}-opt${optIndex}`}
                                            className="text-sm"
                                          >
                                            {option}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}

                              {questionType === 'true-false' && (
                                <div className="space-y-2">
                                  {/* Ensure we always have True and False options */}
                                  {['True', 'False'].map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        id={`q${index}-opt${optIndex}`}
                                        name={`question-${index}`}
                                        value={option}
                                        checked={answers[index] === option}
                                        onChange={() =>
                                          handleAnswerChange(index, option)
                                        }
                                        className="h-4 w-4 text-primary"
                                      />
                                      <label
                                        htmlFor={`q${index}-opt${optIndex}`}
                                        className="text-sm"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {questionType === 'fill-blank' && (
                                <div className="mt-2">
                                  <Textarea
                                    placeholder="Type your answer here..."
                                    value={answers[index] || ''}
                                    onChange={e =>
                                      handleAnswerChange(index, e.target.value)
                                    }
                                    rows={2}
                                    className="w-full resize-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleSubmitAnswers}
                      disabled={isSubmitting}
                      className="px-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Submit Answers
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No questions available for this session.
                </p>
              )}
            </CardContent>
          </Card>

          {feedback && (
            <Card className="mt-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Results: {feedback.score}% Correct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.questionFeedback.map((item: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start">
                        <div
                          className={cn(
                            'mr-2 flex h-5 w-5 items-center justify-center rounded-full text-white text-xs',
                            item.isCorrect ? 'bg-green-500' : 'bg-red-500'
                          )}
                        >
                          {item.isCorrect ? '✓' : '✗'}
                        </div>
                        <div>
                          <p className="font-medium">
                            Question {index + 1}: {item.question}
                          </p>
                          <p className="mt-1 text-sm">
                            Your answer:{' '}
                            <span
                              className={
                                item.isCorrect
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }
                            >
                              {item.userAnswer || '(No answer)'}
                            </span>
                          </p>
                          {!item.isCorrect && (
                            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                              Correct answer: {item.correctAnswer}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {item.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {feedback && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                      {feedback.score}%
                    </div>
                    <p className="mt-4 text-center text-gray-700">
                      {feedback.overallFeedback}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {feedback.feedbackItems?.map((item: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2">{item.question}</p>
                          <div className="mb-3 grid gap-3 md:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs text-gray-500">
                                Your answer:
                              </p>
                              <p
                                className={`${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {item.userAnswer || '(No answer provided)'}
                              </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs text-gray-500">
                                Correct answer:
                              </p>
                              <p className="text-green-600">
                                {item.correctAnswer}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-sm text-blue-800">
                              {item.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Link href="/listening">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
                <Link href="/listening/create">
                  <Button>Practice More</Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
