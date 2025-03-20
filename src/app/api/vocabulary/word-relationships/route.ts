import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import memoryCache from '@/lib/cache';
import dbConnect from '@/lib/db';
import { VocabularyBank } from '@/models/VocabularyBank';

interface WordData {
  id: string;
  word: string;
  [key: string]: unknown;
}

// GET /api/vocabulary/word-relationships?word=example
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the word from the query parameters
    const url = new URL(req.url);
    const word = url.searchParams.get('word');

    if (!word) {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `vocabulary:relationships:${word.toLowerCase()}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for word relationships: ${word}`);
      return NextResponse.json(cachedData);
    }

    console.log(
      `Cache miss for word relationships: ${word}, fetching from external API`
    );

    // Fetch from external API
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );

      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform the external API response to our format
      const relationships = {
        synonyms: [] as string[],
        antonyms: [] as string[],
        related: [] as string[],
        forms: {} as {
          plural?: string;
          past?: string;
          presentParticiple?: string;
          pastParticiple?: string;
        },
      };

      // Extract synonyms and antonyms from the response
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((entry: Record<string, unknown>) => {
          if (entry.meanings && Array.isArray(entry.meanings)) {
            entry.meanings.forEach((meaning: Record<string, unknown>) => {
              // Get synonyms
              if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
                relationships.synonyms = [
                  ...relationships.synonyms,
                  ...(meaning.synonyms as string[]),
                ];
              }

              // Get antonyms
              if (meaning.antonyms && Array.isArray(meaning.antonyms)) {
                relationships.antonyms = [
                  ...relationships.antonyms,
                  ...(meaning.antonyms as string[]),
                ];
              }

              // Get definitions with examples
              if (meaning.definitions && Array.isArray(meaning.definitions)) {
                meaning.definitions.forEach((def: Record<string, unknown>) => {
                  if (def.example) {
                    relationships.related.push(def.example as string);
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

      // Cache the result for 24 hours
      memoryCache.set(cacheKey, relationships, 24 * 60 * 60);

      return NextResponse.json(relationships);
    } catch (error) {
      console.error('Error fetching from external API:', error);

      // Return empty relationships if external API fails
      const emptyRelationships = {
        synonyms: [],
        antonyms: [],
        related: [],
        forms: {},
      };

      return NextResponse.json(emptyRelationships);
    }
  } catch (error) {
    console.error('Error in word relationships API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word relationships' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { relationship } = body;

    if (
      !relationship ||
      !Array.isArray(relationship.words) ||
      relationship.words.length < 2
    ) {
      return NextResponse.json(
        { error: 'Invalid relationship data' },
        { status: 400 }
      );
    }

    await dbConnect();
    const vocabBank = await VocabularyBank.findOne({ userId });

    if (!vocabBank) {
      return NextResponse.json(
        { error: 'Vocabulary bank not found' },
        { status: 404 }
      );
    }

    // Validate that all words in the relationship exist in the vocabulary bank
    const wordMap = new Map<string, WordData>();
    vocabBank.words.forEach((word: WordData) => {
      wordMap.set(word.id.toString(), {
        id: word.id.toString(),
        word: word.word,
      });
    });

    const validWordIds = relationship.words.filter((wordId: string) =>
      wordMap.has(wordId)
    );
    if (validWordIds.length !== relationship.words.length) {
      return NextResponse.json(
        { error: 'One or more words do not exist in your vocabulary bank' },
        { status: 400 }
      );
    }

    // Add relationship logic here...

    return NextResponse.json({
      message: 'Word relationship created successfully',
      relationship: {
        ...relationship,
        words: validWordIds.map((wordId: string) => wordMap.get(wordId)),
      },
    });
  } catch (error) {
    console.error('Error creating word relationship:', error);
    return NextResponse.json(
      { error: 'Failed to create word relationship' },
      { status: 500 }
    );
  }
}
