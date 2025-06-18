"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface DeviceInfo {
  browser: string;
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
}

interface SessionInfo {
  isValid: boolean;
  userId?: string;
  deviceInfo?: any;
  sessionHistory?: any[];
}

export default function SessionDebugPage() {
  const { data: session, status } = useSession();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [detectedBrowser, setDetectedBrowser] = useState<string>("Unknown");

  // Client-side browser detection
  const detectBrowser = (): string => {
    if (typeof window === "undefined") return "Unknown";

    const userAgent = navigator.userAgent.toLowerCase();

    // Brave-specific detection
    if ("brave" in navigator && (navigator as any).brave?.isBrave) {
      return "Brave (API detected)";
    }

    if ((navigator as any).brave !== undefined) {
      return "Brave (object detected)";
    }

    // Check for browser signatures
    if (userAgent.includes("edg/")) return "Edge";
    if (userAgent.includes("firefox")) return "Firefox";
    if (userAgent.includes("safari") && !userAgent.includes("chrome"))
      return "Safari";
    if (userAgent.includes("opera") || userAgent.includes("opr/"))
      return "Opera";
    if (userAgent.includes("chrome")) return "Chrome (or Chromium-based)";

    return "Unknown";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const browser = detectBrowser();
      setDetectedBrowser(browser);

      const deviceFingerprint: DeviceInfo = {
        browser,
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
      };

      setDeviceInfo(deviceFingerprint);

      // Store in sessionStorage
      sessionStorage.setItem("detectedBrowser", browser);
      sessionStorage.setItem(
        "deviceFingerprint",
        JSON.stringify(deviceFingerprint)
      );
    }
  }, []);

  const validateSession = async () => {
    if (!session?.user?.sessionToken) return;

    try {
      const response = await fetch("/api/session/validate?history=true", {
        headers: {
          "X-Device-Fingerprint": JSON.stringify(deviceInfo),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessionInfo(data);
      }
    } catch (error) {
      console.error("Session validation error:", error);
    }
  };

  useEffect(() => {
    if (session && deviceInfo) {
      validateSession();
    }
  }, [session, deviceInfo]);

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Session Debug - Not Logged In
        </h1>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Device Information:</h2>
          <pre className="text-sm">{JSON.stringify(deviceInfo, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Debug Information</h1>

      <div className="grid gap-6">
        {/* Browser Detection */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Browser Detection</h2>
          <div className="space-y-2">
            <p>
              <strong>Detected Browser:</strong> {detectedBrowser}
            </p>
            <p>
              <strong>Brave API Available:</strong>{" "}
              {"brave" in navigator ? "Yes" : "No"}
            </p>
            <p>
              <strong>Brave Object:</strong>{" "}
              {(navigator as any).brave !== undefined ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Session Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Session Information</h2>
          <div className="space-y-2">
            <p>
              <strong>User ID:</strong> {session.user.id}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Session Status:</strong>{" "}
              {sessionInfo?.isValid ? "Valid" : "Invalid"}
            </p>
          </div>
        </div>

        {/* Device Fingerprint */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Device Detection</h2>
          <div className="space-y-2">
            <p>
              <strong>Browser:</strong> {deviceInfo?.browser}
            </p>
            <p>
              <strong>Screen:</strong> {deviceInfo?.screen}
            </p>
            <p>
              <strong>Platform:</strong> {deviceInfo?.platform}
            </p>
            <p>
              <strong>Language:</strong> {deviceInfo?.language}
            </p>
          </div>
        </div>

        {/* Session History */}
        {sessionInfo?.sessionHistory && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">Session History</h2>
            <div className="space-y-2">
              {sessionInfo.sessionHistory.map((session: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <p>
                    <strong>Browser:</strong> {session.deviceInfo.browser}
                  </p>
                  <p>
                    <strong>OS:</strong> {session.deviceInfo.os}
                  </p>
                  <p>
                    <strong>IP:</strong> {session.deviceInfo.ip}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Active:</strong> {session.isActive ? "Yes" : "No"}
                  </p>
                  {session.terminationReason && (
                    <p>
                      <strong>Termination Reason:</strong>{" "}
                      {session.terminationReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={validateSession}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Session Info
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
