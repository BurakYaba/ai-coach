"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper component for vocabulary items
function VocabularyItem({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number;
  item: { word: string; definition: string; example?: string };
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Vocabulary Item {index + 1}</h4>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`vocab-word-${index}`}>Word</Label>
        <Input
          id={`vocab-word-${index}`}
          value={item.word}
          onChange={e => onChange(index, "word", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`vocab-def-${index}`}>Definition</Label>
        <Input
          id={`vocab-def-${index}`}
          value={item.definition}
          onChange={e => onChange(index, "definition", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`vocab-example-${index}`}>Example (Optional)</Label>
        <Input
          id={`vocab-example-${index}`}
          value={item.example || ""}
          onChange={e => onChange(index, "example", e.target.value)}
        />
      </div>
    </div>
  );
}

// Helper component for question items
function QuestionItem({
  index,
  question,
  onChange,
  onRemove,
}: {
  index: number;
  question: {
    text: string;
    options: string[];
    correctOption: number;
  };
  onChange: (
    index: number,
    field: string,
    value: string | string[] | number
  ) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Question {index + 1}</h4>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`question-text-${index}`}>Question</Label>
        <Textarea
          id={`question-text-${index}`}
          value={question.text}
          onChange={e => onChange(index, "text", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        {question.options.map((option, optIdx) => (
          <div key={optIdx} className="flex space-x-2 items-center">
            <Input
              value={option}
              onChange={e => {
                const newOptions = [...question.options];
                newOptions[optIdx] = e.target.value;
                onChange(index, "options", newOptions);
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                if (question.options.length > 2) {
                  const newOptions = question.options.filter(
                    (_, i) => i !== optIdx
                  );
                  onChange(index, "options", newOptions);
                  // Update correctOption if needed
                  if (optIdx === question.correctOption) {
                    onChange(index, "correctOption", 0);
                  } else if (optIdx < question.correctOption) {
                    onChange(
                      index,
                      "correctOption",
                      question.correctOption - 1
                    );
                  }
                }
              }}
              disabled={question.options.length <= 2}
            >
              Remove
            </Button>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`correct-option-${index}-${optIdx}`}
                name={`correct-option-${index}`}
                checked={question.correctOption === optIdx}
                onChange={() => onChange(index, "correctOption", optIdx)}
              />
              <Label htmlFor={`correct-option-${index}-${optIdx}`}>
                Correct
              </Label>
            </div>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const newOptions = [...question.options, ""];
            onChange(index, "options", newOptions);
          }}
        >
          Add Option
        </Button>
      </div>
    </div>
  );
}

export default function EditLibraryItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    level: "b1",
    contentType: "dialogue",
    isPublic: false,
    duration: 0,
    transcript: "",
    audioUrl: "",
    category: "",
    tags: "",
    vocabulary: [] as Array<{
      word: string;
      definition: string;
      example?: string;
    }>,
    questions: [] as Array<{
      text: string;
      options: string[];
      correctOption: number;
    }>,
    objectives: [] as string[],
  });

  useEffect(() => {
    const fetchLibraryItem = async () => {
      try {
        const response = await fetch(`/api/library/${itemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch library item");
        }
        const data = await response.json();

        // Transform the data for the form
        setFormData({
          title: data.title || "",
          topic: data.topic || "",
          level: data.level || "b1",
          contentType: data.contentType || "dialogue",
          isPublic: !!data.isPublic,
          duration: data.duration || 0,
          transcript: data.content?.transcript || "",
          audioUrl: data.content?.audioUrl || "",
          category: data.category || "",
          tags: data.tags ? data.tags.join(", ") : "",
          vocabulary: data.vocabulary || [],
          questions: data.questions || [],
          objectives: data.objectives || [],
        });
      } catch (error) {
        console.error("Error fetching library item:", error);
        toast({
          title: "Error",
          description: "Failed to load library item",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchLibraryItem();
    }
  }, [itemId]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVocabularyChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newVocabulary = [...formData.vocabulary];
    newVocabulary[index] = {
      ...newVocabulary[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      vocabulary: newVocabulary,
    }));
  };

  const addVocabularyItem = () => {
    setFormData(prev => ({
      ...prev,
      vocabulary: [
        ...prev.vocabulary,
        { word: "", definition: "", example: "" },
      ],
    }));
  };

  const removeVocabularyItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | string[] | number
  ) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const addQuestionItem = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          options: ["", ""],
          correctOption: 0,
        },
      ],
    }));
  };

  const removeQuestionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleObjectivesChange = (value: string) => {
    // Split text input by new lines into array of objectives
    const objectives = value
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    setFormData(prev => ({
      ...prev,
      objectives,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse tags into array
      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Format the data for API
      const { transcript, audioUrl, ...restFormData } = formData;
      const dataToSubmit = {
        ...restFormData,
        tags,
        content: {
          transcript,
          audioUrl,
        },
      };

      const response = await fetch(`/api/library/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to update library item");
      }

      toast({
        title: "Success",
        description: "Library item updated successfully",
      });

      // Navigate back to the library item detail page
      router.push(`/admin/library/${itemId}`);
    } catch (error) {
      console.error("Error updating library item:", error);
      toast({
        title: "Error",
        description: "Failed to update library item",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-4">
            <Link href={`/admin/library/${itemId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Item
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Library Item
          </h1>
        </div>
        <Button type="submit" form="edit-library-form" disabled={saving}>
          {saving ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <form
        id="edit-library-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Edit basic details about this library item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={e => handleInputChange("topic", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={value => handleInputChange("level", value)}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a1">A1 - Beginner</SelectItem>
                        <SelectItem value="a2">A2 - Elementary</SelectItem>
                        <SelectItem value="b1">B1 - Intermediate</SelectItem>
                        <SelectItem value="b2">
                          B2 - Upper Intermediate
                        </SelectItem>
                        <SelectItem value="c1">C1 - Advanced</SelectItem>
                        <SelectItem value="c2">C2 - Proficiency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select
                      value={formData.contentType}
                      onValueChange={value =>
                        handleInputChange("contentType", value)
                      }
                    >
                      <SelectTrigger id="contentType">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dialogue">Dialogue</SelectItem>
                        <SelectItem value="monologue">Monologue</SelectItem>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={e =>
                      handleInputChange("category", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">
                    Tags (Comma separated, e.g. "business, travel, food")
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={e => handleInputChange("tags", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={e =>
                      handleInputChange(
                        "duration",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">
                    Learning Objectives (one per line)
                  </Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives.join("\n")}
                    onChange={e => handleObjectivesChange(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is-public"
                    checked={formData.isPublic}
                    onCheckedChange={checked =>
                      handleInputChange("isPublic", checked)
                    }
                  />
                  <Label htmlFor="is-public">
                    Make this item public (visible to users)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Edit content of this library item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transcript">Transcript</Label>
                  <Textarea
                    id="transcript"
                    value={formData.transcript}
                    onChange={e =>
                      handleInputChange("transcript", e.target.value)
                    }
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audioUrl">Audio URL</Label>
                  <Input
                    id="audioUrl"
                    value={formData.audioUrl}
                    onChange={e =>
                      handleInputChange("audioUrl", e.target.value)
                    }
                    placeholder="https://example.com/audio.mp3"
                  />
                  {formData.audioUrl && (
                    <div className="mt-2">
                      <Label className="mb-2 block">Preview</Label>
                      <audio
                        src={formData.audioUrl}
                        controls
                        className="w-full"
                      >
                        <track kind="captions" />
                      </audio>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vocabulary</CardTitle>
                <CardDescription>
                  Edit vocabulary items for this content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.vocabulary.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No vocabulary items added yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.vocabulary.map((item, idx) => (
                      <VocabularyItem
                        key={idx}
                        index={idx}
                        item={item}
                        onChange={handleVocabularyChange}
                        onRemove={removeVocabularyItem}
                      />
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={addVocabularyItem}
                  className="w-full"
                >
                  Add Vocabulary Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Comprehension Questions</CardTitle>
                <CardDescription>
                  Edit questions to test understanding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.questions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No questions added yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.questions.map((question, idx) => (
                      <QuestionItem
                        key={idx}
                        index={idx}
                        question={question}
                        onChange={handleQuestionChange}
                        onRemove={removeQuestionItem}
                      />
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={addQuestionItem}
                  className="w-full"
                >
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
