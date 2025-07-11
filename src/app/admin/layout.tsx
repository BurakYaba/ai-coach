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
    <div className="flex min-h-screen flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              <a
                href="/admin"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Users
              </a>
              <a
                href="/admin/analytics"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Analytics
              </a>
              <a
                href="/admin/schools"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Schools
              </a>
              <a
                href="/admin/feedback"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Feedback
              </a>
            </nav>
            <div className="flex items-center space-x-3 ml-6 border-l border-slate-200 pl-6">
              <a
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Back to App
              </a>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
