"use client";

import { Mic, MicOff, Play, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { uploadSpeakingRecording } from "@/lib/client/audio-upload";
import { cn } from "@/lib/utils";

// Constants for role play scenarios
const ROLE_PLAY_SCENARIOS = [
  {
    id: "free",
    name: "Free Conversation",
    description: "Open-ended conversation about any topic",
  },
  // Food & Dining
  {
    id: "restaurant",
    name: "At a Restaurant",
    description: "Order food and interact with a waiter",
  },
  {
    id: "cafe",
    name: "Coffee Shop",
    description: "Order drinks, find seating, and chat with baristas",
  },
  {
    id: "grocery_shopping",
    name: "Grocery Shopping",
    description:
      "Ask for help finding items, check prices, and interact at checkout",
  },
  {
    id: "food_delivery",
    name: "Food Delivery",
    description: "Order food delivery and handle delivery logistics",
  },

  // Travel & Transportation
  {
    id: "airport",
    name: "Airport Check-in",
    description: "Check in for a flight and handle luggage",
  },
  {
    id: "taxi_uber",
    name: "Taxi/Rideshare",
    description: "Give directions, discuss the route, and handle payment",
  },
  {
    id: "public_transport",
    name: "Public Transportation",
    description:
      "Buy tickets, ask for directions, and navigate transit systems",
  },
  {
    id: "car_rental",
    name: "Car Rental",
    description:
      "Reserve a vehicle, understand insurance, and handle pickup/return",
  },
  {
    id: "train_station",
    name: "Train Station",
    description: "Book tickets, find platforms, and handle delays or changes",
  },

  // Accommodation
  {
    id: "hotel",
    name: "Hotel Check-in",
    description: "Book a room and ask about facilities",
  },
  {
    id: "airbnb_host",
    name: "Airbnb Check-in",
    description: "Meet your host, get instructions, and ask about the area",
  },
  {
    id: "apartment_viewing",
    name: "Apartment Viewing",
    description:
      "Tour an apartment, ask about amenities, and discuss lease terms",
  },

  // Shopping & Services
  {
    id: "shopping",
    name: "Clothing Shopping",
    description: "Buy clothes, ask about products, and bargain",
  },
  {
    id: "electronics_store",
    name: "Electronics Store",
    description:
      "Compare products, ask about warranties, and get technical support",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Get prescription medication and ask about health products",
  },
  {
    id: "post_office",
    name: "Post Office",
    description: "Send packages, buy stamps, and handle mail services",
  },
  {
    id: "hair_salon",
    name: "Hair Salon",
    description:
      "Book appointments, describe desired haircuts, and discuss styling",
  },

  // Healthcare & Wellness
  {
    id: "doctor",
    name: "Doctor Visit",
    description: "Describe symptoms and understand treatment",
  },
  {
    id: "dentist",
    name: "Dentist Appointment",
    description:
      "Discuss dental problems, understand procedures, and schedule follow-ups",
  },
  {
    id: "gym_membership",
    name: "Gym Membership",
    description:
      "Sign up for gym, learn about facilities, and get fitness advice",
  },

  // Professional & Business
  {
    id: "interview",
    name: "Job Interview",
    description: "Answer questions about your experience and skills",
  },
  {
    id: "workplace_meeting",
    name: "Workplace Meeting",
    description: "Participate in team meetings, present ideas, and collaborate",
  },
  {
    id: "networking_event",
    name: "Networking Event",
    description:
      "Introduce yourself professionally and make business connections",
  },
  {
    id: "customer_service",
    name: "Customer Service Call",
    description: "Resolve issues, make complaints, and get assistance",
  },
  {
    id: "business_presentation",
    name: "Business Presentation",
    description: "Present ideas, handle questions, and discuss proposals",
  },

  // Banking & Finance
  {
    id: "bank_visit",
    name: "Bank Visit",
    description: "Open accounts, discuss loans, and handle banking services",
  },
  {
    id: "insurance_consultation",
    name: "Insurance Consultation",
    description: "Compare policies, understand coverage, and file claims",
  },

  // Education & Learning
  {
    id: "university_enrollment",
    name: "University Enrollment",
    description:
      "Apply for courses, understand requirements, and get academic advice",
  },
  {
    id: "library_visit",
    name: "Library Visit",
    description: "Find books, use resources, and get research assistance",
  },
  {
    id: "language_exchange",
    name: "Language Exchange",
    description:
      "Practice languages with native speakers and cultural exchange",
  },

  // Social & Entertainment
  {
    id: "party_invitation",
    name: "Party/Event Planning",
    description:
      "Plan social events, invite friends, and coordinate activities",
  },
  {
    id: "movie_theater",
    name: "Movie Theater",
    description: "Buy tickets, choose seats, and discuss movies",
  },
  {
    id: "sports_event",
    name: "Sports Event",
    description: "Buy tickets, discuss the game, and interact with other fans",
  },
  {
    id: "concert_venue",
    name: "Concert/Music Venue",
    description: "Buy tickets, find seats, and talk about music",
  },

  // Technology & Digital
  {
    id: "tech_support",
    name: "Tech Support Call",
    description:
      "Troubleshoot problems, understand solutions, and get technical help",
  },
  {
    id: "phone_plan",
    name: "Phone Plan Setup",
    description:
      "Choose mobile plans, understand features, and resolve service issues",
  },
  {
    id: "internet_setup",
    name: "Internet Service Setup",
    description:
      "Install internet, troubleshoot connections, and understand packages",
  },

  // Emergency & Urgent Situations
  {
    id: "emergency_call",
    name: "Emergency Situations",
    description:
      "Handle emergencies, call for help, and communicate urgent needs",
  },
  {
    id: "police_report",
    name: "Police Report",
    description:
      "Report incidents, provide information, and understand procedures",
  },

  // Home & Lifestyle
  {
    id: "real_estate_agent",
    name: "Real Estate Agent",
    description:
      "Buy or rent property, understand contracts, and negotiate prices",
  },
  {
    id: "home_repair",
    name: "Home Repair Service",
    description: "Describe problems, get quotes, and schedule maintenance",
  },
  {
    id: "utility_services",
    name: "Utility Services",
    description: "Set up electricity, water, gas, and handle billing issues",
  },

  // Cultural & Community
  {
    id: "museum_visit",
    name: "Museum Visit",
    description: "Ask about exhibits, buy tickets, and discuss art and culture",
  },
  {
    id: "religious_service",
    name: "Religious/Community Center",
    description: "Participate in community activities and cultural events",
  },
  {
    id: "volunteer_work",
    name: "Volunteer Organization",
    description:
      "Sign up for volunteer work and participate in community service",
  },

  // Casual & Daily Life
  {
    id: "neighborhood_chat",
    name: "Neighborhood Chat",
    description:
      "Talk with neighbors, discuss local issues, and build community",
  },
  {
    id: "small_talk",
    name: "Small Talk & Social Chat",
    description:
      "Practice casual conversations, weather talk, and social interactions",
  },
  {
    id: "hobby_discussion",
    name: "Hobby & Interest Discussion",
    description: "Share hobbies, discuss interests, and find common ground",
  },
];

// CEFR levels
const CEFR_LEVELS = [
  {
    id: "a1",
    name: "A1 (Beginner)",
    description:
      "Can understand and use familiar everyday expressions and basic phrases",
  },
  {
    id: "a2",
    name: "A2 (Elementary)",
    description:
      "Can communicate in simple and routine tasks on familiar topics",
  },
  {
    id: "b1",
    name: "B1 (Intermediate)",
    description:
      "Can deal with most situations likely to arise while traveling",
  },
  {
    id: "b2",
    name: "B2 (Upper Intermediate)",
    description: "Can interact with a degree of fluency with native speakers",
  },
  {
    id: "c1",
    name: "C1 (Advanced)",
    description:
      "Can express ideas fluently and spontaneously without much searching for expressions",
  },
  {
    id: "c2",
    name: "C2 (Proficiency)",
    description: "Can understand with ease virtually everything heard or read",
  },
];

// Voice options
const VOICE_OPTIONS = [
  { id: "alloy", name: "Alloy" },
  { id: "echo", name: "Echo" },
  { id: "fable", name: "Fable" },
  { id: "onyx", name: "Onyx" },
  { id: "nova", name: "Nova" },
  { id: "shimmer", name: "Shimmer" },
];

export function TurnBasedConversation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    "idle" | "recording" | "processing" | "speaking" | "error"
  >("idle");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("free");
  const [selectedLevel, setSelectedLevel] = useState("b1");
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [userTranscript, setUserTranscript] = useState("");
  const [speakingSessionId, setSpeakingSessionId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [sessionRecordings, setSessionRecordings] = useState<
    Array<{ blob: Blob; url?: string; timestamp: Date }>
  >([]);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(
    null
  );
  const [userRedirected, setUserRedirected] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(60); // Default 60 seconds
  const [evaluationComplete, setEvaluationComplete] = useState(false); // New state to track true completion

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);
  const pollingCleanupRef = useRef<(() => void) | null>(null);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // When component unmounts, clean up any active polling
  useEffect(() => {
    return () => {
      // Clean up polling on unmount
      if (pollingCleanupRef.current) {
        pollingCleanupRef.current();
      }
    };
  }, []);

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

  // Function to poll for evaluation status - return cleanup function directly, not in a Promise
  const startEvaluationPolling = (sessionId: string): (() => void) => {
    let attempts = 0;
    const basePollingInterval = 5000; // Base 5-second polling interval
    let isCompleted = false;
    const startTime = Date.now();

    // Set up a timer to update elapsed time
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    // Initial progress to match backend starting state
    setEvaluationProgress(5);
    setEvaluationComplete(false);

    const checkEvaluation = async () => {
      try {
        attempts++;
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(
          `Checking evaluation status (attempt ${attempts}, elapsed ${currentElapsed}s)...`
        );

        // Calculate adaptive polling interval based on elapsed time and estimated time
        // Poll more frequently at the beginning and end, less in the middle
        let adaptiveInterval = basePollingInterval;
        if (currentElapsed < 20) {
          // Poll more frequently at the start
          adaptiveInterval = 3000;
        } else if (currentElapsed > estimatedTime * 0.8) {
          // Poll more frequently near the expected completion time
          adaptiveInterval = 3000;
        } else if (currentElapsed > estimatedTime * 1.5) {
          // Poll more frequently if we're way over the estimate
          adaptiveInterval = 3000;
        }

        // Check if session has been evaluated
        const response = await fetch(`/api/speaking/sessions/${sessionId}`);

        if (!response.ok) {
          throw new Error("Failed to check session status");
        }

        const data = await response.json();
        console.log("Evaluation progress check:", {
          progress: data.session?.evaluationProgress,
          hasFeedback: !!data.session?.feedback,
          feedbackScores: data.session?.feedback
            ? `Overall: ${data.session.feedback.overallScore}, Fluency: ${data.session.feedback.fluencyScore}`
            : "None",
        });

        // Check if the session has evaluationProgress field and use that value
        if (
          data.session &&
          typeof data.session.evaluationProgress === "number"
        ) {
          const backendProgress = data.session.evaluationProgress;
          const hasFeedback = !!data.session?.feedback;

          // Only update if the backend progress is greater than current progress
          // and not -1 (which indicates an error)
          if (backendProgress > evaluationProgress && backendProgress !== -1) {
            setEvaluationProgress(backendProgress);
          } else if (backendProgress === -1) {
            // Handle evaluation error
            console.error("Evaluation failed on the backend");
            toast({
              title: "Evaluation Error",
              description:
                "There was a problem analyzing your speaking session.",
              variant: "destructive",
            });
            setIsEvaluating(false);
            return; // Stop polling
          }

          // Only consider evaluation truly complete when ALL these are true:
          // 1. Backend reports 100% progress
          // 2. Feedback object exists and has scores
          // 3. We've been polling for at least 10 seconds (to avoid race conditions)
          if (
            backendProgress >= 100 &&
            hasFeedback &&
            data.session.feedback?.overallScore &&
            currentElapsed > 10
          ) {
            console.log("Evaluation completed with full feedback!");
            setEvaluationProgress(100);
            setEvaluationComplete(true);
            isCompleted = true;
            return; // Exit the polling loop
          }
          // If progress is 100% but no feedback yet, we're still processing
          else if (backendProgress >= 100 && !hasFeedback) {
            console.log(
              "Backend reports 100% but feedback not yet available, continuing to poll..."
            );
            // Keep polling, the backend might be finalizing the evaluation
          }
        } else {
          // Fallback for older sessions without evaluationProgress
          // Make very small increments up to max 80% if we don't know actual progress
          if (!isCompleted) {
            const progressIncrement = Math.min(
              3,
              (80 - evaluationProgress) / 15
            );
            setEvaluationProgress(prev =>
              Math.min(prev + progressIncrement, 80)
            );
          }

          // Check if feedback exists to determine completion
          if (
            data.session &&
            data.session.feedback &&
            data.session.feedback.overallScore &&
            currentElapsed > 10
          ) {
            console.log("Evaluation completed (based on feedback)!");
            setEvaluationProgress(100);
            setEvaluationComplete(true);
            isCompleted = true;
            return; // Exit the polling loop
          }
        }

        // Continue polling until evaluation is complete
        // Stop after 15 minutes (180 attempts at 5 seconds each) to prevent infinite polling
        if (attempts < 180 && !isCompleted) {
          setTimeout(checkEvaluation, adaptiveInterval);
        } else if (attempts >= 180 && !isCompleted) {
          clearInterval(timer);
          // If we've polled for 15 minutes with no completion, show error
          console.error("Evaluation timed out after 15 minutes");
          toast({
            title: "Evaluation Timeout",
            description:
              "The evaluation is taking longer than expected. You can continue to the dashboard.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking evaluation status:", error);

        // Wait a moment then try again, but not indefinitely
        if (attempts < 180 && !isCompleted) {
          setTimeout(checkEvaluation, basePollingInterval);
        } else {
          clearInterval(timer);
          console.error("Exceeded maximum evaluation polling attempts");
        }
      }
    };

    // Start the first check
    checkEvaluation();

    // Return cleanup function for the timer
    return () => clearInterval(timer);
  };

  const startSession = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please login to use the speaking practice feature",
        variant: "destructive",
      });
      return;
    }

    // Validate selections
    if (!selectedScenario || !selectedLevel || !selectedVoice) {
      toast({
        title: "Missing selections",
        description:
          "Please select a scenario, language level, and voice before starting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsStartingSession(true);

      // PHASE 1: Better progressive loading - show immediate feedback
      setConversation([
        {
          role: "assistant",
          text: "🔄 Connecting to conversation partner...",
        },
      ]);

      setStatus("processing");

      // Initialize session with backend
      console.log("Starting conversation session");

      // PHASE 1: Faster timeout for session creation
      const controller = new AbortController();
      const startTimeoutId = setTimeout(() => controller.abort(), 12000); // Reduced from 15000 to 12000

      try {
        const response = await fetch("/api/speaking/conversation/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voice: selectedVoice,
            mode: "turn-based",
            scenario: selectedScenario,
            level: selectedLevel,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Session start error:", errorText);
          throw new Error(`Failed to start session: ${errorText}`);
        }

        const data = await response.json();
        console.log("Session started with ID:", data.speakingSessionId);

        // Set state with session ID and mark session as active
        setSpeakingSessionId(data.speakingSessionId);
        setIsSessionActive(true);

        // PHASE 1: Show AI is preparing response
        setConversation([
          {
            role: "assistant",
            text: "✨ AI is preparing your conversation...",
          },
        ]);

        // Generate initial AI greeting based on selected scenario
        const initialPrompt = getInitialPrompt();
        console.log("Initial prompt:", initialPrompt);

        // Generate and play AI greeting - pass the session ID directly
        await generateAIResponse(initialPrompt, true, data.speakingSessionId);
      } catch (error: any) {
        if (error.name === "AbortError") {
          throw new Error("Connection timed out. Please try again.");
        }
        throw error;
      } finally {
        clearTimeout(startTimeoutId);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Session error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start conversation session",
        variant: "destructive",
      });
      setStatus("error");
    } finally {
      setIsStartingSession(false);
    }
  };

  const endSession = async () => {
    // Don't allow ending again if already evaluating
    if (isEvaluating) return;

    // Clean up any ongoing recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Clean up any previous polling
    if (pollingCleanupRef.current) {
      pollingCleanupRef.current();
      pollingCleanupRef.current = null;
    }

    // Notify backend about session end
    if (session?.user && speakingSessionId) {
      try {
        setIsEvaluating(true);
        setEvaluationProgress(5); // Start with a small initial progress
        setElapsedTime(0);

        // First, ensure any pending uploads are completed
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Extract all audio URLs from recordings that were successfully uploaded
        const audioUrls = sessionRecordings
          .filter(rec => rec.url)
          .map(rec => rec.url as string);

        console.log(`Ending session with ${audioUrls.length} audio recordings`);

        // Estimate evaluation time based on number of recordings
        // Each recording takes ~5-10 seconds to process, plus 20s base time
        const recordingsCount = audioUrls.length;
        const estimatedSeconds = Math.max(60, 20 + recordingsCount * 8);
        setEstimatedTime(estimatedSeconds);
        console.log(`Estimated evaluation time: ${estimatedSeconds} seconds`);

        // Send session end request with audio URLs - evaluation will be triggered by the server
        const response = await fetch("/api/speaking/conversation/end", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            speakingSessionId,
            audioUrls: audioUrls,
          }),
        });

        if (!response.ok) {
          console.error("Error ending session:", await response.json());
          toast({
            title: "Error",
            description: "There was a problem ending your session.",
            variant: "destructive",
          });
          setIsEvaluating(false);
          return;
        }

        const responseData = await response.json();
        console.log(
          "Session ended successfully, server will evaluate recordings",
          responseData
        );

        // Store the session ID for polling
        setCompletedSessionId(speakingSessionId);

        // Wait a brief moment to ensure the backend has started the evaluation process
        // This helps avoid a race condition where polling might start before the backend updates
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Start polling for evaluation status - we don't wait for this to complete
        const cleanup = startEvaluationPolling(speakingSessionId);
        // Store cleanup function for later use
        pollingCleanupRef.current = cleanup;

        // Reset local session data but don't redirect yet
        setIsSessionActive(false);
        setSpeakingSessionId(null);
        setSessionRecordings([]);
      } catch (error) {
        console.error("Error ending session:", error);
        toast({
          title: "Error",
          description: "There was a problem ending your session.",
          variant: "destructive",
        });
        setIsEvaluating(false);
      }
    }
  };

  const startRecording = async () => {
    if (!isSessionActive) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // OPTIMIZATION: Configure MediaRecorder for better compression and faster processing
      const options = {
        mimeType: "audio/webm;codecs=opus", // Opus codec for better compression
        audioBitsPerSecond: 64000, // Lower bitrate for faster upload (still good quality for speech)
      };

      // Fallback for browsers that don't support the preferred format
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        console.log("Preferred audio format not supported, using default");
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        setAudioBlob(audioBlob);
        processRecording(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("recording");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone error",
        description: "Could not access microphone",
        variant: "destructive",
      });
      setStatus("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("processing");
    }
  };

  const processRecording = async (audioBlobToProcess: Blob) => {
    if (!audioBlobToProcess || !speakingSessionId) {
      console.error("Missing audio blob or session ID", {
        hasAudioBlob: !!audioBlobToProcess,
        sessionId: speakingSessionId,
      });
      return;
    }

    console.log(
      "Starting processRecording with blob size:",
      audioBlobToProcess.size
    );
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
        console.log("Uploading audio recording to Cloudinary");
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

        console.log("Audio recording uploaded:", uploadResult.url);
      } catch (uploadError) {
        // Don't fail the whole operation if upload fails
        console.error("Error uploading audio recording:", uploadError);
      }

      // Create form data with the audio blob
      console.log("Creating FormData for transcription");
      const formData = new FormData();
      formData.append("audio", audioBlobToProcess, "recording.webm");
      formData.append("speakingSessionId", speakingSessionId);

      console.log(
        "Sending audio for transcription to /api/speaking/conversation/transcript"
      );

      // Send to backend for transcription
      const response = await fetch("/api/speaking/conversation/transcript", {
        method: "POST",
        body: formData,
      });

      console.log("Transcription response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Transcription failed:", response.status, errorText);
        throw new Error(
          `Failed to transcribe audio: ${response.status} ${errorText}`
        );
      }

      const transcriptionResult = await response.json();
      console.log("Transcription result:", transcriptionResult);

      const { text, potentialGrammarErrors } = transcriptionResult;
      setUserTranscript(text);

      console.log("User said:", text);
      console.log("Potential grammar errors:", potentialGrammarErrors);

      // Add user message to conversation
      setConversation(prev => [...prev, { role: "user", text }]);

      console.log("Generating AI response for user input:", text);
      // Generate AI response with potential grammar errors included
      await generateAIResponse(text, false, undefined, potentialGrammarErrors);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Processing error",
        description: "Failed to process your recording",
        variant: "destructive",
      });
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = async (
    userInput: string,
    isInitial = false,
    sessionIdOverride?: string,
    potentialGrammarErrors?: string
  ) => {
    // Use the override session ID if provided, otherwise use the state variable
    const activeSessionId = sessionIdOverride || speakingSessionId;

    if (!activeSessionId) {
      console.error("Cannot generate AI response: No speaking session ID");

      // Show toast with error message
      toast({
        title: "Session error",
        description:
          "Failed to connect to the conversation session. Please try starting a new conversation.",
        variant: "destructive",
      });

      setStatus("error");
      return;
    }

    setStatus("processing");
    console.log(
      `Generating AI response${isInitial ? " (initial greeting)" : ""}`
    );
    console.log("User input:", userInput);
    console.log("Session ID:", activeSessionId);
    console.log("Scenario:", selectedScenario);
    console.log("Level:", selectedLevel);

    try {
      // Send user input to backend for AI response
      console.log("Sending request to /api/speaking/conversation/respond");

      // PHASE 1: Faster timeout for better responsiveness
      const controller = new AbortController();
      const apiTimeoutId = setTimeout(() => controller.abort(), 30000); // Reduced from 40000 to 30000

      try {
        const response = await fetch("/api/speaking/conversation/respond", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            speakingSessionId: activeSessionId,
            userInput,
            scenario: selectedScenario,
            level: selectedLevel,
            voice: selectedVoice,
            isInitial,
            potentialGrammarErrors,
          }),
          signal: controller.signal,
        });

        clearTimeout(apiTimeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API response error:", response.status, errorText);
          throw new Error(
            `Failed to get AI response: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();
        console.log("API response received:", data);

        // PHASE 1: Add AI response immediately - better perceived performance
        setConversation(prev => [
          ...prev.filter(
            msg => !msg.text.includes("🔄") && !msg.text.includes("✨")
          ), // Remove loading messages
          { role: "assistant", text: data.text },
        ]);

        // PHASE 1: Handle audio loading with better feedback
        if (data.audioUrl && audioElementRef.current) {
          console.log("Loading audio response...");
          audioElementRef.current.src = data.audioUrl;

          // PHASE 1: Faster audio loading timeout
          const audioLoadTimeout = setTimeout(() => {
            console.warn("Audio loading timeout, continuing in text mode");
            setStatus("idle");
          }, 6000); // Reduced from 8000 to 6000 for faster fallback

          audioElementRef.current.onloadeddata = () => {
            clearTimeout(audioLoadTimeout);
            if (audioElementRef.current) {
              audioElementRef.current.play().catch(e => {
                console.warn("Audio autoplay failed:", e);
                setStatus("idle");
              });
              setStatus("speaking");
            }
          };

          audioElementRef.current.onended = () => {
            clearTimeout(audioLoadTimeout);
            console.log("Audio playback completed");
            setStatus("idle");
          };

          audioElementRef.current.onerror = e => {
            clearTimeout(audioLoadTimeout);
            console.error("Audio playback error:", e);
            setStatus("idle");
          };
        } else {
          console.log("No audio URL received or audio element not ready");
          console.log("Continuing conversation in text-only mode");
          setStatus("idle");
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          throw new Error("Response timed out. Please try again.");
        }
        throw error;
      } finally {
        clearTimeout(apiTimeoutId);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "Response error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
      setStatus("error");
    }
  };

  const getInitialPrompt = () => {
    // PHASE 2: Simple approach - let the system prompt handle role-playing
    // This prevents role confusion where AI responds to the greeting instead of giving it
    const scenario = ROLE_PLAY_SCENARIOS.find(s => s.id === selectedScenario);

    if (!scenario) {
      return "Hello!";
    }

    if (scenario.id === "free") {
      return "Hello! I'd like to practice my English conversation skills.";
    }

    // For role-play scenarios, use simple context-setting prompts
    // The system prompt will handle the actual role-playing behavior
    return "Hello!";
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
            {isStartingSession ? "Starting..." : "Start Conversation"}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Status:</p>
              <Badge variant={status === "error" ? "destructive" : "default"}>
                {status === "idle" && "Ready for your response"}
                {status === "recording" && "Recording your response..."}
                {status === "processing" && "Processing..."}
                {status === "speaking" && "AI is speaking..."}
                {status === "error" && "Error"}
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

          {status === "error" && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
              <h3 className="text-destructive font-medium mb-2">Error</h3>
              <p className="text-sm text-destructive/90 mb-3">
                There was a problem with the conversation. Please check the
                console for more details.
              </p>
              <Button
                onClick={() => {
                  // Reset the conversation and start fresh
                  setStatus("idle");
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
            {conversation.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                Click "Start Conversation" to begin speaking practice
              </p>
            ) : (
              conversation.map((message: any, i: number) => (
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

            {/* PHASE 1: Show processing indicator when AI is thinking */}
            {status === "processing" && conversation.length > 0 && (
              <div className="flex items-start space-x-2 justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI is thinking...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {conversation.length === 0 &&
              !isProcessing &&
              status !== "error" && (
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
                disabled={status === "processing" || status === "speaking"}
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                disabled={
                  status === "processing" ||
                  status === "speaking" ||
                  isProcessing ||
                  status === "error"
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

      {/* Alert Dialog for evaluation progress */}
      <AlertDialog open={isEvaluating}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {!evaluationComplete
                ? "Evaluating Your Speaking Session"
                : "Evaluation Complete!"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!evaluationComplete
                ? "Your conversation is being analyzed by our AI. This process evaluates your pronunciation, grammar, fluency, and vocabulary usage. This typically takes 20-30 seconds depending on the length of your session."
                : "Your speaking session has been fully analyzed. You can now view your detailed feedback and improvement suggestions on the dashboard."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Analysis Progress</span>
              <span className="text-sm text-muted-foreground">
                {evaluationProgress}%
              </span>
            </div>
            <Progress value={evaluationProgress} className="h-2" />

            <div className="mt-4 text-sm text-muted-foreground">
              {evaluationProgress < 30 ? (
                <>Preparing audio and transcripts for analysis...</>
              ) : evaluationProgress < 60 ? (
                <>Processing your speech patterns and language use...</>
              ) : evaluationProgress < 90 ? (
                <>Generating detailed feedback for your session...</>
              ) : !evaluationComplete ? (
                <>Almost done! Finalizing your evaluation report...</>
              ) : (
                <>
                  Evaluation complete! Your detailed feedback is ready to view.
                </>
              )}
            </div>

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Time elapsed: {elapsedTime}s</span>
              <span>
                {estimatedTime > 0 && !evaluationComplete
                  ? `Estimated time: ~${estimatedTime}s`
                  : ""}
              </span>
            </div>
          </div>

          <AlertDialogFooter>
            {!evaluationComplete ? (
              <AlertDialogCancel
                onClick={() => {
                  // Show confirmation before leaving, since evaluation continues in background
                  if (
                    window.confirm(
                      "The evaluation will continue in the background but might not be fully complete. Are you sure you want to go to the dashboard now?"
                    )
                  ) {
                    setUserRedirected(true);
                    setIsEvaluating(false);
                    router.replace("/dashboard/speaking");
                  }
                }}
              >
                Continue in Background
              </AlertDialogCancel>
            ) : (
              <AlertDialogAction
                onClick={() => {
                  setUserRedirected(true);
                  setIsEvaluating(false);
                  router.replace("/dashboard/speaking");
                }}
              >
                Go to Dashboard
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
