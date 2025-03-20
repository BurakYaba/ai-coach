import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WritingProgress } from '@/components/writing/WritingProgress';
import { WritingPromptList } from '@/components/writing/WritingPromptList';
import { WritingSessionList } from '@/components/writing/WritingSessionList';

export const metadata: Metadata = {
  title: 'Writing Practice | AI Language Learning',
  description:
    'Improve your writing skills with AI-powered feedback and analysis',
};

export default function WritingDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Writing Practice
          </h1>
          <p className="text-muted-foreground">
            Improve your writing skills with AI-powered feedback and analysis
          </p>
        </div>
        <Link href="/dashboard/writing/new">
          <Button size="lg">New Writing Session</Button>
        </Link>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <WritingSessionList />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <WritingPromptList />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <WritingProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
}
