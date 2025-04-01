'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import AIGeneratedListeningForm from '@/components/admin/AIGeneratedListeningForm';
import { Button } from '@/components/ui/button';

export default function CreateLibraryItemPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Library Item
          </h1>
          <p className="text-muted-foreground">
            Generate an AI-powered listening exercise for the library
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg">
        This form uses AI to generate a complete listening exercise with
        transcript, audio, vocabulary, and comprehension questions. Once
        created, the exercise will be saved to the library where you can later
        edit it or publish it for users.
      </p>

      <AIGeneratedListeningForm />
    </div>
  );
}
