"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshCw, AlertTriangle } from "lucide-react";

export function SubscriptionManagement() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateResult, setLastUpdateResult] = useState<{
    usersUpdated?: number;
    schoolsUpdated?: number;
    timestamp?: string;
  } | null>(null);

  const handleUpdateExpiredSubscriptions = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/admin/subscriptions/update-expired", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update expired subscriptions");
      }

      const result = await response.json();

      setLastUpdateResult({
        usersUpdated: result.usersUpdated,
        schoolsUpdated: result.schoolsUpdated,
        timestamp: new Date().toLocaleString(),
      });

      toast.success(
        `Expired subscriptions updated: ${result.usersUpdated} users, ${result.schoolsUpdated} schools`
      );
    } catch (error) {
      console.error("Error updating expired subscriptions:", error);
      toast.error("Failed to update expired subscriptions");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage and update subscription statuses across the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Update Expired Subscriptions</p>
              <p className="text-muted-foreground">
                This will scan all users and schools for expired subscriptions
                and update their status.
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpdateExpiredSubscriptions}
            disabled={isUpdating}
            className="w-full sm:w-auto mt-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Expired Subscriptions"
            )}
          </Button>

          {lastUpdateResult && (
            <div className="text-sm mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium">Last Update Results:</p>
              <p className="text-muted-foreground">
                {`${lastUpdateResult.usersUpdated} users and ${lastUpdateResult.schoolsUpdated} schools updated`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {`Timestamp: ${lastUpdateResult.timestamp}`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
