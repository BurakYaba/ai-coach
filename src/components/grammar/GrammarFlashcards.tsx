"use client";

import { ChevronLeft, ChevronRight, Check, X, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface GrammarRule {
  _id: string;
  category: string;
  title: string;
  rule: string;
  example: {
    correct: string;
    incorrect: string;
  };
  ceferLevel: string;
  priority: number;
}

export function GrammarFlashcards() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<GrammarRule[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFlashcards();
      fetchSavedCards();
    }
  }, [session?.user?.id]);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/grammar/flashcards");
      if (!response.ok) {
        throw new Error("Failed to fetch grammar flashcards");
      }
      const data = await response.json();
      setFlashcards(data.flashcards || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to load grammar flashcards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCards = async () => {
    try {
      const response = await fetch("/api/grammar/flashcards/saved");
      if (!response.ok) {
        throw new Error("Failed to fetch saved flashcards");
      }
      const data = await response.json();
      setSavedCards(data.savedCardIds || []);
    } catch (error) {
      console.error("Error fetching saved flashcards:", error);
    }
  };

  const handleMarkAsKnown = async () => {
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentIndex];
    try {
      const response = await fetch("/api/grammar/flashcards/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: currentCard._id,
          known: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard status");
      }

      toast({
        title: "Marked as known",
        description: "This rule will appear less frequently in your reviews",
      });

      nextCard();
    } catch (error) {
      console.error("Error updating flashcard status:", error);
      toast({
        title: "Error",
        description: "Failed to update flashcard status",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsUnknown = async () => {
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentIndex];
    try {
      const response = await fetch("/api/grammar/flashcards/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: currentCard._id,
          known: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard status");
      }

      toast({
        title: "Marked for review",
        description: "This rule will appear more frequently in your reviews",
      });

      nextCard();
    } catch (error) {
      console.error("Error updating flashcard status:", error);
      toast({
        title: "Error",
        description: "Failed to update flashcard status",
        variant: "destructive",
      });
    }
  };

  const toggleSaveCard = async () => {
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentIndex];
    const isSaved = savedCards.includes(currentCard._id);

    try {
      const response = await fetch("/api/grammar/flashcards/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: currentCard._id,
          save: !isSaved,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update saved status");
      }

      if (isSaved) {
        setSavedCards(savedCards.filter(id => id !== currentCard._id));
        toast({
          title: "Removed from saved",
          description: "Flashcard removed from your saved collection",
        });
      } else {
        setSavedCards([...savedCards, currentCard._id]);
        toast({
          title: "Saved!",
          description: "Flashcard added to your saved collection",
        });
      }
    } catch (error) {
      console.error("Error updating saved status:", error);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      });
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // If at the end, shuffle and restart
      setCurrentIndex(0);
      setFlashcards([...flashcards].sort(() => Math.random() - 0.5));
      toast({
        title: "All cards reviewed",
        description: "Starting again with reshuffled cards",
      });
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </CardHeader>
        <CardContent className="min-h-[260px] flex items-center justify-center">
          <Skeleton className="h-40 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Grammar Flashcards</CardTitle>
          <CardDescription>
            No flashcards available. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            We couldn&apos;t find any grammar rules to create flashcards for
            you. Complete some writing or speaking exercises to generate grammar
            issues.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/writing")}
          >
            Try Writing Practice
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isSaved = savedCards.includes(currentCard._id);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Grammar Flashcards</CardTitle>
            <CardDescription>
              Review common grammar rules to improve your skills
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {currentCard.ceferLevel}
            </Badge>
            <Badge variant="outline">{currentCard.category}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="min-h-[260px] flex items-center justify-center p-6 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="w-full">
          {!isFlipped ? (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-medium">{currentCard.title}</h3>
              <div className="p-4 bg-muted/30 rounded-md">
                <p className="text-muted-foreground mb-2">
                  <span className="line-through">
                    {currentCard.example.incorrect}
                  </span>
                </p>
                <p className="font-medium">{currentCard.example.correct}</p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Click to see the rule
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-md">
                <h3 className="font-medium mb-2">Rule:</h3>
                <p>{currentCard.rule}</p>
              </div>
              <p className="text-sm text-muted-foreground italic text-center">
                Click to see the example
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextCard}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={toggleSaveCard}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleMarkAsUnknown}
          >
            <X className="h-4 w-4 mr-1" /> Need Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={handleMarkAsKnown}
          >
            <Check className="h-4 w-4 mr-1" /> Got It
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
