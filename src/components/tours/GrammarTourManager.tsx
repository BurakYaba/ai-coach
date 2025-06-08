"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import GrammarTour from "./GrammarTour";

export default function GrammarTourManager() {
  const { data: session } = useSession();
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      checkTourStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

  const checkTourStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;

        // Check if user has completed onboarding and not completed grammar tour
        const hasCompletedOnboarding = onboarding?.completed || false;
        const tours = onboarding?.tours || { completed: [], skipped: [] };
        const hasCompletedGrammarTour = tours.completed.includes("grammar");
        const hasSkippedGrammarTour = tours.skipped.includes("grammar");

        setTourCompleted(hasCompletedGrammarTour || hasSkippedGrammarTour);

        // Show tour only if onboarding is completed and tour hasn't been completed/skipped
        if (
          hasCompletedOnboarding &&
          !hasCompletedGrammarTour &&
          !hasSkippedGrammarTour
        ) {
          // Small delay to ensure page is loaded
          setTimeout(() => {
            setShowTour(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Failed to check grammar tour status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    setTourCompleted(true);

    // Mark grammar tour as completed
    try {
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
    } catch (error) {
      console.error("Failed to update grammar tour progress:", error);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
    // Optionally mark as skipped
    markTourSkipped();
  };

  const markTourSkipped = async () => {
    setTourCompleted(true);
    try {
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            grammar: { skipped: true },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to mark grammar tour as skipped:", error);
    }
  };

  // Don't render anything while loading or if tour is completed
  if (loading || tourCompleted) {
    return null;
  }

  return (
    <GrammarTour
      isOpen={showTour}
      onComplete={handleTourComplete}
      onClose={handleTourClose}
    />
  );
}
