import { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Fluenta Password - Recover Account Access",
  description:
    "Forgot your Fluenta password? Reset it securely and regain access to your personalized AI English learning platform. Get back to improving your speaking, writing, and grammar skills with instant recovery.",
  alternates: {
    canonical: "/forgot-password",
    languages: {
      en: "/forgot-password",
      tr: "/forgot-password",
    },
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white transition-colors group"
        >
          <svg
            className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="sr-only">Reset Your Fluenta Password</h1>
        <h2 className="text-3xl font-bold text-white mb-3">
          Reset Your{" "}
          <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Password
          </span>
        </h2>
        <p className="text-white/80 text-lg">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      {/* Forgot Password Form */}
      <div className="mb-8">
        <ForgotPasswordForm />
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
