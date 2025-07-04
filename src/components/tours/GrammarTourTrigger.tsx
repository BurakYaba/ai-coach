"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrammarTour from "./GrammarTour";

export default function GrammarTourTrigger() {
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
        className="text-muted-foreground hover:text-primary"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Take the Tour
      </Button>

      <GrammarTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  );
}
