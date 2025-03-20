'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWordRelationships } from '@/hooks/use-vocabulary';

interface WordRelationshipsProps {
  wordId: string;
  word: string;
  existingRelationships?: {
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
}

export function WordRelationships({
  wordId,
  word,
  existingRelationships,
}: WordRelationshipsProps) {
  const [activeTab, setActiveTab] = useState('synonyms');
  const { fetchRelationships, updateRelationships } = useWordRelationships();
  const { data, isLoading } = useQuery({
    queryKey: ['relationships', word],
    queryFn: () => fetchRelationships(word),
  });

  // Combine existing relationships with fetched ones
  const relationshipsCombined = {
    synonyms: [
      ...(existingRelationships?.synonyms || []),
      ...(data?.synonyms || []),
    ],
    antonyms: [
      ...(existingRelationships?.antonyms || []),
      ...(data?.antonyms || []),
    ],
    related: [
      ...(existingRelationships?.related || []),
      ...(data?.related || []),
    ],
    forms: {
      ...(existingRelationships?.forms || {}),
      ...(data?.forms || {}),
    },
  };

  // Remove duplicates
  const uniqueSynonyms = Array.from(new Set(relationshipsCombined.synonyms));
  const uniqueAntonyms = Array.from(new Set(relationshipsCombined.antonyms));
  const uniqueRelated = Array.from(new Set(relationshipsCombined.related));

  // Handle saving relationships to the word
  const handleSaveRelationships = () => {
    updateRelationships.mutate({
      wordId,
      relationships: {
        synonyms: uniqueSynonyms,
        antonyms: uniqueAntonyms,
        related: uniqueRelated,
        forms: relationshipsCombined.forms,
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Word Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Relationships</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
            <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
            <TabsTrigger value="related">Related Words</TabsTrigger>
            <TabsTrigger value="forms">Word Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="synonyms">
            <div className="flex flex-wrap gap-2">
              {uniqueSynonyms.map(synonym => (
                <Badge key={synonym} variant="secondary">
                  {synonym}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="antonyms">
            <div className="flex flex-wrap gap-2">
              {uniqueAntonyms.map(antonym => (
                <Badge key={antonym} variant="secondary">
                  {antonym}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="related">
            <div className="flex flex-wrap gap-2">
              {uniqueRelated.map(related => (
                <Badge key={related} variant="secondary">
                  {related}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forms">
            <div className="space-y-2">
              {Object.entries(relationshipsCombined.forms).map(
                ([form, value]) => (
                  <div key={form} className="flex items-center gap-2">
                    <span className="font-medium capitalize">{form}:</span>
                    <span>{value as string}</span>
                  </div>
                )
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          className="mt-4"
          onClick={handleSaveRelationships}
          disabled={updateRelationships.isPending}
        >
          Save Relationships
        </Button>
      </CardContent>
    </Card>
  );
}
