'use client';

import { Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef, memo } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Memoize static arrays to prevent unnecessary re-renders
const topics = [
  'Technology',
  'Science',
  'Environment',
  'Health',
  'Education',
  'Travel',
  'Food and Cuisine',
  'Arts and Culture',
  'Sports',
  'Business',
  'History',
  'Psychology',
  'Social Media',
  'Space Exploration',
  'Climate Change',
];

// Language levels with CEFR standards
const levels = [
  { value: 'A1', label: 'Beginner (A1)' },
  { value: 'A2', label: 'Elementary (A2)' },
  { value: 'B1', label: 'Intermediate (B1)' },
  { value: 'B2', label: 'Upper Intermediate (B2)' },
  { value: 'C1', label: 'Advanced (C1)' },
  { value: 'C2', label: 'Proficient (C2)' },
];

// Text length options
const textLengths = [
  { value: 'short', label: 'Short (100-150 words)' },
  { value: 'medium', label: 'Medium (150-200 words)' },
  { value: 'long', label: 'Long (250-300 words)' },
  { value: 'veryLong', label: 'Very Long (300-400 words)' },
];

// Question count options
const questionCounts = Array.from({ length: 6 }, (_, i) => i + 5); // 5 to 10

// Question types
interface QuestionType {
  value: string;
  label: string;
}

const questionTypes: QuestionType[] = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
  { value: 'fill-blank', label: 'Fill in the Blanks' },
];

// Length to words mapping for reference
const lengthToWords = {
  short: 150,
  medium: 200,
  long: 300,
  veryLong: 400,
};

interface GenerationParams {
  topic: string;
  level: string;
  length: string;
  interests: string;
  questionCount: number;
  questionTypes: string[];
}

// Define interfaces for API responses
interface Question {
  id: string;
  type: string;
  question: string;
  options: any[] | null;
  correctAnswer: string;
  explanation: string;
}

interface VocabularyWord {
  word: string;
  definition: string;
  context: string;
  examples: string[];
  difficulty: number;
}

interface GrammarPattern {
  pattern: string;
  explanation: string;
  examples: string[];
}

interface QuestionsResponse {
  questions: Question[];
}

interface VocabularyResponse {
  vocabulary: VocabularyWord[];
}

interface GrammarResponse {
  patterns: GrammarPattern[];
}

