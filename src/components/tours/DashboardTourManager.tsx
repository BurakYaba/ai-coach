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
      // Small delay to ensure page is fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if essential dashboard elements are loaded
      const waitForDashboardElements = () => {
        const essentialElements = [
          '[data-tour="dashboard-welcome"]',
          '[data-tour="dashboard-nav"]',
          '[data-tour="level-xp-card"]',
        ];

        return essentialElements.every(
          selector => document.querySelector(selector) !== null
        );
      };

      // Wait up to 5 seconds for essential elements
      let attempts = 0;
      while (!waitForDashboardElements() && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!waitForDashboardElements()) {
        console.warn("Dashboard elements not fully loaded, skipping tour");
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
          setShowTour(true);
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
