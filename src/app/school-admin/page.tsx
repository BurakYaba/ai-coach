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
import Branch from "@/models/Branch";

export const metadata: Metadata = {
  title: "School Admin Dashboard",
  description: "Manage your school and students",
};

async function getSchoolData(userId: string) {
  await dbConnect();

  // Get the user to find their school and branch (if they are a branch admin)
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

  // Check if the user is a branch admin
  const isBranchAdmin = user.branch ? true : false;

  // Prepare query for student count - filter by branch if user is a branch admin
  const studentQuery: any = {
    school: school._id,
    role: "user",
  };

  // If user is a branch admin, only count students in their branch
  if (isBranchAdmin && user.branch) {
    studentQuery.branch = user.branch;
  }

  // Get student count with appropriate filtering
  const studentCount = await User.countDocuments(studentQuery);

  // Prepare query for active student count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activeStudentQuery = {
    ...studentQuery,
    updatedAt: { $gte: sevenDaysAgo },
  };

  // Get active student count with appropriate filtering
  const activeStudentCount = await User.countDocuments(activeStudentQuery);

  // Get admin count - if branch admin, only count admins for their branch
  let adminCount = school.admins.length;

  if (isBranchAdmin && user.branch) {
    // Get the branch to find branch-specific admins
    const branch = await Branch.findById(user.branch).populate({
      path: "admins",
      select: "name email _id",
    });

    // Count branch admins correctly
    if (!branch) {
      // If branch not found but user has branch access, count at least the current user
      adminCount = 1;
    } else {
      // Find all users who are school_admin and associated with this specific branch
      const branchAdminsCount = await User.countDocuments({
        branch: user.branch,
        role: "school_admin",
      });

      // Use the count from the database query instead of the branch.admins array
      // This ensures we count all admins properly, regardless of whether they're
      // explicitly listed in the branch.admins array
      adminCount = branchAdminsCount > 0 ? branchAdminsCount : 1; // Minimum of 1 admin
    }

    // Include branch information in the return data
    const branchData = branch
      ? {
          name: branch.name,
          id: branch._id,
        }
      : null;

    // Get subscription info
    const subscriptionActive = school.subscription?.status === "active";
    const subscriptionType = school.subscription?.type || "none";
    const subscriptionMaxUsers = school.subscription?.maxUsers || 0;

    // Return branch-specific data
    return {
      name: school.name,
      branch: branchData,
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
      isBranchAdmin,
    };
  }

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
    isBranchAdmin,
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
        description={
          schoolData?.isBranchAdmin && schoolData.branch
            ? `Manage ${schoolData.branch.name}`
            : "Manage your school and students"
        }
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
                    {schoolData.isBranchAdmin
                      ? "Branch Admins"
                      : "School Admins"}
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
                <CardTitle>
                  {schoolData.isBranchAdmin
                    ? "Branch Information"
                    : "School Information"}
                </CardTitle>
                <CardDescription>
                  {schoolData.isBranchAdmin
                    ? "Details about your branch"
                    : "Details about your school"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>
                      {schoolData.isBranchAdmin && schoolData.branch
                        ? schoolData.branch.name
                        : schoolData.name}
                    </span>
                  </div>
                  {schoolData.location.city && (
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span>
                        {`${schoolData.location.city}${schoolData.location.country ? `, ${schoolData.location.country}` : ""}`}
                      </span>
                    </div>
                  )}
                  {schoolData.isBranchAdmin ? (
                    <div className="flex justify-between">
                      <span className="font-medium">School:</span>
                      <span>{schoolData.name}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="font-medium">Primary Contact:</span>
                      <span>
                        {schoolData.primaryContact.name} (
                        {schoolData.primaryContact.email})
                      </span>
                    </div>
                  )}
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
