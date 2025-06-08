"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModuleTour from "./ModuleTour";
import { TakeTourButton } from "./TakeTourButton";
import { useTour } from "@/hooks/useTour";
import { tourSteps } from "@/data/tourSteps";

interface ModuleTourHelpProps {
  module: string;
  className?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "default" | "sm" | "lg";
  showIcon?: boolean;
  buttonText?: string;
}

export function ModuleTourHelp({
  module,
  className = "",
  buttonVariant = "outline",
  buttonSize = "sm",
  showIcon = true,
  buttonText,
}: ModuleTourHelpProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, markFirstVisit, completeTour, closeTour, manualStart } =
    useTour(module);

  // Handle authentication and first visit tracking
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Mark first visit when component mounts
    markFirstVisit();
  }, [session, status, markFirstVisit]);

  // Don't render if not authenticated or module doesn't have tour steps
  if (status === "loading" || !session?.user || !tourSteps[module]) {
    return null;
  }

  return (
    <>
      <TakeTourButton
        onStartTour={manualStart}
        variant={buttonVariant}
        size={buttonSize}
        showIcon={showIcon}
        className={className}
      >
        {buttonText}
      </TakeTourButton>

      {/* Module Tour */}
      <ModuleTour
        module={module}
        steps={tourSteps[module]}
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </>
  );
}
