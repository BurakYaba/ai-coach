"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import WelcomeStep from "./WelcomeStep";
import SkillAssessmentStep from "./SkillAssessmentStep";
import PreferencesStep from "./PreferencesStep";
import LearningPathStep from "./LearningPathStep";
import CompletionStep from "./CompletionStep";

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const steps = [
    { id: 0, name: "Welcome", component: WelcomeStep },
    { id: 1, name: "Assessment", component: SkillAssessmentStep },
    { id: 2, name: "Preferences", component: PreferencesStep },
    { id: 3, name: "Learning Path", component: LearningPathStep },
    { id: 4, name: "Complete", component: CompletionStep },
  ];

  useEffect(() => {
    fetchOnboardingProgress();
  }, []);

  const fetchOnboardingProgress = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched onboarding progress:", data);
        setOnboardingData(data.onboarding);
        setCurrentStep(data.onboarding.currentStep || 0);
      } else {
        console.error("Failed to fetch onboarding progress:", response.status);
      }
    } catch (error) {
      console.error("Error fetching onboarding progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (stepData: any, nextStep: number) => {
    try {
      // Clean the data to remove any circular references, React components, or DOM elements
      const cleanStepData = cleanDataForAPI(stepData);

      // Prepare the update payload
      const updatePayload: any = {
        currentStep: nextStep,
      };

      // Handle specific step data
      if (stepData?.skillAssessment) {
        updatePayload.skillAssessment = cleanStepData.skillAssessment;
      }

      if (stepData?.learningPreferences) {
        updatePayload.preferences = cleanStepData.learningPreferences;
      }

      if (stepData?.selectedLearningPath) {
        updatePayload.recommendedPath = {
          primaryFocus:
            cleanStepData.selectedLearningPath.selectedModules || [],
          suggestedOrder:
            cleanStepData.selectedLearningPath.selectedModules || [],
          estimatedWeeks: 12,
        };
      }

      const response = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        const data = await response.json();

        // Fetch fresh data to ensure consistency
        await fetchOnboardingProgress();

        // Set the current step
        setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
    }
  };

  const handleStepComplete = (stepData?: any) => {
    const nextStep = currentStep + 1;

    // Check if this is a completion request or if we're at the final step
    if (
      nextStep >= steps.length ||
      stepData?.onboardingCompleted ||
      stepData?.finalStep
    ) {
      // Set completing state to prevent re-rendering
      setCompleting(true);
      // Onboarding complete - don't change the current step, just complete
      console.log("Completing onboarding from step", currentStep);
      completeOnboarding(stepData);
    } else {
      updateProgress(stepData || {}, nextStep);
    }
  };

  const completeOnboarding = async (finalData?: any) => {
    try {
      // Clean the data to remove any circular references, React components, or DOM elements
      const cleanFinalData = cleanDataForAPI(finalData);

      const requestBody = {
        completed: true,
        completedAt: new Date().toISOString(),
        currentStep: 4, // Set to completion step
        ...cleanFinalData,
      };

      console.log("Completing onboarding with data:", requestBody);

      const response = await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Onboarding completion response:", responseData);

        // Force refresh the session token by triggering JWT refresh
        try {
          await updateSession({
            forceRefresh: true, // This forces the JWT callback to refresh from database
          });
          console.log("Session update triggered with force refresh");

          // Wait a moment for the session to update
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (sessionError) {
          console.error("Session update failed:", sessionError);
        }

        // Call the onComplete callback if provided
        if (onComplete) {
          console.log("Calling onComplete callback");
          onComplete();
        }

        // Check if we should redirect to dashboard
        if (finalData?.redirectToDashboard) {
          console.log("Redirecting to dashboard");
          window.location.replace("/dashboard");
        } else {
          // Default redirect behavior
          console.log("Navigating to dashboard");
          router.push("/dashboard");
        }
      } else {
        const errorData = await response.text();
        console.error("Failed to complete onboarding:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        setCompleting(false); // Reset completing state on error
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setCompleting(false); // Reset completing state on error
    }
  };

  // Function to clean data and remove circular references, React components, etc.
  const cleanDataForAPI = (data: any): any => {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => cleanDataForAPI(item));
    }

    if (typeof data === "object") {
      // Check if it's a React element or has circular references
      if (
        data.$$typeof ||
        data._reactInternalFiber ||
        data.__reactFiber ||
        data.stateNode
      ) {
        return null; // Remove React elements
      }

      const cleaned: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];

          // Skip functions and React-specific properties
          if (typeof value === "function") {
            continue;
          }

          // Skip properties that might cause circular references
          if (
            key.startsWith("_react") ||
            key.startsWith("__react") ||
            key === "stateNode"
          ) {
            continue;
          }

          // Skip React elements
          if (
            value &&
            typeof value === "object" &&
            (value.$$typeof || value._reactInternalFiber || value.__reactFiber)
          ) {
            continue;
          }

          cleaned[key] = cleanDataForAPI(value);
        }
      }
      return cleaned;
    }

    return data;
  };

  const handleSkipStep = () => {
    handleStepComplete();
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      updateProgress({}, prevStep);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show completing state instead of re-rendering the completion step
  if (completing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Finalizing Your Setup...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your learning dashboard
          </p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep]?.component;

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Getting Started
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <CurrentStepComponent
          onNext={handleStepComplete}
          onSkip={handleSkipStep}
          onBack={currentStep > 0 ? handleGoBack : undefined}
          data={onboardingData}
        />
      </div>
    </div>
  );
}
