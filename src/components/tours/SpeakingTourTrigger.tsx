"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakingTour from "./SpeakingTour";

export default function SpeakingTourTrigger() {
  const [showTour, setShowTour] = useState(false);

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleTourClose = () => {
    setShowTour(false);
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartTour}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30 hover:border-blue-500/50 text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-all duration-200 group shadow-sm hover:shadow-md text-xs sm:text-sm gap-1 sm:gap-2"
      >
        <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform duration-200">
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <span className="hidden min-[480px]:inline font-medium">
          Take the Tour
        </span>
        <span className="min-[480px]:hidden font-medium">Tour</span>
      </Button>

      <SpeakingTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  );
}
