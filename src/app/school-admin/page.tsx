import { getServerSession } from "next-auth";
import { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import School from "@/models/School";

export const metadata: Metadata = {
  title: "School Admin Dashboard",
  description: "Manage your school and students",
};

async function getSchoolData(userId: string) {
  await dbConnect();

  // Get the user to find their school
  const user = await User.findById(userId);
  if (!user || !user.school) {
    return null;
  }

  // Get the school details
  const school = await School.findById(user.school).populate({
    path: "admins",
    select: "name email",
  });

  if (!school) {
    return null;
  }

  // Get student count
  const studentCount = await User.countDocuments({
    school: school._id,
    role: "user",
  });

  // Get active student count (those who logged in the last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // This assumes updatedAt gets updated on login - adjust as needed
  const activeStudentCount = await User.countDocuments({
    school: school._id,
    role: "user",
    updatedAt: { $gte: sevenDaysAgo },
  });

  // Get admin count
  const adminCount = school.admins.length;

  // Get subscription info
  const subscriptionActive = school.subscription?.status === "active";
  const subscriptionType = school.subscription?.type || "none";
  const subscriptionMaxUsers = school.subscription?.maxUsers || 0;

  // Convert to safe JSON
  return {
    name: school.name,
    location: school.location,
    subscription: {
      active: subscriptionActive,
      type: subscriptionType,
      maxUsers: subscriptionMaxUsers,
      usedSlots: studentCount,
    },
    stats: {
      studentCount,
      activeStudentCount,
      adminCount,
    },
    primaryContact: school.primaryContact,
  };
}

export default async function SchoolAdminDashboard() {
  const session = await getServerSession(authOptions);
  const schoolData = session?.user?.id
    ? await getSchoolData(session.user.id)
    : null;

  return (
    <div className="space-y-6">
      <Heading
        title="School Admin Dashboard"
        description="Manage your school and students"
      />

      {schoolData ? (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {schoolData.stats.studentCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {schoolData.subscription.maxUsers > 0
                      ? `${schoolData.stats.studentCount} of ${schoolData.subscription.maxUsers} slots used`
                      : `Unlimited slots available`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {schoolData.stats.activeStudentCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Students active in the last 7 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    School Admins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {schoolData.stats.adminCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Details about your school</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{schoolData.name}</span>
                  </div>
                  {schoolData.location.city && (
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span>
                        {`${schoolData.location.city}${schoolData.location.country ? `, ${schoolData.location.country}` : ""}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Primary Contact:</span>
                    <span>
                      {schoolData.primaryContact.name} (
                      {schoolData.primaryContact.email})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Your current subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`${schoolData.subscription.active ? "text-green-500" : "text-red-500"}`}
                    >
                      {schoolData.subscription.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Plan:</span>
                    <span className="capitalize">
                      {schoolData.subscription.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">User Limit:</span>
                    <span>
                      {schoolData.subscription.maxUsers > 0
                        ? `${schoolData.subscription.usedSlots} of ${schoolData.subscription.maxUsers} used`
                        : "Unlimited"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>School Information Unavailable</CardTitle>
            <CardDescription>
              Unable to load school information. Please contact support if this
              issue persists.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
