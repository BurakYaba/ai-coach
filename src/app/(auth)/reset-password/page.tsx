import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Fluenta",
  description: "Set your new password",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Reset Your{" "}
          <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Password
          </span>
        </h2>
        <p className="text-white/80 text-lg">Enter your new password below</p>
      </div>

      {/* Reset Password Form */}
      <div className="mb-8">
        <Suspense
          fallback={<div className="text-white/70 text-center">Loading...</div>}
        >
          <ResetPasswordForm />
        </Suspense>
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <div className="text-white/70">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
