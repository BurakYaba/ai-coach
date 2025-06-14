import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { NewReadingSession } from "@/components/reading/NewReadingSession";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "New Reading Session - Fluenta",
  description: "Start a new reading session",
};

export default function NewReadingSessionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/reading"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reading dashboard
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Create New Reading Session
            </h1>
            <p className="text-gray-600 text-lg">
              Generate a personalized reading passage tailored to your level and
              interests.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <NewReadingSession />
        </div>
      </div>
    </div>
  );
}
