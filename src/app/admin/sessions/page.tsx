import { Suspense } from 'react';

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SessionTable } from '@/components/admin/SessionTable';

export const metadata = {
  title: 'Sessions | Admin Dashboard',
  description: 'Manage user listening sessions',
};

function SessionTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="border rounded-md">
        <div className="h-12 border-b px-4 flex items-center">
          <Skeleton className="h-4 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center h-16 px-4 border-b">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-[120px]" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
    </div>
  );
}

export default function SessionsManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Listening Sessions
          </h1>
          <p className="text-muted-foreground">
            Monitor user activity and session completion
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="library">Library Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Sessions</CardTitle>
              <CardDescription>
                View all user listening sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SessionTableSkeleton />}>
                <SessionTable filter="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Sessions</CardTitle>
              <CardDescription>Sessions users have completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SessionTableSkeleton />}>
                <SessionTable filter="completed" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Sessions</CardTitle>
              <CardDescription>
                Sessions users have started but not completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SessionTableSkeleton />}>
                <SessionTable filter="inProgress" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Library Usage</CardTitle>
              <CardDescription>
                Sessions started from library items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SessionTableSkeleton />}>
                <SessionTable filter="library" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
