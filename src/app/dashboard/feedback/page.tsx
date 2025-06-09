import { Suspense } from "react";

import { FeedbackHistory } from "@/components/feedback/FeedbackHistory";

export const metadata = {
  title: "My Feedback - Fluenta",
  description: "View your feedback history and admin responses",
};

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Feedback</h1>
        <p className="text-muted-foreground">
          View your submitted feedback and responses from our team.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <FeedbackHistory />
      </Suspense>
    </div>
  );
}
