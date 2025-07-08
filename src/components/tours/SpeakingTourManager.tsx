"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SpeakingTour from "./SpeakingTour";

export default function SpeakingTourManager() {
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

        // Check tour completion status
        const tours = onboarding?.tours || { completed: [], skipped: [] };
        const hasCompletedSpeakingTour = tours.completed.includes("speaking");
        const hasSkippedSpeakingTour = tours.skipped.includes("speaking");

        setTourCompleted(hasCompletedSpeakingTour || hasSkippedSpeakingTour);

        // Show tour if it hasn't been completed or skipped
        if (!hasCompletedSpeakingTour && !hasSkippedSpeakingTour) {
          // Small delay to ensure page is loaded
          setTimeout(() => {
            setShowTour(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Failed to check speaking tour status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    setTourCompleted(true);

    // Mark speaking tour as completed
    try {
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
    } catch (error) {
      console.error("Failed to update speaking tour progress:", error);
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
            speaking: { skipped: true },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to mark speaking tour as skipped:", error);
    }
  };

  // Don't render anything while loading or if tour is completed
  if (loading || tourCompleted) {
    return null;
  }

  return (
    <SpeakingTour
      isOpen={showTour}
      onComplete={handleTourComplete}
      onClose={handleTourClose}
    />
  );
}
