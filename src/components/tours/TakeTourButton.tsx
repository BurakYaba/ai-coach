"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TakeTourButtonProps {
  onStartTour: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function TakeTourButton({
  onStartTour,
  variant = "outline",
  size = "sm",
  showIcon = true,
  className = "",
  children,
}: TakeTourButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onStartTour}
          className={`${className} gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30 hover:border-blue-500/50 text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-all duration-200 group shadow-sm hover:shadow-md border rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer bg-transparent flex items-center justify-center`}
        >
          {showIcon && (
            <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform duration-200">
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          )}
          <span className="hidden min-[480px]:inline font-medium">
            {children || "Take the Tour"}
          </span>
          <span className="min-[480px]:hidden font-medium">
            {children ? children : "Tour"}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-white/95 backdrop-blur-sm border border-blue-200/50 text-gray-800 shadow-lg">
        <p className="font-medium">
          Get a guided introduction to this module's features
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
