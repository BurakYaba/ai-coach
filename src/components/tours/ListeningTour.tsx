"use client";

import { useEffect, useState } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";

interface ListeningTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const listeningTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Listening Practice",
    content:
      "This is your listening practice hub where you can improve your listening skills with AI-generated audio content. Let's explore the features!",
    target: "[data-tour='listening-header']",
    position: "center",
    action: "none",
    tips: [
      "Practice listening with authentic audio content",
      "Track your progress and improvement over time",
      "Choose from various difficulty levels and topics",
    ],
  },
  {
    id: "tabs",
    title: "Navigation Tabs",
    content:
      "Use these tabs to navigate between different sections: Library for new content, In Progress for ongoing sessions, Completed for finished sessions, and Progress to track your stats.",
    target: "[data-tour='listening-tabs']",
    position: "center",
    action: "none",
    tips: [
      "Library: Browse and start new listening sessions",
      "In Progress: Continue your current sessions",
      "Completed: Review your finished sessions",
      "Progress: View your listening statistics",
    ],
  },
  {
    id: "search-filters",
    title: "Search & Filters",
    content:
      "Use the search bar to find specific topics, and the filters to select difficulty levels (A1-C2) and content types like dialogues, interviews, or news.",
    target: "[data-tour='search-filters']",
    position: "center",
    action: "none",
    tips: [
      "Search by title, topic, or keywords",
      "Filter by CEFR levels (A1 = Beginner, C2 = Advanced)",
      "Choose content types that interest you most",
    ],
  },
  {
    id: "content-library",
    title: "Listening Content Library",
    content:
      "Browse through our extensive library of listening materials. Each card shows the difficulty level, duration, and content type. Click on any item to start practicing!",
    target: "[data-tour='content-library']",
    position: "center",
    action: "none",
    tips: [
      "Color-coded levels: Green (A1-A2), Blue (B1-B2), Purple (C1-C2)",
      "Duration shows how long each session takes",
      "Topics range from daily conversations to academic content",
    ],
  },
  {
    id: "content-card",
    title: "Content Cards",
    content:
      "Each content card displays key information: title, level, duration, and topic. Click 'Start Session' to begin listening practice with interactive features.",
    target: "[data-tour='content-card']",
    position: "center",
    action: "none",
    tips: [
      "Level badge shows CEFR difficulty rating",
      "Duration helps you plan your study time",
      "Topics cover real-world scenarios and academic subjects",
    ],
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    content:
      "Monitor your listening improvement with detailed statistics showing your completion rates, time spent, and skill development across different levels.",
    target: "[data-tour='progress-tab']",
    position: "center",
    action: "none",
    tips: [
      "Track completion rates by difficulty level",
      "Monitor time spent on listening practice",
      "See your improvement trends over time",
    ],
  },
  {
    id: "session-features",
    title: "Interactive Session Features",
    content:
      "During listening sessions, you'll have access to transcripts, vocabulary explanations, comprehension questions, and playback controls for optimal learning.",
    target: "[data-tour='listening-tabs']",
    position: "center",
    action: "none",
    tips: [
      "Synchronized transcripts help follow along",
      "Vocabulary panels explain difficult words",
      "Comprehension questions test understanding",
      "Playback controls let you repeat sections",
    ],
  },
  {
    id: "ready-to-start",
    title: "Ready to Improve Your Listening?",
    content:
      "You're all set! Start with content matching your level, use the filters to find interesting topics, and track your progress. Happy listening!",
    target: "[data-tour='content-library']",
    position: "center",
    action: "none",
    tips: [
      "Start with A1-A2 if you're a beginner",
      "Try B1-B2 for intermediate learners",
      "Challenge yourself with C1-C2 advanced content",
      "Regular practice leads to rapid improvement!",
    ],
  },
];

export default function ListeningTour({
  isOpen,
  onClose,
  onComplete,
}: ListeningTourProps) {
  const [tourKey, setTourKey] = useState(0);

  // Force tour to re-render when opened to ensure proper positioning
  useEffect(() => {
    if (isOpen) {
      setTourKey(prev => prev + 1);
    }
  }, [isOpen]);

  const handleTourComplete = async () => {
    try {
      // Update user's onboarding progress to mark listening tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            listening: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update listening tour completion:", error);
      // Still call onComplete even if API call fails
      onComplete();
    }
  };

  return (
    <ModuleTour
      key={tourKey}
      module="listening"
      steps={listeningTourSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
