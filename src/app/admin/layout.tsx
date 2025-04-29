import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { isAdmin, authOptions } from "@/lib/auth";

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
          <nav className="flex items-center space-x-4">
            <a href="/admin" className="text-sm font-medium hover:text-primary">
              Dashboard
            </a>
            <a
              href="/admin/listening"
              className="text-sm font-medium hover:text-primary"
            >
              Listening Library
            </a>
            <a
              href="/admin/users"
              className="text-sm font-medium hover:text-primary"
            >
              Users
            </a>
            <a
              href="/admin/schools"
              className="text-sm font-medium hover:text-primary"
            >
              Schools
            </a>
            <a
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Back to App
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
