"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Progress } from "@/components/ui/progress";
import LanguageSelectionStep from "./LanguageSelectionStep";
import WelcomeStep from "./WelcomeStep";
import SkillAssessmentStep from "./SkillAssessmentStep";
import PreferencesStep from "./PreferencesStep";
import LearningPathStep from "./LearningPathStep";
import CompletionStep from "./CompletionStep";
import { useOnboardingTranslations } from "@/lib/onboarding-translations";

interface OnboardingData {
  language: "en" | "tr";
  skillAssessment?: any;
  learningPreferences?: any;
  learningPath?: any;
  onboarding?: any;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ language: "en" });
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const steps = [
    {
      id: "language",
      name: "Language Selection",
      component: LanguageSelectionStep,
    },
    { id: "welcome", name: "Welcome", component: WelcomeStep },
    { id: "assessment", name: "Assessment", component: SkillAssessmentStep },
    { id: "preferences", name: "Preferences", component: PreferencesStep },
    { id: "learning-path", name: "Learning Path", component: LearningPathStep },
    { id: "completion", name: "Completion", component: CompletionStep },
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
        setData(data.onboarding);
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

  const handleNext = async (stepData?: any) => {
    setLoading(true);

    try {
      // Update data with new step data
      const updatedData = { ...data, ...stepData };
      setData(updatedData);

      // Clean the step data to remove any circular references, React components, or DOM elements
      const cleanStepData = stepData ? cleanDataForAPI(stepData) : undefined;

      // Save progress to backend
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentStep: currentStep + 1,
          language: updatedData.language,
          ...(cleanStepData && { [steps[currentStep].id]: cleanStepData }),
        }),
      });

      // Move to next step
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      // Skip entire onboarding process
      await fetch("/api/onboarding/skip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: data.language,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Mark onboarding as completed
      await fetch("/api/onboarding/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
          completedAt: new Date().toISOString(),
          language: data.language,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
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
      handleNext(stepData);
    }
  };

  const completeOnboarding = async (finalData?: any) => {
    try {
      console.log("Starting onboarding completion process");

      // Use the dedicated completion endpoint
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
          finalData: finalData || {},
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Onboarding completion response:", responseData);

        // Force JWT token refresh if requested
        if (responseData.forceRefresh) {
          console.log("Forcing JWT token refresh after onboarding completion");
          try {
            await updateSession();
            console.log("JWT token refresh completed");
          } catch (error) {
            console.error("Error refreshing JWT token:", error);
          }
        }

        // Use the same hard redirect approach as the English version
        console.log("Redirecting to dashboard with refresh token");
        window.location.href =
          "/dashboard?refresh_token=true&onboarding_completed=true";
        return; // Exit early since we're doing a hard redirect
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
  const cleanDataForAPI = (data: any, visited = new WeakSet()): any => {
    if (data === null || data === undefined) {
      return data;
    }

    // Handle primitive types
    if (typeof data !== "object") {
      return data;
    }

    // Check for circular references
    if (visited.has(data)) {
      return null; // Skip circular references
    }

    if (Array.isArray(data)) {
      visited.add(data);
      const result = data.map(item => cleanDataForAPI(item, visited));
      visited.delete(data);
      return result;
    }

    // Check if it's a React element or has circular references
    if (
      data.$$typeof ||
      data._reactInternalFiber ||
      data.__reactFiber ||
      data.stateNode
    ) {
      return null; // Remove React elements
    }

    visited.add(data);
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

        cleaned[key] = cleanDataForAPI(value, visited);
      }
    }

    visited.delete(data);
    return cleaned;
  };

  const CurrentStepComponent = steps[currentStep]?.component;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>
                  Step {currentStep} of {steps.length - 1}
                </span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        )}

        {/* Current Step Content */}
        <div className="max-w-6xl mx-auto">
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={
                currentStep === steps.length - 1
                  ? handleStepComplete
                  : handleNext
              }
              onBack={currentStep > 1 ? handleBack : undefined}
              onSkip={currentStep > 1 ? handleSkip : undefined}
              data={data}
              language={data.language}
              {...(currentStep === steps.length - 1 && {
                onComplete: handleComplete,
              })}
            />
          )}
        </div>

        {/* Skip Button (only show after language selection) */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Skip Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
