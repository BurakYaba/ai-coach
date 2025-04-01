import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { LibraryItemView } from '@/components/listening/LibraryItemView';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/library/${params.id}`
    );
    if (!response.ok) throw new Error('Failed to fetch library item');

    const data = await response.json();

    return {
      title: `${data.title} | Listening Library`,
      description: `${data.level} level listening exercise about ${data.topic}`,
    };
  } catch (error) {
    return {
      title: 'Listening Exercise | Language Coach',
      description: 'Improve your listening skills with our curated exercises',
    };
  }
}

function LibraryItemSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
            <Skeleton className="h-64 w-full" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RedirectPage({ params }: { params: { id: string } }) {
  redirect(`/dashboard/listening/library/${params.id}`);
  return null;
}
