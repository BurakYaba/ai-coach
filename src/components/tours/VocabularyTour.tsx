"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";

interface VocabularyTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const vocabularyTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Vocabulary",
    content:
      "This is your personal vocabulary dashboard where you can manage, study, and track your English word collection. Let's explore the key features!",
    target: "[data-tour='vocabulary-header']",
    position: "center",
    action: "none",
    tips: [
      "Build your vocabulary through spaced repetition learning",
      "Words are automatically added from reading and writing sessions",
      "Track your mastery progress for each word",
    ],
  },
  {
    id: "vocabulary-stats",
    title: "Vocabulary Statistics",
    content:
      "Track your progress with comprehensive stats: total words learned, mastered words, words needing review, and your average mastery level.",
    target: "[data-tour='vocabulary-stats']",
    position: "center",
    action: "none",
    tips: [
      "Mastered words have 90%+ retention rate",
      "Average mastery shows your overall vocabulary strength",
      "Review words appear when spaced repetition schedules them",
    ],
  },
  {
    id: "study-tools",
    title: "Study Tools",
    content:
      "Quick access to flashcards for spaced repetition practice and refresh button to update your vocabulary data.",
    target: "[data-tour='vocabulary-actions']",
    position: "center",
    action: "none",
    tips: [
      "Flashcards use proven spaced repetition algorithms",
      "Regular review sessions improve long-term retention",
      "Refresh updates your vocabulary from recent activities",
    ],
  },
  {
    id: "word-filters",
    title: "Word Filters",
    content:
      "Filter your vocabulary by categories: All Words, Need Review (due for practice), Mastered (90%+ mastery), and Learning (in progress).",
    target: "[data-tour='vocabulary-tabs']",
    position: "center",
    action: "none",
    tips: [
      "Focus on 'Need Review' words for efficient studying",
      "Learning words need more practice to reach mastery",
      "Use filters to organize your study sessions",
    ],
  },
  {
    id: "review-session",
    title: "Start Review Session",
    content:
      "Begin a spaced repetition review session with words that are due for practice. The system uses proven algorithms to optimize your learning.",
    target: "[data-tour='start-review-btn']",
    position: "center",
    action: "none",
    tips: [
      "Review sessions adapt to your performance",
      "Correctly answered words appear less frequently",
      "Challenging words get more practice opportunities",
    ],
  },
  {
    id: "word-collection",
    title: "Word Collection",
    content:
      "Your vocabulary words are displayed as cards showing the word, definition, context, mastery level, and related words (synonyms/antonyms).",
    target: "[data-tour='vocabulary-grid']",
    position: "center",
    action: "none",
    tips: [
      "Context examples help you understand word usage",
      "Synonyms and antonyms expand your vocabulary connections",
      "Mastery percentages show your learning progress",
    ],
  },
  {
    id: "ready-to-start",
    title: "Ready to Build Your Vocabulary?",
    content:
      "You're all set! Start with review sessions, explore your word collection, and track your progress. Your vocabulary will grow with every session!",
    target: "[data-tour='vocabulary-header']",
    position: "center",
    action: "none",
    tips: [
      "Regular review sessions are key to vocabulary retention",
      "Focus on high-frequency words for maximum impact",
      "Use context clues to understand word meanings",
      "Practice using new words in your own sentences",
    ],
  },
];

export default function VocabularyTour({
  isOpen,
  onClose,
  onComplete,
}: VocabularyTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(vocabularyTourSteps);
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
          vocabularyTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(vocabularyTourSteps);
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
      // Update user's onboarding progress to mark vocabulary tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            vocabulary: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update vocabulary tour completion:", error);
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
      module="vocabulary"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
