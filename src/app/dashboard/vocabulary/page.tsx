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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="border-2 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
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

  if (!vocabularyBank || vocabularyBank.words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <VocabularyTourManager />

          <div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            data-tour="vocabulary-header"
          >
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Vocabulary Dashboard
              </h1>
              <p className="text-gray-600">
                Build your vocabulary systematically with spaced repetition,
                contextual learning, and personalized word lists.
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
              data-tour="vocabulary-actions"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/vocabulary/flashcards")}
                className="flex items-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <FlipHorizontal className="h-4 w-4" />
                <span className="hidden min-[480px]:inline">Flashcards</span>
                <span className="min-[480px]:hidden">Cards</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <VocabularyTourTrigger />
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <VocabularyTourManager />

        <div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
          data-tour="vocabulary-header"
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Vocabulary Dashboard
            </h1>
            <p className="text-gray-600">
              Build your vocabulary systematically with spaced repetition,
              contextual learning, and personalized word lists.
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
            data-tour="vocabulary-actions"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/vocabulary/flashcards")}
              className="flex items-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <FlipHorizontal className="h-4 w-4" />
              <span className="hidden min-[480px]:inline">Flashcards</span>
              <span className="min-[480px]:hidden">Cards</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <VocabularyTourTrigger />
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-tour="vocabulary-stats"
        >
          <Card className="border-2 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalWords}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mastered Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.masteredWords} ({masteredPercentage}%)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Words to Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {wordsNeedingReview}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.averageMastery}%
                  </div>
                </div>
                <div className="w-full">
                  <Progress value={stats.averageMastery} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
              data-tour="vocabulary-tabs"
            >
              <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All ({vocabularyBank.words.length})
                </TabsTrigger>
                <TabsTrigger value="review" className="text-xs sm:text-sm">
                  Review ({wordsNeedingReview})
                </TabsTrigger>
                <TabsTrigger value="mastered" className="text-xs sm:text-sm">
                  Mastered ({stats.masteredWords})
                </TabsTrigger>
                <TabsTrigger value="learning" className="text-xs sm:text-sm">
                  Learning ({stats.learningWords})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={handleStartReview}
              disabled={wordsNeedingReview === 0}
              data-tour="start-review-btn"
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              Start Review
            </Button>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-tour="vocabulary-grid"
          >
            {currentWords.length > 0 ? (
              currentWords.map((word, index) => {
                // Get card styling based on mastery level (similar to reading cards)
                const getCardStyling = () => {
                  if (word.mastery >= 90) {
                    return "border-green-300 bg-green-50";
                  } else if (word.mastery >= 50) {
                    return "border-blue-300 bg-blue-50";
                  } else {
                    return "border-orange-300 bg-orange-50";
                  }
                };

                return (
                  <Card
                    key={word._id}
                    className={`border-2 hover:shadow-lg transition-all duration-300 group h-full flex flex-col ${getCardStyling()}`}
                    data-tour={index === 0 ? "word-card" : undefined}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-gray-800">
                          {word.word}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50"
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
                                    : "text-gray-400 hover:text-red-500"
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
                            variant="secondary"
                            className={`text-xs ${
                              word.mastery >= 90
                                ? "bg-green-100 text-green-700"
                                : word.mastery >= 50
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {word.mastery}%
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm text-gray-600">
                        {word.partOfSpeech}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <p className="text-sm text-gray-700 mb-3">
                        {word.definition}
                      </p>
                      {word.context && word.context.length > 0 && (
                        <p className="text-xs text-gray-500 italic mb-3">
                          &ldquo;{word.context[0]}&rdquo;
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {word.tags &&
                          word.tags
                            .filter(tag => tag !== "favorite")
                            .map((tag, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs bg-gray-50"
                              >
                                {tag}
                              </Badge>
                            ))}
                      </div>

                      {word.relationships && (
                        <div className="space-y-2 mb-3">
                          {word.relationships.synonyms &&
                            word.relationships.synonyms?.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-xs text-gray-500">
                                  Synonyms:
                                </span>
                                {word.relationships.synonyms
                                  .slice(0, 2)
                                  .map((synonym, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      {synonym}
                                    </Badge>
                                  ))}
                                {word.relationships.synonyms?.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +
                                    {(word.relationships.synonyms?.length ||
                                      0) - 2}{" "}
                                    more
                                  </Badge>
                                )}
                              </div>
                            )}
                          {word.relationships.antonyms &&
                            word.relationships.antonyms?.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-xs text-gray-500">
                                  Antonyms:
                                </span>
                                {word.relationships.antonyms
                                  .slice(0, 2)
                                  .map((antonym, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs bg-red-50 text-red-700 border-red-200"
                                    >
                                      {antonym}
                                    </Badge>
                                  ))}
                                {word.relationships.antonyms?.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +
                                    {(word.relationships.antonyms?.length ||
                                      0) - 2}{" "}
                                    more
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 px-3 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() =>
                            router.push(
                              `/dashboard/vocabulary/word/${word._id}`
                            )
                          }
                        >
                          <BookOpenCheck className="h-3 w-3 mr-1" />
                          Details
                          {word.relationships?.synonyms &&
                            word.relationships.synonyms.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {word.relationships.synonyms.length} relations
                              </Badge>
                            )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full flex h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <BookOpen className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    No words found for the selected filter.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("all")}
                    className="border-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    View All Words
                  </Button>
                </div>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination data-tour="vocabulary-pagination">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(prev => Math.max(prev - 1, 1))
                        }
                        className="cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className={`cursor-pointer ${
                            page === currentPage
                              ? "bg-blue-500 text-white"
                              : "hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(prev => Math.min(prev + 1, totalPages))
                        }
                        className="cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
