import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface TourState {
  isOpen: boolean;
  shouldShow: boolean;
  loading: boolean;
  hasCheckedFirstVisit: boolean;
}

export function useTour(module: string) {
  const { data: session } = useSession();
  const [tourState, setTourState] = useState<TourState>({
    isOpen: false,
    shouldShow: false,
    loading: true,
    hasCheckedFirstVisit: false,
  });

  useEffect(() => {
    if (session?.user?.id) {
      checkTourStatus();
    }
  }, [session, module]);

  const checkTourStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;

        // Check if onboarding is completed
        if (!onboarding?.completed) {
          setTourState({
            isOpen: false,
            shouldShow: false,
            loading: false,
            hasCheckedFirstVisit: false,
          });
          return;
        }

        // Check if this specific module tour has been completed or skipped
        const tours = onboarding.tours || { completed: [], skipped: [] };
        const moduleVisits = onboarding.moduleVisits || {};

        const hasVisited = moduleVisits[module]?.firstVisit;
        const tourCompleted = tours.completed.includes(module);
        const tourSkipped = tours.skipped.includes(module);

        // Show tour if user has visited the module but hasn't completed or skipped the tour
        const shouldShowTour = hasVisited && !tourCompleted && !tourSkipped;

        setTourState({
          isOpen: shouldShowTour,
          shouldShow: shouldShowTour,
          loading: false,
          hasCheckedFirstVisit: true,
        });
      } else {
        console.error("Failed to fetch tour status");
        setTourState({
          isOpen: false,
          shouldShow: false,
          loading: false,
          hasCheckedFirstVisit: false,
        });
      }
    } catch (error) {
      console.error("Error checking tour status:", error);
      setTourState({
        isOpen: false,
        shouldShow: false,
        loading: false,
        hasCheckedFirstVisit: false,
      });
    }
  };

  const startTour = () => {
    setTourState(prev => ({ ...prev, isOpen: true }));
  };

  const manualStart = () => {
    // Allow users to manually start the tour regardless of completion status
    setTourState(prev => ({
      ...prev,
      isOpen: true,
      shouldShow: true,
    }));
  };

  const closeTour = async () => {
    setTourState(prev => ({ ...prev, isOpen: false }));

    // Mark tour as skipped (not completed)
    try {
      await updateTourStatus(false);
    } catch (error) {
      console.error("Error updating tour status:", error);
    }
  };

  const completeTour = async () => {
    setTourState(prev => ({ ...prev, isOpen: false, shouldShow: false }));

    // Mark tour as completed
    try {
      await updateTourStatus(true);
    } catch (error) {
      console.error("Error completing tour:", error);
    }
  };

  const updateTourStatus = async (completed: boolean) => {
    try {
      const response = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tours: {
            [module]: {
              completed,
              skipped: !completed,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tour status");
      }
    } catch (error) {
      console.error("Error updating tour status:", error);
      throw error;
    }
  };

  const markFirstVisit = async () => {
    // Don't check again if we've already checked in this session
    if (tourState.hasCheckedFirstVisit) {
      return;
    }

    try {
      // First check if user has already visited this module
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        const onboarding = data.onboarding;
        const moduleVisits = onboarding?.moduleVisits || {};

        // If user has already visited this module, just update the tour state
        if (moduleVisits[module]?.firstVisit) {
          setTourState(prev => ({ ...prev, hasCheckedFirstVisit: true }));
          // Check if we should show the tour
          const tours = onboarding.tours || { completed: [], skipped: [] };
          const tourCompleted = tours.completed.includes(module);
          const tourSkipped = tours.skipped.includes(module);
          const shouldShowTour =
            onboarding?.completed && !tourCompleted && !tourSkipped;

          if (shouldShowTour) {
            setTourState(prev => ({
              ...prev,
              isOpen: true,
              shouldShow: true,
              loading: false,
              hasCheckedFirstVisit: true,
            }));
          }
          return;
        }

        // Check if onboarding is completed before showing tour
        if (!onboarding?.completed) {
          setTourState(prev => ({ ...prev, hasCheckedFirstVisit: true }));
          return;
        }
      }

      // Only make PATCH call if it's actually a first visit
      const patchResponse = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleVisits: {
            [module]: {
              firstVisit: new Date().toISOString(),
              visitCount: 1,
            },
          },
        }),
      });

      if (patchResponse.ok) {
        const patchData = await patchResponse.json();

        // Mark that we've checked first visit and immediately show tour
        // since this is a first visit and onboarding is completed
        setTourState({
          isOpen: true,
          shouldShow: true,
          loading: false,
          hasCheckedFirstVisit: true,
        });
      }
    } catch (error) {
      console.error("Error marking first visit:", error);
      setTourState(prev => ({
        ...prev,
        loading: false,
        hasCheckedFirstVisit: true,
      }));
    }
  };

  return {
    isOpen: tourState.isOpen,
    shouldShow: tourState.shouldShow,
    loading: tourState.loading,
    startTour,
    manualStart,
    closeTour,
    completeTour,
    markFirstVisit,
    checkTourStatus,
  };
}
