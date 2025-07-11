"use client";

import {
  Mic,
  Play,
  Square,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Languages,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
import { Button } from "@/components/ui/button";
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

// Avatar system imports
import { AvatarSelector } from "./avatar/AvatarSelector";
import { AvatarViewer } from "./avatar/AvatarViewer";
import { AVATAR_CHARACTERS, getAvatarByVoiceId } from "./avatar/constants";
import type { AvatarCharacter, FacialAnimationData } from "./avatar/types";

// Image mapping for scenarios
const SCENARIO_IMAGE_MAP: Record<string, string> = {
  free: "free conversation-min.webp",
  restaurant: "at a restaurant-min.webp",
  cafe: "coffee shop-min.webp",
  grocery_shopping: "grocery shopping-min.webp",
  food_delivery: "food delivery-min.webp",
  airport: "airport check-in-min.webp",
  taxi_uber: "taxi-rideshare-min.webp",
  public_transport: "public transport-min.webp",
  car_rental: "car rental-min.webp",
  train_station: "train station-min.webp",
  hotel: "hotel check-in-min.webp",
  airbnb_host: "airbnb check-in-min.webp",
  apartment_viewing: "apartment viewing-min.webp",
  shopping: "clothes shopping-min.webp",
  electronics_store: "electronics store-min.webp",
  pharmacy: "pharmacy-min.webp",
  post_office: "post office-min.webp",
  hair_salon: "hair saloon-min.webp",
  doctor: "doctor visit-min.webp",
  dentist: "dentist appointment-min.webp",
  gym_membership: "gym membership-min.webp",
  interview: "job interview-min.webp",
  workplace_meeting: "workplace meeting-min.webp",
  networking_event: "networking event-min.webp",
  customer_service: "customer service call-min.webp",
  business_presentation: "business presentation-min.webp",
  bank_visit: "bank visit-min.webp",
  insurance_consultation: "insurance consultation-min.webp",
  university_enrollment: "university enrollment-min.webp",
  library_visit: "library visit-min.webp",
  language_exchange: "language exchange-min.webp",
  party_invitation: "party-event planning-min.webp",
  movie_theater: "movie theatre-min.webp",
  sports_event: "sports event-min.webp",
  concert_venue: "concert-music venue-min.webp",
  tech_support: "tech support call-min.webp",
  phone_plan: "phone plan setup-min.webp",
  internet_setup: "internet plan setup-min.webp",
  emergency_call: "emergency call-min.webp",
  real_estate_agent: "real estate agent-min.webp",
  home_repair: "home repair service-min.webp",
  utility_services: "utility services-min.webp",
  museum_visit: "museum visit-min.webp",
  religious_service: "religious-community centre-min.webp",
  volunteer_work: "volunteer organization-min.webp",
  neighborhood_chat: "neighbourhood chat-min.webp",
  small_talk: "small talk & social chat-min.webp",
  hobby_discussion: "hobby&interest discussion-min.webp",
};

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

// Voice image mapping
const VOICE_IMAGE_MAP: Record<string, string> = {
  alloy: "alloy-min.webp",
  echo: "echo-min.webp",
  fable: "fable-min.webp",
  onyx: "onyx-min.webp",
  nova: "nova-min.webp",
  shimmer: "shimmer-min.webp",
};

// Voice options with enhanced metadata
const VOICE_OPTIONS = [
  {
    id: "alloy",
    name: "Alloy",
    gender: "female",
    description: "Smokey, husky female voice with contralto range",
  },
  {
    id: "echo",
    name: "Echo",
    gender: "male",
    description: "Energetic and warm male tenor voice",
  },
  {
    id: "fable",
    name: "Fable",
    gender: "male",
    description: "Alto male voice with slight English accent",
  },
  {
    id: "onyx",
    name: "Onyx",
    gender: "male",
    description: "Deep bass-baritone male voice with rich tone",
  },
  {
    id: "nova",
    name: "Nova",
    gender: "female",
    description: "Clear alto female voice, very responsive",
  },
  {
    id: "shimmer",
    name: "Shimmer",
    gender: "female",
    description: "Soothing contralto female voice",
  },
];

// VoiceImageSelector Component - Enhanced with Avatar System
function VoiceImageSelector({
  voices,
  selectedVoice,
  onVoiceChange,
}: {
  voices: typeof VOICE_OPTIONS;
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}) {
  // Convert voice selection to avatar character
  const selectedAvatarCharacter =
    getAvatarByVoiceId(selectedVoice) || AVATAR_CHARACTERS[0];

  const handleAvatarChange = (character: AvatarCharacter) => {
    onVoiceChange(character.voiceId);
  };

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium block">
        Choose Your Conversation Partner:
      </span>

      {/* Use our new AvatarSelector */}
      <AvatarSelector
        characters={AVATAR_CHARACTERS}
        selectedCharacter={selectedAvatarCharacter}
        onCharacterChange={handleAvatarChange}
        disabled={false}
      />
    </div>
  );
}

