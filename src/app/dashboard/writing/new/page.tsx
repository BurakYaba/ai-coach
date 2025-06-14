"use client";

import { ArrowLeft, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Type-specific topic lists
const topicsByType = {
  essay: [
    "Technology",
    "Science",
    "Environment",
    "Health",
    "Education",
    "Travel",
    "Food and Cuisine",
    "Arts and Culture",
    "Sports",
    "Business",
    "History",
    "Psychology",
    "Social Media",
    "Space Exploration",
    "Climate Change",
    "Literature",
    "Music",
    "Film and Television",
    "Fashion",
    "Politics",
    "Economics",
    "Philosophy",
    "Religion",
    "Architecture",
    "Transportation",
    "Agriculture",
    "Energy",
    "Wildlife",
    "Languages",
    "Artificial Intelligence",
  ],
  letter: [
    "Customer Service Complaint",
    "Job Application",
    "Event Invitation",
    "Request for Information",
    "Recommendation Request",
    "Thank You Message",
    "Community Issue",
    "Business Proposal",
    "Formal Apology",
    "School Application",
    "Housing Inquiry",
    "Travel Feedback",
    "Product Suggestion",
    "Health Services",
    "Subscription Cancellation",
  ],
  story: [
    "Adventure Journey",
    "Mystery Discovery",
    "Unexpected Friendship",
    "Cultural Encounter",
    "Personal Challenge",
    "Historical Event",
    "Fantasy World",
    "Family Secret",
    "Moral Dilemma",
    "First Experience",
    "Lost and Found",
    "Dream Sequence",
    "Coming of Age",
    "Animal Perspective",
    "Time Travel",
  ],
  argument: [
    "Environmental Policy",
    "Education Reform",
    "Technology Regulation",
    "Healthcare Access",
    "Economic Inequality",
    "Media Ethics",
    "Social Media Impact",
    "Immigration Policy",
    "Urban Development",
    "Cultural Preservation",
    "Food Safety",
    "Wildlife Conservation",
    "Digital Privacy",
    "Public Transportation",
    "Alternative Energy",
  ],
};

// Language levels with CEFR standards
const levels = [
  { value: "A1", label: "Beginner (A1)" },
  { value: "A2", label: "Elementary (A2)" },
  { value: "B1", label: "Intermediate (B1)" },
  { value: "B2", label: "Upper Intermediate (B2)" },
  { value: "C1", label: "Advanced (C1)" },
  { value: "C2", label: "Proficient (C2)" },
];

export default function NewWritingSessionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("essay");
  const [selectedLevel, setSelectedLevel] = useState<string>("B1");
  const [customTopic, setCustomTopic] = useState<string>(topicsByType.essay[0]);
  const [availableTopics, setAvailableTopics] = useState<string[]>(
    topicsByType.essay
  );
  const [creating, setCreating] = useState(false);

  // Update available topics when writing type changes
  useEffect(() => {
    // Get topics for the selected type, or use essay topics as fallback
    const topics =
      topicsByType[selectedType as keyof typeof topicsByType] ||
      topicsByType.essay;
    setAvailableTopics(topics);

    // Set first topic from the list as default
    setCustomTopic(topics[0]);
  }, [selectedType]);

  // Generate a new prompt and create a session
  const generatePromptAndCreateSession = async () => {
    if (!customTopic || customTopic.trim() === "") {
      toast({
        title: "Error",
        description: "Please select a topic",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      // Generate a new prompt
      const generateResponse = await fetch("/api/writing/prompts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          level: selectedLevel,
          topic: customTopic,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate prompt");
      }

      const generateData = await generateResponse.json();
      const generatedPrompt = generateData.prompt;

      // Ensure requirements is an array of strings
      let requirements = [];
      if (Array.isArray(generatedPrompt.requirements)) {
        requirements = generatedPrompt.requirements.filter(
          (req: any) => typeof req === "string"
        );
      } else if (
        generatedPrompt.requirements &&
        typeof generatedPrompt.requirements === "string"
      ) {
        requirements = [generatedPrompt.requirements];
      }

      // Prepare the prompt data
      const promptData = {
        text: generatedPrompt.text,
        type: generatedPrompt.type,
        topic: generatedPrompt.topic,
        targetLength: Math.floor(
          (generatedPrompt.suggestedLength.min +
            generatedPrompt.suggestedLength.max) /
            2
        ),
        requirements: requirements,
      };

      // Use the regular API endpoint
      const sessionResponse = await fetch("/api/writing/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptData,
        }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(`Failed to create session: ${errorData.error || ""}`);
      }

      const data = await sessionResponse.json();

      // Navigate to the new session
      router.push(`/dashboard/writing/${data.session._id}`);

      toast({
        title: "Success",
        description: "Writing session created successfully",
      });
    } catch (error: any) {
      console.error("Error creating writing session:", error);
      toast({
        title: "Error",
        description: `Failed to create writing session: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generatePromptAndCreateSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/writing")}
            className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              New Writing Session
            </h1>
            <p className="text-gray-600">
              Start a new writing practice session
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First card: Choose Writing Type and Level */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Choose Writing Type and Level
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select the type of writing you want to practice and your
                  current level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Writing Type
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger
                      id="type"
                      className="border-2 hover:border-blue-300 transition-colors"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="argument">Argument</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="level"
                    className="text-sm font-medium text-gray-700"
                  >
                    Difficulty Level
                  </Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger
                      id="level"
                      className="border-2 hover:border-blue-300 transition-colors"
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Second card: Choose Topic */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Choose a Topic
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select a topic for your {selectedType.toLowerCase()} writing
                  prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <Label
                    htmlFor="topic"
                    className="text-sm font-medium text-gray-700"
                  >
                    Topic
                  </Label>
                  <Select
                    value={customTopic}
                    onValueChange={(value: string) => setCustomTopic(value)}
                  >
                    <SelectTrigger
                      id="topic"
                      className="border-2 hover:border-blue-300 transition-colors"
                    >
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Our system will generate a {selectedType.toLowerCase()}{" "}
                    prompt based on your selected topic and level
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/dashboard/writing")}
                  className="border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || !customTopic}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  {creating ? "Creating..." : "Start Writing Session"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
