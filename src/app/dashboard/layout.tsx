import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import NotificationManager from "@/components/notifications/NotificationManager";
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary/5 blur-3xl opacity-30" />
      </div>

      <DashboardHeader user={session.user} subscription={subscriptionInfo} />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Notification Manager - handles browser notifications */}
          <NotificationManager />
          {children}
        </div>
      </main>
    </div>
  );
}
