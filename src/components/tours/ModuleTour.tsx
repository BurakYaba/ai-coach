"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, X, HelpCircle, Lightbulb } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isXsMobile, setIsXsMobile] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tourKey, setTourKey] = useState(0);

  // Floating UI setup with responsive configuration
  const { refs, floatingStyles, context } = useFloating({
    placement:
      steps[currentStep]?.position === "center"
        ? "top"
        : steps[currentStep]?.position || "top",
    middleware: [
      offset(isXsMobile ? 6 : isMobile ? 8 : 12), // Smaller offset for extra small mobile
      flip({
        fallbackAxisSideDirection: "start",
        padding: isXsMobile ? 2 : isMobile ? 4 : 8, // Smaller padding for extra small mobile
      }),
      shift({
        padding: isXsMobile ? 2 : isMobile ? 4 : 8, // Smaller padding for extra small mobile
      }),
    ],
    whileElementsMounted: autoUpdate,
    open: isVisible && targetElement !== null,
  });

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  // Enhanced mobile detection with breakpoints
  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      const width = window.innerWidth;
      // Three-tier responsive system
      setIsXsMobile(width < 640); // Extra small mobile
      setIsMobile(width >= 640 && width < 768); // Regular mobile/tablet
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle tour visibility
  useEffect(() => {
    if (isOpen && steps.length > 0) {
      setIsVisible(true);
      highlightElement(currentStep);
    } else {
      setIsVisible(false);
      clearHighlight();
    }
  }, [isOpen, currentStep, steps]);

  // Handle step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Update Floating UI placement when step changes
  useEffect(() => {
    if (isVisible && targetElement) {
      // Force Floating UI to recalculate position
      const element = targetElement;
      refs.setReference(element);
    }
  }, [currentStep, isVisible, targetElement, refs]);

  // Force tour re-render when opened
  useEffect(() => {
    if (isOpen) {
      setTourKey(prev => prev + 1);
    }
  }, [isOpen]);

  const findElementWithRetry = useCallback(
    async (selector: string, retries = 3): Promise<HTMLElement | null> => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) return element;

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return findElementWithRetry(selector, retries - 1);
      }

      console.warn(`Tour target element not found after retries: ${selector}`);
      return null;
    },
    []
  );

  const highlightElement = useCallback(
    async (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return;

      const element = await findElementWithRetry(step.target);
      if (!element) {
        // If element not found, show tour in center of screen
        console.warn(
          `Target element not found: ${step.target}, showing tour in center`
        );
        setTargetElement(null);
        return;
      }

      setTargetElement(element);

      // Set the reference element for Floating UI
      refs.setReference(element);

      // Add highlight class to target element with mobile-specific styling
      element.classList.add("tour-highlight");
      element.style.position = "relative";
      element.style.setProperty("z-index", "2147483646", "important");

      // Mobile-specific highlight styling
      if (isXsMobile) {
        element.style.boxShadow =
          "0 0 0 2px rgba(59, 130, 246, 0.7), 0 0 0 4px rgba(59, 130, 246, 0.4)";
        element.style.borderRadius = "4px";
      } else if (isMobile) {
        element.style.boxShadow =
          "0 0 0 3px rgba(59, 130, 246, 0.6), 0 0 0 6px rgba(59, 130, 246, 0.3)";
        element.style.borderRadius = "6px";
      } else {
        element.style.boxShadow =
          "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)";
        element.style.borderRadius = "8px";
      }

      element.style.isolation = "isolate";

      // Mobile-optimized scroll behavior
      element.scrollIntoView({
        behavior: "smooth",
        block: isMobile ? "nearest" : "center", // Better for mobile
        inline: isMobile ? "nearest" : "center",
      });

      // Handle action if specified with mobile considerations
      if (step.action && step.action !== "none") {
        setTimeout(
          () => {
            switch (step.action) {
              case "click":
                // Add touch-friendly click handling for mobile
                if (isMobile) {
                  element.dispatchEvent(
                    new TouchEvent("touchend", { bubbles: true })
                  );
                }
                element.click();
                break;
              case "hover":
                // Hover actions might not work well on mobile, skip or adapt
                if (!isMobile) {
                  element.dispatchEvent(
                    new MouseEvent("mouseenter", { bubbles: true })
                  );
                }
                break;
              case "focus":
                if (
                  element instanceof HTMLInputElement ||
                  element instanceof HTMLTextAreaElement
                ) {
                  element.focus();
                  // On mobile, ensure keyboard doesn't cover the element
                  if (isMobile) {
                    setTimeout(() => {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 300);
                  }
                }
                break;
            }
          },
          isMobile ? 500 : 1000
        ); // Faster action on mobile
      }
    },
    [steps, refs, findElementWithRetry, isMobile, isXsMobile]
  );

  const clearHighlight = useCallback(() => {
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
      targetElement.style.boxShadow = "";
      targetElement.style.zIndex = "";
      targetElement.style.isolation = "";
      setTargetElement(null);
    }
  }, [targetElement]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      clearHighlight();
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep, steps.length, clearHighlight]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      clearHighlight();
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, clearHighlight]);

  const handleSkip = useCallback(() => {
    clearHighlight();
    onClose();
  }, [clearHighlight, onClose]);

  const completeTour = useCallback(() => {
    clearHighlight();
    onComplete();
  }, [clearHighlight, onComplete]);

  const handleStepJump = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        clearHighlight();
        setCurrentStep(stepIndex);
      }
    },
    [steps.length, clearHighlight]
  );

  if (!isVisible || steps.length === 0 || !isMounted) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className="z-[2147483647]">
        <FloatingFocusManager context={context}>
          <AnimatePresence>
            {isVisible && (
              <>
                {/* Dark overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50"
                />

                {/* Tour content */}
                <motion.div
                  key={tourKey}
                  ref={refs.setFloating}
                  style={floatingStyles}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`z-[2147483647] ${
                    !targetElement
                      ? `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                          isXsMobile
                            ? "m-2 max-w-xs w-[95vw]"
                            : isMobile
                              ? "m-3 max-w-sm"
                              : "m-4 max-w-md"
                        }`
                      : isXsMobile
                        ? "fixed m-2 max-w-xs w-[95vw]"
                        : isMobile
                          ? "fixed m-3 max-w-sm"
                          : "fixed m-4 max-w-md"
                  }`}
                  {...getFloatingProps()}
                >
                  <Card
                    className={`border shadow-2xl mx-auto ${
                      isXsMobile
                        ? "w-full max-w-xs max-h-[70vh] mx-auto"
                        : isMobile
                          ? "w-auto max-w-sm max-h-[80vh]"
                          : "w-full max-w-md max-h-[75vh] mx-auto"
                    }`}
                  >
                    <CardContent
                      className={`overflow-y-auto ${
                        isXsMobile
                          ? "p-2 max-h-[70vh]"
                          : isMobile
                            ? "p-3 max-h-[80vh]"
                            : "p-3 max-h-[75vh]"
                      }`}
                    >
                      {/* Header */}
                      <div
                        className={`flex items-center justify-between ${
                          isXsMobile ? "mb-2" : isMobile ? "mb-2" : "mb-2"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1 ${
                            isXsMobile ? "gap-1" : isMobile ? "gap-1" : "gap-1"
                          }`}
                        >
                          <HelpCircle
                            className={`text-primary ${
                              isXsMobile
                                ? "h-3 w-3"
                                : isMobile
                                  ? "h-4 w-4"
                                  : "h-4 w-4"
                            }`}
                          />
                          <h3
                            className={`font-semibold ${
                              isXsMobile
                                ? "text-xs"
                                : isMobile
                                  ? "text-sm"
                                  : "text-base"
                            }`}
                          >
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
                          className={`p-0 ${
                            isXsMobile
                              ? "h-6 w-6"
                              : isMobile
                                ? "h-7 w-7"
                                : "h-6 w-6"
                          }`}
                        >
                          <X
                            className={`$${
                              isXsMobile
                                ? "h-2.5 w-2.5"
                                : isMobile
                                  ? "h-3 w-3"
                                  : "h-3 w-3"
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Progress bar */}
                      <div
                        className={
                          isXsMobile ? "mb-2" : isMobile ? "mb-3" : "mb-3"
                        }
                      >
                        <div
                          className={`flex justify-between text-muted-foreground mb-2 ${
                            isXsMobile
                              ? "text-xs"
                              : isMobile
                                ? "text-xs"
                                : "text-xs"
                          }`}
                        >
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

                      {/* Content - Mobile optimized layout */}
                      <div
                        className={`${isXsMobile ? "flex-1 mb-2" : isMobile ? "flex-1 mb-3" : "mb-3"}`}
                      >
                        <p
                          className={`text-muted-foreground mb-3 ${
                            isXsMobile
                              ? "text-xs leading-relaxed"
                              : isMobile
                                ? "text-sm leading-relaxed"
                                : "text-sm leading-relaxed"
                          }`}
                        >
                          {currentStepData.content}
                        </p>

                        {/* Tips */}
                        {currentStepData.tips &&
                          currentStepData.tips.length > 0 && (
                            <div
                              className={`bg-amber-50 dark:bg-amber-950/20 rounded-lg mb-3 ${
                                isXsMobile ? "p-2" : isMobile ? "p-3" : "p-2"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Lightbulb
                                  className={`text-amber-600 mt-0.5 flex-shrink-0 ${
                                    isXsMobile
                                      ? "h-3 w-3"
                                      : isMobile
                                        ? "h-4 w-4"
                                        : "h-4 w-4"
                                  }`}
                                />
                                <div>
                                  <p
                                    className={`font-medium text-amber-800 dark:text-amber-200 mb-1 ${
                                      isXsMobile
                                        ? "text-xs"
                                        : isMobile
                                          ? "text-xs"
                                          : "text-xs"
                                    }`}
                                  >
                                    Tips:
                                  </p>
                                  <ul
                                    className={`text-amber-700 dark:text-amber-300 space-y-1 ${
                                      isXsMobile
                                        ? "text-xs"
                                        : isMobile
                                          ? "text-xs"
                                          : "text-xs"
                                    }`}
                                  >
                                    {currentStepData.tips.map((tip, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-1"
                                      >
                                        <span className="text-amber-600">
                                          •
                                        </span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Navigation - Mobile optimized */}
                      <div
                        className={`${
                          isXsMobile
                            ? "flex flex-col gap-1.5 mt-auto"
                            : isMobile
                              ? "flex flex-col gap-2 mt-auto"
                              : "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1 ${isXsMobile ? "gap-1.5" : isMobile ? "gap-2" : "gap-2"}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`${isXsMobile ? "text-xs flex-1 h-8" : isMobile ? "text-xs flex-1" : "text-xs flex-1"}`}
                          >
                            <ArrowLeft
                              className={`mr-1 ${isXsMobile ? "h-2.5 w-2.5" : isMobile ? "h-3 w-3" : "h-3 w-3"}`}
                            />
                            <span
                              className={
                                isXsMobile
                                  ? ""
                                  : isMobile
                                    ? ""
                                    : "hidden sm:inline"
                              }
                            >
                              Previous
                            </span>
                            <span
                              className={
                                isXsMobile
                                  ? "hidden"
                                  : isMobile
                                    ? "hidden"
                                    : "sm:hidden"
                              }
                            >
                              Prev
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSkip}
                            className={`${isXsMobile ? "text-xs flex-1 h-8" : isMobile ? "text-xs flex-1" : "text-xs flex-1"}`}
                          >
                            <span
                              className={
                                isXsMobile
                                  ? ""
                                  : isMobile
                                    ? ""
                                    : "hidden sm:inline"
                              }
                            >
                              Skip Tour
                            </span>
                            <span
                              className={
                                isXsMobile
                                  ? "hidden"
                                  : isMobile
                                    ? "hidden"
                                    : "sm:hidden"
                              }
                            >
                              Skip
                            </span>
                          </Button>
                        </div>
                        <Button
                          onClick={handleNext}
                          size="sm"
                          className={`${isXsMobile ? "text-xs w-full h-8" : isMobile ? "text-xs w-full" : "min-w-[80px] text-xs flex-1"}`}
                        >
                          {currentStep === steps.length - 1 ? "Finish" : "Next"}
                          {currentStep < steps.length - 1 && (
                            <ArrowRight
                              className={`ml-1 ${isXsMobile ? "h-2.5 w-2.5" : isMobile ? "h-3 w-3" : "h-3 w-3"}`}
                            />
                          )}
                        </Button>
                      </div>

                      {/* Step indicators */}
                      <div
                        className={`flex justify-center gap-1 ${isXsMobile ? "mt-2" : isMobile ? "mt-3" : "mt-3"}`}
                      >
                        {steps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleStepJump(index)}
                            className={`rounded-full transition-colors ${isXsMobile ? "w-1.5 h-1.5" : "w-2 h-2"} ${index === currentStep ? "bg-primary" : index < currentStep ? "bg-primary/50" : "bg-secondary"}`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}

// CSS for highlight effect (add to global styles)
export const tourStyles = `
  .tour-highlight {
    transition: all 0.3s ease;
  }
  
  .tour-highlight::after {
    content: '';
    position: absolute;
    border: 2px solid rgb(59, 130, 246);
    border-radius: 12px;
    pointer-events: none;
    animation: pulse-border 2s infinite;
    z-index: 2147483645 !important;
  }
  
  /* Desktop highlight */
  @media (min-width: 768px) {
    .tour-highlight::after {
      inset: -8px;
      border-radius: 12px;
    }
  }
  
  /* Mobile highlight */
  @media (max-width: 767px) {
    .tour-highlight::after {
      inset: -6px;
      border-radius: 8px;
      border-width: 3px;
    }
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
  
  /* Mobile-specific touch improvements */
  @media (max-width: 767px) {
    .tour-highlight {
      touch-action: manipulation;
    }
    
    .tour-highlight::after {
      animation-duration: 1.5s;
    }
  }
`;
