import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import DashboardHeader from "@/components/dashboard/header";
import NotificationManager from "@/components/notifications/NotificationManager";
import { authOptions } from "@/lib/auth";

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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary/5 blur-3xl opacity-30" />
      </div>

      <DashboardHeader user={session.user} />
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
