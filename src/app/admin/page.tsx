import Link from "next/link";
import { getServerSession } from "next-auth";

import { DashboardStats } from "@/components/admin/DashboardStats";
import { SubscriptionManagement } from "@/components/admin/subscription-management";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your language learning platform",
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
          Manage content, users, and monitor platform activity
        </p>
      </div>

      {/* Dashboard statistics with real-time data */}
      <DashboardStats />

      {/* Subscription Management */}
      <div className="mt-8 mb-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Subscription Management
        </h2>
        <SubscriptionManagement />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AdminActionCard
          title="Manage Listening Library"
          description="Add, edit, or remove items from the listening content library"
          href="/admin/library"
          buttonText="Manage Library"
        />

        <AdminActionCard
          title="Manage Users"
          description="View, edit user accounts and permissions"
          href="/admin/users"
          buttonText="Manage Users"
        />

        <AdminActionCard
          title="Track Sessions"
          description="View and analyze user listening sessions"
          href="/admin/sessions"
          buttonText="View Sessions"
        />
      </div>
    </div>
  );
}
