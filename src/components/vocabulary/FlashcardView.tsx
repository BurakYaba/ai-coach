"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Volume2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUpdateWordReview } from "@/hooks/use-vocabulary";
import type { VocabularyWord } from "@/hooks/use-vocabulary";
import { PerformanceRating } from "@/lib/spaced-repetition";

interface FlashcardViewProps {
  words: VocabularyWord[];
  onComplete?: () => void;
}

export default function FlashcardView({
  words,
  onComplete,
}: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [reviewedWords, setReviewedWords] = useState<string[]>([]);
  const updateWordReview = useUpdateWordReview();

  const currentWord = words[currentIndex];
  const progress = (reviewedWords.length / words.length) * 100;

  // Function to speak the word using text-to-speech
  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else if (reviewedWords.length === words.length && onComplete) {
      onComplete();
    }
  };

  // Handle rating the word
  const handleRateWord = (performance: PerformanceRating) => {
    if (!reviewedWords.includes(currentWord._id)) {
      updateWordReview.mutate({
        wordId: currentWord._id,
        performance,
      });

      setReviewedWords([...reviewedWords, currentWord._id]);
    }

    // Move to the next word
    handleNext();
  };

  // Check if all words have been reviewed
  useEffect(() => {
    if (reviewedWords.length === words.length && onComplete) {
      onComplete();
    }
  }, [reviewedWords, words.length, onComplete]);

  if (!currentWord) {
    return <div>No words to review</div>;
  }

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600 font-medium">
            {currentIndex + 1} of {words.length}
          </span>
          <span className="text-sm text-gray-600 font-medium">
            {reviewedWords.length} reviewed
          </span>
        </div>
        <Progress value={progress} className="h-3 bg-gray-200" />
      </div>

      <div className="w-full h-80 perspective-1000 mb-8">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction * 200,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction * -200,
            }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <div className="w-full h-full relative">
              <div
                className={`w-full h-full absolute backface-hidden transition-transform duration-500 ease-in-out ${
                  isFlipped
                    ? "rotate-y-180 opacity-0"
                    : "rotate-y-0 opacity-100"
                }`}
                onClick={handleFlip}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFlip();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Card className="w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <h2 className="text-4xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {currentWord.word}
                  </h2>
                  <Badge
                    variant="outline"
                    className="mb-6 text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {currentWord.partOfSpeech}
                  </Badge>
                  <p className="text-sm text-gray-500 text-center">
                    Tap to see definition
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 hover:bg-blue-50"
                    onClick={e => {
                      e.stopPropagation();
                      speakWord();
                    }}
                  >
                    <Volume2 className="h-5 w-5 text-blue-600" />
                  </Button>
                </Card>
              </div>

              <div
                className={`w-full h-full absolute backface-hidden transition-transform duration-500 ease-in-out ${
                  isFlipped
                    ? "rotate-y-0 opacity-100"
                    : "rotate-y-180 opacity-0"
                }`}
                onClick={handleFlip}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFlip();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Card className="w-full h-full flex flex-col p-8 cursor-pointer overflow-auto border-2 bg-white shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Definition
                  </h3>
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    {currentWord.definition}
                  </p>

                  {currentWord.examples && currentWord.examples.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Example
                      </h3>
                      <p className="text-sm italic mb-4 text-gray-600 bg-gray-50 p-3 rounded-lg border">
                        &ldquo;{currentWord.examples[0]}&rdquo;
                      </p>
                    </>
                  )}

                  {currentWord.context && currentWord.context.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Context
                      </h3>
                      <p className="text-sm italic mb-4 text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        &ldquo;{currentWord.context[0]}&rdquo;
                      </p>
                    </>
                  )}

                  {currentWord.tags && currentWord.tags.length > 0 && (
                    <div className="mt-auto">
                      <h3 className="text-sm font-medium mb-2 text-gray-700">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {currentWord.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between w-full max-w-md gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRateWord(PerformanceRating.DIFFICULT)}
            disabled={reviewedWords.includes(currentWord._id)}
            className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
          >
            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
            Hard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRateWord(PerformanceRating.EASY)}
            disabled={reviewedWords.includes(currentWord._id)}
            className="border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50"
          >
            <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
            Easy
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={
            currentIndex === words.length - 1 &&
            reviewedWords.length === words.length
          }
          className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
