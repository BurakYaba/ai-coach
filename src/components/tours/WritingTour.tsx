"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";
import { tourSteps } from "@/data/tourSteps";

interface WritingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const writingTourSteps: TourStep[] = tourSteps.writing;

export default function WritingTour({
  isOpen,
  onClose,
  onComplete,
}: WritingTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(writingTourSteps);
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
          writingTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(writingTourSteps);
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
      // Update user's onboarding progress to mark writing tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            writing: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update writing tour completion:", error);
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
      module="writing"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
