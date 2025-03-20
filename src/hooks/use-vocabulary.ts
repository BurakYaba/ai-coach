'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';
import {
  PerformanceRating,
  calculateNewMastery,
  calculateNextReview,
} from '@/lib/spaced-repetition';

// Types
interface VocabularyWord {
  _id: string;
  word: string;
  definition: string;
  context: string[];
  examples: string[];
  pronunciation: string;
  partOfSpeech: string;
  difficulty: number;
  mastery: number;
  lastReviewed: Date;
  nextReview: Date;
  reviewHistory: Array<{
    date: Date;
    performance: number;
    context: string;
  }>;
  tags: string[];
  source: {
    type: string;
    id: string;
    title: string;
  };
  easinessFactor?: number;
  repetitions?: number;
  interval?: number;
  // New fields for word relationships
  relationships?: {
    synonyms?: string[];
    antonyms?: string[];
    related?: string[];
    forms?: {
      plural?: string;
      past?: string;
      presentParticiple?: string;
      pastParticiple?: string;
    };
  };
  notes?: string; // User's personal notes about the word
  usageExamples?: string[]; // Additional examples from the user
  learningStatus?: 'new' | 'learning' | 'reviewing' | 'mastered'; // Explicit learning status
}

interface VocabularyStats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  needsReviewWords: number;
  averageMastery: number;
  lastStudySession: Date;
  studyStreak: number;
}

interface VocabularyBank {
  _id: string;
  userId: string;
  words: VocabularyWord[];
  stats: VocabularyStats;
  settings: {
    dailyWordGoal: number;
    reviewFrequency: 'daily' | 'spaced' | 'custom';
    customReviewIntervals?: number[];
    notificationsEnabled: boolean;
  };
}

// Query keys
const VOCABULARY_KEYS = {
  all: ['vocabulary'] as const,
  bank: () => [...VOCABULARY_KEYS.all, 'bank'] as const,
  review: () => [...VOCABULARY_KEYS.all, 'review'] as const,
  word: (id: string) => [...VOCABULARY_KEYS.all, 'word', id] as const,
};

// API functions
async function fetchVocabularyBank(): Promise<VocabularyBank> {
  const response = await fetch('/api/vocabulary');
  if (!response.ok) {
    throw new Error('Failed to fetch vocabulary bank');
  }
  return response.json();
}

async function fetchWordsForReview(): Promise<VocabularyWord[]> {
  const response = await fetch('/api/vocabulary?needsReview=true');
  if (!response.ok) {
    throw new Error('Failed to fetch words for review');
  }
  const data = await response.json();
  return data.words || [];
}

