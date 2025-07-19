"use client";

import { differenceInDays } from "date-fns";
import { CreditCard, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { ManageSubscriptionButton } from "@/components/payments/manage-subscription-button";

interface SubscriptionInfo {
  type: "free" | "monthly" | "annual";
  status: "active" | "expired" | "pending";
  startDate?: string;
  endDate?: string;
}

interface SubscriptionBadgeProps {
  subscription: SubscriptionInfo;
  isIndividualUser?: boolean;
}

export function SubscriptionBadge({
  subscription,
  isIndividualUser,
}: SubscriptionBadgeProps) {
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

  // Determine status badge
  const getStatusBadge = () => {
    if (!isActive)
      return { text: "Expired", className: "bg-red-100 text-red-700" };
    if (isExpiringSoon)
      return {
        text: "Expiring Soon",
        className: "bg-orange-100 text-orange-700",
      };
    return { text: "Active", className: "bg-green-100 text-green-700" };
  };

  const statusBadge = getStatusBadge();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
          <Calendar className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-medium text-white">{displayType}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 border-0 shadow-xl">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Subscription Status
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}
            >
              {statusBadge.text}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-800">{displayType}</span>
              </div>
            </div>

            {isActive && endDate && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Subscription Progress</span>
                  <span className="font-medium text-gray-800">
                    {remainingDays} days left
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {isExpiringSoon && isActive && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-700">
                  Your subscription expires in {remainingDays} days.{" "}
                  {isIndividualUser
                    ? "Visit our pricing page to renew."
                    : "Contact your administrator to renew."}
                </p>
              </div>
            )}

            {!isActive && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-sm text-red-700">
                  Your subscription has expired.{" "}
                  {isIndividualUser
                    ? "Visit our pricing page to renew."
                    : "Contact your administrator to renew."}
                </p>
              </div>
            )}

            {type === "free" && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  You're currently on the free plan. Upgrade to unlock premium
                  features!
                </p>
              </div>
            )}

            {/* Show upgrade button for individual users */}
            {isIndividualUser && (
              <div className="space-y-2">
                <Link href="/pricing">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {!isActive || isExpiringSoon || type === "free"
                      ? "Renew Subscription"
                      : "Upgrade Plan"}
                  </Button>
                </Link>
                {isActive && type !== "free" && (
                  <ManageSubscriptionButton
                    className="w-full"
                    variant="outline"
                  >
                    Manage Billing
                  </ManageSubscriptionButton>
                )}
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
