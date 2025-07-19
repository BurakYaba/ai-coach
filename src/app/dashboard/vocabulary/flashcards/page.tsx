"use client";

import { AlertCircle, ArrowLeft, BookOpen } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashcardView from "@/components/vocabulary/FlashcardView";
import { useVocabularyBank, type VocabularyWord } from "@/hooks/use-vocabulary";

export default function VocabularyFlashcardsPage() {
  const router = useRouter();
  useSession({
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-center">
            <Skeleton className="h-64 w-full max-w-md" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Flashcards
            </h1>
          </div>
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load vocabulary data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!vocabularyBank || vocabularyBank.words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Vocabulary Flashcards
            </h1>
          </div>
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No vocabulary words yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                Start adding words from your reading sessions to build your
                vocabulary.
              </p>
              <Button
                onClick={() => router.push("/dashboard/reading")}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Go to Reading Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToDashboard}
            className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Vocabulary Flashcards
          </h1>
        </div>

        {isComplete ? (
          <div className="flex justify-center">
            <Card className="max-w-md w-full border-2 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-800">
                  Review Complete!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  You&apos;ve reviewed {filteredWords.length} words.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-700">
                  Great job! Continue practicing regularly to improve your
                  vocabulary mastery.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBackToDashboard}
                    className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={handleStartOver}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full max-w-2xl"
              >
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All ({vocabularyBank.words.length})
                  </TabsTrigger>
                  <TabsTrigger value="review" className="text-xs sm:text-sm">
                    Review (
                    {
                      vocabularyBank.words.filter(word => {
                        const nextReview = new Date(word.nextReview);
                        return nextReview <= new Date();
                      }).length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="mastered" className="text-xs sm:text-sm">
                    Mastered (
                    {
                      vocabularyBank.words.filter(word => word.mastery >= 90)
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="learning" className="text-xs sm:text-sm">
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
            </div>

            {filteredWords.length > 0 ? (
              <FlashcardView
                words={filteredWords}
                onComplete={handleComplete}
              />
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <BookOpen className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Words Found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    There are no words in the selected category.
                  </p>
                  <Button
                    onClick={() => setActiveTab("all")}
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    View All Words
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