// ScenarioImageSelector Component
function ScenarioImageSelector({
  scenarios,
  selectedScenario,
  onScenarioChange,
}: {
  scenarios: typeof ROLE_PLAY_SCENARIOS;
  selectedScenario: string;
  onScenarioChange: (scenarioId: string) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium block">Practice Scenario:</span>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Left scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background border shadow-lg flex-shrink-0"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2 flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {scenarios.map(scenario => {
            const imageSrc = SCENARIO_IMAGE_MAP[scenario.id];
            const isSelected = selectedScenario === scenario.id;

            return (
              <div
                key={scenario.id}
                className={cn(
                  "flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105",
                  isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                )}
                onClick={() => onScenarioChange(scenario.id)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onScenarioChange(scenario.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${scenario.name} scenario: ${scenario.description}`}
                aria-pressed={isSelected}
              >
                <div className="relative w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                  {imageSrc && (
                    <Image
                      src={`/images/speaking/${imageSrc}`}
                      alt={scenario.name}
                      fill
                      className="object-cover transition-transform duration-200 hover:scale-110"
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                      priority={scenario.id === "free"} // Prioritize the default option
                    />
                  )}

                  {/* Overlay with scenario name */}
                  <div className="absolute inset-0 bg-black/40 flex items-end">
                    <div className="p-1 sm:p-2 w-full">
                      <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                        {scenario.name}
                      </p>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background border shadow-lg flex-shrink-0"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected scenario description */}
      <p className="text-xs text-muted-foreground">
        {scenarios.find(s => s.id === selectedScenario)?.description}
      </p>
    </div>
  );
}

export function TurnBasedConversation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    "idle" | "recording" | "processing" | "speaking" | "error"
  >("idle");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("free");
  const [selectedLevel, setSelectedLevel] = useState("b1");
  const [selectedVoice, setSelectedVoice] = useState("echo");
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
  const [currentFacialAnimationData, setCurrentFacialAnimationData] =
    useState<FacialAnimationData>({ visemes: [] });

  // REAL-TIME TRANSCRIPTION: New state for audio visualization and immediate transcription
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

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

  // AI Audio and Translation state
  const [aiAudioUrls, setAiAudioUrls] = useState<{
    [messageIndex: number]: string;
  }>({});
  const [translations, setTranslations] = useState<{
    [messageIndex: number]: string;
  }>({});
  const [loadingStates, setLoadingStates] = useState<{
    audio: { [messageIndex: number]: boolean };
    translation: { [messageIndex: number]: boolean };
  }>({
    audio: {},
    translation: {},
  });

  // REPLAY FIX: Store facial animation data per message for replay functionality
  const [aiFacialAnimationData, setAiFacialAnimationData] = useState<{
    [key: number]: FacialAnimationData;
  }>({});
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);
  const pollingCleanupRef = useRef<(() => void) | null>(null);

  // REAL-TIME TRANSCRIPTION: New refs for audio analysis and timing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioSimulationRef = useRef<NodeJS.Timeout | null>(null); // Add simulation cleanup ref
  const isRecordingRef = useRef<boolean>(false); // Add ref to track recording state reliably

  // Avatar state
  const [selectedCharacter, setSelectedCharacter] = useState<AvatarCharacter>(
    getAvatarByVoiceId("echo") || AVATAR_CHARACTERS[2] // Alex is index 2
  );

  // Update selected character when voice changes
  useEffect(() => {
    const newCharacter = getAvatarByVoiceId(selectedVoice);
    if (newCharacter && newCharacter.id !== selectedCharacter.id) {
      setSelectedCharacter(newCharacter);
    }
  }, [selectedVoice, selectedCharacter.id]);

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

      // REAL-TIME TRANSCRIPTION: Clean up audio analysis
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Clean up audio simulation
      if (audioSimulationRef.current) {
        clearTimeout(audioSimulationRef.current);
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
        // console.log(
        //   `Checking evaluation status (attempt ${attempts}, elapsed ${currentElapsed}s)...`
        // );

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
        // console.log("Evaluation progress check:", {
        //   progress: data.session?.evaluationProgress,
        //   hasFeedback: !!data.session?.feedback,
        //   feedbackScores: data.session?.feedback
        //     ? `Overall: ${data.session.feedback.overallScore}, Fluency: ${data.session.feedback.fluencyScore}`
        //     : "None",
        // });

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
            // console.log("Evaluation completed with full feedback!");
            setEvaluationProgress(100);
            setEvaluationComplete(true);
            isCompleted = true;
            return; // Exit the polling loop
          }
          // If progress is 100% but no feedback yet, we're still processing
          else if (backendProgress >= 100 && !hasFeedback) {
            // console.log(
            //   "Backend reports 100% but feedback not yet available, continuing to poll..."
            // );
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
            // console.log("Evaluation completed (based on feedback)!");
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

      // PHASE 1 OPTIMIZATION: Immediate session activation and feedback
      setIsSessionActive(true);
      setStatus("idle");

      // Get the selected voice name for the initial message
      const selectedAvatarCharacter = getAvatarByVoiceId(selectedVoice);
      const selectedCharacterName = selectedAvatarCharacter?.name || "AI";

      setConversation([
        {
          role: "assistant",
          text: `${selectedCharacterName} is getting ready. Please wait...`,
        },
      ]);

      // console.log("Starting conversation session");

      // PHASE 1 OPTIMIZATION: Parallel operations - session creation and microphone prep
      const [sessionResponse] = await Promise.all([
        // Priority: Create session (fast)
        fetch("/api/speaking/conversation/start", {
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
        }),

        // Background: Prepare microphone access (parallel, non-blocking)
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 16000,
              channelCount: 1,
            },
          })
          .then(stream => {
            // Release the stream immediately - we just wanted to get permission
            stream.getTracks().forEach(track => track.stop());
            // console.log("Microphone access confirmed");
          })
          .catch(error => {
            console.warn("Microphone prep failed:", error);
            // Non-blocking - user can still try to record later
          }),
      ]);

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error("Session start error:", errorText);
        throw new Error(`Failed to start session: ${errorText}`);
      }

      const data = await sessionResponse.json();
      // console.log("Session started with ID:", data.speakingSessionId);

      // Set session ID
      setSpeakingSessionId(data.speakingSessionId);

      // PHASE 1 OPTIMIZATION: Load AI greeting in background (non-blocking)
      loadInitialGreetingAsync(data.speakingSessionId);
    } catch (error) {
      console.error("Error starting session:", error);

      // Reset session state on error
      setIsSessionActive(false);
      setStatus("error");

      toast({
        title: "Session error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start conversation session",
        variant: "destructive",
      });
    } finally {
      setIsStartingSession(false);
    }
  };

  // PHASE 1 OPTIMIZATION: Background greeting loader (non-blocking)
  const loadInitialGreetingAsync = async (sessionId: string) => {
    try {
      const initialPrompt = getInitialPrompt();
      // console.log("Loading initial AI greeting:", initialPrompt);

      await generateAIResponse(initialPrompt, true, sessionId);

      // Replace "getting ready..." message with actual greeting when ready
      setConversation(prev =>
        prev.filter(msg => !msg.text.includes("is getting ready"))
      );
    } catch (error) {
      console.warn("Initial greeting generation failed:", error);
      // Continue without greeting - user can still record
      // Keep the "Please wait..." message as fallback
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

        // console.log(`Ending session with ${audioUrls.length} audio recordings`);

        // Estimate evaluation time based on number of recordings
        // Each recording takes ~5-10 seconds to process, plus 20s base time
        const recordingsCount = audioUrls.length;
        const estimatedSeconds = Math.max(60, 20 + recordingsCount * 8);
        setEstimatedTime(estimatedSeconds);
        // console.log(`Estimated evaluation time: ${estimatedSeconds} seconds`);

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
        // console.log(
        //   "Session ended successfully, server will evaluate recordings",
        //   responseData
        // );

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

        // Clean up AI audio files from Cloudinary
        await cleanupAIAudio();

        // Reset AI audio and translation state
        setAiAudioUrls({});
        setTranslations({});
        setLoadingStates({ audio: {}, translation: {} });
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
      // PHASE 1 OPTIMIZATION: WebRTC-grade audio settings for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true, // From WebRTC implementation
          noiseSuppression: true, // From WebRTC implementation
          autoGainControl: true, // From WebRTC implementation
          sampleRate: 16000, // Optimized for speech recognition
          channelCount: 1, // Mono for speech (smaller files)
        },
      });

      // Clean up any previous audio simulation
      if (audioSimulationRef.current) {
        clearTimeout(audioSimulationRef.current);
        audioSimulationRef.current = null;
      }

      // REAL-TIME TRANSCRIPTION: Set up audio analysis for visualization
      let audioAnalysisWorking = false;
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();

        // Optimized settings for real-time voice detection
        analyserRef.current.fftSize = 256; // Smaller for faster processing
        analyserRef.current.smoothingTimeConstant = 0.1; // Minimal smoothing for immediate response

        source.connect(analyserRef.current);
        audioAnalysisWorking = true;

        // console.log("Audio analysis setup successful");
      } catch (audioAnalysisError) {
        console.warn("Audio analysis setup failed:", audioAnalysisError);
        audioAnalysisWorking = false;
      }

      // PHASE 1 OPTIMIZATION: Better compression and faster processing
      const options = {
        mimeType: "audio/webm;codecs=opus", // Opus codec for better compression
        audioBitsPerSecond: 32000, // OPTIMIZED: Reduced from 64000 for faster upload while maintaining quality
      };

      // Fallback for browsers that don't support the preferred format
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        // console.log("Preferred audio format not supported, using default");
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

        // REAL-TIME TRANSCRIPTION: Start immediate transcription
        processRecordingImmediate(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());

        // Clean up audio analysis
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Clean up audio simulation
        if (audioSimulationRef.current) {
          clearTimeout(audioSimulationRef.current);
          audioSimulationRef.current = null;
        }

        // Reset audio level and recording ref
        setAudioLevel(0);
        isRecordingRef.current = false;
      };

      mediaRecorder.start();
      setIsRecording(true);
      isRecordingRef.current = true; // Set ref immediately
      setStatus("recording");

      // REAL-TIME TRANSCRIPTION: Start recording timer and reset audio level
      startRecordingTimer();
      setAudioLevel(0);

      // Start appropriate audio visualization AFTER isRecording is set
      if (audioAnalysisWorking) {
        // Production: Starting real audio analysis
        analyzeAudioLevel();
      } else {
        // Production: Starting simulated audio visualization
        startAudioSimulation();
      }
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
      isRecordingRef.current = false; // Update ref immediately

      // REAL-TIME TRANSCRIPTION: Stop timer and show transcribing state
      stopRecordingTimer();
      setIsTranscribing(true);
      setStatus("processing");

      // Show immediate visual feedback that transcription is happening
      setConversation(prev => [
        ...prev,
        {
          role: "user",
          text: "🔄 Transcribing...",
        },
      ]);
    }
  };

  // REAL-TIME TRANSCRIPTION: Immediate processing for faster UX
  const processRecordingImmediate = async (audioBlobToProcess: Blob) => {
    if (!audioBlobToProcess || !speakingSessionId) {
      console.error("Missing audio blob or session ID", {
        hasAudioBlob: !!audioBlobToProcess,
        sessionId: speakingSessionId,
      });
      return;
    }

    // console.log(
    //   "Starting immediate transcription with blob size:",
    //   audioBlobToProcess.size
    // );

    try {
      // Store the recording in our session recordings array immediately
      const newRecording = {
        blob: audioBlobToProcess,
        timestamp: new Date(),
      };
      setSessionRecordings(prev => [...prev, newRecording]);

      // REAL-TIME TRANSCRIPTION: Start transcription immediately (priority operation)
      // console.log("Creating FormData for immediate transcription");
      const formData = new FormData();
      formData.append("audio", audioBlobToProcess, "recording.webm");
      formData.append("speakingSessionId", speakingSessionId);

      // console.log("Sending audio for immediate transcription");

      // REAL-TIME TRANSCRIPTION: Parallel processing - transcription and upload
      const [transcriptionResponse] = await Promise.all([
        // Priority: Transcription (user needs to see this immediately)
        fetch("/api/speaking/conversation/transcript", {
          method: "POST",
          body: formData,
        }),

        // Background: Upload to Cloudinary (for evaluation later, non-blocking)
        uploadSpeakingRecording(audioBlobToProcess, speakingSessionId)
          .then(uploadResult => {
            // Update the recording entry with the URL when ready
            setSessionRecordings(prev =>
              prev.map((rec, index) =>
                index === prev.length - 1
                  ? { ...rec, url: uploadResult.url }
                  : rec
              )
            );
            // console.log("Audio recording uploaded:", uploadResult.url);
          })
          .catch(uploadError => {
            // Don't fail the whole operation if upload fails
            console.error("Error uploading audio recording:", uploadError);
          }),
      ]);

      // console.log(
      //   "Transcription response status:",
      //   transcriptionResponse.status
      // );

      if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text();
        console.error(
          "Transcription failed:",
          transcriptionResponse.status,
          errorText
        );
        throw new Error(
          `Failed to transcribe audio: ${transcriptionResponse.status} ${errorText}`
        );
      }

      const transcriptionResult = await transcriptionResponse.json();
      // console.log("Transcription result:", transcriptionResult);

      const { text, potentialGrammarErrors } = transcriptionResult;
      setUserTranscript(text);

      // console.log("User said:", text);
      // console.log("Potential grammar errors:", potentialGrammarErrors);

      // REAL-TIME TRANSCRIPTION: Replace transcribing message with actual transcript
      setConversation(prev =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.text.includes("🔄 Transcribing")
            ? { role: "user", text }
            : msg
        )
      );

      // Get the selected voice name for the thinking message
      const selectedAvatarCharacter = getAvatarByVoiceId(selectedVoice);
      const selectedCharacterName = selectedAvatarCharacter?.name || "AI";

      // REAL-TIME TRANSCRIPTION: Show AI thinking immediately with character name
      setConversation(prev => [
        ...prev,
        {
          role: "assistant",
          text: `💭 ${selectedCharacterName} is thinking...`,
        },
      ]);

      // console.log("Generating AI response for user input:", text);

      // Generate AI response asynchronously (non-blocking UI)
      generateAIResponseAsync(text, potentialGrammarErrors);
    } catch (error) {
      console.error("Error processing recording:", error);

      // Better error handling with user-friendly messages - replace transcribing message
      setConversation(prev =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.text.includes("🔄 Transcribing")
            ? { role: "user", text: "❌ Speech processing failed" }
            : msg
        )
      );

      toast({
        title: "Processing error",
        description: "Failed to process your recording",
        variant: "destructive",
      });
      setStatus("error");
    } finally {
      setIsTranscribing(false);
      setIsProcessing(false);
    }
  };

  // PHASE 1 OPTIMIZATION: Separate async AI response function for non-blocking operation
  const generateAIResponseAsync = async (
    userInput: string,
    potentialGrammarErrors?: any[]
  ) => {
    try {
      // Convert grammar errors array to string format expected by generateAIResponse
      const grammarErrorsString = potentialGrammarErrors
        ? JSON.stringify(potentialGrammarErrors)
        : undefined;

      await generateAIResponse(
        userInput,
        false,
        undefined,
        grammarErrorsString
      );
    } catch (error) {
      console.error("AI response generation failed:", error);

      // Replace thinking message with error
      setConversation(prev =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.text.includes("💭")
            ? {
                role: "assistant",
                text: "Sorry, I couldn't generate a response. Please try again.",
              }
            : msg
        )
      );
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
    // console.log(
    //   `Generating AI response${isInitial ? " (initial greeting)" : ""}`
    // );
    // console.log("User input:", userInput);
    // console.log("Session ID:", activeSessionId);
    // console.log("Scenario:", selectedScenario);
    // console.log("Level:", selectedLevel);

    try {
      // Send user input to backend for AI response
      // console.log("Sending request to /api/speaking/conversation/respond");

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
            userName:
              session?.user?.name || session?.user?.email?.split("@")[0],
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
        // console.log("API response received:", data);

        // PHASE 1 OPTIMIZATION: Replace thinking message or add new response
        setConversation(prev => {
          const filtered = prev.filter(
            msg =>
              !msg.text.includes("🔄") &&
              !msg.text.includes("✨") &&
              !msg.text.includes("💭")
          ); // Remove all loading/thinking messages
          const newConversation = [
            ...filtered,
            { role: "assistant" as const, text: data.text },
          ];

          // Store AI audio for repeat functionality if audio is available
          if (data.audioUrl) {
            const messageIndex = newConversation.length - 1; // Index of the AI message we just added
            storeAIAudio(data.audioUrl, messageIndex);

            // REPLAY FIX: Store facial animation data for replay (moved here for correct indexing)
            if (
              data.facialAnimationData &&
              data.facialAnimationData.visemes &&
              data.facialAnimationData.visemes.length > 0 &&
              data.role === "assistant"
            ) {
              setAiFacialAnimationData(prevFacialData => ({
                ...prevFacialData,
                [messageIndex]: data.facialAnimationData,
              }));
              // Production: Facial animation data stored for replay
            }
          }

          return newConversation;
        });

        // PHASE 1: Handle audio loading with better feedback
        if (data.audioUrl && audioElementRef.current) {
          // console.log("Loading audio response...");
          audioElementRef.current.src = data.audioUrl;

          // PHASE 1: Faster audio loading timeout
          const audioLoadTimeout = setTimeout(() => {
            console.warn("Audio loading timeout, continuing in text mode");
            setStatus("idle");
            setCurrentFacialAnimationData({ visemes: [] }); // Clear viseme data if audio fails
          }, 6000); // Reduced from 8000 to 6000 for faster fallback

          audioElementRef.current.onloadeddata = () => {
            clearTimeout(audioLoadTimeout);
            if (audioElementRef.current) {
              // PHASE 2: Set facial animation data right before audio starts
              // FIXED: Only set facial animation data for AI responses (not user speech)
              if (
                data.facialAnimationData &&
                data.facialAnimationData.visemes &&
                data.facialAnimationData.visemes.length > 0 &&
                data.role === "assistant"
              ) {
                setCurrentFacialAnimationData(data.facialAnimationData);
                // Production: Syncing facial animations with AI audio playback
              } else {
                // Clear facial animation data if this is user speech or no animation data
                setCurrentFacialAnimationData({ visemes: [] });
                if (
                  data.facialAnimationData &&
                  data.facialAnimationData.visemes &&
                  data.facialAnimationData.visemes.length > 0
                ) {
                  // Production: Ignoring facial animation data for user speech
                }
                // Production: Avatar speaking without facial animations
              }

              audioElementRef.current.play().catch(e => {
                console.warn("Audio autoplay failed:", e);
                setStatus("idle");
                setCurrentFacialAnimationData({ visemes: [] }); // Clear viseme data if audio fails
              });
              setStatus("speaking");
            }
          };

          audioElementRef.current.onended = () => {
            clearTimeout(audioLoadTimeout);
            // Production: Audio playback completed
            setStatus("idle");
            setCurrentFacialAnimationData({ visemes: [] }); // Clear viseme data when audio ends
            // Production: Avatar state now idle (audio ended)
          };

          audioElementRef.current.onerror = e => {
            clearTimeout(audioLoadTimeout);
            console.error("Audio playback error:", e);
            setStatus("idle");
            setCurrentFacialAnimationData({ visemes: [] }); // Clear viseme data on error
            // Production: Avatar state now idle (audio error)
          };
        } else {
          // Production: No audio URL received or audio element not ready
          // Production: Continuing conversation in text-only mode
          setStatus("idle");
          setCurrentFacialAnimationData({ visemes: [] }); // No audio means no lip sync
          // Production: Avatar state now idle (no audio)
        }

        // PHASE 2: Store viseme data for lip sync animation
        // Note: This is now moved to the audio loading section for better sync
        if (!data.audioUrl) {
          // Only set here if there's no audio
          // FIXED: Only process viseme data for AI responses
          if (
            data.facialAnimationData &&
            data.facialAnimationData.visemes &&
            data.facialAnimationData.visemes.length > 0 &&
            data.role === "assistant"
          ) {
            // Production: AI facial animation data available but no audio - lip sync disabled
          }
          setCurrentFacialAnimationData({ visemes: [] });
        }

        // DUPLICATE SECTION - COMMENTED OUT TO FIX ANIMATION OVERRIDE
        // // PHASE 2: Store facial animation data for enhanced lip sync
        // if (
        //   data.facialAnimationData &&
        //   data.facialAnimationData.visemes.length > 0
        // ) {
        //   console.log(
        //     `🎭 Setting facial animation data: ${data.facialAnimationData.visemes.length} visemes`,
        //     data.facialAnimationData
        //   );
        //   setCurrentFacialAnimationData(data.facialAnimationData);
        //   console.log("🎭 Avatar state: speaking (with facial animations)");
        // } else {
        //   setCurrentFacialAnimationData({ visemes: [] });
        //   console.log(
        //     "🎭 Avatar state: speaking (no facial animations - user speech or no data)"
        //   );
        // }

        // PHASE 2: Store AI audio for replay - FACIAL ANIMATION STORAGE MOVED TO setConversation CALLBACK
        if (data.audioUrl) {
          // Calculate the correct message index - this will be the index of the AI message we're about to add
          const messageIndex = conversation.length;
          storeAIAudio(data.audioUrl, messageIndex);

          // DUPLICATE REMOVED: Facial animation data storage moved inside setConversation callback
          // for correct indexing with newConversation.length - 1
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

  // REAL-TIME TRANSCRIPTION: Audio level analysis for visualization
  const analyzeAudioLevel = () => {
    if (!analyserRef.current || !isRecordingRef.current) {
      // console.log(
      //   "analyzeAudioLevel stopped - analyser:",
      //   !!analyserRef.current,
      //   "isRecording:",
      //   isRecordingRef.current
      // );
      return;
    }

    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    try {
      analyserRef.current.getByteTimeDomainData(dataArray); // Use time domain for better voice detection

      // Calculate the maximum amplitude for immediate response
      let max = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = Math.abs(dataArray[i] - 128) / 128; // Center around 0 and normalize
        if (normalized > max) {
          max = normalized;
        }
      }

      // Apply amplification for better visual response
      const amplified = Math.min(max * 2.5, 1); // Amplify and cap at 1

      // Debug: Log audio level more frequently for debugging
      if (Math.random() < 0.1) {
        // Log ~10% of the time for debugging
        // console.log(
        //   "Audio level:",
        //   amplified.toFixed(3),
        //   "Raw max:",
        //   max.toFixed(3),
        //   "Buffer length:",
        //   bufferLength,
        //   "IsRecording:",
        //   isRecordingRef.current
        // );
      }

      setAudioLevel(amplified);
    } catch (error) {
      console.error("Error in audio analysis:", error);
      // Fall back to simulation if real analysis fails
      if (isRecordingRef.current) {
        // console.log("Falling back to audio simulation due to analysis error");
        startAudioSimulation();
        return;
      }
    }

    // Continue animation if still recording
    if (isRecordingRef.current) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel);
    } else {
      // console.log("Stopped audio analysis - recording ended");
    }
  };

  // REAL-TIME TRANSCRIPTION: Fallback audio simulation with proper timing
  const startAudioSimulation = () => {
    if (!isRecordingRef.current) {
      // console.log("Not starting audio simulation - not recording");
      return;
    }

    // Clean up any existing simulation first
    if (audioSimulationRef.current) {
      clearTimeout(audioSimulationRef.current);
      audioSimulationRef.current = null;
    }

    // console.log("Starting audio simulation fallback");

    const updateLevel = () => {
      if (!isRecordingRef.current) {
        // console.log("Stopping audio simulation - recording ended");
        return;
      }

      // Generate more realistic audio levels that vary over time
      const baseLevel = 0.15 + Math.random() * 0.7; // Random base level
      const smoothLevel = Math.min(baseLevel, 1);

      // console.log("Simulated audio level:", smoothLevel.toFixed(3));
      setAudioLevel(smoothLevel);

      // Schedule next update
      if (isRecordingRef.current) {
        audioSimulationRef.current = setTimeout(
          updateLevel,
          80 + Math.random() * 40
        ); // 80-120ms intervals for natural variation
      }
    };

    // Start the simulation
    updateLevel();
  };

  // REAL-TIME TRANSCRIPTION: Start recording timer
  const startRecordingTimer = () => {
    recordingStartTimeRef.current = Date.now();
    setRecordingDuration(0);

    recordingTimerRef.current = setInterval(() => {
      if (recordingStartTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - recordingStartTimeRef.current) / 1000
        );
        setRecordingDuration(elapsed);
      }
    }, 100); // Update every 100ms for smooth timer
  };

  // REAL-TIME TRANSCRIPTION: Stop recording timer
  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    recordingStartTimeRef.current = null;
  };

  // Store AI audio response in Cloudinary for repeat functionality
  const storeAIAudio = async (audioData: string, messageIndex: number) => {
    if (!speakingSessionId) return;

    setLoadingStates(prev => ({
      ...prev,
      audio: { ...prev.audio, [messageIndex]: true },
    }));

    try {
      // SIMPLIFIED: Store the audio URL directly instead of uploading to Cloudinary
      // Since audioData is already a URL from Azure TTS, just store it
      setAiAudioUrls(prev => ({
        ...prev,
        [messageIndex]: audioData,
      }));

      // Production: AI audio stored for message replay functionality
    } catch (error) {
      console.error("Error storing AI audio:", error);
      toast({
        title: "Audio Storage Error",
        description: "Could not store audio for repeat functionality.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        audio: { ...prev.audio, [messageIndex]: false },
      }));
    }
  };

  // Repeat AI audio response
  const repeatAIAudio = async (messageIndex: number) => {
    const audioUrl = aiAudioUrls[messageIndex];
    const facialAnimationData = aiFacialAnimationData[messageIndex];

    // Production: Repeating audio for message with facial animation data

    if (audioUrl && audioElementRef.current) {
      try {
        // Stop current audio first
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;

        // REPLAY FIX: Restore facial animation data for this specific message
        if (
          facialAnimationData &&
          facialAnimationData.visemes &&
          facialAnimationData.visemes.length > 0
        ) {
          setCurrentFacialAnimationData(facialAnimationData);
          // Production: Restored visemes for replay
        } else {
          setCurrentFacialAnimationData({ visemes: [] });
          // Production: No facial animation data found - lip sync disabled for replay
        }

        // Set new source and play
        audioElementRef.current.src = audioUrl;

        // Wait for audio to load then play
        audioElementRef.current.onloadeddata = () => {
          audioElementRef.current?.play().catch(error => {
            console.error("Error playing repeat audio:", error);
            toast({
              title: "Playback Error",
              description: "Could not play the audio. Please try again.",
              variant: "destructive",
            });
          });
        };

        // Handle immediate play if already loaded
        if (audioElementRef.current.readyState >= 2) {
          await audioElementRef.current.play();
        }
      } catch (error) {
        console.error("Error playing AI audio:", error);
        toast({
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Production: No audio URL found for message
      toast({
        title: "Audio Not Available",
        description: "This audio is no longer available for playback.",
        variant: "destructive",
      });
    }
  };

  // Translate AI response to Turkish
  const translateAIResponse = async (text: string, messageIndex: number) => {
    setLoadingStates(prev => ({
      ...prev,
      translation: { ...prev.translation, [messageIndex]: true },
    }));

    try {
      const response = await fetch("/api/speaking/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate text");
      }

      const data = await response.json();

      setTranslations(prev => ({
        ...prev,
        [messageIndex]: data.translatedText,
      }));

      toast({
        title: "Translation Complete",
        description: "AI response has been translated to Turkish.",
      });
    } catch (error) {
      console.error("Error translating text:", error);
      toast({
        title: "Translation Error",
        description: "Could not translate the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        translation: { ...prev.translation, [messageIndex]: false },
      }));
    }
  };

  // Clean up AI audio files when session ends
  const cleanupAIAudio = async () => {
    if (!speakingSessionId) return;

    try {
      await fetch("/api/speaking/ai-audio/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ speakingSessionId }),
      });

      // console.log(
      //   `AI audio cleanup completed for session ${speakingSessionId}`
      // );
    } catch (error) {
      console.warn("AI audio cleanup failed:", error);
      // Don't show error to user as this is background cleanup
    }
  };

  return (
    <div className="space-y-4">
      {!isSessionActive ? (
        <div className="space-y-4">
          <ScenarioImageSelector
            scenarios={ROLE_PLAY_SCENARIOS}
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
          />

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium mb-1 block">
                Language Level:
              </span>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger
                  aria-label="Select your language level"
                  className="w-full"
                >
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                  <SelectItem value="C1">C1 - Advanced</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {CEFR_LEVELS.find(l => l.id === selectedLevel)?.description}
              </p>
            </div>

            <VoiceImageSelector
              voices={VOICE_OPTIONS}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
            />
          </div>

          <Button
            onClick={startSession}
            disabled={!session?.user || isStartingSession}
            className="mt-4 w-full"
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
          {/* Free Conversation Title with End Conversation Button */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
            <h3 className="text-lg font-semibold">Free Conversation</h3>
            <Button
              variant="destructive"
              onClick={endSession}
              className="w-full sm:w-auto text-sm"
            >
              <Square className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          </div>

          {/* Main Layout: Avatar on Left, Conversation on Right */}
          <div className="flex flex-col lg:flex-row gap-6 mb-4">
            {/* Avatar Section - Left Side */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="w-full max-w-sm">
                <AvatarViewer
                  character={selectedCharacter}
                  state={status === "speaking" ? "speaking" : "idle"}
                  facialAnimationData={currentFacialAnimationData}
                  audioRef={audioElementRef} // Pass audio reference for real-time analysis
                />
              </div>
            </div>

            {/* Conversation Section - Right Side */}
            <div className="lg:w-2/3 space-y-4">
              {status === "error" && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-3 sm:p-4 mb-4">
                  <h3 className="text-destructive font-medium mb-2 text-sm">
                    Error
                  </h3>
                  <p className="text-xs sm:text-sm text-destructive/90 mb-3">
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
                        generateAIResponse(
                          initialPrompt,
                          true,
                          speakingSessionId
                        );
                      }
                    }}
                    variant="outline"
                    className="mr-2 text-sm"
                    size="sm"
                  >
                    Retry
                  </Button>
                </div>
              )}

              <div
                ref={conversationContainerRef}
                className="border rounded-lg p-2 sm:p-4 space-y-3 sm:space-y-4 h-[350px] sm:h-[400px] overflow-y-auto"
              >
                {conversation.length === 0 ? (
                  <p className="text-center text-muted-foreground text-xs sm:text-sm py-6 sm:py-8">
                    Click "Start Conversation" to begin speaking practice
                  </p>
                ) : (
                  conversation.map((message: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-col min-w-0", // min-w-0 allows text to wrap properly
                          message.role === "user" ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg p-2 sm:p-3 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-xs sm:text-sm leading-relaxed break-words">
                            {message.text}
                          </p>

                          {/* Translation display for AI messages */}
                          {message.role === "assistant" && translations[i] && (
                            <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                              <p className="text-xs text-muted-foreground italic break-words">
                                🇹🇷 {translations[i]}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Repeat and Translate buttons for AI messages */}
                        {message.role === "assistant" && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-2 w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => repeatAIAudio(i)}
                              disabled={
                                !aiAudioUrls[i] || loadingStates.audio[i]
                              }
                              className="h-6 sm:h-7 px-2 text-xs w-full sm:w-auto justify-start sm:justify-center"
                            >
                              {loadingStates.audio[i] ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Volume2 className="h-3 w-3 mr-1" />
                              )}
                              {aiAudioUrls[i] ? "Repeat" : "Loading..."}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                translateAIResponse(message.text, i)
                              }
                              disabled={
                                loadingStates.translation[i] ||
                                !!translations[i]
                              }
                              className="h-6 sm:h-7 px-2 text-xs w-full sm:w-auto justify-start sm:justify-center"
                            >
                              {loadingStates.translation[i] ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Languages className="h-3 w-3 mr-1" />
                              )}
                              {translations[i] ? "Translated" : "Translate"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* REAL-TIME TRANSCRIPTION: Audio visualization during recording */}
                {isRecording && (
                  <div className="flex items-start gap-2 justify-end">
                    <div className="flex justify-center">
                      {/* Audio level bars with fixed height container */}
                      <div className="flex items-end space-x-1 py-3 sm:py-4 h-12 sm:h-16">
                        {[...Array(6)].map(
                          (
                            _,
                            i // Reduced from 8 to 6 bars for mobile
                          ) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1.5 sm:w-2 bg-red-500 rounded-full transition-all duration-100",
                                audioLevel > (i + 1) * 0.167 // Adjusted for 6 bars
                                  ? "opacity-100"
                                  : "opacity-30"
                              )}
                              style={{
                                height:
                                  audioLevel > (i + 1) * 0.167
                                    ? `${Math.max(8, 8 + i * 3)}px` // Smaller bars for mobile
                                    : "8px",
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex justify-center p-3 sm:p-4">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {conversation.length === 0 &&
                  !isProcessing &&
                  status !== "error" && (
                    <div className="text-center text-muted-foreground p-3 sm:p-4">
                      <p className="text-xs sm:text-sm">
                        Starting conversation. Please wait...
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex justify-center mt-3 sm:mt-4 px-2 sm:px-0">
                {isRecording ? (
                  <Button
                    variant="destructive"
                    onClick={stopRecording}
                    disabled={status === "processing" || status === "speaking"}
                    className="animate-pulse w-full sm:w-auto text-sm"
                    size="sm"
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
                      isTranscribing ||
                      status === "error"
                    }
                    className="w-full sm:w-auto text-sm"
                    size="sm"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Record Response
                  </Button>
                )}
              </div>
            </div>
          </div>

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
                      Evaluation complete! Your detailed feedback is ready to
                      view.
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
        </>
      )}
    </div>
  );
}
