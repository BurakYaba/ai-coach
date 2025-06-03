import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { isSchoolAdmin, authOptions } from "@/lib/auth";
import { SchoolAdminSidebar } from "@/components/school-admin/SchoolAdminSidebar";

// Force dynamic to ensure the role check runs on each request
export const dynamic = "force-dynamic";

export const metadata = {
  title: "School Admin Dashboard | Fluenta",
  description: "Manage your school and students",
};

export default async function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and has school_admin role
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/school-admin");
  }

  const userIsSchoolAdmin = await isSchoolAdmin(session.user.id);

  if (!userIsSchoolAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SchoolAdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 container mx-auto">{children}</main>
      </div>
    </div>
  );
}
