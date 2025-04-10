import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Components
import { LibraryTable } from "@/components/admin/LibraryTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Listening Library | Admin Dashboard",
  description: "Manage listening library content",
};

function LibraryTableSkeleton() {
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

export default function LibraryManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Listening Library
          </h1>
          <p className="text-muted-foreground">
            Manage listening exercises available to users
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/library/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Library Items</CardTitle>
              <CardDescription>
                View all items in the listening library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LibraryTableSkeleton />}>
                <LibraryTable filter="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Items</CardTitle>
              <CardDescription>Items that are visible to users</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LibraryTableSkeleton />}>
                <LibraryTable filter="published" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Items</CardTitle>
              <CardDescription>
                Items that are not yet visible to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LibraryTableSkeleton />}>
                <LibraryTable filter="drafts" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
