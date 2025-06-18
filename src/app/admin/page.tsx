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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, schools, and monitor platform activity
        </p>
      </div>

      {/* Dashboard statistics with real-time data */}
      <DashboardStats />

      <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
  );
}
