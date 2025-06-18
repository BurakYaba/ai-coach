"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UseSessionValidationOptions {
  checkInterval?: number; // in milliseconds
  onSessionTerminated?: () => void;
  disabled?: boolean;
}

export function useSessionValidation(
  options: UseSessionValidationOptions = {}
) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastValidationRef = useRef<number>(0);

  // State for tracking validation status
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<number>(0);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const {
    checkInterval = 30000, // 30 seconds
    onSessionTerminated,
    disabled = false,
  } = options;

  const validateSession = async (): Promise<boolean> => {
    if (!session?.user?.sessionToken || disabled) {
      setIsValid(true);
      setError(null);
      return true; // Skip validation if no session token or disabled
    }

    setIsValidating(true);

    try {
      // Include enhanced device fingerprint from client-side detection
      const deviceFingerprint =
        typeof window !== "undefined"
          ? sessionStorage.getItem("deviceFingerprint")
          : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (deviceFingerprint) {
        headers["X-Device-Fingerprint"] = deviceFingerprint;
      }

      const response = await fetch("/api/session/validate", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        setIsValid(false);
        setError(`Session validation failed: ${response.status}`);

        // If we get a 401, it means the session is invalid - trigger logout
        if (response.status === 401) {
          // Show notification to user
          toast({
            title: "Session Terminated",
            description:
              "Your session has been terminated. This may be due to a login from another device.",
            variant: "destructive",
            duration: 5000,
          });

          // Call custom handler if provided
          if (onSessionTerminated) {
            onSessionTerminated();
          }

          // Force logout
          await signOut({
            redirect: false,
            callbackUrl: "/login?error=session_terminated",
          });

          // Redirect to login
          router.push(
            "/login?error=session_terminated&message=Your session has been terminated due to a login from another device."
          );
        }

        setIsValidating(false);
        return false;
      }

      const data = await response.json();

      if (!data.isValid) {
        setIsValid(false);
        setError("Session terminated - logged in from another device");

        // Show notification to user
        toast({
          title: "Session Terminated",
          description:
            "Your session has been terminated. This may be due to a login from another device.",
          variant: "destructive",
          duration: 5000,
        });

        // Call custom handler if provided
        if (onSessionTerminated) {
          onSessionTerminated();
        }

        // Force logout
        await signOut({
          redirect: false,
          callbackUrl: "/login?error=session_terminated",
        });

        // Redirect to login
        router.push(
          "/login?error=session_terminated&message=Your session has been terminated due to a login from another device."
        );

        setIsValidating(false);
        return false;
      }

      setIsValid(true);
      setError(null);
      setLastValidation(Date.now());
      setIsValidating(false);
      return true;
    } catch (error) {
      console.error("Session validation error:", error);
      setError(`Network error: ${error}`);
      setIsValidating(false);
      // Don't log out on network errors, just log them
      return true;
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  // Set up periodic validation
  useEffect(() => {
    if (status !== "authenticated" || disabled) {
      cleanup();
      return;
    }

    // Initial validation after a short delay
    const initialDelay = setTimeout(() => {
      validateSession();
    }, 5000); // Wait 5 seconds after mount

    // Set up recurring validation
    intervalRef.current = setInterval(() => {
      const now = Date.now();

      // Throttle validation to prevent excessive calls
      if (now - lastValidationRef.current < checkInterval) {
        return;
      }

      lastValidationRef.current = now;
      validateSession();
    }, checkInterval);

    return () => {
      cleanup();
      clearTimeout(initialDelay);
    };
  }, [status, session, checkInterval, disabled]);

  // Listen for visibility changes to validate when tab becomes active
  useEffect(() => {
    if (disabled) return;

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        session?.user?.sessionToken
      ) {
        // Validate session when user returns to tab
        validateSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, disabled]);

  // Listen for storage events (for logout in other tabs)
  useEffect(() => {
    if (disabled) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "nextauth.message" && event.newValue) {
        try {
          const message = JSON.parse(event.newValue);
          if (message.event === "session" && message.data === null) {
            // Session was cleared in another tab
            toast({
              title: "Logged Out",
              description: "You have been logged out in another tab.",
              variant: "destructive",
            });
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [disabled, toast]);

  // Manual validation function
  const manualValidate = async (): Promise<boolean> => {
    return await validateSession();
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    validateSession: manualValidate,
    isValidating: isValidating,
    isValid: isValid,
    error: error,
    lastValidation: lastValidation,
  };
}

// Enhanced hook with logout handling
export function useSessionManager() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Call our custom logout API to terminate the session
      if (session?.user?.sessionToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
    }

    // Sign out with NextAuth
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  const handleForceLogoutAllDevices = async () => {
    try {
      const response = await fetch("/api/session/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "force_logout",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });

        // Sign out current session
        await signOut({
          redirect: true,
          callbackUrl: "/login",
        });
      } else {
        throw new Error("Failed to force logout");
      }
    } catch (error) {
      console.error("Error forcing logout:", error);
      toast({
        title: "Error",
        description: "Failed to log out from all devices",
        variant: "destructive",
      });
    }
  };

  return {
    logout: handleLogout,
    forceLogoutAllDevices: handleForceLogoutAllDevices,
  };
}
