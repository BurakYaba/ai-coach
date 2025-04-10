'use client';

import { Mic, MicOff, Play, Square, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { uploadSpeakingRecording } from '@/lib/client/audio-upload';
import { cn } from '@/lib/utils';

// Constants for role play scenarios
const ROLE_PLAY_SCENARIOS = [
  {
    id: 'free',
    name: 'Free Conversation',
    description: 'Open-ended conversation about any topic',
  },
  {
    id: 'restaurant',
    name: 'At a Restaurant',
    description: 'Order food and interact with a waiter',
  },
  {
    id: 'airport',
    name: 'Airport Check-in',
    description: 'Check in for a flight and handle luggage',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    description: 'Buy clothes, ask about products, and bargain',
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    description: 'Describe symptoms and understand treatment',
  },
  {
    id: 'interview',
    name: 'Job Interview',
    description: 'Answer questions about your experience and skills',
  },
  {
    id: 'hotel',
    name: 'Hotel Check-in',
    description: 'Book a room and ask about facilities',
  },
];

// CEFR levels
const CEFR_LEVELS = [
  {
    id: 'a1',
    name: 'A1 (Beginner)',
    description:
      'Can understand and use familiar everyday expressions and basic phrases',
  },
  {
    id: 'a2',
    name: 'A2 (Elementary)',
    description:
      'Can communicate in simple and routine tasks on familiar topics',
  },
  {
    id: 'b1',
    name: 'B1 (Intermediate)',
    description:
      'Can deal with most situations likely to arise while traveling',
  },
  {
    id: 'b2',
    name: 'B2 (Upper Intermediate)',
    description: 'Can interact with a degree of fluency with native speakers',
  },
  {
    id: 'c1',
    name: 'C1 (Advanced)',
    description:
      'Can express ideas fluently and spontaneously without much searching for expressions',
  },
  {
    id: 'c2',
    name: 'C2 (Proficiency)',
    description: 'Can understand with ease virtually everything heard or read',
  },
];

// Voice options
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
];

