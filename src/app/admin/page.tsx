import Link from "next/link";
import { getServerSession } from "next-auth";
import { Metadata } from "next";

import { DashboardStats } from "@/components/admin/DashboardStats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard | Fluenta",
  description: "Manage your Fluenta platform",
};

// Admin action card component
function AdminActionCard({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90">
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-800 text-lg font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-600 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // This shouldn't happen due to layout protection
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Admin Welcome Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-200 text-lg">
            Manage users, schools, and monitor platform activity
          </p>
        </div>

        {/* Dashboard statistics with real-time data */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20">
          <DashboardStats />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AdminActionCard
              title="Manage Users"
              description="View, edit user accounts and permissions"
              href="/admin/users"
              buttonText="Manage Users"
            />

            <AdminActionCard
              title="User Analytics"
              description="Track detailed user activity and module usage"
              href="/admin/analytics"
              buttonText="View Analytics"
            />

            <AdminActionCard
              title="Manage Schools"
              description="View and manage schools and their branches"
              href="/admin/schools"
              buttonText="Manage Schools"
            />

            <AdminActionCard
              title="User Feedback"
              description="View and respond to user feedback and suggestions"
              href="/admin/feedback"
              buttonText="View Feedback"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
