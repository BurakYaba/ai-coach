'use client';

import { BookOpen, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VocabularyWord {
  word: string;
  definition: string;
  context: string;
  examples: string[];
  difficulty: number;
}

interface VocabularyPanelProps {
  vocabulary: VocabularyWord[];
  reviewedWords: string[];
  onWordReviewed?: (word: string) => void;
  sessionId?: string;
  addedToBank?: string[];
  onAddToBank?: (word: string) => void;
}

export function VocabularyPanel({
  vocabulary,
  reviewedWords,
  onWordReviewed,
  sessionId,
  addedToBank = [],
  onAddToBank,
}: VocabularyPanelProps) {
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'remaining'>('all');
  const [addedToBankLocal, setAddedToBankLocal] = useState<
    Record<string, boolean>
  >({});
  const [isAddingToBank, setIsAddingToBank] = useState<Record<string, boolean>>(
    {}
  );
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const prevOpenAccordionsRef = useRef<string[]>([]);

  // Initialize addedToBankLocal from addedToBank prop
  useEffect(() => {
    if (addedToBank.length > 0) {
      const initialState: Record<string, boolean> = {};
      addedToBank.forEach(word => {
        initialState[word] = true;
      });
      setAddedToBankLocal(initialState);
    }
  }, [addedToBank]);

  // Memoize filtered vocabulary to prevent unnecessary recalculations
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter(word => {
      if (filter === 'reviewed') return reviewedWords.includes(word.word);
      if (filter === 'remaining') return !reviewedWords.includes(word.word);
      return true;
    });
  }, [vocabulary, reviewedWords, filter]);

  // Memoize progress calculation
  const progress = useMemo(() => {
    return Math.round((reviewedWords.length / vocabulary.length) * 100);
  }, [reviewedWords.length, vocabulary.length]);

  // Memoize difficulty color function
  const getDifficultyColor = useCallback((difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800';
    if (difficulty <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }, []);

  // Filter handlers
  const setAllFilter = useCallback(() => setFilter('all'), []);
  const setReviewedFilter = useCallback(() => setFilter('reviewed'), []);
  const setRemainingFilter = useCallback(() => setFilter('remaining'), []);

  // Track accordion state changes and mark words as reviewed when opened
  useEffect(() => {
    // Find newly opened accordions
    const newlyOpened = openAccordions.filter(
      item => !prevOpenAccordionsRef.current.includes(item)
    );

    // Check for newly opened accordions and mark words as reviewed
    if (newlyOpened.length > 0) {
      newlyOpened.forEach(item => {
        const index = parseInt(item.replace('item-', ''));
        if (isNaN(index) || index < 0 || index >= filteredVocabulary.length)
          return;

        const word = filteredVocabulary[index];
        // Only mark as reviewed if not already reviewed
        if (word && !reviewedWords.includes(word.word) && onWordReviewed) {
          onWordReviewed(word.word);
        }
      });
    }

    // Update the ref with current open accordions
    prevOpenAccordionsRef.current = openAccordions;
  }, [openAccordions, filteredVocabulary, reviewedWords, onWordReviewed]);

  // Function to add word to vocabulary bank
  const addToVocabularyBank = useCallback(
    async (word: VocabularyWord) => {
      try {
        setIsAddingToBank(prev => ({ ...prev, [word.word]: true }));

        const response = await fetch('/api/vocabulary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word: {
              word: word.word,
              definition: word.definition,
              context: [word.context],
              examples: word.examples,
              difficulty: word.difficulty,
              partOfSpeech: 'other', // Default
              pronunciation: '', // Required field
              tags: [],
              source: {
                type: 'reading',
                id: sessionId || '000000000000000000000000', // Use a valid ObjectId format if no sessionId is provided
                title: sessionId ? 'Reading Session' : 'Manual Addition',
              },
            },
          }),
        });

        if (response.ok) {
          setAddedToBankLocal(prev => ({ ...prev, [word.word]: true }));
          // Notify parent component
          if (onAddToBank) {
            onAddToBank(word.word);
          }
          toast.success(`Added "${word.word}" to vocabulary bank`);
        } else {
          const data = await response.json();
          if (response.status === 409) {
            // Word already exists
            setAddedToBankLocal(prev => ({ ...prev, [word.word]: true }));
            // Notify parent component even for existing words
            if (onAddToBank && !addedToBank.includes(word.word)) {
              onAddToBank(word.word);
            }
            toast.info(`"${word.word}" already exists in your vocabulary bank`);
          } else {
            throw new Error(data.error || 'Failed to add to vocabulary bank');
          }
        }
      } catch (error) {
        console.error('Error adding to vocabulary bank:', error);
        toast.error(`Failed to add "${word.word}" to vocabulary bank`);
      } finally {
        setIsAddingToBank(prev => ({ ...prev, [word.word]: false }));
      }
    },
    [sessionId, onAddToBank, addedToBank]
  );

  // Modify the button rendering to check both local state and prop
  const isWordAddedToBank = useCallback(
    (word: string) => {
      return addedToBankLocal[word] || addedToBank.includes(word);
    },
    [addedToBankLocal, addedToBank]
  );

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Vocabulary</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/vocabulary">
              <BookOpen className="mr-2 h-4 w-4" />
              View Vocabulary Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm text-gray-600">
            {reviewedWords.length} of {vocabulary.length} words reviewed
          </span>
        </div>
        <div className="flex gap-2 mb-4">
          <Badge
            variant={filter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={setAllFilter}
          >
            All ({vocabulary.length})
          </Badge>
          <Badge
            variant={filter === 'reviewed' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={setReviewedFilter}
          >
            Reviewed ({reviewedWords.length})
          </Badge>
          <Badge
            variant={filter === 'remaining' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={setRemainingFilter}
          >
            Remaining ({vocabulary.length - reviewedWords.length})
          </Badge>
        </div>
      </div>

      <Accordion
        type="multiple"
        value={openAccordions}
        onValueChange={setOpenAccordions}
      >
        {filteredVocabulary.map((word, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4">
                <span className="font-semibold">{word.word}</span>
                <Badge
                  variant="secondary"
                  className={getDifficultyColor(word.difficulty)}
                >
                  Level {word.difficulty}
                </Badge>
                {reviewedWords.includes(word.word) && (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800"
                  >
                    Reviewed
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Definition
                  </h4>
                  <p>{word.definition}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Context</h4>
                  <p className="italic">&ldquo;{word.context}&rdquo;</p>
                </div>
                {word.examples.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">
                      Examples
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {word.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    size="sm"
                    disabled={
                      isWordAddedToBank(word.word) || isAddingToBank[word.word]
                    }
                    onClick={() => addToVocabularyBank(word)}
                    className="w-full"
                  >
                    {isAddingToBank[word.word] ? (
                      'Adding...'
                    ) : isWordAddedToBank(word.word) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Added to Bank
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Vocabulary Bank
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
