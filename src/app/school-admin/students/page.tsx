import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Heading } from "@/components/ui/heading";
import { StudentTable } from "@/components/school-admin/StudentTable";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Student Management | School Admin",
  description: "Manage your students",
};

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="space-y-6">
        <Heading
          title="Student Management"
          description="Manage your students"
        />
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Student Management"
          description="Manage your students"
        />
      </div>

      <StudentTable userId={session.user.id} />
    </div>
  );
}
