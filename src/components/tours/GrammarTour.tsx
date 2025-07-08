"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";

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
    id: "practice-exercises",
    title: "Practice Exercises",
    content:
      "Reinforce your grammar learning with interactive exercises, daily challenges, and flashcards. Practice makes perfect!",
    target: "[data-tour='grammar-practice-tab']",
    position: "center",
    action: "none",
    tips: [
      "Daily challenges keep grammar practice consistent",
      "Flashcards help memorize grammar rules",
      "Interactive exercises test your understanding",
    ],
  },
  {
    id: "ready-to-improve",
    title: "Ready to Improve Your Grammar?",
    content:
      "You're all set! Generate personalized lessons, track your grammar issues, and practice regularly. Your grammar will improve with every session!",
    target: "[data-tour='generate-lesson-btn']",
    position: "center",
    action: "none",
    tips: [
      "Start with personalized lessons based on your mistakes",
      "Focus on one grammar rule at a time",
      "Practice regularly to reinforce learning",
      "Track your progress to stay motivated",
    ],
  },
];

export default function GrammarTour({
  isOpen,
  onClose,
  onComplete,
}: GrammarTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(grammarTourSteps);
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
          grammarTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(grammarTourSteps);
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

  // Don't render if still translating
  if (isTranslating) {
    return null;
  }

  return (
    <ModuleTour
      key={tourKey}
      module="grammar"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
