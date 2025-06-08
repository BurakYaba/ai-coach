"use client";

import {
  AlertCircle,
  BookOpen,
  Check,
  Clock,
  Star,
  RefreshCw,
  Heart,
  FlipHorizontal,
  BookOpenCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useVocabularyBank,
  useToggleWordFavorite,
  type VocabularyWord,
} from "@/hooks/use-vocabulary";
import VocabularyTourManager from "@/components/tours/VocabularyTourManager";
import VocabularyTourTrigger from "@/components/tours/VocabularyTourTrigger";

export default function VocabularyDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  const [activeTab, setActiveTab] = useState("all");
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 8;

  const {
    data: vocabularyBank,
    isLoading,
    error,
    refetch,
  } = useVocabularyBank();

  const toggleFavoriteMutation = useToggleWordFavorite();

  const handleToggleFavorite = (wordId: string) => {
    toggleFavoriteMutation.mutate(wordId);
  };

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

    setCurrentPage(1);
  }, [activeTab, vocabularyBank]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredWords.length / wordsPerPage);
  }, [filteredWords, wordsPerPage]);

  const currentWords = useMemo(() => {
    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return filteredWords.slice(startIndex, endIndex);
  }, [filteredWords, currentPage, wordsPerPage]);

  const handleStartReview = () => {
    router.push("/dashboard/vocabulary/review");
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing data...",
      description: "Fetching your latest vocabulary data.",
    });

    refetch()
      .then(() => {
        toast({
          title: "Data refreshed",
          description: "Your vocabulary data is now up to date.",
        });
      })
      .catch(error => {
        toast({
          title: "Refresh failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to refresh data. Please try again.",
          variant: "destructive",
        });
      });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Vocabulary Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
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

  if (!vocabularyBank || vocabularyBank.words.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <VocabularyTourManager />

        <div
          className="flex justify-between items-center mb-6"
          data-tour="vocabulary-header"
        >
          <h1 className="text-3xl font-bold">Vocabulary Dashboard</h1>
          <div className="flex gap-2" data-tour="vocabulary-actions">
            <VocabularyTourTrigger />
          </div>
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

  const stats = vocabularyBank.stats || {
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    needsReviewWords: 0,
    averageMastery: 0,
    lastStudySession: new Date(),
    studyStreak: 0,
  };
  const masteredPercentage =
    stats.totalWords > 0
      ? Math.round((stats.masteredWords / stats.totalWords) * 100)
      : 0;

  const now = new Date();
  const wordsNeedingReview = vocabularyBank.words.filter(word => {
    const nextReview = new Date(word.nextReview);
    return nextReview <= now;
  }).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <VocabularyTourManager />

      <div
        className="flex justify-between items-center"
        data-tour="vocabulary-header"
      >
        <h1 className="text-3xl font-bold">Vocabulary Dashboard</h1>
        <div className="flex gap-2" data-tour="vocabulary-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/vocabulary/flashcards")}
            className="flex items-center gap-1"
          >
            <FlipHorizontal className="h-4 w-4" />
            Flashcards
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <VocabularyTourTrigger />
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-tour="vocabulary-stats"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{stats.totalWords}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Mastered Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">
                {stats.masteredWords} ({masteredPercentage}%)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Words to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              <div className="text-2xl font-bold">{wordsNeedingReview}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold">
                  {stats.averageMastery}%
                </div>
              </div>
              <div className="w-full mt-2">
                <Progress value={stats.averageMastery} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
            data-tour="vocabulary-tabs"
          >
            <TabsList>
              <TabsTrigger value="all">
                All Words ({vocabularyBank.words.length})
              </TabsTrigger>
              <TabsTrigger value="review">
                Need Review ({wordsNeedingReview})
              </TabsTrigger>
              <TabsTrigger value="mastered">
                Mastered ({stats.masteredWords})
              </TabsTrigger>
              <TabsTrigger value="learning">
                Learning ({stats.learningWords})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={handleStartReview}
            disabled={wordsNeedingReview === 0}
            data-tour="start-review-btn"
          >
            Start Review
          </Button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          data-tour="vocabulary-grid"
        >
          {currentWords.length > 0 ? (
            currentWords.map((word, index) => (
              <Card
                key={word._id}
                className="overflow-hidden h-full flex flex-col"
                data-tour={index === 0 ? "word-card" : undefined}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold">
                      {word.word}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(word._id)}
                        disabled={
                          toggleFavoriteMutation.isPending &&
                          toggleFavoriteMutation.variables === word._id
                        }
                      >
                        {toggleFavoriteMutation.isPending &&
                        toggleFavoriteMutation.variables === word._id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Heart
                            className={`h-4 w-4 ${
                              word.tags?.includes("favorite")
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        )}
                        <span className="sr-only">
                          {word.tags?.includes("favorite")
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </span>
                      </Button>
                      <Badge
                        variant={
                          word.mastery >= 90
                            ? "default"
                            : word.mastery >= 50
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {word.mastery}%
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    {word.partOfSpeech}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-grow">
                  <p className="text-sm mb-2">{word.definition}</p>
                  {word.context && word.context.length > 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{word.context[0]}&rdquo;
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {word.tags &&
                      word.tags
                        .filter(tag => tag !== "favorite")
                        .map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                  </div>

                  {word.relationships && (
                    <div className="mt-2 space-y-1">
                      {word.relationships.synonyms &&
                        word.relationships.synonyms?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-muted-foreground">
                              Synonyms:
                            </span>
                            {word.relationships.synonyms
                              .slice(0, 2)
                              .map((synonym, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {synonym}
                                </Badge>
                              ))}
                            {word.relationships.synonyms?.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +
                                {(word.relationships.synonyms?.length || 0) - 2}{" "}
                                more
                              </Badge>
                            )}
                          </div>
                        )}
                      {word.relationships.antonyms &&
                        word.relationships.antonyms?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-muted-foreground">
                              Antonyms:
                            </span>
                            {word.relationships.antonyms
                              .slice(0, 2)
                              .map((antonym, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {antonym}
                                </Badge>
                              ))}
                            {word.relationships.antonyms?.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +
                                {(word.relationships.antonyms?.length || 0) - 2}{" "}
                                more
                              </Badge>
                            )}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() =>
                        router.push(`/dashboard/vocabulary/word/${word._id}`)
                      }
                    >
                      <BookOpenCheck className="h-3 w-3 mr-1" />
                      Details
                      {word.relationships?.synonyms &&
                        word.relationships.synonyms.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {word.relationships.synonyms.length} relations
                          </Badge>
                        )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                No words found for the selected filter.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4" data-tour="vocabulary-pagination">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
