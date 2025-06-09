"use client";

import { Suspense } from "react";

import { FeedbackTable } from "@/components/admin/FeedbackTable";
import { Skeleton } from "@/components/ui/skeleton";

function FeedbackTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function AdminFeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Feedback</h1>
        <p className="text-muted-foreground">
          Manage and respond to user feedback and suggestions.
        </p>
      </div>

      <FeedbackTable />
    </div>
  );
}
