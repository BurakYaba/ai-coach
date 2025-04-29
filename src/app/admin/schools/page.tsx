import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SchoolTable } from "@/components/admin/SchoolTable";

export const metadata = {
  title: "School Management | Admin Dashboard",
  description: "Manage schools and branches on the language learning platform",
};

function SchoolTableSkeleton() {
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

export default function SchoolManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            School Management
          </h1>
          <p className="text-muted-foreground">
            Manage schools, branches, and school administrators
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>
            View and manage schools and their branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SchoolTableSkeleton />}>
            <SchoolTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
