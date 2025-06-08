"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import VocabularyTour from "./VocabularyTour";

export default function VocabularyTourTrigger() {
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
        className="text-muted-foreground hover:text-primary text-xs sm:text-sm"
      >
        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden min-[480px]:inline">Take the Tour</span>
        <span className="min-[480px]:hidden">Tour</span>
      </Button>

      <VocabularyTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  );
}
