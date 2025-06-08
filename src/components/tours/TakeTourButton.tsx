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
        <Button
          variant={variant}
          size={size}
          onClick={onStartTour}
          className={`${className} gap-1 sm:gap-2`}
        >
          {showIcon && <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
          <span className="hidden min-[480px]:inline">
            {children || "Take the Tour"}
          </span>
          <span className="min-[480px]:hidden">
            {children ? children : "Tour"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Get a guided introduction to this module's features</p>
      </TooltipContent>
    </Tooltip>
  );
}
