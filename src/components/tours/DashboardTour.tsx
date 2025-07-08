"use client";

import { useState, useEffect } from "react";
import ModuleTour, { TourStep } from "./ModuleTour";
import { translateTourSteps } from "@/lib/translations";
import { useNativeLanguage } from "@/hooks/use-native-language";

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard",
    content:
      "This is your main dashboard where you can track your learning progress and access all language learning modules. Let's take a quick tour!",
    target: "[data-tour='dashboard-welcome']",
    position: "center",
    action: "none",
    tips: [
      "Your dashboard shows an overview of your learning journey",
      "You can always return here to check your progress",
    ],
  },
  {
    id: "navigation",
    title: "Module Navigation",
    content:
      "Use this navigation bar to access different learning modules. Each module offers unique learning experiences tailored to different skills.",
    target: "[data-tour='dashboard-nav']",
    position: "center",
    action: "none",
    tips: [
      "Click on any module to start learning",
      "Your current location is highlighted",
      "Try different modules to find what works best for you",
    ],
  },
  {
    id: "level-stats",
    title: "Level & Experience",
    content:
      "Track your level and XP progress here. You earn experience points by completing activities in any module, and level up as you learn!",
    target: "[data-tour='level-xp-card']",
    position: "center",
    action: "none",
    tips: [
      "XP is earned from all learning activities",
      "Higher levels unlock new features",
      "Check your progress to next level here",
    ],
  },
  {
    id: "streak",
    title: "Learning Streak",
    content:
      "Maintain your learning streak by practicing daily. Consistent daily practice is key to language learning success!",
    target: "[data-tour='streak-card']",
    position: "center",
    action: "none",
    tips: [
      "Practice daily to maintain your streak",
      "Even 5-10 minutes counts toward your streak",
      "Streaks help build consistent learning habits",
    ],
  },
  {
    id: "achievements",
    title: "Achievements & Badges",
    content:
      "Explore your achievements and badges here. These track your progress and celebrate your learning milestones across all modules.",
    target: "[data-tour='achievements-section']",
    position: "center",
    action: "none",
    tips: [
      "Achievements unlock as you reach milestones",
      "Some achievements require specific activities",
      "Check back regularly to see new achievements",
    ],
  },
  {
    id: "user-profile",
    title: "User Profile & Settings",
    content:
      "Access your profile, settings, and account options from this menu. You can customize your learning experience here.",
    target: "[data-tour='user-nav']",
    position: "center",
    action: "none",
    tips: [
      "Update your profile information",
      "Adjust notification settings",
      "View your subscription status",
    ],
  },
  {
    id: "xp-progress",
    title: "Quick XP Overview",
    content:
      "This shows your current XP and progress. It's visible on every page so you can always see your learning progress.",
    target: "[data-tour='xp-progress']",
    position: "center",
    action: "none",
    tips: [
      "This XP indicator follows you throughout the app",
      "Click to see detailed progress information",
    ],
  },
  {
    id: "modules-overview",
    title: "Ready to Start Learning!",
    content:
      "You're all set! Each module offers different ways to improve your English. Choose based on your current goals and interests. Happy learning!",
    target: "[data-tour='dashboard-nav']",
    position: "center",
    action: "none",
    tips: [
      "Reading: Improve comprehension with AI-generated content",
      "Writing: Practice with AI feedback and corrections",
      "Speaking: Have conversations with AI tutors",
      "Listening: Train your ear with audio content",
      "Vocabulary: Learn words with spaced repetition",
      "Grammar: Master rules with adaptive lessons",
      "Games: Have fun while learning with interactive games",
    ],
  },
];

export default function DashboardTour({
  isOpen,
  onClose,
  onComplete,
}: DashboardTourProps) {
  const [tourKey, setTourKey] = useState(0);
  const [translatedSteps, setTranslatedSteps] =
    useState<TourStep[]>(dashboardTourSteps);
  const [isTranslating, setIsTranslating] = useState(false);
  const { nativeLanguage } = useNativeLanguage();

  // Force tour to re-render when opened to ensure proper positioning
  useEffect(() => {
    if (isOpen) {
      setTourKey(prev => prev + 1);
    }
  }, [isOpen]);

  // Translate tour steps based on user's native language
  useEffect(() => {
    const translateSteps = async () => {
      setIsTranslating(true);
      try {
        const translated = await translateTourSteps(
          dashboardTourSteps,
          nativeLanguage
        );
        setTranslatedSteps(translated);
      } catch (error) {
        console.error("Failed to translate tour steps:", error);
        // Fallback to original steps
        setTranslatedSteps(dashboardTourSteps);
      } finally {
        setIsTranslating(false);
      }
    };

    if (isOpen) {
      translateSteps();
    }
  }, [isOpen, nativeLanguage]);

  const handleTourComplete = async () => {
    try {
      // Update user's onboarding progress to mark dashboard tour as completed
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

      onComplete();
    } catch (error) {
      console.error("Failed to update dashboard tour completion:", error);
      // Still call onComplete even if API call fails
      onComplete();
    }
  };

  // Don't render if still translating
  if (isTranslating) {
    return null;
  }

  return (
    <ModuleTour
      key={tourKey}
      module="dashboard"
      steps={translatedSteps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleTourComplete}
    />
  );
}

// Helper function to add tour data attributes to dashboard elements
export function addDashboardTourAttributes() {
  if (typeof window === "undefined") return;

  // Add tour attributes to dashboard elements
  const elementsToTag = [
    {
      selector: ".space-y-8 > div:first-child",
      attribute: "dashboard-welcome",
    },
    { selector: "nav.flex.items-center.space-x-1", attribute: "dashboard-nav" },
    {
      selector: '[data-testid="level-xp-card"], .grid > div:first-child',
      attribute: "level-xp-card",
    },
    {
      selector: '[data-testid="streak-card"], .grid > div:nth-child(2)',
      attribute: "streak-card",
    },
    {
      selector:
        '[data-testid="achievements-section"], .space-y-6 > div:last-child',
      attribute: "achievements-section",
    },
    {
      selector: '[data-testid="user-nav"], .hidden.md\\:block > div',
      attribute: "user-nav",
    },
    { selector: '[data-testid="xp-progress"]', attribute: "xp-progress" },
  ];

  elementsToTag.forEach(({ selector, attribute }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute("data-tour", attribute);
    }
  });
}
