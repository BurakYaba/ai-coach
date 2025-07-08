"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ListeningTour from "./ListeningTour";

export default function ListeningTourManager() {
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
      // Wait for page elements to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if essential listening page elements are loaded
      const waitForListeningElements = () => {
        const essentialElements = [
          '[data-tour="listening-sessions"]',
          '[data-tour="create-session"]',
          '[data-tour="stats-overview"]',
        ];

        return essentialElements.every(
          selector => document.querySelector(selector) !== null
        );
      };

      // Wait up to 5 seconds for elements to load
      let attempts = 0;
      while (!waitForListeningElements() && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!waitForListeningElements()) {
        console.warn("Listening page elements not fully loaded, skipping tour");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;

        // Check tour completion status
        const tours = onboarding?.tours || { completed: [], skipped: [] };
        const hasCompletedListeningTour = tours.completed.includes("listening");
        const hasSkippedListeningTour = tours.skipped.includes("listening");

        setTourCompleted(hasCompletedListeningTour || hasSkippedListeningTour);

        // Show tour if it hasn't been completed or skipped
        if (!hasCompletedListeningTour && !hasSkippedListeningTour) {
          // Additional delay to ensure everything is settled
          setTimeout(() => {
            setShowTour(true);
          }, 500);
        }
      } else {
        console.warn("Failed to fetch tour status, skipping listening tour");
      }
    } catch (error) {
      console.error("Failed to check listening tour status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    setTourCompleted(true);

    // Mark listening tour as completed
    try {
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
    } catch (error) {
      console.error("Failed to update listening tour progress:", error);
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
            listening: { skipped: true },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to mark listening tour as skipped:", error);
    }
  };

  // Don't render anything while loading or if tour is completed
  if (loading || tourCompleted) {
    return null;
  }

  return (
    <ListeningTour
      isOpen={showTour}
      onComplete={handleTourComplete}
      onClose={handleTourClose}
    />
  );
}
