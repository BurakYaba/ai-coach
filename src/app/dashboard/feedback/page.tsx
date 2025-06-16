"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeedbackHistory } from "@/components/feedback/FeedbackHistory";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Feedback</h1>
              <p className="text-gray-600">
                View your submitted feedback and responses from our team
              </p>
            </div>
          </div>

          {/* Submit New Feedback Button */}
          <FeedbackForm
            trigger={
              <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            }
          />
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="text-gray-600">Loading your feedback...</p>
              </div>
            </div>
          }
        >
          <FeedbackHistory />
        </Suspense>
      </div>
    </div>
  );
}
