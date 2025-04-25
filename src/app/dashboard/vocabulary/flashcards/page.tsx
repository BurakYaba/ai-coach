"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashcardView from "@/components/vocabulary/FlashcardView";
import { useVocabularyBank, type VocabularyWord } from "@/hooks/use-vocabulary";

export default function VocabularyFlashcardsPage() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  const [activeTab, setActiveTab] = useState("all");
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const { data: vocabularyBank, isLoading, error } = useVocabularyBank();

  // Filter words based on active tab
  useEffect(() => {
    if (!vocabularyBank) return;

    const now = new Date();

    switch (activeTab) {
      case "review":
        setFilteredWords(
          vocabularyBank.words.filter(word => {
            const nextReview = new Date(word.nextReview);
            return nextReview <= now;
          })
        );
        break;
      case "mastered":
        setFilteredWords(
          vocabularyBank.words.filter(word => word.mastery >= 90)
        );
        break;
      case "learning":
        setFilteredWords(
          vocabularyBank.words.filter(
            word => word.mastery > 0 && word.mastery < 90
          )
        );
        break;
      case "all":
      default:
        setFilteredWords([...vocabularyBank.words]);
        break;
    }
  }, [activeTab, vocabularyBank]);

  const handleBackToDashboard = () => {
    router.push("/dashboard/vocabulary");
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleStartOver = () => {
    setIsComplete(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vocabulary Flashcards</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load vocabulary data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty state
  if (!vocabularyBank || vocabularyBank.words.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Vocabulary Flashcards</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No vocabulary words yet</CardTitle>
            <CardDescription>
              Start adding words from your reading sessions to build your
              vocabulary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/reading")}>
              Go to Reading Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackToDashboard}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Vocabulary Flashcards</h1>
      </div>

      {isComplete ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Review Complete!</CardTitle>
            <CardDescription>
              You&apos;ve reviewed {filteredWords.length} words.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>
              Great job! Continue practicing regularly to improve your
              vocabulary mastery.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button onClick={handleStartOver}>Start Over</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All Words ({vocabularyBank.words.length})
              </TabsTrigger>
              <TabsTrigger value="review">
                Need Review (
                {
                  vocabularyBank.words.filter(word => {
                    const nextReview = new Date(word.nextReview);
                    return nextReview <= new Date();
                  }).length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="mastered">
                Mastered (
                {vocabularyBank.words.filter(word => word.mastery >= 90).length}
                )
              </TabsTrigger>
              <TabsTrigger value="learning">
                Learning (
                {
                  vocabularyBank.words.filter(
                    word => word.mastery > 0 && word.mastery < 90
                  ).length
                }
                )
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredWords.length > 0 ? (
            <FlashcardView words={filteredWords} onComplete={handleComplete} />
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No Words Found</CardTitle>
                <CardDescription>
                  There are no words in the selected category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab("all")}>
                  View All Words
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
