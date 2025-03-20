'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Progress Dashboard
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              The comprehensive progress tracking dashboard is coming soon! This
              will include detailed analytics on your reading, vocabulary,
              writing, and speaking progress.
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-4">
            <p>
              In the meantime, you can track your progress in each individual
              section:
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/reading">Reading Progress</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/vocabulary">Vocabulary Progress</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/writing">Writing Progress</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