export function TurnBasedConversation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    'idle' | 'recording' | 'processing' | 'speaking' | 'error'
  >('idle');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('free');
  const [selectedLevel, setSelectedLevel] = useState('b1');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [speakingSessionId, setSpeakingSessionId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [sessionRecordings, setSessionRecordings] = useState<
    Array<{ blob: Blob; url?: string; timestamp: Date }>
  >([]);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    // Create audio element for playback
    if (!audioElementRef.current) {
      const audioElement = new Audio();
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;
    }

    return () => {
      // Clean up on component unmount
      endSession();
    };
  }, []);

  const startSession = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to use the speaking practice feature',
        variant: 'destructive',
      });
      return;
    }

    // Validate selections
    if (!selectedScenario || !selectedLevel || !selectedVoice) {
      toast({
        title: 'Missing selections',
        description:
          'Please select a scenario, language level, and voice before starting',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsStartingSession(true);

      // Reset conversation and add a loading message
      setConversation([
        {
          role: 'assistant',
          text: 'Starting conversation, please wait...',
        },
      ]);

      setStatus('processing');

      // Initialize session with backend
      console.log('Starting conversation session');

      // Add timeout for the API request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

      try {
        const response = await fetch('/api/speaking/conversation/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voice: selectedVoice,
            mode: 'turn-based',
            scenario: selectedScenario,
            level: selectedLevel,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Session start error:', errorText);
          throw new Error(`Failed to start session: ${errorText}`);
        }

        const data = await response.json();
        console.log('Session started with ID:', data.speakingSessionId);

        // Set state with session ID and mark session as active
        setSpeakingSessionId(data.speakingSessionId);
        setIsSessionActive(true);

        // Generate initial AI greeting based on selected scenario
        const initialPrompt = getInitialPrompt();
        console.log('Initial prompt:', initialPrompt);

        // Generate and play AI greeting - pass the session ID directly
        await generateAIResponse(initialPrompt, true, data.speakingSessionId);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: 'Session error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to start conversation session',
        variant: 'destructive',
      });
      setStatus('error');
    } finally {
      setIsStartingSession(false);
    }
  };

  const endSession = async () => {
    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    // Reset session state
    setConversation([]);
    setIsSessionActive(false);
    setStatus('idle');

    // Notify backend about session end
    if (session?.user && speakingSessionId) {
      try {
        // First, ensure any pending uploads are completed
        // This is a simple approach - for production, you might want to implement a more robust solution
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Extract all audio URLs from recordings that were successfully uploaded
        const audioUrls = sessionRecordings
          .filter(rec => rec.url)
          .map(rec => rec.url as string);

        console.log(`Ending session with ${audioUrls.length} audio recordings`);

        // Send session end request with audio URLs - evaluation will be triggered by the server
        const response = await fetch('/api/speaking/conversation/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speakingSessionId,
            audioUrls: audioUrls,
          }),
        });

        if (response.ok) {
          console.log(
            'Session ended successfully, server will evaluate recordings'
          );
          toast({
            title: 'Session ended',
            description:
              'Your speaking practice session has been saved and is being evaluated.',
          });
        } else {
          console.error('Error ending session:', await response.json());
          toast({
            title: 'Error',
            description: 'There was a problem ending your session.',
            variant: 'destructive',
          });
        }

        // Reset session data
        setSpeakingSessionId(null);
        setSessionRecordings([]);

        // Redirect to the dashboard
        router.push('/dashboard/speaking');
      } catch (error) {
        console.error('Error ending session:', error);
        toast({
          title: 'Error',
          description: 'There was a problem ending your session.',
          variant: 'destructive',
        });
      }
    }
  };

  const startRecording = async () => {
    if (!isSessionActive) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        setAudioBlob(audioBlob);
        processRecording(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('processing');
    }
  };

  const processRecording = async (audioBlobToProcess: Blob) => {
    if (!audioBlobToProcess || !speakingSessionId) return;

    setIsProcessing(true);

    try {
      // Store the recording in our session recordings array
      const newRecording = {
        blob: audioBlobToProcess,
        timestamp: new Date(),
      };
      setSessionRecordings(prev => [...prev, newRecording]);

      // Try to upload to Cloudinary for later analysis
      try {
        console.log('Uploading audio recording to Cloudinary');
        const uploadResult = await uploadSpeakingRecording(
          audioBlobToProcess,
          speakingSessionId
        );

        // Update the recording entry with the URL
        setSessionRecordings(prev =>
          prev.map((rec, index) =>
            index === prev.length - 1 ? { ...rec, url: uploadResult.url } : rec
          )
        );

        console.log('Audio recording uploaded:', uploadResult.url);
      } catch (uploadError) {
        // Don't fail the whole operation if upload fails
        console.error('Error uploading audio recording:', uploadError);
      }

      // Create form data with the audio blob
      const formData = new FormData();
      formData.append('audio', audioBlobToProcess, 'recording.webm');
      formData.append('speakingSessionId', speakingSessionId);

      // Send to backend for transcription
      const response = await fetch('/api/speaking/conversation/transcript', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { text } = await response.json();
      setUserTranscript(text);

      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', text }]);

      // Generate AI response - pass the currentSessionId explicitly
      await generateAIResponse(text, false);
    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: 'Processing error',
        description: 'Failed to process your recording',
        variant: 'destructive',
      });
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = async (
    userInput: string,
    isInitial = false,
    sessionIdOverride?: string
  ) => {
    // Use the override session ID if provided, otherwise use the state variable
    const activeSessionId = sessionIdOverride || speakingSessionId;

    if (!activeSessionId) {
      console.error('Cannot generate AI response: No speaking session ID');

      // Show toast with error message
      toast({
        title: 'Session error',
        description:
          'Failed to connect to the conversation session. Please try starting a new conversation.',
        variant: 'destructive',
      });

      setStatus('error');
      return;
    }

    setStatus('processing');
    console.log(
      `Generating AI response${isInitial ? ' (initial greeting)' : ''}`
    );
    console.log('User input:', userInput);
    console.log('Session ID:', activeSessionId);
    console.log('Scenario:', selectedScenario);
    console.log('Level:', selectedLevel);

    try {
      // Send user input to backend for AI response
      console.log('Sending request to /api/speaking/conversation/respond');

      // Add timeout for the API request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

      try {
        const response = await fetch('/api/speaking/conversation/respond', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speakingSessionId: activeSessionId,
            userInput,
            scenario: selectedScenario,
            level: selectedLevel,
            voice: selectedVoice,
            isInitial,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response error:', response.status, errorText);
          throw new Error(
            `Failed to get AI response: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();
        console.log('API response received:', data);

        // Add AI response to conversation
        setConversation(prev => [
          ...prev,
          { role: 'assistant', text: data.text },
        ]);

        // Play audio response
        if (data.audioUrl && audioElementRef.current) {
          console.log('Playing audio response');
          audioElementRef.current.src = data.audioUrl;
          audioElementRef.current.play();
          setStatus('speaking');

          audioElementRef.current.onended = () => {
            console.log('Audio playback completed');
            setStatus('idle');
          };

          audioElementRef.current.onerror = e => {
            console.error('Audio playback error:', e);
            setStatus('idle');
          };
        } else {
          console.log('No audio URL received or audio element not ready');
          setStatus('idle');
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: 'Response error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate AI response. Please try again.',
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  const getInitialPrompt = () => {
    // Find the selected scenario
    const scenario = ROLE_PLAY_SCENARIOS.find(s => s.id === selectedScenario);

    if (!scenario) {
      return "Hello! I'm your AI language practice partner. What would you like to talk about today?";
    }

    if (scenario.id === 'free') {
      return `Hello there! I'm your English language practice partner. I'm here to help you improve your conversation skills. How are you doing today? Is there any specific topic you'd like to discuss?`;
    }

    // Role-play specific greetings
    switch (scenario.id) {
      case 'restaurant':
        return `Hello and welcome to our restaurant! My name is Alex and I'll be your server today. Would you like to see our menu? We have some excellent specials today that I can tell you about.`;

      case 'airport':
        return `Good day! Welcome to the airport check-in counter. May I see your passport and flight details, please? I'll help you check in for your flight today.`;

      case 'shopping':
        return `Hello there! Welcome to our clothing store. We have some great sales going on today. Is there something specific you're looking for? Perhaps I can help you find it.`;

      case 'doctor':
        return `Good morning. I'm Dr. Thompson. Thanks for coming in today. What seems to be the problem? Can you tell me what symptoms you've been experiencing?`;

      case 'interview':
        return `Hello, thank you for coming in today. I'm the hiring manager for the position you applied for. Please, have a seat. Could you start by telling me a little about yourself and your experience?`;

      case 'hotel':
        return `Good evening and welcome to our hotel! I'm at the front desk and I'll be assisting you with your check-in. Do you have a reservation with us?`;

      default:
        return `Hello! I'm your AI language practice partner. Let's practice in a ${scenario.name.toLowerCase()} scenario. I'll guide you through this conversation as if we're in a real-life situation.`;
    }
  };

  return (
    <div className="space-y-4">
      {!isSessionActive ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium mb-1 block">
                Practice Scenario:
              </span>
              <Select
                value={selectedScenario}
                onValueChange={setSelectedScenario}
              >
                <SelectTrigger aria-label="Select a practice scenario">
                  <SelectValue placeholder="Select a scenario" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_PLAY_SCENARIOS.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {
                  ROLE_PLAY_SCENARIOS.find(s => s.id === selectedScenario)
                    ?.description
                }
              </p>
            </div>

            <div>
              <span className="text-sm font-medium mb-1 block">
                Language Level:
              </span>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger aria-label="Select your language level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {CEFR_LEVELS.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {CEFR_LEVELS.find(l => l.id === selectedLevel)?.description}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium mb-1 block">AI Voice:</span>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger
                className="w-full md:w-[180px]"
                aria-label="Select an AI voice"
              >
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map(voice => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={startSession}
            disabled={!session?.user || isStartingSession}
            className="mt-4"
          >
            {isStartingSession ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isStartingSession ? 'Starting...' : 'Start Conversation'}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Status:</p>
              <Badge variant={status === 'error' ? 'destructive' : 'default'}>
                {status === 'idle' && 'Ready for your response'}
                {status === 'recording' && 'Recording your response...'}
                {status === 'processing' && 'Processing...'}
                {status === 'speaking' && 'AI is speaking...'}
                {status === 'error' && 'Error'}
              </Badge>

              <Badge variant="outline">
                {ROLE_PLAY_SCENARIOS.find(s => s.id === selectedScenario)?.name}
              </Badge>

              <Badge variant="outline">
                Level: {selectedLevel.toUpperCase()}
              </Badge>
            </div>

            <Button variant="destructive" onClick={endSession}>
              <Square className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          </div>

          {status === 'error' && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
              <h3 className="text-destructive font-medium mb-2">Error</h3>
              <p className="text-sm text-destructive/90 mb-3">
                There was a problem with the conversation. Please check the
                console for more details.
              </p>
              <Button
                onClick={() => {
                  // Reset the conversation and start fresh
                  setStatus('idle');
                  // If no conversation yet, need to re-initialize with AI greeting
                  if (conversation.length === 0 && speakingSessionId) {
                    const initialPrompt = getInitialPrompt();
                    generateAIResponse(initialPrompt, true, speakingSessionId);
                  }
                }}
                variant="outline"
                className="mr-2"
              >
                Retry
              </Button>
            </div>
          )}

          <div
            ref={conversationContainerRef}
            className="border rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto"
          >
            {conversation.map((message, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start space-x-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {conversation.length === 0 &&
              !isProcessing &&
              status !== 'error' && (
                <div className="text-center text-muted-foreground p-4">
                  <p>Starting conversation. Please wait...</p>
                </div>
              )}
          </div>

          <div className="flex justify-center mt-4">
            {isRecording ? (
              <Button
                variant="destructive"
                onClick={stopRecording}
                disabled={status === 'processing' || status === 'speaking'}
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                disabled={
                  status === 'processing' ||
                  status === 'speaking' ||
                  isProcessing ||
                  status === 'error'
                }
              >
                <Mic className="mr-2 h-4 w-4" />
                Record Response
              </Button>
            )}
          </div>
        </>
      )}

      {/* Hidden audio element for playback */}
      <audio ref={audioElementRef} className="hidden" aria-hidden="true">
        <track kind="captions" src="" label="English captions" />
      </audio>
    </div>
  );
}