// Use memo to prevent unnecessary re-renders
export const NewReadingSession = memo(function NewReadingSession() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [params, setParams] = useState<GenerationParams>({
    topic: topics[0],
    level: 'B1',
    length: 'medium',
    interests: '',
    questionCount: 5,
    questionTypes: ['multiple-choice', 'true-false'],
  });
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use useCallback to memoize the handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Reset state
        setError(null);
        setIsLoading(true);
        setLoadingStep('Generating content...');

        // Abort any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Initialize a new abort controller
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, 120000); // 2 minute timeout

        // Pass the exact CEFR level to the API without mapping
        const apiLevel = params.level; // 'A1', 'A2', 'B1', 'B2', 'C1', or 'C2'

        // Get target length from the mapping
        const targetLength =
          lengthToWords[params.length as keyof typeof lengthToWords];

        // Prepare question type configuration
        const questionTypeConfig = params.questionTypes.map(type => ({
          type,
          count: Math.ceil(params.questionCount / params.questionTypes.length),
        }));

        // Call the unified API endpoint with timeout handling
        const unifiedResponse = await fetch('/api/reading/generate/unified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            level: apiLevel,
            topic: params.topic,
            targetLength,
            interests: params.interests,
            questionTypes: questionTypeConfig,
            questionCount: params.questionCount,
          }),
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!unifiedResponse.ok) {
          // Check for specific error status codes
          if (unifiedResponse.status === 504) {
            throw new Error(
              'The request timed out. Please try again with a shorter content length or simpler topic.'
            );
          }

          // Try to get error details from the response
          let errorMessage = 'Failed to generate reading session content';
          try {
            const errorData = await unifiedResponse.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // Ignore JSON parsing errors
          }

          throw new Error(errorMessage);
        }

        const unifiedData = await unifiedResponse.json();

        // Extract the data from the unified response
        const content = unifiedData.content;
        const questions = { questions: unifiedData.questions || [] };
        const vocabulary = { vocabulary: unifiedData.vocabulary || [] };
        const grammar = { patterns: unifiedData.grammar || [] };

        setLoadingStep('Creating reading session...');

        // Calculate word count and estimated reading time
        const wordCount = content.content.split(/\s+/).length;
        const estimatedReadingTime = Math.ceil((wordCount / 200) * 60); // words per minute

        // Transform questions to match the expected schema format
        const transformedQuestions = questions.questions.map(
          (question: Question) => {
            // Ensure question has a type, default to multiple-choice if missing
            let questionType = question.type || 'multiple-choice';

            // Normalize question type to match what the schema expects
            // Convert 'fill-in-the-blank' to 'fill-blank'
            if (questionType === 'fill-in-the-blank') {
              questionType = 'fill-blank';
            }

            // Transform options from {id, text} objects to string[] if needed
            let options: string[] | null = null;
            if (question.options) {
              if (
                typeof question.options[0] === 'object' &&
                question.options[0] !== null
              ) {
                // If options are objects with id and text, extract just the text
                options = question.options.map(
                  (opt: { id?: string; text?: string } | string) =>
                    typeof opt === 'object' && 'text' in opt && opt.text
                      ? opt.text
                      : String(opt)
                );
              } else if (Array.isArray(question.options)) {
                // If already an array of strings, use as is
                options = question.options.map(opt => String(opt));
              }
            }

            // Return properly formatted question
            return {
              id: question.id,
              type: questionType,
              question: question.question,
              options: options || [],
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
            };
          }
        );

        // Transform vocabulary items to match the expected schema format
        const transformedVocabulary = vocabulary.vocabulary.map(
          (word: VocabularyWord) => {
            // Create a properly formatted vocabulary item with all required fields
            return {
              word: word.word,
              definition: word.definition,
              context: word.context || `Example context for "${word.word}".`,
              examples: Array.isArray(word.examples)
                ? word.examples
                : [`Example usage of "${word.word}".`],
              difficulty:
                typeof word.difficulty === 'number' ? word.difficulty : 3,
            };
          }
        );

        // Create reading session
        const sessionResponse = await fetch('/api/reading/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: content.title,
            content: content.content,
            questions: transformedQuestions,
            vocabulary: transformedVocabulary,
            grammarFocus: grammar.patterns,
            level: params.level,
            topic: params.topic,
            wordCount: wordCount,
            estimatedReadingTime: estimatedReadingTime,
            aiAnalysis: {
              readingLevel:
                apiLevel === 'A1'
                  ? 1
                  : apiLevel === 'A2'
                    ? 2
                    : apiLevel === 'B1'
                      ? 3
                      : apiLevel === 'B2'
                        ? 5
                        : apiLevel === 'C1'
                          ? 7
                          : apiLevel === 'C2'
                            ? 9
                            : 3,
              complexityScore:
                apiLevel === 'A1'
                  ? 1
                  : apiLevel === 'A2'
                    ? 2
                    : apiLevel === 'B1'
                      ? 4
                      : apiLevel === 'B2'
                        ? 6
                        : apiLevel === 'C1'
                          ? 8
                          : apiLevel === 'C2'
                            ? 10
                            : 4,
              topicRelevance: content.metadata?.topicRelevance || 8,
              suggestedNextTopics: [params.topic],
            },
          }),
        });

        if (!sessionResponse.ok) {
          const errorText = await sessionResponse.text();
          console.error('Session creation error:', errorText);
          throw new Error(`Failed to create reading session: ${errorText}`);
        }

        const session = await sessionResponse.json();

        toast.success('Your reading session has been created.');
        router.push(`/dashboard/reading/${session._id}`);
      } catch (error: any) {
        setIsLoading(false);
        setLoadingStep('');
        // Handle abort/timeout errors specially
        if (error.name === 'AbortError') {
          const errorMessage =
            'Request timed out. Please try again with a shorter content length or simpler topic.';
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          const errorMessage =
            error.message || 'Failed to create reading session';
          setError(errorMessage);
          toast.error(errorMessage);
        }
        console.error('Error creating reading session:', error);
      }
    },
    [params, router]
  );

  // Update a specific param without re-rendering the entire component
  const updateParam = useCallback((key: keyof GenerationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle question type toggle with minimal re-renders
  const handleQuestionTypeToggle = useCallback((type: string) => {
    setParams(prev => {
      const currentTypes = [...prev.questionTypes];
      const typeIndex = currentTypes.indexOf(type);

      if (typeIndex === -1) {
        // Ensure at least one type is selected
        return { ...prev, questionTypes: [...currentTypes, type] };
      } else if (currentTypes.length > 1) {
        // Prevent deselecting the last type
        currentTypes.splice(typeIndex, 1);
        return { ...prev, questionTypes: currentTypes };
      }

      return prev;
    });
  }, []);

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields in a single row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Theme</Label>
            <Select
              value={params.topic}
              onValueChange={(value: string) =>
                setParams({ ...params, topic: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Difficulty Level</Label>
            <Select
              value={params.level}
              onValueChange={(value: string) =>
                setParams({ ...params, level: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Text Length</Label>
            <Select
              value={params.length}
              onValueChange={(value: string) =>
                setParams({ ...params, length: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {textLengths.map(length => (
                  <SelectItem key={length.value} value={length.value}>
                    {length.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Select
              value={params.questionCount.toString()}
              onValueChange={(value: string) =>
                setParams({ ...params, questionCount: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                {questionCounts.map(count => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Question Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {questionTypes.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={params.questionTypes.includes(type.value)}
                  onCheckedChange={checked => {
                    if (checked) {
                      setParams({
                        ...params,
                        questionTypes: [...params.questionTypes, type.value],
                      });
                    } else {
                      setParams({
                        ...params,
                        questionTypes: params.questionTypes.filter(
                          t => t !== type.value
                        ),
                      });
                    }
                  }}
                />
                <label
                  htmlFor={type.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">
            Additional Interests or Requirements
          </Label>
          <Textarea
            id="interests"
            placeholder="Enter any specific interests or requirements (optional)"
            value={params.interests}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setParams({ ...params, interests: e.target.value })
            }
            className="h-24"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingStep || 'Generating...'}</span>
              </div>
            ) : (
              'Generate Reading Session'
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Generation Progress</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${loadingStep.includes('Generating reading') ? 'bg-primary animate-pulse' : loadingStep === '' ? 'bg-muted-foreground' : 'bg-green-500'}`}
                ></div>
                <span>Generating reading content and materials</span>
              </li>
              <li className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${loadingStep.includes('Creating reading') ? 'bg-primary animate-pulse' : loadingStep === '' || !loadingStep.includes('Creating reading') ? 'bg-muted-foreground' : 'bg-green-500'}`}
                ></div>
                <span>Saving reading session</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              This process may take up to a minute. Please be patient.
            </p>
          </div>
        )}
      </form>
    </Card>
  );
});