async function updateWordReview(
  wordId: string,
  performance: PerformanceRating
): Promise<VocabularyWord> {
  // Create a review entry
  const reviewEntry = {
    date: new Date().toISOString(),
    performance: Number(performance),
    context: 'Spaced repetition review',
  };

  const response = await fetch(`/api/vocabulary/word/${wordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      performance: Number(performance),
      lastReviewed: new Date().toISOString(),
      reviewHistory: [reviewEntry],
    }),
  });

  if (!response.ok) {
    // Try to get more detailed error information
    let errorMessage = 'Failed to update word review';
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If we can't parse the error response, use the status text
      errorMessage = `Failed to update word review: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Add a new function to toggle word favorite status
async function toggleWordFavorite(wordId: string): Promise<VocabularyWord> {
  const response = await fetch(`/api/vocabulary/word/${wordId}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update favorite status';
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorMessage = `Failed to update favorite status: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Define a type for word relationships
interface WordRelationships {
  synonyms: string[];
  antonyms: string[];
  related: string[];
  forms: {
    plural?: string;
    past?: string;
    presentParticiple?: string;
    pastParticiple?: string;
  };
}

// Function to fetch word relationships from external API
async function fetchWordRelationships(
  word: string
): Promise<WordRelationships> {
  try {
    // First try our internal API
    const response = await fetch(
      `/api/vocabulary/word-relationships?word=${encodeURIComponent(word)}`
    );

    if (response.ok) {
      return response.json();
    }

    // Fallback to external API if our API fails
    // This is a placeholder - you would replace with your actual API
    const externalResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    if (!externalResponse.ok) {
      throw new Error('Failed to fetch word relationships');
    }

    const data = await externalResponse.json();

    // Transform the external API response to our format
    const relationships: WordRelationships = {
      synonyms: [],
      antonyms: [],
      related: [],
      forms: {},
    };

    // Extract synonyms and antonyms from the response
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((entry: any) => {
        if (entry.meanings && Array.isArray(entry.meanings)) {
          entry.meanings.forEach((meaning: any) => {
            // Get synonyms
            if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
              relationships.synonyms = [
                ...relationships.synonyms,
                ...meaning.synonyms,
              ];
            }

            // Get antonyms
            if (meaning.antonyms && Array.isArray(meaning.antonyms)) {
              relationships.antonyms = [
                ...relationships.antonyms,
                ...meaning.antonyms,
              ];
            }

            // Get definitions with examples
            if (meaning.definitions && Array.isArray(meaning.definitions)) {
              meaning.definitions.forEach((def: any) => {
                if (def.example) {
                  relationships.related.push(def.example);
                }
              });
            }
          });
        }
      });
    }

    // Remove duplicates
    relationships.synonyms = Array.from(new Set(relationships.synonyms));
    relationships.antonyms = Array.from(new Set(relationships.antonyms));
    relationships.related = Array.from(new Set(relationships.related));

    return relationships;
  } catch (error) {
    console.error('Error fetching word relationships:', error);
    // Return empty relationships object on error
    return {
      synonyms: [],
      antonyms: [],
      related: [],
      forms: {},
    };
  }
}

// Function to update word with relationships
async function updateWordRelationships(
  wordId: string,
  relationships: WordRelationships
): Promise<VocabularyWord> {
  const response = await fetch(`/api/vocabulary/word/${wordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      relationships,
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update word relationships';
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorMessage = `Failed to update word relationships: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Custom hooks
export function useVocabularyBank() {
  return useQuery({
    queryKey: VOCABULARY_KEYS.bank(),
    queryFn: fetchVocabularyBank,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWordsForReview() {
  return useQuery({
    queryKey: VOCABULARY_KEYS.review(),
    queryFn: fetchWordsForReview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateWordReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      wordId,
      performance,
    }: {
      wordId: string;
      performance: PerformanceRating;
    }) => updateWordReview(wordId, performance),

    // Implement optimistic updates
    onMutate: async ({ wordId, performance }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: VOCABULARY_KEYS.bank() });
      await queryClient.cancelQueries({ queryKey: VOCABULARY_KEYS.review() });

      // Get the current state of the vocabulary bank
      const previousBankData = queryClient.getQueryData<VocabularyBank>(
        VOCABULARY_KEYS.bank()
      );
      const previousReviewData = queryClient.getQueryData<VocabularyWord[]>(
        VOCABULARY_KEYS.review()
      );

      if (previousBankData) {
        // Create a copy of the vocabulary bank
        const updatedBank = { ...previousBankData };

        // Find the word to update
        const wordIndex = updatedBank.words.findIndex(w => w._id === wordId);

        if (wordIndex !== -1) {
          const currentWord = { ...updatedBank.words[wordIndex] };

          // Calculate new mastery based on performance
          const newMastery = calculateNewMastery(
            performance,
            currentWord.mastery
          );

          // Create a review entry
          const reviewEntry = {
            date: new Date(),
            performance: Number(performance),
            context: 'Spaced repetition review',
          };

          // Calculate next review date
          const wordData = {
            mastery: newMastery,
            easinessFactor: currentWord.easinessFactor || 2.5,
            repetitions: currentWord.repetitions || 0,
            interval: currentWord.interval || 0,
          };

          const nextReview = calculateNextReview(performance, wordData);

          // Update the word with new values
          const updatedWord = {
            ...currentWord,
            mastery: newMastery,
            lastReviewed: new Date(),
            nextReview,
            reviewHistory: [...(currentWord.reviewHistory || []), reviewEntry],
            easinessFactor: wordData.easinessFactor,
            repetitions: wordData.repetitions,
            interval: wordData.interval,
          };

          // Update the word in the bank
          updatedBank.words[wordIndex] = updatedWord;

          // Update stats
          const stats = { ...updatedBank.stats };

          // Recalculate stats
          const totalWords = updatedBank.words.length;
          const masteredWords = updatedBank.words.filter(
            w => w.mastery >= 80
          ).length;
          const learningWords = updatedBank.words.filter(
            w => w.mastery < 80
          ).length;
          const needsReviewWords = updatedBank.words.filter(w => {
            const nextReview = new Date(w.nextReview);
            return nextReview <= new Date();
          }).length;

          const totalMastery = updatedBank.words.reduce(
            (sum, w) => sum + w.mastery,
            0
          );
          const averageMastery =
            totalWords > 0 ? Math.round(totalMastery / totalWords) : 0;

          updatedBank.stats = {
            ...stats,
            totalWords,
            masteredWords,
            learningWords,
            needsReviewWords,
            averageMastery,
          };

          // Update the cache with our optimistic result
          queryClient.setQueryData(VOCABULARY_KEYS.bank(), updatedBank);

          // Update the review words list if it exists in cache
          if (previousReviewData) {
            // Remove the reviewed word from the list
            const updatedReviewData = previousReviewData.filter(
              w => w._id !== wordId
            );
            queryClient.setQueryData(
              VOCABULARY_KEYS.review(),
              updatedReviewData
            );
          }
        }
      }

      // Return the previous data so we can revert if there's an error
      return { previousBankData, previousReviewData };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousBankData) {
        queryClient.setQueryData(
          VOCABULARY_KEYS.bank(),
          context.previousBankData
        );
      }
      if (context?.previousReviewData) {
        queryClient.setQueryData(
          VOCABULARY_KEYS.review(),
          context.previousReviewData
        );
      }

      toast({
        title: 'Error updating word review',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },

    // Always refetch after error or success to make sure our local data is in sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VOCABULARY_KEYS.bank() });
      queryClient.invalidateQueries({ queryKey: VOCABULARY_KEYS.review() });
    },

    onSuccess: () => {
      toast({
        title: 'Word review updated',
        description: 'Your progress has been saved.',
      });
    },
  });
}

// Add a new hook for toggling word favorite status with optimistic updates
export function useToggleWordFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (wordId: string) => toggleWordFavorite(wordId),

    // Implement optimistic updates
    onMutate: async wordId => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: VOCABULARY_KEYS.bank() });

      // Get the current state
      const previousData = queryClient.getQueryData<VocabularyBank>(
        VOCABULARY_KEYS.bank()
      );

      if (previousData) {
        // Create a copy of the vocabulary bank
        const updatedBank = { ...previousData };

        // Find the word to update
        const wordIndex = updatedBank.words.findIndex(w => w._id === wordId);

        if (wordIndex !== -1) {
          // Toggle the favorite status
          const currentWord = { ...updatedBank.words[wordIndex] };
          const isFavorite = currentWord.tags?.includes('favorite') || false;

          // Update tags
          let updatedTags = [...(currentWord.tags || [])];

          if (isFavorite) {
            // Remove favorite tag
            updatedTags = updatedTags.filter(tag => tag !== 'favorite');
          } else {
            // Add favorite tag
            updatedTags.push('favorite');
          }

          // Update the word
          updatedBank.words[wordIndex] = {
            ...currentWord,
            tags: updatedTags,
          };

          // Update the cache
          queryClient.setQueryData(VOCABULARY_KEYS.bank(), updatedBank);
        }
      }

      return { previousData };
    },

    // If the mutation fails, roll back
    onError: (err, wordId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(VOCABULARY_KEYS.bank(), context.previousData);
      }

      toast({
        title: 'Error updating favorite status',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VOCABULARY_KEYS.bank() });
    },

    onSuccess: () => {
      toast({
        title: 'Favorite status updated',
        description: 'Your changes have been saved.',
      });
    },
  });
}

// Hook to fetch and update word relationships
export function useWordRelationships() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query hook for fetching relationships
  const fetchRelationships = async (
    word: string
  ): Promise<WordRelationships> => {
    return fetchWordRelationships(word);
  };

  // Mutation hook for updating relationships
  const updateRelationships = useMutation({
    mutationFn: ({
      wordId,
      relationships,
    }: {
      wordId: string;
      relationships: WordRelationships;
    }) => updateWordRelationships(wordId, relationships),

    onSuccess: data => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: VOCABULARY_KEYS.bank() });
      queryClient.invalidateQueries({
        queryKey: [...VOCABULARY_KEYS.all, 'relationships', data.word],
      });

      toast({
        title: 'Word relationships updated',
        description: 'The word has been updated with new relationships.',
      });
    },
  });

  return {
    fetchRelationships,
    updateRelationships,
  };
}

// Export types
export type { VocabularyWord, VocabularyStats, VocabularyBank };
