'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

// Predefined topics for the dropdown
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
  'Literature',
  'Music',
  'Film and Television',
  'Fashion',
  'Politics',
  'Economics',
  'Philosophy',
  'Religion',
  'Architecture',
  'Transportation',
  'Agriculture',
  'Energy',
  'Wildlife',
  'Languages',
  'Artificial Intelligence',
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

interface WritingPrompt {
  _id: string;
  type: 'essay' | 'letter' | 'story' | 'argument';
  level: string;
  topic: string;
  text: string;
  requirements: string[];
  suggestedLength: {
    min: number;
    max: number;
  };
  timeLimit?: number;
}

export default function NewWritingSessionPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('essay');
  const [selectedLevel, setSelectedLevel] = useState<string>('B1');
  const [customTopic, setCustomTopic] = useState<string>('Technology');
  const [creating, setCreating] = useState(false);
  const [promptOption, setPromptOption] = useState<'existing' | 'generate'>(
    'existing'
  );
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');

  // Fetch prompts
  useEffect(() => {
    async function fetchPrompts() {
      try {
        const response = await fetch(
          `/api/writing/prompts?type=${selectedType}&level=${selectedLevel}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const data = await response.json();
        setPrompts(data.prompts);

        // Select the first prompt by default if available
        if (data.prompts.length > 0) {
          setSelectedPromptId(data.prompts[0]._id);
        } else {
          setSelectedPromptId('');
        }
      } catch (error) {
        console.error('Error fetching writing prompts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load writing prompts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, [selectedType, selectedLevel]);

  // Create a new session with an existing prompt
  const createSessionWithExistingPrompt = async () => {
    if (!selectedPromptId) {
      toast({
        title: 'Error',
        description: 'Please select a prompt',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      // Find the selected prompt
      const prompt = prompts.find(p => p._id === selectedPromptId);
      if (!prompt) {
        throw new Error('Prompt not found');
      }

      // Create a new writing session
      const response = await fetch('/api/writing/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: {
            text: prompt.text,
            type: prompt.type,
            topic: prompt.topic,
            targetLength: Math.floor(
              (prompt.suggestedLength.min + prompt.suggestedLength.max) / 2
            ),
            requirements: prompt.requirements,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();

      // Navigate to the new session
      router.push(`/dashboard/writing/${data.session._id}`);

      toast({
        title: 'Success',
        description: 'Writing session created successfully',
      });
    } catch (error) {
      console.error('Error creating writing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create writing session',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  // Generate a new prompt and create a session
  const generatePromptAndCreateSession = async () => {
    if (!customTopic || customTopic.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please select a topic',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      // Generate a new prompt
      const generateResponse = await fetch('/api/writing/prompts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          level: selectedLevel,
          topic: customTopic,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate prompt');
      }

      const generateData = await generateResponse.json();
      const generatedPrompt = generateData.prompt;

      // Create a new writing session with the generated prompt
      const sessionResponse = await fetch('/api/writing/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: {
            text: generatedPrompt.text,
            type: generatedPrompt.type,
            topic: generatedPrompt.topic,
            targetLength: Math.floor(
              (generatedPrompt.suggestedLength.min +
                generatedPrompt.suggestedLength.max) /
                2
            ),
            requirements: generatedPrompt.requirements,
          },
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await sessionResponse.json();

      // Navigate to the new session
      router.push(`/dashboard/writing/${sessionData.session._id}`);

      toast({
        title: 'Success',
        description: 'Writing session created successfully',
      });
    } catch (error) {
      console.error('Error creating writing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create writing session',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (promptOption === 'existing') {
      await createSessionWithExistingPrompt();
    } else {
      await generatePromptAndCreateSession();
    }
  };

  // Handle prompt selection
  const handlePromptSelection = (promptId: string) => {
    setSelectedPromptId(promptId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Writing Session
          </h1>
          <p className="text-muted-foreground">
            Start a new writing practice session
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/writing')}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First card: Choose Writing Type and Level */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Choose Writing Type and Level</CardTitle>
              <CardDescription>
                Select the type of writing you want to practice and your current
                level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Writing Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="argument">Argument</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger id="level">
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
              </div>
            </CardContent>
          </Card>

          {/* Second card: Choose a Prompt */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Choose a Prompt</CardTitle>
              <CardDescription>
                Select an existing prompt or generate a new one based on your
                topic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <RadioGroup
                value={promptOption}
                onValueChange={value =>
                  setPromptOption(value as 'existing' | 'generate')
                }
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="existing" className="font-medium">
                      Use an existing prompt
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose from our curated collection of writing prompts
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="generate" id="generate" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="generate" className="font-medium">
                      Generate a new prompt
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create a custom prompt based on your topic of interest
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {promptOption === 'existing' ? (
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : prompts.length === 0 ? (
                    <div className="text-center p-6 border rounded-md">
                      <p className="mb-2">
                        No prompts available for the selected type and level.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your selection or generate a custom prompt.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {prompts.map(prompt => (
                        <div
                          key={prompt._id}
                          className={`p-4 border rounded-md cursor-pointer transition-colors ${
                            selectedPromptId === prompt._id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handlePromptSelection(prompt._id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePromptSelection(prompt._id);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={selectedPromptId === prompt._id}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium capitalize">
                              {prompt.topic}
                            </h3>
                            <Badge variant="outline">
                              {prompt.suggestedLength.min}-
                              {prompt.suggestedLength.max} words
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {prompt.text}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {prompt.requirements.length} requirements •{' '}
                            {prompt.timeLimit || 30} min suggested time
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={customTopic}
                      onValueChange={(value: string) => setCustomTopic(value)}
                    >
                      <SelectTrigger id="topic">
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
                    <p className="text-xs text-muted-foreground">
                      Choose a topic for your writing prompt
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/dashboard/writing')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  creating ||
                  (promptOption === 'existing' && !selectedPromptId) ||
                  (promptOption === 'generate' && !customTopic)
                }
              >
                {creating ? 'Creating...' : 'Start Writing Session'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
