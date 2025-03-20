'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function WordDetailsPage() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard/vocabulary');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackToDashboard}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Word Details</h1>
      </div>

      <p>
        This is a placeholder page. Please use the dynamic route with the word
        ID.
      </p>

      <Button onClick={handleBackToDashboard} className="mt-4">
        Back to Vocabulary Dashboard
      </Button>
    </div>
  );
}
