"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, HelpCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "hover" | "focus" | "none";
  optional?: boolean;
  tips?: string[];
}

interface ModuleTourProps {
  module: string;
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export default function ModuleTour({
  module,
  steps,
  isOpen,
  onClose,
  onComplete,
  onStepChange,
}: ModuleTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      setIsVisible(true);
      highlightElement(currentStep);
    } else {
      setIsVisible(false);
      clearHighlight();
    }
  }, [isOpen, currentStep, steps]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const highlightElement = async (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;

    // Find the target element with retry mechanism
    const findElementWithRetry = async (
      retries = 3
    ): Promise<HTMLElement | null> => {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) return element;

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return findElementWithRetry(retries - 1);
      }

      console.warn(
        `Tour target element not found after retries: ${step.target}`
      );
      return null;
    };

    const element = await findElementWithRetry();
    if (!element) return;

    setTargetElement(element);

    // Calculate position for the tour overlay
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    // Use conservative dimensions and viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Reduced margin for more space
    const safeMargin = 60; // Extra safety margin from edges

    // Get actual tour dimensions more conservatively
    let tourWidth = 400; // More conservative default width
    let tourHeight = 300; // More conservative default height

    if (tourRef.current) {
      const tourRect = tourRef.current.getBoundingClientRect();
      if (tourRect.width > 0 && tourRect.height > 0) {
        tourWidth = Math.min(tourRect.width, 400); // Cap at 400px
        tourHeight = Math.min(tourRect.height, 350); // Cap at 350px
      }
    }

    console.log("Tour positioning debug:", {
      targetElement: step.target,
      viewportWidth,
      viewportHeight,
      tourWidth,
      tourHeight,
      elementRect: rect,
      step: step.position,
      scrollTop,
      scrollLeft,
    });

    let x = 0;
    let y = 0;
    const adjustedPosition = "center"; // Force all positions to center for reliability

    // Always use safe center positioning for maximum reliability
    x = scrollLeft + viewportWidth / 2;
    // Place in upper-center area to prevent bottom overflow
    y = scrollTop + Math.min(viewportHeight * 0.3, 200); // 30% from top or 200px, whichever is smaller

    console.log("Final position (safe center):", {
      x,
      y,
      adjustedPosition,
      popupHeight: tourHeight,
      viewportHeight,
      safeY: y,
      viewport: {
        left: scrollLeft,
        right: scrollLeft + viewportWidth,
        top: scrollTop,
        bottom: scrollTop + viewportHeight,
      },
    });

    setOverlayPosition({ x, y });

    // Store the adjusted position for transform calculation
    (element as any)._tourAdjustedPosition = adjustedPosition;

    // Add highlight class to target element
    element.classList.add("tour-highlight");
    element.style.position = "relative";
    element.style.setProperty("z-index", "2147483646", "important");
    element.style.boxShadow =
      "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)";
    element.style.borderRadius = "8px";
    element.style.isolation = "isolate"; // Create new stacking context

    // Scroll element into view with better positioning
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    // Handle action if specified
    if (step.action && step.action !== "none") {
      setTimeout(() => {
        switch (step.action) {
          case "click":
            element.click();
            break;
          case "hover":
            element.dispatchEvent(
              new MouseEvent("mouseenter", { bubbles: true })
            );
            break;
          case "focus":
            if (
              element instanceof HTMLInputElement ||
              element instanceof HTMLTextAreaElement
            ) {
              element.focus();
            }
            break;
        }
      }, 1000);
    }
  };

  const clearHighlight = () => {
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
      targetElement.style.boxShadow = "";
      targetElement.style.zIndex = "";
      targetElement.style.isolation = "";
      setTargetElement(null);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      clearHighlight();
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      clearHighlight();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    clearHighlight();
    onClose();
  };

  const completeTour = () => {
    clearHighlight();
    onComplete();
  };

  const handleStepJump = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      clearHighlight();
      setCurrentStep(stepIndex);
    }
  };

  if (!isVisible || steps.length === 0 || !isMounted) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Get the adjusted position from the target element
  const adjustedPosition = targetElement
    ? (targetElement as any)._tourAdjustedPosition || currentStepData.position
    : currentStepData.position;

  const tourContent = (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2147483647,
            }}
          />

          {/* Tour content */}
          <motion.div
            ref={tourRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed max-w-md"
            style={{
              left: overlayPosition.x,
              top: overlayPosition.y,
              maxHeight: "60vh",
              maxWidth: "min(400px, 90vw)",
              zIndex: 2147483647,
              transform:
                adjustedPosition === "center"
                  ? "translate(-50%, 0)"
                  : adjustedPosition === "top"
                    ? "translate(-50%, -100%)"
                    : adjustedPosition === "bottom"
                      ? "translate(-50%, 0)"
                      : adjustedPosition === "left"
                        ? "translate(-100%, -50%)"
                        : "translate(0, -50%)",
            }}
          >
            <Card className="border shadow-2xl">
              <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      {currentStepData.title}
                    </h3>
                    {currentStepData.optional && (
                      <Badge variant="secondary" className="text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentStepData.content}
                  </p>

                  {/* Tips */}
                  {currentStepData.tips && currentStepData.tips.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                            Tips:
                          </p>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            {currentStepData.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span className="text-amber-600">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSkip}>
                      Skip Tour
                    </Button>
                  </div>

                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="min-w-[80px]"
                  >
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                    {currentStep < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-1 mt-4">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleStepJump(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? "bg-primary"
                          : index < currentStep
                            ? "bg-primary/50"
                            : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(tourContent, document.body);
}

// CSS for highlight effect (add to global styles)
export const tourStyles = `
  .tour-highlight {
    transition: all 0.3s ease;
  }
  
  .tour-highlight::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px solid rgb(59, 130, 246);
    border-radius: 12px;
    pointer-events: none;
    animation: pulse-border 2s infinite;
    z-index: 2147483645 !important;
  }
  
  @keyframes pulse-border {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.02);
    }
  }
`;
