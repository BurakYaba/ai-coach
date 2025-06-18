"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardTour from "./DashboardTour";

export default function DashboardTourManager() {
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
      // Longer delay to ensure gamification data has time to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if essential dashboard elements are loaded
      const waitForDashboardElements = () => {
        const essentialElements = [
          '[data-tour="dashboard-welcome"]',
          '[data-tour="dashboard-nav"]',
        ];

        // Level XP card is optional since it depends on gamification data
        const optionalElements = ['[data-tour="level-xp-card"]'];

        const essentialLoaded = essentialElements.every(
          selector => document.querySelector(selector) !== null
        );

        const optionalLoaded = optionalElements.some(
          selector => document.querySelector(selector) !== null
        );

        return essentialLoaded; // Don't require optional elements
      };

      // Wait up to 10 seconds for essential elements (increased from 5 seconds)
      let attempts = 0;
      while (!waitForDashboardElements() && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!waitForDashboardElements()) {
        console.warn(
          "Essential dashboard elements not fully loaded, skipping tour"
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;

        // Check if user has completed onboarding and not completed dashboard tour
        const hasCompletedOnboarding = onboarding?.completed || false;
        const tours = onboarding?.tours || { completed: [], skipped: [] };
        const hasCompletedDashboardTour = tours.completed.includes("dashboard");
        const hasSkippedDashboardTour = tours.skipped.includes("dashboard");

        setTourCompleted(hasCompletedDashboardTour || hasSkippedDashboardTour);

        // Show tour only if onboarding is completed and tour hasn't been completed/skipped
        if (
          hasCompletedOnboarding &&
          !hasCompletedDashboardTour &&
          !hasSkippedDashboardTour
        ) {
          // Additional delay to ensure everything is settled
          setTimeout(() => {
            setShowTour(true);
          }, 1000);
        }
      } else {
        console.warn("Failed to fetch onboarding progress, skipping tour");
      }
    } catch (error) {
      console.error("Failed to check tour status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    setTourCompleted(true);

    // Mark dashboard tour as completed
    try {
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            dashboard: { completed: true },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to update dashboard tour progress:", error);
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
            dashboard: { skipped: true },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to mark dashboard tour as skipped:", error);
    }
  };

  // Don't render anything while loading or if tour is completed
  if (loading || tourCompleted) {
    return null;
  }

  return (
    <DashboardTour
      isOpen={showTour}
      onComplete={handleTourComplete}
      onClose={handleTourClose}
    />
  );
}
