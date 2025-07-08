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

      // Modern gradient highlight styling
      if (isXsMobile) {
        element.style.boxShadow =
          "0 0 0 2px rgba(59, 130, 246, 0.8), 0 0 0 4px rgba(147, 51, 234, 0.4), 0 0 20px rgba(59, 130, 246, 0.3)";
        element.style.borderRadius = "8px";
      } else if (isMobile) {
        element.style.boxShadow =
          "0 0 0 3px rgba(59, 130, 246, 0.7), 0 0 0 6px rgba(147, 51, 234, 0.3), 0 0 25px rgba(59, 130, 246, 0.4)";
        element.style.borderRadius = "10px";
      } else {
        element.style.boxShadow =
          "0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 8px rgba(147, 51, 234, 0.2), 0 0 30px rgba(59, 130, 246, 0.5)";
        element.style.borderRadius = "12px";
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
                {/* Overlay without blur to preserve page visibility */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40"
                />

                {/* Tour content with glass-morphism */}
                <motion.div
                  key={tourKey}
                  ref={refs.setFloating}
                  style={floatingStyles}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className={`z-[2147483647] ${
                    !targetElement
                      ? `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                          isXsMobile
                            ? "m-1 max-w-[280px] w-[90vw]"
                            : isMobile
                              ? "m-2 max-w-sm w-[85vw]"
                              : "m-3 max-w-md w-[400px]"
                        }`
                      : isXsMobile
                        ? "fixed m-1 max-w-[280px] w-[90vw]"
                        : isMobile
                          ? "fixed m-2 max-w-sm w-[85vw]"
                          : "fixed m-3 max-w-md w-[400px]"
                  }`}
                  {...getFloatingProps()}
                >
                  <Card
                    className={`bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl mx-auto ${
                      isXsMobile
                        ? "w-full max-h-[85vh] rounded-xl"
                        : isMobile
                          ? "w-auto max-h-[80vh] rounded-xl"
                          : "w-full max-h-[75vh] rounded-2xl"
                    }`}
                  >
                    <CardContent
                      className={`overflow-y-auto ${
                        isXsMobile
                          ? "p-3 max-h-[85vh]"
                          : isMobile
                            ? "p-4 max-h-[80vh]"
                            : "p-4 max-h-[75vh]"
                      }`}
                    >
                      {/* Header */}
                      <div
                        className={`flex items-center justify-between ${
                          isXsMobile ? "mb-3" : isMobile ? "mb-3" : "mb-4"
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            isXsMobile
                              ? "gap-1.5"
                              : isMobile
                                ? "gap-2"
                                : "gap-2"
                          }`}
                        >
                          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                            <HelpCircle
                              className={`text-white ${
                                isXsMobile
                                  ? "h-3 w-3"
                                  : isMobile
                                    ? "h-3.5 w-3.5"
                                    : "h-4 w-4"
                              }`}
                            />
                          </div>
                          <h3
                            className={`font-bold text-gray-900 ${
                              isXsMobile
                                ? "text-sm"
                                : isMobile
                                  ? "text-base"
                                  : "text-base"
                            }`}
                          >
                            {currentStepData.title}
                          </h3>
                          {currentStepData.optional && (
                            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs border-0 py-0 px-1.5">
                              Optional
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSkip}
                          className={`text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full ${
                            isXsMobile
                              ? "h-6 w-6 p-0"
                              : isMobile
                                ? "h-7 w-7 p-0"
                                : "h-7 w-7 p-0"
                          }`}
                        >
                          <X
                            className={`${
                              isXsMobile
                                ? "h-3 w-3"
                                : isMobile
                                  ? "h-3.5 w-3.5"
                                  : "h-4 w-4"
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Progress bar with gradient */}
                      <div
                        className={
                          isXsMobile ? "mb-3" : isMobile ? "mb-3" : "mb-4"
                        }
                      >
                        <div
                          className={`flex justify-between text-gray-600 mb-2 ${
                            isXsMobile
                              ? "text-xs"
                              : isMobile
                                ? "text-xs"
                                : "text-sm"
                          }`}
                        >
                          <span>
                            Step {currentStep + 1} of {steps.length}
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Content - More compact */}
                      <div
                        className={`${isXsMobile ? "flex-1 mb-3" : isMobile ? "flex-1 mb-3" : "mb-4"}`}
                      >
                        <p
                          className={`text-gray-700 mb-3 leading-snug ${
                            isXsMobile
                              ? "text-xs"
                              : isMobile
                                ? "text-sm"
                                : "text-sm"
                          }`}
                        >
                          {currentStepData.content}
                        </p>

                        {/* Tips with modern styling - more compact */}
                        {currentStepData.tips &&
                          currentStepData.tips.length > 0 && (
                            <div
                              className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg ${
                                isXsMobile ? "p-2" : isMobile ? "p-2.5" : "p-3"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md flex-shrink-0">
                                  <Lightbulb
                                    className={`text-white ${
                                      isXsMobile
                                        ? "h-2.5 w-2.5"
                                        : isMobile
                                          ? "h-3 w-3"
                                          : "h-3 w-3"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <p
                                    className={`font-semibold text-amber-800 mb-1 ${
                                      isXsMobile
                                        ? "text-xs"
                                        : isMobile
                                          ? "text-xs"
                                          : "text-sm"
                                    }`}
                                  >
                                    Pro Tips:
                                  </p>
                                  <ul
                                    className={`text-amber-700 space-y-1 ${
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
                                        className="flex items-start gap-1.5"
                                      >
                                        <span className="text-amber-600 mt-0.5 flex-shrink-0">
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

                      {/* Navigation with gradient buttons - more compact */}
                      <div
                        className={`${
                          isXsMobile
                            ? "flex flex-col gap-2 mt-auto"
                            : isMobile
                              ? "flex flex-col gap-2 mt-auto"
                              : "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2"
                        }`}
                      >
                        <div
                          className={`flex items-center ${isXsMobile ? "gap-1.5" : isMobile ? "gap-2" : "gap-2"}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ${isXsMobile ? "text-xs flex-1 h-8" : isMobile ? "text-xs flex-1 h-8" : "text-sm flex-1 h-9"}`}
                          >
                            <ArrowLeft
                              className={`mr-1 ${isXsMobile ? "h-3 w-3" : isMobile ? "h-3 w-3" : "h-3.5 w-3.5"}`}
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
                            className={`bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ${isXsMobile ? "text-xs flex-1 h-8" : isMobile ? "text-xs flex-1 h-8" : "text-sm flex-1 h-9"}`}
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
                          className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${isXsMobile ? "text-xs w-full h-8" : isMobile ? "text-sm w-full h-8" : "min-w-[90px] text-sm flex-1 h-9"}`}
                        >
                          {currentStep === steps.length - 1 ? "Finish" : "Next"}
                          {currentStep < steps.length - 1 && (
                            <ArrowRight
                              className={`ml-1 ${isXsMobile ? "h-3 w-3" : isMobile ? "h-3 w-3" : "h-3.5 w-3.5"}`}
                            />
                          )}
                        </Button>
                      </div>

                      {/* Step indicators with gradient - more compact */}
                      <div
                        className={`flex justify-center gap-1.5 ${isXsMobile ? "mt-3" : isMobile ? "mt-3" : "mt-4"}`}
                      >
                        {steps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleStepJump(index)}
                            className={`rounded-full transition-all duration-300 ${isXsMobile ? "w-1.5 h-1.5" : "w-2 h-2"} ${
                              index === currentStep
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
                                : index < currentStep
                                  ? "bg-gradient-to-r from-blue-400 to-purple-400 opacity-70"
                                  : "bg-gray-300 hover:bg-gray-400"
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
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}

// Enhanced CSS for modern highlight effect
export const tourStyles = `
  .tour-highlight {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .tour-highlight::after {
    content: '';
    position: absolute;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
    border: 3px solid;
    border-image: linear-gradient(45deg, rgb(59, 130, 246), rgb(147, 51, 234)) 1;
    border-radius: 16px;
    pointer-events: none;
    animation: pulse-gradient 2s infinite;
    z-index: 2147483645 !important;
    backdrop-filter: blur(1px);
  }
  
  /* Desktop highlight */
  @media (min-width: 768px) {
    .tour-highlight::after {
      inset: -10px;
      border-radius: 16px;
      border-width: 3px;
    }
  }
  
  /* Mobile highlight */
  @media (max-width: 767px) {
    .tour-highlight::after {
      inset: -8px;
      border-radius: 12px;
      border-width: 2px;
    }
  }
  
  @keyframes pulse-gradient {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
      filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
    }
    50% {
      opacity: 0.8;
      transform: scale(1.01);
      filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.4));
    }
  }
  
  /* Mobile-specific touch improvements */
  @media (max-width: 767px) {
    .tour-highlight {
      touch-action: manipulation;
    }
    
    .tour-highlight::after {
      animation-duration: 1.8s;
    }
  }
  
  /* Enhanced gradient animations */
  @keyframes floating {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  .tour-highlight {
    animation: floating 3s ease-in-out infinite;
  }
`;
