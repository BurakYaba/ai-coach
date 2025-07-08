"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";
import { tourSteps } from "@/data/tourSteps";

interface ListeningTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const listeningTourSteps: TourStep[] = tourSteps.listening;

export default function ListeningTour({
  isOpen,
  onClose,
  onComplete,
}: ListeningTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(listeningTourSteps);
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
          listeningTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(listeningTourSteps);
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

  // Don't render if still translating
  if (isTranslating) {
    return null;
  }

  return (
    <ModuleTour
      key={tourKey}
      module="listening"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}
