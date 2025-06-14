import { Metadata } from "next";
import { ReadingSession } from "@/components/reading/ReadingSession";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReadingSessionModel from "@/models/ReadingSession";

interface ReadingSessionPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ReadingSessionPageProps): Promise<Metadata> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {
        title: "Reading Session - Fluenta",
        description: "Continue your reading practice",
      };
    }

    await dbConnect();
    const readingSession = await ReadingSessionModel.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return {
        title: "Reading Session Not Found - Fluenta",
        description: "The reading session you're looking for doesn't exist",
      };
    }

    return {
      title: `${readingSession.title} - Fluenta`,
      description: `Continue reading: ${readingSession.title}`,
    };
  } catch (error) {
    return {
      title: "Reading Session - Fluenta",
      description: "Continue your reading practice",
    };
  }
}

async function getReadingSession(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }

    await dbConnect();

    const readingSession = await ReadingSessionModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!readingSession) {
      return null;
    }

    return JSON.parse(JSON.stringify(readingSession));
  } catch (error) {
    console.error("Error fetching reading session:", error);
    return null;
  }
}

export default async function ReadingSessionPage({
  params,
}: ReadingSessionPageProps) {
  const readingSession = await getReadingSession(params.id);

  if (!readingSession) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <ReadingSession sessionId={params.id} />
      </div>
    </div>
  );
}
