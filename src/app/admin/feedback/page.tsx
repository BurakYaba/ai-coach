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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            User Feedback
          </h1>
          <p className="text-orange-100 text-lg">
            Manage and respond to user feedback and suggestions.
          </p>
        </div>

        {/* Feedback Content */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30">
          <FeedbackTable />
        </div>
      </div>
    </div>
  );
}
