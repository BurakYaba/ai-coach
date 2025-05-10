"use client";

import { differenceInDays } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";

interface SubscriptionInfo {
  type: "free" | "monthly" | "annual";
  status: "active" | "expired" | "pending";
  startDate?: string;
  endDate?: string;
}

interface SubscriptionBadgeProps {
  subscription: SubscriptionInfo;
}

export function SubscriptionBadge({ subscription }: SubscriptionBadgeProps) {
  if (!subscription) {
    return null;
  }

  const { type, status, startDate, endDate } = subscription;
  const isActive = status === "active";
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Badge
            variant={
              isActive
                ? isExpiringSoon
                  ? "outline"
                  : "default"
                : "destructive"
            }
            className="capitalize"
          >
            <CalendarClock className="h-3 w-3 mr-1" />
            {displayType}
          </Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4 border border-muted/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Subscription Status</h4>
            <Badge
              variant={
                isActive
                  ? isExpiringSoon
                    ? "outline"
                    : "default"
                  : "destructive"
              }
              className="text-xs"
            >
              {isActive
                ? isExpiringSoon
                  ? "Expiring Soon"
                  : "Active"
                : "Expired"}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground capitalize">
            <span className="font-medium text-foreground">Type:</span> {type}
          </div>

          {isActive && endDate && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Subscription Progress</span>
                <span>{remainingDays} days left</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {isExpiringSoon && isActive && (
            <div className="text-xs text-amber-500 mt-2">
              Your subscription expires in {remainingDays} days. Contact your
              administrator to renew.
            </div>
          )}

          {!isActive && (
            <div className="text-xs text-destructive mt-2">
              Your subscription has expired. Contact your administrator to
              renew.
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
