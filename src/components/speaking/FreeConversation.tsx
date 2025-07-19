"use client";

import { Mic, MicOff, Play, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define a proper type for the OpenAI event object
type OpenAIEvent = Record<string, any>;

// Helper function to extract user text from various possible event shapes
const extractUserText = (item: Record<string, any>): string => {
  const extractedText = "";

  // Case 1: Direct content as string
  if (typeof item.content === "string" && item.content.trim()) {
    return item.content;
  }

  // Case 2: Input content as string
  if (
    item.input &&
    typeof item.input.content === "string" &&
    item.input.content.trim()
  ) {
    return item.input.content;
  }

  // Case 3: Content as object with text property
  if (item.content && typeof item.content === "object") {
    if (item.content.text) return String(item.content.text);
    if (item.content.value) return String(item.content.value);
  }

  // Case 4: Input content as object with text property
  if (
    item.input &&
    item.input.content &&
    typeof item.input.content === "object"
  ) {
    if (item.input.content.text) return String(item.input.content.text);
    if (item.input.content.value) return String(item.input.content.value);
  }

  // Case 5: Direct transcript property
  if (
    item.transcript &&
    typeof item.transcript === "string" &&
    item.transcript.trim()
  ) {
    return item.transcript;
  }

  // Case 6: Direct text property
  if (item.text && typeof item.text === "string" && item.text.trim()) {
    return item.text;
  }

  // Case 7: Speech property
  if (item.speech && typeof item.speech === "string" && item.speech.trim()) {
    return item.speech;
  }

  // Case 8: Speech text from input_audio object in an array
  if (item.input && Array.isArray(item.input)) {
    const audioItems = item.input.filter(
      (input: Record<string, any>) =>
        input.type === "input_audio" && input.speech_text
    );

    if (audioItems.length > 0 && audioItems[0].speech_text) {
      return audioItems[0].speech_text;
    }
  }

  // Case 9: Array of inputs with input_audio type
  if (
    Array.isArray(item) ||
    (typeof item.input?.content === "object" &&
      Array.isArray(item.input.content))
  ) {
    const arrayToCheck = Array.isArray(item) ? item : item.input.content;
    const audioItems = arrayToCheck.filter(
      (input: Record<string, any>) =>
        input && input.type === "input_audio" && input.transcript
    );

    if (audioItems.length > 0 && audioItems[0].transcript) {
      return audioItems[0].transcript;
    }

    // If transcript is null but we have speech_recognizer data
    const recognizerItems = arrayToCheck.filter(
      (input: Record<string, any>) =>
        input &&
        input.type === "input_audio" &&
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
    typeof item.input?.content === "string" &&
    (item.input.content.startsWith("[{") || item.input.content.startsWith('{"'))
  ) {
    try {
      const parsed = JSON.parse(item.input.content);
      if (Array.isArray(parsed)) {
        const audioItems = parsed.filter(
          (input: Record<string, any>) =>
            input && input.type === "input_audio" && input.transcript
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
      console.error("Failed to parse JSON content:", e);
    }
  }

  return extractedText;
};

export function FreeConversation() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "speaking" | "listening" | "error"
  >("idle");
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [aiTranscript, setAiTranscript] = useState<string>("");
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("alloy");
  const [muted, setMuted] = useState<boolean>(false);
  const [speakingSessionId, setSpeakingSessionId] = useState<string | null>(
    null
  );
  const [responseCount, setResponseCount] = useState<number>(0);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);

  // Add refs to track current transcript values
  const currentAiTranscriptRef = useRef<string>("");
  const currentUserTranscriptRef = useRef<string>("");

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
      // setLastReceivedTranscript(currentAiTranscriptRef.current); // This line was removed
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

  // Check if user is admin
  const isUserAdmin = session?.user?.role === "admin";

  // If user is not an admin, show a coming soon message
  if (!isUserAdmin) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Real-time Conversation Coming Soon!
          </h2>
          <p className="text-gray-700 mb-6">
            We're excited to announce that our real-time conversation feature is
            currently under development and will be available to all users
            shortly. This advanced feature will allow you to have natural,
            flowing conversations with our AI speaking partner in real-time.
          </p>
          <div className="bg-white rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What to expect:
            </h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Natural, flowing conversations without turn-taking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Instant responses as you speak</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>More realistic speaking practice experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Enhanced pronunciation and fluency feedback</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              In the meantime, you can continue using our turn-based
              conversation feature for your speaking practice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const startConversation = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please login to use the speaking practice feature",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple starts
    if (status !== "idle") {
      return;
    }

    try {
      // Reset conversation state
      setConversation([]);
      clearTranscripts();
      setStatus("connecting");
      // Reset response count
      setResponseCount(0);

      // Request ephemeral key from our backend
      const tokenResponse = await fetch("/api/speaking/conversation/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice: selectedVoice,
          mode: "realtime",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }

      const { ephemeralKey, speakingSessionId } = await tokenResponse.json();
      setSpeakingSessionId(speakingSessionId);

      // Create WebRTC peer connection with proper configuration
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = peerConnection;

      // Step 4: Set up audio element for playback
      peerConnection.ontrack = e => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = e.streams[0];
        }
      };

      // Add connection state change logging
      peerConnection.oniceconnectionstatechange = () => {
        // Production: ICE connection state changed
      };

      peerConnection.onconnectionstatechange = () => {
        // Production: Connection state changed
      };

      // Step 5: Add local audio track for microphone input
      try {
        const clientMedia = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const audioTrack = clientMedia.getAudioTracks()[0];
        peerConnection.addTrack(audioTrack, new MediaStream([audioTrack]));

        // Handle muting/unmuting
        audioTrack.enabled = !muted;
      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast({
          title: "Microphone access denied",
          description:
            "Please allow microphone access to use speaking practice",
          variant: "destructive",
        });
        setStatus("error");
        return;
      }

      // Step 6: Set up data channel for sending and receiving events
      const dataChannel = peerConnection.createDataChannel("oai-events", {
        ordered: true,
      });
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        // Production: Data channel is open
        setStatus("connected");
      };

      dataChannel.onclose = () => {
        // Production: Data channel is closed
        setStatus("idle");
      };

      dataChannel.onmessage = async e => {
        try {
          const eventData = JSON.parse(e.data);
          await handleServerEvent(eventData);
        } catch (parseError) {
          console.error("Error parsing server event:", parseError, e.data);
          toast({
            title: "Data parsing error",
            description: "Failed to process message from server",
            variant: "destructive",
          });
        }
      };

      dataChannel.onerror = err => {
        console.error("Data channel error:", err);
        // Set status to error
        setStatus("error");

        toast({
          title: "Connection error",
          description:
            "There was an error with the connection. Please try resetting.",
          variant: "destructive",
        });

        // If the data channel is in a failed state, close it to allow reset
        if (
          dataChannel.readyState === "closing" ||
          dataChannel.readyState === "closed"
        ) {
          console.log("Data channel already closing or closed");
        } else {
          // Attempt to cleanly close the connection
          try {
            stopConversation();
          } catch (closeError) {
            console.error(
              "Error stopping conversation after data channel error:",
              closeError
            );
          }
        }
      };

      // Step 7: Create and set local description (offer)
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Step 8: Send offer to OpenAI Realtime API
      const model = "gpt-4o-mini-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: "POST",
          body: peerConnection.localDescription?.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error("SDP response error:", errorText);
        throw new Error(
          `Failed to connect to OpenAI Realtime API: ${sdpResponse.status} ${errorText}`
        );
      }

      // Step 9: Set remote description (answer)
      const responseData = await sdpResponse.json();
      console.log("Received SDP answer from OpenAI");

      // Production: Received SDP answer from OpenAI
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp: responseData.sdp,
        })
      );

      // Production: WebRTC connection established
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      setStatus("error");
      toast({
        title: "Connection error",
        description:
          error.message || "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopConversation = async () => {
    // Clear transcript states
    clearTranscripts();

    // Close data channel and peer connection
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    } else {
      // Production: Data channel already closing or closed
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Reset state
    peerConnectionRef.current = null;
    dataChannelRef.current = null;

    setStatus("idle");

    // Notify backend about session end
    if (session?.user && speakingSessionId) {
      try {
        const response = await fetch("/api/speaking/conversation/end", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            speakingSessionId,
          }),
        });

        if (response.ok) {
          // Reset session ID
          setSpeakingSessionId(null);

          // Redirect to the dashboard speaking page
          router.replace("/dashboard/speaking");
        } else {
          console.error("Error ending conversation:", await response.text());
          toast({
            title: "Error",
            description: "There was a problem ending your session.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error ending conversation:", error);
        toast({
          title: "Error",
          description: "There was a problem ending your session.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleMute = () => {
    if (peerConnectionRef.current) {
      const newMutedState = !muted;
      const senders = peerConnectionRef.current.getSenders();

      senders.forEach(sender => {
        if (sender.track && sender.track.kind === "audio") {
          sender.track.enabled = !newMutedState;
        }
      });

      setMuted(newMutedState);
    }
  };

  const updateSession = async () => {
    if (
      !dataChannelRef.current ||
      dataChannelRef.current.readyState !== "open"
    ) {
      // Production: Data channel not ready for session update
      return;
    }

    // Production: Preparing to update session after delay

    try {
      const updateEvent = {
        type: "session.update",
        session: {
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
          },
          input_audio_transcription: {
            model: "whisper-1",
          },
        },
      };

      // Production: Sending session update
      dataChannelRef.current.send(JSON.stringify(updateEvent));

      // Production: Session update sent successfully
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  // Update session to make AI responses more concise as conversation progresses
  const updateSessionVerbosity = () => {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      const event = {
        type: "session.update",
        session: {
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
          },
        },
      };

      try {
        // Production: Sending session verbosity update
        dataChannelRef.current.send(JSON.stringify(event));
        // Production: Session verbosity updated successfully
      } catch (error) {
        console.error("Error sending session verbosity update:", error);
      }
    }
  };

  const saveTranscript = async (
    role: "user" | "assistant",
    text: string,
    sessionId: string
  ) => {
    try {
      await fetch("/api/speaking/conversation/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speakingSessionId: sessionId,
          role,
          text,
        }),
      });
    } catch (error) {
      console.error("Error saving transcript:", error);
    }
  };

  const handleServerEvent = async (event: OpenAIEvent) => {
    // Production: Server event received

    // Variables used across multiple case statements
    let transcriptionText = "";

    // Handle different event types
    switch (event.type) {
      case "session.created": {
        // Production: Session created successfully
        setStatus("connected");

        // Production: Starting conversation session creation
        const conversationStartResponse = await fetch(
          "/api/speaking/conversation/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              voice: selectedVoice,
              mode: "real-time",
            }),
          }
        );

        if (conversationStartResponse.ok) {
          const sessionData = await conversationStartResponse.json();
          setSpeakingSessionId(sessionData.speakingSessionId);
          // Production: Session started successfully
        }

        // Update session with proper configuration
        updateSession();

        // Add welcome message after session is ready
        const welcomeMessage =
          "Hello! I'm here to help you practice English conversation. What would you like to talk about today?";

        setConversation(prev => [
          ...prev,
          { role: "assistant", text: welcomeMessage },
        ]);

        // Production: Welcome message added to conversation

        if (speakingSessionId) {
          // Production: Data channel no longer open, skipping session update
          saveTranscript("assistant", welcomeMessage, speakingSessionId);
        }

        break;
      }

      case "error": {
        // Handle OpenAI API errors
        console.error("Error from OpenAI API:", event);

        let errorMessage = "An error occurred with the OpenAI Realtime API";
        let errorCode = "";
        let isParameterError = false;

        // Extract error details if available
        if (event.message) {
          errorMessage = event.message;
        } else if (event.error && typeof event.error === "object") {
          // Handle different error object structures
          if (event.error.message) {
            errorMessage = event.error.message;

            // Check for parameter-related errors
            if (
              event.error.message.includes("parameter") ||
              event.error.code === "unknown_parameter"
            ) {
              isParameterError = true;
            }
          }

          if (event.error.code) {
            errorCode = event.error.code;
            errorMessage = `Error code: ${event.error.code}`;

            if (event.error.code === "unknown_parameter") {
              isParameterError = true;

              // Get the specific parameter name from the error
              if (event.error.param) {
                errorMessage = `Invalid parameter: ${event.error.param}`;
              }
            }
          } else if (event.error.type) {
            errorMessage = `Error type: ${event.error.type}`;
          }

          // Additional logging for debugging
          console.log(
            "Error object details:",
            JSON.stringify(event.error, null, 2)
          );

          // Log specific parameter error guidance if detected
          if (isParameterError) {
            console.warn(
              "⚠️ PARAMETER ERROR DETECTED: The session update contains parameters not supported by the OpenAI API"
            );

            if (event.error.param) {
              const invalidParam = event.error.param.replace("session.", "");
              console.warn(
                `❌ Invalid parameter: "${invalidParam}" is not supported`
              );
              console.warn(
                `ℹ️ Valid parameters according to API: ${Object.keys(event.session || {}).join(", ")}`
              );
            }
          }
        }

        // Show toast with appropriate error message
        toast({
          title: isParameterError
            ? "Invalid Session Parameter"
            : "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });

        // If there's a critical error, stop the conversation
        if (
          event.code === "invalid_request_error" ||
          event.code === "authentication_error" ||
          isParameterError ||
          (event.error &&
            (event.error.type === "fatal" ||
              event.error.code === "invalid_session_update" ||
              event.error.message?.includes("session")))
        ) {
          console.log("Critical error detected, stopping conversation");
          stopConversation();
        }

        // Set status to error
        setStatus("error");
        break;
      }

      case "input_audio_buffer.speech_started":
        setStatus("speaking");
        setUserTranscript("");
        currentUserTranscriptRef.current = "";
        break;

      case "input_audio_buffer.speech_stopped":
        setStatus("listening");
        break;

      case "input_audio_buffer.committed":
        console.log("Received committed speech input:", event);

        if (event.speech) {
          console.log("Found speech content:", event.speech);
          currentUserTranscriptRef.current = String(event.speech);
          setUserTranscript(currentUserTranscriptRef.current);
        }

        if (event.item_id && event.item) {
          console.log(
            "Processing input with item_id:",
            event.item_id,
            "Item:",
            event.item
          );
          const extractedText = extractUserText(
            event.item as Record<string, any>
          );
          if (extractedText) {
            console.log("Extracted text from item:", extractedText);
            currentUserTranscriptRef.current = extractedText;
            setUserTranscript(extractedText);
          }
        }

        // Check for transcript field directly in the event
        if (
          event.transcript &&
          typeof event.transcript === "string" &&
          event.transcript.trim()
        ) {
          console.log("Found direct transcript in event:", event.transcript);
          currentUserTranscriptRef.current = event.transcript;
          setUserTranscript(event.transcript);
        }

        if (
          currentUserTranscriptRef.current &&
          currentUserTranscriptRef.current.trim() &&
          currentUserTranscriptRef.current !== "[object Object]" &&
          !currentUserTranscriptRef.current.includes(
            '"type":"input_audio","transcript":null'
          ) &&
          speakingSessionId
        ) {
          const finalUserTranscript = currentUserTranscriptRef.current;
          console.log(
            "Adding user transcript to conversation:",
            finalUserTranscript
          );

          saveTranscript("user", finalUserTranscript, speakingSessionId);

          setConversation(prev => {
            const lastUserMessage = prev
              .filter(msg => msg.role === "user")
              .pop();
            if (
              lastUserMessage &&
              lastUserMessage.text === finalUserTranscript
            ) {
              console.log("Skipping duplicate user message");
              return prev;
            }
            console.log("Adding new user message to conversation");
            return [...prev, { role: "user", text: finalUserTranscript }];
          });
        } else {
          console.log(
            "No valid transcript found in event. Current ref:",
            currentUserTranscriptRef.current
          );

          if (event.item_id && speakingSessionId) {
            const placeholderText = "I'm sorry, could you repeat that?";

            if (
              !currentUserTranscriptRef.current ||
              currentUserTranscriptRef.current.trim() === "" ||
              currentUserTranscriptRef.current === "[object Object]" ||
              currentUserTranscriptRef.current.includes(
                '"type":"input_audio","transcript":null'
              )
            ) {
              console.log("Adding placeholder text for empty transcript");
              setConversation(prev => [
                ...prev,
                { role: "user", text: placeholderText },
              ]);

              if (speakingSessionId) {
                saveTranscript("user", placeholderText, speakingSessionId);
              }
            }
          }
        }
        break;

      case "conversation.item.created":
        console.log("Conversation item created:", event);

        if (event.item && event.item.role === "user") {
          console.log("User conversation item detected");
          let userContent = "";

          userContent = extractUserText(event.item as Record<string, any>);
          console.log("Extracted user content:", userContent);

          if (
            userContent &&
            typeof userContent === "string" &&
            userContent.trim() !== "" &&
            userContent !== "[object Object]" &&
            !userContent.includes('"type":"input_audio","transcript":null')
          ) {
            console.log("Setting user transcript to:", userContent);
            currentUserTranscriptRef.current = userContent;
            setUserTranscript(userContent);

            setConversation(prev => {
              const exists = prev.some(
                msg => msg.role === "user" && msg.text === userContent
              );
              if (exists) {
                console.log("User message already exists in conversation");
                return prev;
              }
              console.log("Adding new user message to conversation");
              return [...prev, { role: "user", text: userContent }];
            });

            if (speakingSessionId) {
              saveTranscript("user", userContent, speakingSessionId);
            }
          } else {
            console.log("Extracted content not valid:", userContent);

            if (event.item.input && Array.isArray(event.item.input)) {
              console.log("Checking input array for speech_text");
              const audioItems = event.item.input.filter(
                (item: Record<string, any>) =>
                  item.type === "input_audio" && item.speech_text
              );

              if (audioItems.length > 0) {
                const speechText = audioItems[0].speech_text;
                console.log("Found speech_text in input array:", speechText);

                currentUserTranscriptRef.current = speechText;
                setUserTranscript(speechText);

                setConversation(prev => {
                  const exists = prev.some(
                    msg => msg.role === "user" && msg.text === speechText
                  );
                  if (exists) return prev;
                  return [...prev, { role: "user", text: speechText }];
                });

                if (speakingSessionId) {
                  saveTranscript("user", speechText, speakingSessionId);
                }
              } else {
                console.log("No audio items with speech_text found");
              }
            }

            // Try to find content in raw_content
            if (event.item.raw_content || event.raw_content) {
              const rawContent = event.item.raw_content || event.raw_content;
              console.log("Examining raw content:", rawContent);

              try {
                const parsedContent =
                  typeof rawContent === "string"
                    ? JSON.parse(rawContent)
                    : rawContent;
                console.log("Parsed raw content:", parsedContent);

                if (parsedContent && typeof parsedContent === "object") {
                  let extractedText = "";
                  if (parsedContent.text) extractedText = parsedContent.text;
                  else if (parsedContent.content)
                    extractedText = parsedContent.content;
                  else if (parsedContent.message)
                    extractedText = parsedContent.message;
                  else if (parsedContent.transcript)
                    extractedText = parsedContent.transcript;

                  console.log(
                    "Extracted text from raw content:",
                    extractedText
                  );

                  if (extractedText && extractedText.trim() !== "") {
                    currentUserTranscriptRef.current = extractedText;
                    setUserTranscript(extractedText);

                    setConversation(prev => {
                      const exists = prev.some(
                        msg => msg.role === "user" && msg.text === extractedText
                      );
                      if (exists) return prev;
                      return [...prev, { role: "user", text: extractedText }];
                    });

                    if (speakingSessionId) {
                      saveTranscript("user", extractedText, speakingSessionId);
                    }
                  }
                }
              } catch (e) {
                console.error("Failed to parse raw content:", e);
              }
            }
          }
        } else if (event.item && event.item.role === "assistant") {
          console.log("Assistant item created:", event.item);
        }
        break;

      case "conversation.item.input_audio_transcription.delta":
        console.log("Received transcription delta:", event);

        if (event.delta) {
          console.log("Transcription delta content:", event.delta);
          const isNewTranscript =
            !currentUserTranscriptRef.current ||
            currentUserTranscriptRef.current.length === 0;

          if (isNewTranscript) {
            console.log("Starting new transcript with:", event.delta);
            currentUserTranscriptRef.current = event.delta;
          } else {
            console.log("Appending to transcript:", event.delta);
            currentUserTranscriptRef.current += event.delta;
          }

          // Update the UI with the current transcript
          setUserTranscript(currentUserTranscriptRef.current);
          console.log("Current transcript:", currentUserTranscriptRef.current);

          // If the transcript has meaningful content and we're in a speaking state, update the UI
          if (
            currentUserTranscriptRef.current.trim().length > 0 &&
            status === "speaking"
          ) {
            setStatus("speaking"); // Ensure we're in speaking state
          }
        }
        break;

      case "conversation.item.input_audio_transcription.completed":
        console.log("Transcription completed:", event);

        if (
          event.transcript &&
          typeof event.transcript === "string" &&
          event.transcript.trim()
        ) {
          console.log("Final transcript:", event.transcript);

          // Set the final transcript
          currentUserTranscriptRef.current = event.transcript;
          setUserTranscript(event.transcript);

          // Add to conversation if not already present
          setConversation(prev => {
            // Check if this transcript is already in the conversation
            const exists = prev.some(
              msg => msg.role === "user" && msg.text === event.transcript
            );

            if (exists) {
              console.log("User transcript already exists in conversation");
              return prev;
            }

            console.log("Adding complete user transcript to conversation");
            return [...prev, { role: "user", text: event.transcript }];
          });

          // Save to database
          if (speakingSessionId) {
            saveTranscript("user", event.transcript, speakingSessionId);
          }
        } else {
          console.log("No transcript in completed event or empty transcript");
        }
        break;

      case "response.created":
        setAiTranscript("");
        // setCompleteAiMessage(""); // This line was removed
        currentAiTranscriptRef.current = "";
        setStatus("listening");
        break;

      case "response.audio_transcript.delta":
        if (event.delta) {
          currentAiTranscriptRef.current += event.delta;

          // setCompleteAiMessage(currentAiTranscriptRef.current); // This line was removed
          setAiTranscript(currentAiTranscriptRef.current);
        }
        break;

      case "response.audio_transcript.done":
        {
          const finalTranscript = currentAiTranscriptRef.current;

          if (finalTranscript && finalTranscript.trim()) {
            setConversation(prev => {
              const isDuplicate = prev.some(
                msg => msg.role === "assistant" && msg.text === finalTranscript
              );

              if (isDuplicate) {
                return prev;
              }

              return [...prev, { role: "assistant", text: finalTranscript }];
            });

            if (speakingSessionId) {
              saveTranscript("assistant", finalTranscript, speakingSessionId);
            }
          } else {
            console.error("No transcript to save!");
          }
        }
        break;

      case "response.audio.done":
        break;

      case "response.content_part.done":
        break;

      case "response.done":
        {
          const messageToSave = currentAiTranscriptRef.current;

          if (messageToSave && messageToSave.trim()) {
            const isDuplicate = conversation.some(
              msg => msg.role === "assistant" && msg.text === messageToSave
            );

            if (!isDuplicate) {
              setConversation(prev => {
                const isDuplicateNow = prev.some(
                  msg => msg.role === "assistant" && msg.text === messageToSave
                );
                if (isDuplicateNow) return prev;

                return [...prev, { role: "assistant", text: messageToSave }];
              });

              if (speakingSessionId) {
                saveTranscript("assistant", messageToSave, speakingSessionId);
              }

              // Increment response count and update session verbosity if needed
              const newCount = responseCount + 1;
              setResponseCount(newCount);

              // Update verbosity at specific thresholds
              if (newCount === 5 || newCount === 10) {
                updateSessionVerbosity();
              }
            }
          }
        }

        setStatus("connected");
        break;

      case "output_audio_buffer.started":
        setStatus("listening");
        break;

      case "output_audio_buffer.stopped":
        setStatus("connected");
        break;

      case "session.updated": {
        console.log("Session update succeeded:", event);

        // Log confirmation
        if (event.session) {
          console.log(
            "Session updated with structure:",
            JSON.stringify(event.session, null, 2).substring(0, 500) + "..."
          );
          console.log("Updated session keys:", Object.keys(event.session));
        }

        break;
      }

      case "input_audio_buffer.transcription":
        console.log("Received buffer transcription:", event);

        // Extract transcription content from various possible fields
        transcriptionText = event.delta || event.transcript || "";

        if (transcriptionText && transcriptionText.trim()) {
          console.log("Buffer transcription content:", transcriptionText);

          // Update the current transcript, either starting a new one or appending
          if (currentUserTranscriptRef.current.length === 0) {
            console.log(
              "Setting new transcript from buffer:",
              transcriptionText
            );
            currentUserTranscriptRef.current = transcriptionText;
          } else {
            console.log(
              "Appending to transcript from buffer:",
              transcriptionText
            );
            currentUserTranscriptRef.current += " " + transcriptionText;
          }

          // Update the UI
          setUserTranscript(currentUserTranscriptRef.current);

          // Update the chat interface if we have meaningful content
          if (
            currentUserTranscriptRef.current.trim().length > 3 &&
            speakingSessionId &&
            status === "speaking"
          ) {
            console.log(
              "Adding transcript from buffer to conversation:",
              currentUserTranscriptRef.current
            );

            // Check for transcript in conversation to avoid duplicates
            setConversation(prev => {
              const exists = prev.some(
                msg =>
                  msg.role === "user" &&
                  (msg.text === currentUserTranscriptRef.current ||
                    msg.text.includes(currentUserTranscriptRef.current))
              );

              if (exists) {
                console.log(
                  "Similar transcript already exists, not adding duplicate"
                );
                return prev;
              }

              return [
                ...prev,
                { role: "user", text: currentUserTranscriptRef.current },
              ];
            });
          }
        }
        break;

      case "rate_limits.updated":
        // Just log the rate limits update, no specific handling needed
        console.log("Rate limits updated:", event);
        break;

      case "response.output_item.added":
        console.log("Response output item added:", event);
        // Check if there's content we can extract for the AI response
        if (event.item && event.item.content) {
          console.log("Output item content:", event.item.content);
        }
        break;

      case "response.content_part.added":
        console.log("Response content part added:", event);
        // This event might contain partial AI response content
        if (event.content) {
          console.log("Response content:", event.content);
        }
        break;

      case "response.output_item.done":
        console.log("Response output item completed:", event);
        // Output item has completed, can be used to finalize AI responses
        break;

      case "output_audio_buffer.cleared":
        console.log("Output audio buffer cleared:", event);
        // This event indicates that the output audio buffer has been cleared
        // No specific handling needed, just log for debugging
        break;

      case "conversation.item.truncated":
        console.log("Conversation item truncated:", event);
        // This happens when a conversation item is truncated due to length constraints
        // No specific handling needed for our use case
        break;

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }
  };

  const clearTranscripts = () => {
    setUserTranscript("");
    setAiTranscript("");
    // setCompleteAiMessage(""); // This line was removed
    currentUserTranscriptRef.current = "";
    currentAiTranscriptRef.current = "";
    // setCurrentAiResponseId(null); // This line was removed
    // setCurrentItemId(null); // This line was removed
  };

  // Check if a user input matches any template response
  const checkForTemplateMatch = (userInput: string): string | null => {
    const normalizedInput = userInput.toLowerCase().trim();

    // Common phrases templates to reduce API calls
    const commonResponses = {
      greetings: [
        {
          user: "hello",
          ai: "Hello! How are you doing today? What would you like to talk about?",
        },
        { user: "hi", ai: "Hi there! What's on your mind today?" },
        {
          user: "good morning",
          ai: "Good morning! How's your day starting off?",
        },
        {
          user: "good afternoon",
          ai: "Good afternoon! How has your day been so far?",
        },
        { user: "good evening", ai: "Good evening! How was your day?" },
      ],
      farewells: [
        {
          user: "goodbye",
          ai: "Goodbye! It was nice talking with you. Feel free to come back anytime for more practice!",
        },
        {
          user: "bye",
          ai: "Bye! I hope our conversation was helpful. Come back soon!",
        },
        {
          user: "see you",
          ai: "See you later! Remember, regular practice is the key to language improvement.",
        },
        {
          user: "talk to you later",
          ai: "Looking forward to our next conversation! Keep practicing!",
        },
      ],
      clarifications: [
        {
          user: "what",
          ai: "I'm sorry, let me explain that differently. What part would you like me to clarify?",
        },
        { user: "can you repeat", ai: "Of course! I said: " },
        {
          user: "i don't understand",
          ai: "Let me try to explain that more clearly. ",
        },
      ],
    };

    // Search all categories of template responses
    for (const category of Object.values(commonResponses)) {
      for (const template of category) {
        // Check for exact match or if input contains the template phrase
        if (
          normalizedInput === template.user ||
          normalizedInput.includes(template.user)
        ) {
          return template.ai;
        }
      }
    }

    return null;
  };

  // Reset the connection state to allow retrying
  const resetConnection = () => {
    stopConversation();
    setStatus("idle");
    toast({
      title: "Connection reset",
      description: "You can now try starting the conversation again.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">AI Voice:</p>
          <Select
            value={selectedVoice}
            onValueChange={setSelectedVoice}
            disabled={status !== "idle"}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <SelectItem value="A1">A1 - Beginner</SelectItem>
              <SelectItem value="A2">A2 - Elementary</SelectItem>
              <SelectItem value="B1">B1 - Intermediate</SelectItem>
              <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
              <SelectItem value="C1">C1 - Advanced</SelectItem>
              <SelectItem value="C2">C2 - Proficient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {status === "idle" ? (
            <Button onClick={startConversation} disabled={!session?.user}>
              <Play className="mr-2 h-4 w-4" />
              Start Conversation
            </Button>
          ) : status === "error" ? (
            <Button variant="outline" onClick={resetConnection}>
              <Play className="mr-2 h-4 w-4" />
              Reset & Retry
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopConversation}>
              <Square className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          )}

          {status !== "idle" && status !== "error" && (
            <Button variant="outline" onClick={toggleMute}>
              {muted ? (
                <MicOff className="mr-2 h-4 w-4" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {muted ? "Unmute" : "Mute"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-medium">Status:</p>
        <Badge variant={status === "error" ? "destructive" : "default"}>
          {status === "idle" && "Not connected"}
          {status === "connecting" && "Connecting..."}
          {status === "connected" && "Connected"}
          {status === "speaking" && "You are speaking..."}
          {status === "listening" && "AI is speaking..."}
          {status === "error" && "Connection error"}
        </Badge>

        {/* Display connection debug info */}
        {status === "error" && (
          <span className="text-xs text-destructive">
            Check console for details. Try again with a different voice or
            refresh the page.
          </span>
        )}
      </div>

      <div className="space-y-3">
        {status === "speaking" && currentUserTranscriptRef.current && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You&apos;re speaking:
            </p>
            <p className="font-medium">{userTranscript || "..."}</p>
          </div>
        )}

        {status === "listening" && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">AI is speaking:</p>
            <p className="font-medium">{aiTranscript || "..."}</p>
          </div>
        )}
      </div>

      <div
        ref={conversationContainerRef}
        className="border rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto"
      >
        {conversation.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            {status === "idle"
              ? "Start a conversation to begin speaking practice"
              : "Say something to start the conversation..."}
          </p>
        ) : (
          conversation.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start space-x-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
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
