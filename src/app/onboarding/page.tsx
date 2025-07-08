import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

// Modern animated background component
const OnboardingBackgroundGradient = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/2 w-[60rem] h-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 blur-3xl animate-pulse"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] opacity-20">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating elements */}
      <div className="hidden lg:block absolute top-1/4 left-10 w-24 h-24 rounded-full bg-blue-400/20 blur-xl animate-float"></div>
      <div
        className="hidden lg:block absolute bottom-1/3 right-10 w-20 h-20 rounded-full bg-purple-400/20 blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="hidden lg:block absolute top-2/3 right-1/4 w-16 h-16 rounded-full bg-indigo-400/20 blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  await dbConnect();

  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  // If onboarding is already completed, redirect to dashboard
  if (user.onboarding?.completed) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background elements */}
      <OnboardingBackgroundGradient />

      {/* Main content area */}
      <div className="relative z-10 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <OnboardingFlow initialData={user.onboarding} />
        </div>
      </div>
    </div>
  );
}
