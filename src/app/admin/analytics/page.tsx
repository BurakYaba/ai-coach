import { Metadata } from "next";
import { UserAnalytics } from "@/components/admin/UserAnalytics";

export const metadata: Metadata = {
  title: "User Analytics | Admin Dashboard",
  description: "Track and analyze user activity across all modules",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
        <p className="text-muted-foreground">
          Track detailed user activity and module usage statistics
        </p>
      </div>

      <UserAnalytics />
    </div>
  );
}
