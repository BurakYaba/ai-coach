"use client";

import { useSessionValidation } from "@/hooks/useSessionValidation";
import { useEffect, useState } from "react";

// Client-side browser detection including Brave
function detectBrowserClient(): string {
  if (typeof window === "undefined") return "Unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  // Brave-specific detection using JavaScript APIs
  if ("brave" in navigator && (navigator as any).brave?.isBrave) {
    return "Brave";
  }

  // Check for Brave using feature detection
  if (
    navigator.userAgent.includes("Chrome") &&
    !navigator.userAgent.includes("Edge") &&
    !navigator.userAgent.includes("OPR")
  ) {
    // Additional Brave detection methods
    try {
      // Brave has specific APIs that Chrome doesn't
      if ((navigator as any).brave !== undefined) {
        return "Brave";
      }

      // Check for Brave's ad blocking behavior
      const testElement = document.createElement("div");
      testElement.innerHTML = "&nbsp;";
      testElement.className = "adsbox";
      document.body.appendChild(testElement);

      setTimeout(() => {
        const isBrave = testElement.offsetHeight === 0;
        document.body.removeChild(testElement);

        if (isBrave) {
          // Store Brave detection for session validation
          sessionStorage.setItem("detectedBrowser", "Brave");
        }
      }, 100);
    } catch (e) {
      // Ignore errors in detection
    }
  }

  // Fallback to user agent detection
  if (userAgent.includes("edg/")) return "Edge";
  if (userAgent.includes("firefox")) return "Firefox";
  if (userAgent.includes("safari") && !userAgent.includes("chrome"))
    return "Safari";
  if (userAgent.includes("opera") || userAgent.includes("opr/")) return "Opera";
  if (userAgent.includes("chrome")) return "Chrome";

  return "Unknown";
}

export default function SessionMonitor() {
  const { isValid, error, lastValidation } = useSessionValidation();
  const [detectedBrowser, setDetectedBrowser] = useState<string>("Unknown");

  useEffect(() => {
    // Detect browser on client side
    const browser = detectBrowserClient();
    setDetectedBrowser(browser);

    // Also store in sessionStorage for API calls
    sessionStorage.setItem("detectedBrowser", browser);

    // Enhanced device fingerprint
    const deviceFingerprint = {
      browser,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
    };

    sessionStorage.setItem(
      "deviceFingerprint",
      JSON.stringify(deviceFingerprint)
    );
  }, []);

  // Don't render anything if session is valid
  if (isValid) {
    return null;
  }

  // Show error if session is invalid
  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Session Terminated</p>
            <p className="text-sm">
              You have been logged out from another device.
            </p>
            <p className="text-xs mt-1">Browser: {detectedBrowser}</p>
          </div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="ml-2 bg-white text-red-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
