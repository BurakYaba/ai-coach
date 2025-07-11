import { Metadata } from "next";
import { UserAnalytics } from "@/components/admin/UserAnalytics";

export const metadata: Metadata = {
  title: "User Analytics | Admin Dashboard",
  description: "Track and analyze user activity across all modules",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            User Analytics
          </h1>
          <p className="text-green-100 text-lg">
            Track detailed user activity and module usage statistics
          </p>
        </div>

        {/* Analytics Content */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30">
          <UserAnalytics />
        </div>
      </div>
    </div>
  );
}
