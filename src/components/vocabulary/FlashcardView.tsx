'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Volume2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUpdateWordReview } from '@/hooks/use-vocabulary';
import type { VocabularyWord } from '@/hooks/use-vocabulary';
import { PerformanceRating } from '@/lib/spaced-repetition';

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
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
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
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {words.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {reviewedWords.length} reviewed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="w-full h-64 perspective-1000 mb-6">
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
                    ? 'rotate-y-180 opacity-0'
                    : 'rotate-y-0 opacity-100'
                }`}
                onClick={handleFlip}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFlip();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Card className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer">
                  <h2 className="text-3xl font-bold mb-2">
                    {currentWord.word}
                  </h2>
                  <Badge variant="outline" className="mb-4">
                    {currentWord.partOfSpeech}
                  </Badge>
                  <p className="text-sm text-muted-foreground text-center">
                    Tap to see definition
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={e => {
                      e.stopPropagation();
                      speakWord();
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </Card>
              </div>

              <div
                className={`w-full h-full absolute backface-hidden transition-transform duration-500 ease-in-out ${
                  isFlipped
                    ? 'rotate-y-0 opacity-100'
                    : 'rotate-y-180 opacity-0'
                }`}
                onClick={handleFlip}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFlip();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Card className="w-full h-full flex flex-col p-6 cursor-pointer overflow-auto">
                  <h3 className="text-lg font-semibold mb-2">Definition</h3>
                  <p className="mb-4">{currentWord.definition}</p>

                  {currentWord.examples && currentWord.examples.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-2">Example</h3>
                      <p className="text-sm italic mb-4">
                        &ldquo;{currentWord.examples[0]}&rdquo;
                      </p>
                    </>
                  )}

                  <div className="mt-auto text-sm text-muted-foreground text-center">
                    Tap to see word
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={e => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center w-full">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => handleRateWord(PerformanceRating.DIFFICULT)}
            disabled={reviewedWords.includes(currentWord._id)}
          >
            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
            Difficult
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-green-200 hover:bg-green-50 hover:text-green-600"
            onClick={() => handleRateWord(PerformanceRating.EASY)}
            disabled={reviewedWords.includes(currentWord._id)}
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
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
