"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  MapPin,
  Chrome,
  AlertTriangle,
  LogOut,
} from "lucide-react";

interface DeviceInfo {
  userAgent: string;
  ip: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  os: string;
  location?: {
    country?: string;
    city?: string;
  };
}

interface SessionData {
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  terminationReason?: string;
  terminatedAt?: string;
}

export default function SessionManager() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isForceLoggingOut, setIsForceLoggingOut] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchSessionData();
    }
  }, [session]);

  const fetchSessionData = async () => {
    try {
      setIsLoading(true);

      // Fetch current active session
      const currentResponse = await fetch(
        "/api/session/validate?action=current"
      );
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        setActiveSession(currentData.activeSession);
      }

      // Fetch session history
      const historyResponse = await fetch(
        "/api/session/validate?action=history&limit=5"
      );
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setSessionHistory(historyData.sessionHistory || []);
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
      toast({
        title: "Error",
        description: "Failed to load session information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async () => {
    try {
      setIsForceLoggingOut(true);

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

        // Refresh session data
        await fetchSessionData();
      } else {
        throw new Error("Failed to force logout");
      }
    } catch (error) {
      console.error("Error forcing logout:", error);
      toast({
        title: "Error",
        description: "Failed to log out from other devices",
        variant: "destructive",
      });
    } finally {
      setIsForceLoggingOut(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getTerminationReasonBadge = (reason?: string) => {
    switch (reason) {
      case "logout":
        return <Badge variant="secondary">Logged Out</Badge>;
      case "concurrent_login":
        return (
          <Badge variant="destructive">Terminated (Concurrent Login)</Badge>
        );
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      case "forced":
        return <Badge variant="destructive">Force Logged Out</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Loading session information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Active Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Current Session
          </CardTitle>
          <CardDescription>
            Information about your current active session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(activeSession.deviceInfo.deviceType)}
                  <div>
                    <div className="font-medium">
                      {activeSession.deviceInfo.browser} on{" "}
                      {activeSession.deviceInfo.os}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeSession.deviceInfo.deviceType} •{" "}
                      {activeSession.deviceInfo.ip}
                    </div>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Started: {formatDate(activeSession.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span>
                    Last active: {getTimeSince(activeSession.lastActivity)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Security Notice:</strong> This is your current active
                  session. Only one session is allowed per account for maximum
                  security. If you log in from another device, this session will
                  be automatically terminated.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
              <p className="text-gray-600">
                No active session found. Please refresh the page or log in
                again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Your recent login history and terminated sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionHistory.length > 0 ? (
            <div className="space-y-4">
              {sessionHistory.map((session, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.deviceInfo.deviceType)}
                      <div>
                        <div className="font-medium">
                          {session.deviceInfo.browser} on{" "}
                          {session.deviceInfo.os}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.deviceInfo.deviceType} •{" "}
                          {session.deviceInfo.ip}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {session.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        getTerminationReasonBadge(session.terminationReason)
                      )}
                    </div>
                  </div>
                  {index < sessionHistory.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Session History</h3>
              <p className="text-gray-600">No previous sessions found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Security Actions
          </CardTitle>
          <CardDescription>
            Actions to protect your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">
                Suspicious Activity?
              </h4>
              <p className="text-sm text-red-700 mb-3">
                If you notice any unauthorized access or suspicious activity,
                immediately log out from all devices and change your password.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isForceLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isForceLoggingOut
                      ? "Logging out..."
                      : "Log Out All Devices"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log Out All Devices</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will terminate all active sessions and log you out
                      from all devices. You will need to log in again on all
                      devices.
                      <br />
                      <br />
                      Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleForceLogout}>
                      Yes, Log Out All Devices
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Security Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Only use trusted devices for logging in</li>
                <li>• Always log out when using shared computers</li>
                <li>• Report any suspicious activity immediately</li>
                <li>• Keep your login credentials secure</li>
                <li>• Use strong, unique passwords</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
