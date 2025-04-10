import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function SpeakingSessionNotFound() {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Speaking Session Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The speaking session you&apos;re looking for doesn&apos;t exist or you
        don&apos;t have permission to view it.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/dashboard/speaking">Back to Speaking Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/speaking">Start New Speaking Session</Link>
        </Button>
      </div>
    </div>
  );
}
