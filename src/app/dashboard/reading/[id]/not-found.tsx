import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ReadingSessionNotFound() {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Reading Session Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The reading session you're looking for doesn't exist or you don't have
        permission to view it.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/dashboard/reading">Back to Reading Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/reading/new">Create New Reading Session</Link>
        </Button>
      </div>
    </div>
  );
}
