'use client';

import { Mic, MicOff, Play, Square } from 'lucide-react';
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
import { cn } from '@/lib/utils';

// Define a proper type for the OpenAI event object
type OpenAIEvent = Record<string, any>;

// Helper function to extract user text from various possible event shapes
const extractUserText = (item: Record<string, any>): string => {
  const extractedText = '';

  // Case 1: Direct content as string
  if (typeof item.content === 'string' && item.content.trim()) {
    return item.content;
  }

  // Case 2: Input content as string
  if (
    item.input &&
    typeof item.input.content === 'string' &&
    item.input.content.trim()
  ) {
    return item.input.content;
  }

  // Case 3: Content as object with text property
  if (item.content && typeof item.content === 'object') {
    if (item.content.text) return String(item.content.text);
    if (item.content.value) return String(item.content.value);
  }

  // Case 4: Input content as object with text property
  if (
    item.input &&
    item.input.content &&
    typeof item.input.content === 'object'
  ) {
    if (item.input.content.text) return String(item.input.content.text);
    if (item.input.content.value) return String(item.input.content.value);
  }

  // Case 5: Direct transcript property
  if (
    item.transcript &&
    typeof item.transcript === 'string' &&
    item.transcript.trim()
  ) {
    return item.transcript;
  }

  // Case 6: Direct text property
  if (item.text && typeof item.text === 'string' && item.text.trim()) {
    return item.text;
  }

  // Case 7: Speech property
  if (item.speech && typeof item.speech === 'string' && item.speech.trim()) {
    return item.speech;
  }

  // Case 8: Speech text from input_audio object in an array
  if (item.input && Array.isArray(item.input)) {
    const audioItems = item.input.filter(
      (input: Record<string, any>) =>
        input.type === 'input_audio' && input.speech_text
    );

    if (audioItems.length > 0 && audioItems[0].speech_text) {
      return audioItems[0].speech_text;
    }
  }

  // Case 9: Array of inputs with input_audio type
  if (
    Array.isArray(item) ||
    (typeof item.input?.content === 'object' &&
      Array.isArray(item.input.content))
  ) {
    const arrayToCheck = Array.isArray(item) ? item : item.input.content;
    const audioItems = arrayToCheck.filter(
      (input: Record<string, any>) =>
        input && input.type === 'input_audio' && input.transcript
    );

    if (audioItems.length > 0 && audioItems[0].transcript) {
      return audioItems[0].transcript;
    }

    // If transcript is null but we have speech_recognizer data
    const recognizerItems = arrayToCheck.filter(
      (input: Record<string, any>) =>
        input &&
        input.type === 'input_audio' &&
        input.speech_recognizer &&
        input.speech_recognizer.text
    );

    if (
      recognizerItems.length > 0 &&
      recognizerItems[0].speech_recognizer.text
    ) {
      return recognizerItems[0].speech_recognizer.text;
    }
  }

  // Last resort: Try to parse JSON if it's potentially an array of objects as a string
  if (
    typeof item.input?.content === 'string' &&
    (item.input.content.startsWith('[{') || item.input.content.startsWith('{"'))
  ) {
    try {
      const parsed = JSON.parse(item.input.content);
      if (Array.isArray(parsed)) {
        const audioItems = parsed.filter(
          (input: Record<string, any>) =>
            input && input.type === 'input_audio' && input.transcript
        );

        if (audioItems.length > 0 && audioItems[0].transcript) {
          return audioItems[0].transcript;
        }
      } else if (parsed.transcript) {
        return parsed.transcript;
      } else if (parsed.text) {
        return parsed.text;
      } else if (parsed.content) {
        return parsed.content;
      }
    } catch (e) {
      console.error('Failed to parse JSON content:', e);
    }
  }

  return extractedText;
};

