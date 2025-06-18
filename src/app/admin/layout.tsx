import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { isAdmin, authOptions } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

// Improves performance by reducing re-renders
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check if user is admin
  const userIsAdmin = await isAdmin(session.user.id);
  if (!userIsAdmin) {
    redirect("/dashboard"); // Redirect non-admins to dashboard
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <a
                href="/admin"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="text-sm font-medium hover:text-primary"
              >
                Users
              </a>
              <a
                href="/admin/analytics"
                className="text-sm font-medium hover:text-primary"
              >
                Analytics
              </a>
              <a
                href="/admin/schools"
                className="text-sm font-medium hover:text-primary"
              >
                Schools
              </a>
              <a
                href="/admin/feedback"
                className="text-sm font-medium hover:text-primary"
              >
                Feedback
              </a>
            </nav>
            <div className="flex items-center space-x-2 ml-4 border-l pl-4">
              <a
                href="/dashboard"
                className="px-3 py-1 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Back to App
              </a>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
