import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

import { NewReadingSession } from "@/components/reading/NewReadingSession";

export const metadata: Metadata = {
  title: "New Reading Session - Fluenta",
  description: "Start a new reading session",
};

export default function NewReadingSessionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-start py-6 sm:py-8">
      <div className="w-full max-w-4xl px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link
            href="/dashboard/reading"
            className="inline-flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reading dashboard
          </Link>

          {/* Gradient accent card */}
          <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-2">
            <div className="absolute right-2 top-2 sm:right-4 sm:top-4 opacity-20 text-white text-5xl sm:text-7xl pointer-events-none select-none">
              <BookOpen className="w-12 h-12 sm:w-20 sm:h-20" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 z-10 relative">
              Create New Reading Session
            </h1>
            <p className="text-base sm:text-lg text-blue-100 z-10 relative">
              Generate a personalized reading passage tailored to your level and
              interests.
            </p>
          </div>
        </div>

        {/* Form with gradient border */}
        <div className="gradient-border rounded-2xl shadow-lg bg-white/90 dark:bg-gray-900/90 p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <NewReadingSession />
          </div>
        </div>
      </div>
    </div>
  );
}
