"use client";

import { useSessionValidation } from "@/hooks/useSessionValidation";

export default function SessionMonitor() {
  // This hook handles all the session validation logic internally
  useSessionValidation({
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes
    onSessionTerminated: () => {
      // Custom handler for session termination
      console.log("Session terminated by SessionMonitor");
    },
  });

  return null;
}
