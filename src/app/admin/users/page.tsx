import { Suspense } from "react";
import { Metadata } from "next";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { UserTable } from "@/components/admin/UserTable";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users of Fluenta",
};

function UserTableSkeleton() {
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

export default function UsersManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            User Management
          </h1>
          <p className="text-blue-100 text-lg">
            Manage users and their roles on the platform
          </p>
        </div>

        {/* Users Table Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="text-slate-800 text-xl font-semibold">
              Users
            </CardTitle>
            <CardDescription className="text-slate-600">
              View all users, their activity, and manage their roles
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Suspense fallback={<UserTableSkeleton />}>
              <UserTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
