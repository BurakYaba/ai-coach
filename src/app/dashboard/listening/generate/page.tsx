"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Form schema with validation
const formSchema = z.object({
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  contentType: z.enum(["monologue", "dialogue", "interview", "news"]),
  targetLength: z.enum(["short", "medium", "long"]).default("medium"),
});

export default function GenerateListeningPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "B1",
      topic: "",
      contentType: "dialogue",
      targetLength: "medium" as "short" | "medium" | "long",
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);

    try {
      // Call the API to generate listening content
      const response = await fetch("/api/listening/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage =
          responseData.error || "Failed to generate listening content";

        // Add details if available
        if (responseData.details) {
          console.error("Error details:", responseData.details);
          // Check if it's a model validation error
          if (responseData.modelError) {
            errorMessage = `Schema validation error: ${responseData.details}`;
          }
        }

        throw new Error(errorMessage);
      }

      // Get the generated session
      const session = responseData;

      toast({
        title: "Success!",
        description: "Your listening content has been generated.",
      });

      // Redirect to the new session
      router.push(`/dashboard/listening/${session._id}`);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate listening content",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/dashboard/listening" className="mr-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">Generate Listening Practice</h1>
        <p className="text-muted-foreground">
          Create a new listening session with AI-generated content tailored to
          your needs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* CEFR Level */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEFR Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
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
                      Choose the appropriate level for your current English
                      proficiency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Topic */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Travel, Food, Technology, Climate Change..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a topic you're interested in learning about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Type */}
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <SelectItem value="dialogue">Dialogue</SelectItem>
                        <SelectItem value="monologue">Monologue</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="news">News Report</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the format of the listening content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Length */}
              <FormField
                control={form.control}
                name="targetLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Length</FormLabel>
                    <div className="flex flex-col space-y-3">
                      <div
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-3",
                          field.value === "short" &&
                            "border-primary bg-primary/10"
                        )}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === "short"}
                            value="short"
                            onChange={e => field.onChange(e.target.value)}
                            className="h-4 w-4 text-primary"
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <div className="font-medium">Short</div>
                          <div className="text-xs text-muted-foreground">
                            1-2 minutes (ideal for beginners)
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-3",
                          field.value === "medium" &&
                            "border-primary bg-primary/10"
                        )}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === "medium"}
                            value="medium"
                            onChange={e => field.onChange(e.target.value)}
                            className="h-4 w-4 text-primary"
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <div className="font-medium">Medium</div>
                          <div className="text-xs text-muted-foreground">
                            3-4 minutes (most common)
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-3",
                          field.value === "long" &&
                            "border-primary bg-primary/10"
                        )}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === "long"}
                            value="long"
                            onChange={e => field.onChange(e.target.value)}
                            className="h-4 w-4 text-primary"
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <div className="font-medium">Long</div>
                          <div className="text-xs text-muted-foreground">
                            5-6 minutes (more challenging)
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full md:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tips for Best Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Choose Specific Topics</h3>
              <p className="text-sm text-muted-foreground">
                Instead of "food", try "traditional Italian cuisine" or "street
                food in Asia"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Match Level to Ability</h3>
              <p className="text-sm text-muted-foreground">
                If you find content too difficult, try a lower level next time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Content Type Matters</h3>
              <p className="text-sm text-muted-foreground">
                Dialogues are great for conversation practice, while news helps
                with formal language
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Regular Practice</h3>
              <p className="text-sm text-muted-foreground">
                15-20 minutes of daily listening practice yields the best
                results over time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
