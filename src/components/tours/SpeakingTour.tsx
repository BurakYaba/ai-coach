"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";

interface SpeakingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const speakingTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Speaking Practice",
    content:
      "This is your speaking practice dashboard where you can track your conversation sessions, review feedback, and monitor your speaking progress. Let's explore the features!",
    target: "[data-tour='speaking-header']",
    position: "center",
    action: "none",
    tips: [
      "Practice speaking with AI conversation partners",
      "Get real-time feedback on pronunciation and fluency",
      "Track your improvement over time with detailed analytics",
    ],
  },
  {
    id: "start-practice",
    title: "Start Speaking Practice",
    content:
      "Click this button to begin a new speaking session. You can choose between real-time conversations with AI or turn-based practice with different scenarios.",
    target: "[data-tour='practice-speaking-btn']",
    position: "center",
    action: "none",
    tips: [
      "Real-time mode provides natural conversation flow",
      "Turn-based mode gives you time to think and prepare",
      "Choose scenarios that match your learning goals",
    ],
  },
  {
    id: "statistics",
    title: "Practice Statistics",
    content:
      "Track your speaking progress with comprehensive stats: total sessions, completed sessions, practice time, and average session duration. See your improvement over time!",
    target: "[data-tour='speaking-overview']",
    position: "center",
    action: "none",
    tips: [
      "Regular practice sessions improve fluency faster",
      "Track your speaking time to set daily goals",
      "Completion rate shows your consistency",
    ],
  },
  {
    id: "recent-session",
    title: "Recent Session Details",
    content:
      "View details about your most recent practice session including duration, status, conversation type, and scenario. Quick access to your latest practice.",
    target: "[data-tour='recent-session']",
    position: "center",
    action: "none",
    tips: [
      "Review recent sessions to track improvement",
      "Check session status to resume incomplete conversations",
      "Different scenarios help practice various situations",
    ],
  },
  {
    id: "session-history",
    title: "Session History",
    content:
      "Browse through all your past speaking practice sessions. Each session is tracked with detailed information about your performance and progress.",
    target: "[data-tour='session-history-header']",
    position: "center",
    action: "none",
    tips: [
      "Review past sessions to identify improvement areas",
      "Compare performance across different time periods",
      "Revisit challenging conversations for more practice",
    ],
  },
  {
    id: "session-details",
    title: "Session Cards",
    content:
      "Each session card shows conversation type, duration, status, scenario, voice settings, and transcript length. Click to view detailed feedback and analysis.",
    target: "[data-tour='session-card']",
    position: "center",
    action: "none",
    tips: [
      "Click any session card for detailed feedback",
      "Voice settings affect conversation difficulty",
      "Transcript length indicates conversation depth",
    ],
  },
  {
    id: "pagination",
    title: "Navigate Sessions",
    content:
      "Use pagination to browse through your speaking session history. All your practice sessions are organized chronologically for easy access.",
    target: "[data-tour='speaking-pagination']",
    position: "center",
    action: "none",
    tips: [
      "Recent sessions appear first for easy access",
      "Use pagination to find older practice sessions",
      "Session organization helps track long-term progress",
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    content:
      "When you're new to speaking practice, you'll see helpful guidance to start your first session. The system tracks everything once you begin practicing!",
    target: "[data-tour='no-sessions-card']",
    position: "center",
    action: "none",
    tips: [
      "Don't worry about making mistakes - they're part of learning",
      "Start with easier scenarios and gradually increase difficulty",
      "Regular practice leads to noticeable improvement",
    ],
  },
];

export default function SpeakingTour({
  isOpen,
  onClose,
  onComplete,
}: SpeakingTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(speakingTourSteps);
  const [isTranslating, setIsTranslating] = useState(false);
  const { nativeLanguage } = useNativeLanguage();

  // Force tour to re-render when opened to ensure proper positioning
  useEffect(() => {
    if (isOpen) {
      setTourKey(prev => prev + 1);
    }
  }, [isOpen]);

  // Translate tour steps based on user's native language
  useEffect(() => {
    const translateSteps = async () => {
      setIsTranslating(true);
      try {
        const translated = await translateTourSteps(
          speakingTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(speakingTourSteps);
      } finally {
        setIsTranslating(false);
      }
    };

    if (isOpen) {
      translateSteps();
    }
  }, [isOpen, nativeLanguage]);

  const handleTourComplete = async () => {
    try {
      // Update user's onboarding progress to mark speaking tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            speaking: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update speaking tour completion:", error);
      // Still call onComplete even if API call fails
      onComplete();
    }
  };

  // Don't render if still translating
  if (isTranslating) {
    return null;
  }

  return (
    <ModuleTour
      key={tourKey}
      module="speaking"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
