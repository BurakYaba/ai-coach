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
      // Check if user has completed dashboard tour via API
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;

        // Check tour completion status
        const tours = onboarding?.tours || { completed: [], skipped: [] };
        const hasCompletedDashboardTour = tours.completed.includes("dashboard");
        const hasSkippedDashboardTour = tours.skipped.includes("dashboard");

        setTourCompleted(hasCompletedDashboardTour || hasSkippedDashboardTour);

        // Show tour if it hasn't been completed or skipped
        if (!hasCompletedDashboardTour && !hasSkippedDashboardTour) {
          // Delay to ensure page is loaded
          setTimeout(() => {
            setShowTour(true);
          }, 1000);
        }
      } else {
        console.warn("Failed to fetch tour status, skipping dashboard tour");
      }
    } catch (error) {
      console.error("Failed to check dashboard tour status:", error);
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
    // Mark as skipped
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
