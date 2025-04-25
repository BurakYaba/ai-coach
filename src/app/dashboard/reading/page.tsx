import { AlertCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { ReadingProgressPage } from "@/components/reading/ReadingProgressPage";
import { ReadingSessionList } from "@/components/reading/ReadingSessionList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Reading Practice",
  description: "Improve your English reading skills with AI-powered content.",
};

// Add dynamic = 'force-dynamic' to ensure page is not statically cached
export const dynamic = "force-dynamic";

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: { page?: string; error?: string; success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Handle success and error messages from URL parameters
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Set error message based on URL parameter
  if (searchParams.error) {
    switch (searchParams.error) {
      case "invalid-id":
        errorMessage = "Invalid session ID. Please try again.";
        break;
      case "not-found":
        errorMessage = "Reading session not found.";
        break;
      case "delete-failed":
        errorMessage = "Failed to delete reading session. Please try again.";
        break;
      default:
        errorMessage = "An error occurred. Please try again.";
    }
  }

  // Set success message based on URL parameter
  if (searchParams.success === "deleted") {
    successMessage = "Reading session deleted successfully.";
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reading Practice
          </h1>
          <p className="text-muted-foreground">
            Improve your reading comprehension with AI-generated content
            tailored to your level.
          </p>
        </div>
        <Link href="/dashboard/reading/new">
          <Button size="lg">Start New Session</Button>
        </Link>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <ReadingSessionList />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ReadingProgressPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