export function FreeConversation() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error'
  >('idle');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [aiTranscript, setAiTranscript] = useState<string>('');
  const [completeAiMessage, setCompleteAiMessage] = useState<string>('');
  const [currentAiResponseId, setCurrentAiResponseId] = useState<string | null>(
    null
  );
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('alloy');
  const [muted, setMuted] = useState<boolean>(false);
  const [speakingSessionId, setSpeakingSessionId] = useState<string | null>(
    null
  );
  const [lastReceivedTranscript, setLastReceivedTranscript] =
    useState<string>('');

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);

  // Add refs to track current transcript values
  const currentAiTranscriptRef = useRef<string>('');
  const currentUserTranscriptRef = useRef<string>('');

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // Store last complete transcript as fallback
  useEffect(() => {
    if (
      currentAiTranscriptRef.current &&
      currentAiTranscriptRef.current.trim()
    ) {
      setLastReceivedTranscript(currentAiTranscriptRef.current);
    }
  }, [currentAiTranscriptRef.current]);

  useEffect(() => {
    // Create audio element for playback
    if (!audioElementRef.current) {
      const audioElement = new Audio();
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;
    }

    return () => {
      // Clean up on component unmount
      stopConversation();
    };
  }, []);

  const startConversation = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to use the speaking practice feature',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Reset conversation state
      setConversation([]);
      clearTranscripts();
      setStatus('connecting');

      // Step 1: Request ephemeral key from our backend
      const tokenResponse = await fetch('/api/speaking/conversation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice: selectedVoice,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token');
      }

      const { ephemeralKey, speakingSessionId: sessionId } =
        await tokenResponse.json();
      setSpeakingSessionId(sessionId);

      // Step 2: Create WebRTC peer connection
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Step 3: Set up audio element for playback
      peerConnection.ontrack = e => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = e.streams[0];
        }
      };

      // Step 4: Add local audio track for microphone input
      try {
        const clientMedia = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioTrack = clientMedia.getAudioTracks()[0];
        peerConnection.addTrack(audioTrack);

        // Handle muting/unmuting
        audioTrack.enabled = !muted;
      } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
          title: 'Microphone access denied',
          description:
            'Please allow microphone access to use speaking practice',
          variant: 'destructive',
        });
        setStatus('error');
        return;
      }

      // Step 5: Set up data channel for sending and receiving events
      const dataChannel = peerConnection.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener('open', () => {
        console.log('Data channel is open');
        setStatus('connected');

        // Update session with instructions
        updateSession();
      });

      dataChannel.addEventListener('message', e => {
        handleServerEvent(JSON.parse(e.data));
      });

      dataChannel.addEventListener('close', () => {
        console.log('Data channel is closed');
        setStatus('idle');
      });

      // Step 6: Create and set local description (offer)
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Step 7: Send offer to OpenAI Realtime API
      const model = 'gpt-4o-mini-realtime-preview-2024-12-17';
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: 'POST',
          body: peerConnection.localDescription?.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp',
          },
        }
      );

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI Realtime API');
      }

      // Step 8: Set remote description (answer)
      const answer = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };

      await peerConnection.setRemoteDescription(
        answer as RTCSessionDescriptionInit
      );

      console.log('WebRTC connection established');
      setStatus('connected');

      // Add welcome message to conversation
      const welcomeMessage =
        "Hello! I'm your AI speaking practice partner. What would you like to talk about today?";

      // Add directly to conversation state (don't use addMessage helper)
      setConversation([{ role: 'assistant', text: welcomeMessage }]);
      console.log('Added welcome message to conversation:', welcomeMessage);

      // Also update the complete message state (for debugging)
      setCompleteAiMessage(welcomeMessage);

      // Save welcome message to database
      if (sessionId) {
        await saveTranscript('assistant', welcomeMessage, sessionId);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setStatus('error');
      toast({
        title: 'Connection error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const stopConversation = async () => {
    // Clear transcript states
    clearTranscripts();

    // Close data channel and peer connection
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Reset state
    peerConnectionRef.current = null;
    dataChannelRef.current = null;

    setStatus('idle');

    // Notify backend about session end
    if (session?.user && speakingSessionId) {
      try {
        await fetch('/api/speaking/conversation/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speakingSessionId,
          }),
        });

        // Reset session ID
        setSpeakingSessionId(null);
      } catch (error) {
        console.error('Error ending conversation:', error);
      }
    }
  };

  const toggleMute = () => {
    if (peerConnectionRef.current) {
      const newMutedState = !muted;
      const senders = peerConnectionRef.current.getSenders();

      senders.forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = !newMutedState;
        }
      });

      setMuted(newMutedState);
    }
  };

  const updateSession = () => {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === 'open'
    ) {
      const event = {
        type: 'session.update',
        session: {
          instructions: `You are an AI language coach specializing in conversation practice. 
          Your goal is to help the user improve their English speaking skills through natural conversation.
          
          Follow these guidelines:
          1. Speak in a natural, conversational way
          2. Adjust to the user's language level
          3. Ask follow-up questions to keep the conversation flowing
          4. Provide gentle corrections when the user makes grammar or pronunciation errors
          5. Encourage the user to elaborate on their thoughts
          6. End your responses with questions to promote continued dialogue
          
          Keep your responses brief and avoid long monologues to allow the user more speaking time.`,

          // Add audio transcription configuration for user speech
          input_audio_transcription: {
            model: 'whisper-1',
          },
        },
      };

      dataChannelRef.current.send(JSON.stringify(event));
    }
  };

  const saveTranscript = async (
    role: 'user' | 'assistant',
    text: string,
    sessionId: string
  ) => {
    try {
      await fetch('/api/speaking/conversation/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          speakingSessionId: sessionId,
          role,
          text,
        }),
      });
    } catch (error) {
      console.error('Error saving transcript:', error);
    }
  };

  const handleServerEvent = (event: OpenAIEvent) => {
    if (event.type !== 'response.audio_transcript.delta') {
      console.log('Server event:', event.type);
    }

    if (event.response_id && event.response_id !== currentAiResponseId) {
      setCurrentAiResponseId(event.response_id);
    }

    if (event.item_id && event.item_id !== currentItemId) {
      setCurrentItemId(event.item_id);
    }

    if (event.item && event.item.role === 'user') {
      const extractedText = extractUserText(event.item as Record<string, any>);

      if (
        extractedText &&
        extractedText.trim() !== '' &&
        extractedText !== '[object Object]' &&
        !extractedText.includes('"type":"input_audio","transcript":null')
      ) {
        currentUserTranscriptRef.current = extractedText;
        setUserTranscript(extractedText);

        setConversation(prev => {
          const exists = prev.some(
            msg => msg.role === 'user' && msg.text === extractedText
          );
          if (exists) return prev;
          return [...prev, { role: 'user', text: extractedText }];
        });

        if (speakingSessionId) {
          saveTranscript('user', extractedText, speakingSessionId);
        }
      }
    }

    if (
      event.transcript &&
      typeof event.transcript === 'string' &&
      event.transcript.trim()
    ) {
      currentUserTranscriptRef.current = event.transcript;
      setUserTranscript(event.transcript);

      if (speakingSessionId) {
        saveTranscript('user', event.transcript, speakingSessionId);

        if (
          event.type.includes('input_audio') ||
          (event.item_id && !event.response_id)
        ) {
          setConversation(prev => {
            const exists = prev.some(
              msg => msg.role === 'user' && msg.text === event.transcript
            );
            if (exists) return prev;
            return [...prev, { role: 'user', text: event.transcript }];
          });
        }
      }
    }

    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        setStatus('speaking');
        setUserTranscript('');
        currentUserTranscriptRef.current = '';
        break;

      case 'input_audio_buffer.speech_stopped':
        setStatus('listening');
        break;

      case 'input_audio_buffer.committed':
        if (event.speech) {
          currentUserTranscriptRef.current = String(event.speech);
          setUserTranscript(currentUserTranscriptRef.current);
        }

        if (event.item_id && event.item) {
          const extractedText = extractUserText(
            event.item as Record<string, any>
          );
          if (extractedText) {
            currentUserTranscriptRef.current = extractedText;
            setUserTranscript(extractedText);
          }
        }

        if (
          currentUserTranscriptRef.current &&
          currentUserTranscriptRef.current.trim() &&
          currentUserTranscriptRef.current !== '[object Object]' &&
          !currentUserTranscriptRef.current.includes(
            '"type":"input_audio","transcript":null'
          ) &&
          speakingSessionId
        ) {
          const finalUserTranscript = currentUserTranscriptRef.current;

          saveTranscript('user', finalUserTranscript, speakingSessionId);

          setConversation(prev => {
            const lastUserMessage = prev
              .filter(msg => msg.role === 'user')
              .pop();
            if (
              lastUserMessage &&
              lastUserMessage.text === finalUserTranscript
            ) {
              return prev;
            }
            return [...prev, { role: 'user', text: finalUserTranscript }];
          });
        } else {
          if (event.item_id && speakingSessionId) {
            const placeholderText = "I'm sorry, could you repeat that?";

            if (
              !currentUserTranscriptRef.current ||
              currentUserTranscriptRef.current.trim() === '' ||
              currentUserTranscriptRef.current === '[object Object]' ||
              currentUserTranscriptRef.current.includes(
                '"type":"input_audio","transcript":null'
              )
            ) {
              setConversation(prev => [
                ...prev,
                { role: 'user', text: placeholderText },
              ]);

              if (speakingSessionId) {
                saveTranscript('user', placeholderText, speakingSessionId);
              }
            }
          }
        }
        break;

      case 'conversation.item.created':
        if (event.item && event.item.role === 'user') {
          let userContent = '';

          userContent = extractUserText(event.item as Record<string, any>);

          if (
            userContent &&
            typeof userContent === 'string' &&
            userContent.trim() !== '' &&
            userContent !== '[object Object]' &&
            !userContent.includes('"type":"input_audio","transcript":null')
          ) {
            currentUserTranscriptRef.current = userContent;
            setUserTranscript(userContent);

            setConversation(prev => {
              const exists = prev.some(
                msg => msg.role === 'user' && msg.text === userContent
              );
              if (exists) return prev;
              return [...prev, { role: 'user', text: userContent }];
            });

            if (speakingSessionId) {
              saveTranscript('user', userContent, speakingSessionId);
            }
          } else {
            if (event.item.input && Array.isArray(event.item.input)) {
              const audioItems = event.item.input.filter(
                (item: Record<string, any>) =>
                  item.type === 'input_audio' && item.speech_text
              );

              if (audioItems.length > 0) {
                const speechText = audioItems[0].speech_text;

                currentUserTranscriptRef.current = speechText;
                setUserTranscript(speechText);

                setConversation(prev => {
                  const exists = prev.some(
                    msg => msg.role === 'user' && msg.text === speechText
                  );
                  if (exists) return prev;
                  return [...prev, { role: 'user', text: speechText }];
                });

                if (speakingSessionId) {
                  saveTranscript('user', speechText, speakingSessionId);
                }
              }
            }

            if (event.item.raw_content || event.raw_content) {
              const rawContent = event.item.raw_content || event.raw_content;
              try {
                const parsedContent =
                  typeof rawContent === 'string'
                    ? JSON.parse(rawContent)
                    : rawContent;
                if (parsedContent && typeof parsedContent === 'object') {
                  let extractedText = '';
                  if (parsedContent.text) extractedText = parsedContent.text;
                  else if (parsedContent.content)
                    extractedText = parsedContent.content;
                  else if (parsedContent.message)
                    extractedText = parsedContent.message;
                  else if (parsedContent.transcript)
                    extractedText = parsedContent.transcript;

                  if (extractedText && extractedText.trim() !== '') {
                    currentUserTranscriptRef.current = extractedText;
                    setUserTranscript(extractedText);

                    setConversation(prev => {
                      const exists = prev.some(
                        msg => msg.role === 'user' && msg.text === extractedText
                      );
                      if (exists) return prev;
                      return [...prev, { role: 'user', text: extractedText }];
                    });

                    if (speakingSessionId) {
                      saveTranscript('user', extractedText, speakingSessionId);
                    }
                  }
                }
              } catch (e) {
                console.error('Failed to parse raw content:', e);
              }
            }
          }
        }
        break;

      case 'conversation.item.input_audio_transcription.delta':
        if (event.delta) {
          const isNewTranscript =
            !currentUserTranscriptRef.current ||
            currentUserTranscriptRef.current.length === 0;

          if (isNewTranscript) {
            currentUserTranscriptRef.current = event.delta;
          } else {
            currentUserTranscriptRef.current += event.delta;
          }

          setUserTranscript(currentUserTranscriptRef.current);
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript && typeof event.transcript === 'string') {
          currentUserTranscriptRef.current = event.transcript;
          setUserTranscript(event.transcript);

          setConversation(prev => {
            const exists = prev.some(
              msg => msg.role === 'user' && msg.text === event.transcript
            );
            if (exists) return prev;
            return [...prev, { role: 'user', text: event.transcript }];
          });

          if (speakingSessionId) {
            saveTranscript('user', event.transcript, speakingSessionId);
          }
        }
        break;

      case 'response.created':
        setAiTranscript('');
        setCompleteAiMessage('');
        currentAiTranscriptRef.current = '';
        setStatus('listening');
        break;

      case 'response.audio_transcript.delta':
        if (event.delta) {
          currentAiTranscriptRef.current += event.delta;

          setAiTranscript(currentAiTranscriptRef.current);
          setCompleteAiMessage(currentAiTranscriptRef.current);

          setLastReceivedTranscript(currentAiTranscriptRef.current);
        }
        break;

      case 'response.audio_transcript.done':
        {
          const finalTranscript = currentAiTranscriptRef.current;

          if (finalTranscript && finalTranscript.trim()) {
            setConversation(prev => {
              const isDuplicate = prev.some(
                msg => msg.role === 'assistant' && msg.text === finalTranscript
              );

              if (isDuplicate) {
                return prev;
              }

              return [...prev, { role: 'assistant', text: finalTranscript }];
            });

            if (speakingSessionId) {
              saveTranscript('assistant', finalTranscript, speakingSessionId);
            }
          } else {
            console.error('No transcript to save!');
          }
        }
        break;

      case 'response.audio.done':
        break;

      case 'response.content_part.done':
        break;

      case 'response.done':
        {
          const messageToSave = currentAiTranscriptRef.current;

          if (messageToSave && messageToSave.trim()) {
            const isDuplicate = conversation.some(
              msg => msg.role === 'assistant' && msg.text === messageToSave
            );

            if (!isDuplicate) {
              setConversation(prev => {
                const isDuplicateNow = prev.some(
                  msg => msg.role === 'assistant' && msg.text === messageToSave
                );
                if (isDuplicateNow) return prev;

                return [...prev, { role: 'assistant', text: messageToSave }];
              });

              if (speakingSessionId) {
                saveTranscript('assistant', messageToSave, speakingSessionId);
              }
            }
          }
        }

        setStatus('connected');
        break;

      case 'output_audio_buffer.started':
        setStatus('listening');
        break;

      case 'output_audio_buffer.stopped':
        setStatus('connected');
        break;

      case 'session.updated':
        break;

      case 'input_audio_buffer.transcription':
        {
          const transcriptionText = event.delta || event.transcript || '';
          if (transcriptionText) {
            if (currentUserTranscriptRef.current.length === 0) {
              currentUserTranscriptRef.current = transcriptionText;
            } else {
              currentUserTranscriptRef.current += transcriptionText;
            }

            setUserTranscript(currentUserTranscriptRef.current);
          }
        }
        break;

      default:
        console.log('Unhandled event type:', event.type);
        break;
    }
  };

  const clearTranscripts = () => {
    setUserTranscript('');
    setAiTranscript('');
    setCompleteAiMessage('');
    currentUserTranscriptRef.current = '';
    currentAiTranscriptRef.current = '';
    setCurrentAiResponseId(null);
    setCurrentItemId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">AI Voice:</p>
          <Select
            value={selectedVoice}
            onValueChange={setSelectedVoice}
            disabled={status !== 'idle'}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Alloy</SelectItem>
              <SelectItem value="shimmer">Shimmer</SelectItem>
              <SelectItem value="nova">Nova</SelectItem>
              <SelectItem value="echo">Echo</SelectItem>
              <SelectItem value="fable">Fable</SelectItem>
              <SelectItem value="onyx">Onyx</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {status === 'idle' ? (
            <Button onClick={startConversation} disabled={!session?.user}>
              <Play className="mr-2 h-4 w-4" />
              Start Conversation
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopConversation}>
              <Square className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          )}

          {status !== 'idle' && (
            <Button variant="outline" onClick={toggleMute}>
              {muted ? (
                <MicOff className="mr-2 h-4 w-4" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {muted ? 'Unmute' : 'Mute'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-medium">Status:</p>
        <Badge variant={status === 'error' ? 'destructive' : 'default'}>
          {status === 'idle' && 'Not connected'}
          {status === 'connecting' && 'Connecting...'}
          {status === 'connected' && 'Connected'}
          {status === 'speaking' && 'You are speaking...'}
          {status === 'listening' && 'AI is speaking...'}
          {status === 'error' && 'Connection error'}
        </Badge>
      </div>

      <div className="space-y-3">
        {status === 'speaking' && currentUserTranscriptRef.current && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You&apos;re speaking:
            </p>
            <p className="font-medium">{userTranscript || '...'}</p>
          </div>
        )}

        {status === 'listening' && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">AI is speaking:</p>
            <p className="font-medium">{aiTranscript || '...'}</p>
          </div>
        )}
      </div>

      <div
        ref={conversationContainerRef}
        className="border rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto"
      >
        {conversation.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            {status === 'idle'
              ? 'Start a conversation to begin speaking practice'
              : 'Say something to start the conversation...'}
          </p>
        ) : (
          conversation.map((message, i) => (
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
          ))
        )}
      </div>

      <div ref={conversationEndRef} />

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioElementRef}
        autoPlay
        playsInline
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
