import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import NotificationManager from "@/components/notifications/NotificationManager";
import { SubscriptionRefreshHandler } from "@/components/payments/subscription-refresh-handler";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import DashboardHeader from "@/components/dashboard/header";

// Improves performance by reducing re-renders
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check if user is a branch admin
  await dbConnect();
  const user = await User.findById(session.user.id);

  // Redirect branch admins to school-admin dashboard
  if (user?.role === "school_admin" && user?.branch) {
    redirect("/school-admin");
  }

  // Remove admin auto-redirect completely to allow admin users to access the dashboard
  // This fixes the "Back to App" button functionality from the admin page

  // Prepare subscription info for the header
  const subscriptionInfo = user?.subscription
    ? {
        type: user.subscription.type || "free",
        status: user.subscription.status || "pending",
        startDate: user.subscription.startDate
          ? user.subscription.startDate.toISOString()
          : undefined,
        endDate: user.subscription.endDate
          ? user.subscription.endDate.toISOString()
          : undefined,
      }
    : undefined;

  // Check if user is individual (not associated with a school)
  const isIndividualUser = !user?.school;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        user={session.user}
        subscription={subscriptionInfo}
        isIndividualUser={isIndividualUser}
      />

      <main className="flex-1">
        {/* Notification Manager - handles browser notifications */}
        <NotificationManager />
        {/* Subscription Refresh Handler - handles JWT refresh after payments */}
        <SubscriptionRefreshHandler />
        {children}
      </main>
    </div>
  );
}
