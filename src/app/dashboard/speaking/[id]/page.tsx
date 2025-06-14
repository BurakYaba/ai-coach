import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { SpeakingSessionDetails } from "@/components/speaking/SpeakingSessionDetails";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpeakingSession from "@/models/SpeakingSession";

interface SpeakingSessionPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Speaking Session | Fluenta",
  description: "Practice your speaking skills",
};

async function getSpeakingSession(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }

    await dbConnect();

    const speakingSession = await SpeakingSession.findOne({
      _id: id,
      user: session.user.id,
    });

    if (!speakingSession) {
      return null;
    }

    return JSON.parse(JSON.stringify(speakingSession));
  } catch (error) {
    console.error("Error fetching speaking session:", error);
    return null;
  }
}

export default async function SpeakingSessionPage({
  params,
}: SpeakingSessionPageProps) {
  const speakingSession = await getSpeakingSession(params.id);

  if (!speakingSession) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <SpeakingSessionDetails sessionId={params.id} />
      </div>
    </div>
  );
}
