'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  level: z.string().min(2, {
    message: 'Please select a CEFR level',
  }),
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters',
  }),
  contentType: z.string().min(1, {
    message: 'Please select a content type',
  }),
  targetLength: z.string().min(1, {
    message: 'Please select a target length',
  }),
  category: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export default function AIGeneratedListeningForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: '',
      topic: '',
      contentType: 'dialogue',
      targetLength: 'medium',
      category: '',
      isPublic: false,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send the form data to the API
      const response = await fetch('/api/admin/library/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate listening content');
      }

      toast({
        title: 'Success!',
        description: `Library item "${data.title}" has been ${values.isPublic ? 'published' : 'saved as draft'}.`,
      });

      // Redirect to the library management page
      router.push('/admin/library');
      router.refresh();
    } catch (error) {
      console.error('Error generating library item:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate listening content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create AI-Generated Listening Exercise</CardTitle>
        <CardDescription>
          Our AI will generate a complete listening exercise based on your
          specifications, including transcript, audio, comprehension questions,
          and vocabulary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEFR Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Beginner</SelectItem>
                      <SelectItem value="A2">A2 - Elementary</SelectItem>
                      <SelectItem value="B1">B1 - Intermediate</SelectItem>
                      <SelectItem value="B2">
                        B2 - Upper Intermediate
                      </SelectItem>
                      <SelectItem value="C1">C1 - Advanced</SelectItem>
                      <SelectItem value="C2">C2 - Proficiency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Travel, Food, Technology"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Business English, Academic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <ContentTypeOption
                        value="dialogue"
                        label="Dialogue"
                        description="Conversation between two people"
                        current={field.value}
                      />
                      <ContentTypeOption
                        value="monologue"
                        label="Monologue"
                        description="Single speaker"
                        current={field.value}
                      />
                      <ContentTypeOption
                        value="interview"
                        label="Interview"
                        description="Q&A format"
                        current={field.value}
                      />
                      <ContentTypeOption
                        value="news"
                        label="News"
                        description="News report style"
                        current={field.value}
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetLength"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Target Length</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="short" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Short (1-2 min)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Medium (2-4 min)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="long" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Long (4-6 min)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Publish Immediately
                    </FormLabel>
                    <FormDescription>
                      Make this exercise available to all users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating (this may take 1-2 minutes)...
                </>
              ) : (
                'Generate Listening Exercise'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Helper component for content type options
function ContentTypeOption({
  value,
  label,
  description,
  current,
}: {
  value: string;
  label: string;
  description: string;
  current: string;
}) {
  return (
    <FormItem className="flex flex-col space-y-1 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <FormControl>
          <RadioGroupItem value={value} />
        </FormControl>
        <FormLabel className="font-normal cursor-pointer">{label}</FormLabel>
      </div>
      <p
        className={`text-xs text-muted-foreground ml-7 ${current === value ? 'opacity-100' : 'opacity-70'}`}
      >
        {description}
      </p>
    </FormItem>
  );
}
