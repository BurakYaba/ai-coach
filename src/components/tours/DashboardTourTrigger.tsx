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
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 sm:h-9 sm:w-9 group"
            >
              <div className="p-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                <HelpCircle className="h-4 w-4 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800 shadow-lg">
            <p className="font-medium">Take Dashboard Tour</p>
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
