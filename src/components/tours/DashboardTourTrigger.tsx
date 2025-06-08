"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DashboardTour from "./DashboardTour";

export default function DashboardTourTrigger() {
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartTour}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary sm:h-8 sm:w-8"
            >
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Take Dashboard Tour</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DashboardTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  );
}
