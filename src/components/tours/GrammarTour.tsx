"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";

interface GrammarTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const grammarTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Grammar Practice",
    content:
      "This is your personalized grammar center where you can track grammar issues, take lessons, and practice with exercises. Let's explore how to improve your English grammar!",
    target: "[data-tour='grammar-header']",
    position: "center",
    action: "none",
    tips: [
      "AI analyzes your grammar mistakes from writing and speaking",
      "Get personalized lessons based on your common errors",
      "Track your improvement with achievements and badges",
    ],
  },
  {
    id: "generate-lesson",
    title: "Generate Personalized Lessons",
    content:
      "Click this button to create a custom grammar lesson based on your most common grammar mistakes. The AI analyzes your errors and creates targeted learning content.",
    target: "[data-tour='generate-lesson-btn']",
    position: "center",
    action: "none",
    tips: [
      "Lessons are personalized based on your actual mistakes",
      "AI focuses on your most frequent error patterns",
      "New lessons adapt as your grammar improves",
    ],
  },
  {
    id: "navigation",
    title: "Grammar Navigation",
    content:
      "Navigate between different sections: Dashboard (overview & achievements), Issues (your grammar mistakes), Lessons (personalized content), and Practice (interactive exercises).",
    target: "[data-tour='grammar-tabs']",
    position: "center",
    action: "none",
    tips: [
      "Dashboard shows your overall grammar progress",
      "Issues tab lists all identified grammar mistakes",
      "Lessons tab contains your personalized learning content",
      "Practice tab offers daily challenges and flashcards",
    ],
  },
  {
    id: "achievements",
    title: "Grammar Achievements",
    content:
      "Track your progress with achievements and badges. See how many issues you've resolved, lessons completed, and earn badges for your improvement milestones.",
    target: "[data-tour='grammar-achievements']",
    position: "center",
    action: "none",
    tips: [
      "Earn badges by resolving grammar issues",
      "Lesson completion counts toward achievements",
      "Different badge levels: bronze, silver, and gold",
    ],
  },
  {
    id: "issues-tracking",
    title: "Grammar Issues Tracking",
    content:
      "View all grammar errors identified from your writing and speaking sessions. Each issue includes explanations and corrections to help you learn.",
    target: "[data-tour='grammar-issues-tab']",
    position: "center",
    action: "none",
    tips: [
      "Issues are automatically detected from your activities",
      "Each issue includes detailed explanations",
      "Mark issues as resolved once you've learned the rule",
    ],
  },
  {
    id: "personalized-lessons",
    title: "Personalized Lessons",
    content:
      "Access custom grammar lessons generated based on your common mistakes. Each lesson provides explanations, examples, and practice exercises.",
    target: "[data-tour='grammar-lessons-tab']",
    position: "center",
    action: "none",
    tips: [
      "Lessons target your specific weak areas",
      "Interactive exercises reinforce learning",
      "Progress tracking shows lesson completion",
    ],
  },
  {
    id: "daily-challenge",
    title: "Daily Grammar Challenge",
    content:
      "Test your grammar knowledge with daily challenges. Maintain your streak and compete with yourself to improve your grammar skills consistently.",
    target: "[data-tour='daily-challenge']",
    position: "center",
    action: "none",
    tips: [
      "New challenge available every day",
      "Maintain streaks for better learning habits",
      "Challenges adapt to your skill level",
    ],
  },
  {
    id: "flashcards",
    title: "Grammar Flashcards",
    content:
      "Review grammar rules using spaced repetition flashcards. An effective way to memorize and internalize grammar concepts for long-term retention.",
    target: "[data-tour='grammar-flashcards']",
    position: "center",
    action: "none",
    tips: [
      "Spaced repetition improves long-term retention",
      "Flashcards focus on rules you struggle with",
      "Regular review sessions are most effective",
    ],
  },
];

export default function GrammarTour({
  isOpen,
  onClose,
  onComplete,
}: GrammarTourProps) {
  const [tourKey, setTourKey] = useState(0);

  // Force tour to re-render when opened to ensure proper positioning
  useEffect(() => {
    if (isOpen) {
      setTourKey(prev => prev + 1);
    }
  }, [isOpen]);

  const handleTourComplete = async () => {
    try {
      // Update user's onboarding progress to mark grammar tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            grammar: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update grammar tour completion:", error);
      // Still call onComplete even if API call fails
      onComplete();
    }
  };

  return (
    <ModuleTour
      key={tourKey}
      module="grammar"
      steps={grammarTourSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
