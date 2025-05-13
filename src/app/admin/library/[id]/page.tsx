"use client";

import { ArrowLeft } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function LibraryItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const itemId = params?.id as string;

  useEffect(() => {
    const fetchLibraryItem = async () => {
      try {
        const response = await fetch(`/api/library/${itemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch library item");
        }
        const data = await response.json();
        setItem(data);
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

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center mb-6">
          <Button variant="outline" asChild className="mr-4">
            <Link href="/admin/library">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Item Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              The library item you requested could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-4">
            <Link href="/admin/library">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={item.isPublic ? "default" : "outline"}>
                {item.isPublic ? "Public" : "Draft"}
              </Badge>
              <Badge variant="outline">{item.level}</Badge>
              {item.contentType && (
                <Badge variant="secondary">{item.contentType}</Badge>
              )}
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/library/${item._id}/edit`}>Edit Item</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Audio transcript and learning materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.content?.audioUrl && (
                <div className="space-y-2">
                  <h3 className="font-medium">Audio</h3>
                  <audio
                    src={item.content.audioUrl}
                    controls
                    className="w-full"
                  >
                    <track kind="captions" src="" label="English captions" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {item.content?.transcript && (
                <div className="space-y-2">
                  <h3 className="font-medium">Transcript</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="whitespace-pre-wrap">
                      {item.content.transcript}
                    </div>
                  </div>
                </div>
              )}

              {item.vocabulary && item.vocabulary.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Vocabulary</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <ul className="list-disc pl-5 space-y-1">
                      {item.vocabulary.map((vocab: any, index: number) => (
                        <li key={index}>
                          <span className="font-semibold">{vocab.word}</span>
                          {vocab.definition && `: ${vocab.definition}`}
                          {vocab.example && (
                            <div className="text-muted-foreground italic text-sm">
                              Example: {vocab.example}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {item.questions && item.questions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Comprehension Questions</h3>
                  <div className="space-y-4">
                    {item.questions.map((question: any, index: number) => (
                      <div
                        key={index}
                        className="bg-muted p-4 rounded-md space-y-2"
                      >
                        <p className="font-medium">
                          {index + 1}. {question.text}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <ul className="list-disc pl-5">
                            {question.options.map(
                              (option: string, optIdx: number) => (
                                <li
                                  key={optIdx}
                                  className={
                                    optIdx === question.correctOption
                                      ? "text-green-600 font-medium"
                                      : ""
                                  }
                                >
                                  {option}{" "}
                                  {optIdx === question.correctOption &&
                                    "(Correct)"}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Topic</h3>
                <p>{item.topic}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Duration</h3>
                <p>{formatDuration(item.duration)}</p>
              </div>
              {item.category && (
                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <p>{item.category}</p>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {item.difficulty && (
                <div>
                  <h3 className="text-sm font-medium">Difficulty</h3>
                  <p>{item.difficulty}</p>
                </div>
              )}
              {item.objectives && (
                <div>
                  <h3 className="text-sm font-medium">Learning Objectives</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {item.objectives.map((objective: string, index: number) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p>{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              {item.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p>{new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">ID</h3>
                <p className="text-xs font-mono break-all">{item._id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
