"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  contentType: z.enum(["monologue", "dialogue", "interview", "news"]),
  targetLength: z.enum(["short", "medium", "long"]),
});

// Create a wrapper component that uses useSearchParams
function CreateListeningForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Parse the preset parameter if available
  const presetParam = searchParams?.get("preset");
  let preset: any = null;

  if (presetParam) {
    try {
      preset = JSON.parse(decodeURIComponent(presetParam));
    } catch (e) {
      console.error("Failed to parse preset parameter:", e);
    }
  }

  // Default form values
  const defaultValues = {
    level: preset?.level || "B1",
    topic: preset?.topic || "",
    contentType: preset?.contentType || "dialogue",
    targetLength: (preset?.targetLength || "medium") as
      | "short"
      | "medium"
      | "long",
  };

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/listening/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // Try to get detailed error information
        const errorData = await response.json().catch(() => null);

        // Handle specific status codes
        if (response.status === 504) {
          throw new Error(
            "The request timed out. This might be due to high server load or the complexity of your request. Please try again with shorter content length."
          );
        }

        // Use server error message if available
        if (errorData && errorData.error) {
          throw new Error(errorData.error);
        }

        // Fallback error message
        throw new Error("Failed to generate listening session");
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description: "Your listening practice has been created.",
      });

      // Redirect to the new session
      router.push(`/listening/${data._id}`);
    } catch (error) {
      console.error("Error creating session:", error);

      // Determine if error is retryable
      const isTimeout =
        error instanceof Error &&
        (error.message.includes("timed out") ||
          error.message.includes("timeout"));

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create session",
        variant: "destructive",
        action: isTimeout ? (
          <Button
            variant="outline"
            onClick={() => {
              // Suggest simpler parameters for timeout errors
              form.setValue("targetLength", "short");
              toast({
                title: "Tip",
                description:
                  "Try with shorter content length for faster processing.",
              });
            }}
          >
            Try Shorter
          </Button>
        ) : undefined,
      });

      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="mb-6">
        <Link
          href="/listening"
          className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to listening dashboard
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">
          Create Listening Practice
        </h1>
        <p className="text-gray-500">
          Customize your listening exercise to match your level and interests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Settings</CardTitle>
          <CardDescription>
            Fill in the details below to generate personalized listening content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEFR Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Beginner</SelectItem>
                        <SelectItem value="A2">A2 - Elementary</SelectItem>
                        <SelectItem value="B1">B1 - Intermediate</SelectItem>
                        <SelectItem value="B2">
                          B2 - Upper Intermediate
                        </SelectItem>
                        <SelectItem value="C1">C1 - Advanced</SelectItem>
                        <SelectItem value="C2">C2 - Proficient</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the CEFR level appropriate for your current
                      proficiency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a topic (e.g., 'travel', 'technology', 'food')"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a topic you&apos;re interested in practicing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                        disabled={isLoading}
                      >
                        <ContentTypeOption
                          value="dialogue"
                          label="Dialogue"
                          description="Conversation between two or more people"
                          name={field.name}
                          checked={field.value === "dialogue"}
                        />
                        <ContentTypeOption
                          value="monologue"
                          label="Monologue"
                          description="Single speaker talking on a subject"
                          name={field.name}
                          checked={field.value === "monologue"}
                        />
                        <ContentTypeOption
                          value="interview"
                          label="Interview"
                          description="Questions and answers between interviewer and interviewee"
                          name={field.name}
                          checked={field.value === "interview"}
                        />
                        <ContentTypeOption
                          value="news"
                          label="News"
                          description="Formal news-style report or broadcast"
                          name={field.name}
                          checked={field.value === "news"}
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                        disabled={isLoading}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="short" id="short" />
                          <Label htmlFor="short">Short (1-2 min)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium (2-4 min)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="long" id="long" />
                          <Label htmlFor="long">Long (4-6 min)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Generating..." : "Create Practice"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading fallback for the Suspense boundary
function FormSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component that uses Suspense
export default function CreateListeningSessionPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateListeningForm />
    </Suspense>
  );
}

// Helper component for content type radio options
function ContentTypeOption({
  value,
  label,
  description,
  name,
  checked,
}: {
  value: string;
  label: string;
  description: string;
  name: string;
  checked: boolean;
}) {
  return (
    <Label
      htmlFor={`${name}-${value}`}
      className={`flex w-[calc(50%-0.5rem)] cursor-pointer flex-col rounded-lg border p-4 ${
        checked ? "border-primary bg-primary/5" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={value} id={`${name}-${value}`} />
        <span className="font-medium">{label}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </Label>
  );
}
