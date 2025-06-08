"use client";

import { useState } from "react";
import { Settings, CreditCard, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ManageSubscriptionButtonProps {
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  children?: React.ReactNode;
  size?: "default" | "sm" | "lg";
}

export function ManageSubscriptionButton({
  className,
  variant = "outline",
  children,
  size = "default",
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/payments/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to access billing portal");
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error("Billing portal error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {children || (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </>
          )}
        </>
      )}
    </Button>
  );
}

// Alternative button variants for different contexts
export function BillingPortalButton({ className }: { className?: string }) {
  return (
    <ManageSubscriptionButton className={className} variant="ghost" size="sm">
      <FileText className="mr-2 h-3 w-3" />
      View Billing
    </ManageSubscriptionButton>
  );
}

export function CancelSubscriptionButton({
  className,
}: {
  className?: string;
}) {
  return (
    <ManageSubscriptionButton
      className={className}
      variant="destructive"
      size="sm"
    >
      <X className="mr-2 h-3 w-3" />
      Cancel Subscription
    </ManageSubscriptionButton>
  );
}

export function UpdatePaymentButton({ className }: { className?: string }) {
  return (
    <ManageSubscriptionButton className={className} variant="outline" size="sm">
      <CreditCard className="mr-2 h-3 w-3" />
      Update Payment
    </ManageSubscriptionButton>
  );
}
