"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";
import { tourSteps } from "@/data/tourSteps";

interface ReadingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const readingTourSteps: TourStep[] = tourSteps.reading;

export default function ReadingTour({
  isOpen,
  onClose,
  onComplete,
}: ReadingTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(readingTourSteps);
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
          readingTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(readingTourSteps);
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
      // Update user's onboarding progress to mark reading tour as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            reading: { completed: true },
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update reading tour completion:", error);
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
      module="reading"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
