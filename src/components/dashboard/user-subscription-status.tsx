"use client";

import { format, differenceInDays } from "date-fns";
import { CalendarClock, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SubscriptionInfo {
  type: "free" | "monthly" | "annual";
  status: "active" | "expired" | "pending";
  startDate?: string;
  endDate?: string;
}

interface UserSubscriptionStatusProps {
  subscription: SubscriptionInfo;
  userName?: string;
}

export function UserSubscriptionStatus({
  subscription,
  userName,
}: UserSubscriptionStatusProps) {
  if (!subscription) {
    return null;
  }

  const { type, status, startDate, endDate } = subscription;
  const isActive = status === "active";
  const formattedStartDate = startDate
    ? format(new Date(startDate), "MMM d, yyyy")
    : "N/A";
  const formattedEndDate = endDate
    ? format(new Date(endDate), "MMM d, yyyy")
    : "N/A";

  // Calculate remaining days
  const remainingDays = endDate
    ? differenceInDays(new Date(endDate), new Date())
    : 0;
  const isExpiringSoon = remainingDays > 0 && remainingDays <= 3;
  const totalDays =
    startDate && endDate
      ? differenceInDays(new Date(endDate), new Date(startDate))
      : 0;
  const progress = totalDays > 0 ? 100 - (remainingDays / totalDays) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Subscription Status</CardTitle>
          <Badge
            variant={
              isActive
                ? isExpiringSoon
                  ? "outline"
                  : "default"
                : "destructive"
            }
            className="ml-2"
          >
            {isActive
              ? isExpiringSoon
                ? "Expiring Soon"
                : "Active"
              : "Expired"}
          </Badge>
        </div>
        <CardDescription>
          {userName
            ? `${userName}'s subscription details`
            : "Your subscription details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CalendarClock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Subscription Type</p>
                <p className="text-sm capitalize text-muted-foreground">
                  {type}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formattedStartDate} to {formattedEndDate}
                </p>
              </div>
            </div>
          </div>

          {isActive && endDate && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{remainingDays} days left</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {isExpiringSoon && isActive && (
            <Alert variant="default" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Expiring Soon</AlertTitle>
              <AlertDescription>
                Your {type} subscription expires in {remainingDays} days.
                Contact your branch administrator to renew.
              </AlertDescription>
            </Alert>
          )}

          {!isActive && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Expired</AlertTitle>
              <AlertDescription>
                Your {type} subscription has expired. Contact your branch
                administrator to renew.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
