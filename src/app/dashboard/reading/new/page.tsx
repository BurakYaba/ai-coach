import { Metadata } from "next";

import { NewReadingSession } from "@/components/reading/NewReadingSession";

export const metadata: Metadata = {
  title: "New Reading Session - Fluenta",
  description: "Start a new reading session",
};

export default function NewReadingSessionPage() {
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Reading Session</h1>
        <p className="text-gray-600">
          Generate a personalized reading passage tailored to your level and
          interests.
        </p>
      </div>

      <NewReadingSession />
    </div>
  );
}
