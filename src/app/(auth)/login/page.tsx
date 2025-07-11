import { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

interface Props {
  searchParams: { callbackUrl?: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const callbackUrl = searchParams.callbackUrl;

  if (callbackUrl) {
    return {
      title: "Login to Continue - Fluenta AI English Learning",
      description:
        "Sign in to your Fluenta account to continue to your requested page. Access personalized AI lessons, track your progress, and improve your English skills with advanced learning technology.",
      alternates: {
        canonical: "/login",
      },
    };
  }

  return {
    title: "Login to Fluenta - AI English Learning Platform",
    description:
      "Sign in to your Fluenta account to continue your English learning journey. Access personalized AI lessons, track your progress, and improve your speaking, writing, and grammar skills with advanced feedback technology.",
    alternates: {
      canonical: "/login",
    },
  };
}

export default function LoginPage({ searchParams }: Props) {
  const callbackUrl = searchParams.callbackUrl;

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
        <h1 className="sr-only">
          {callbackUrl
            ? "Login to Continue - Fluenta Account Access"
            : "Login to Your Fluenta Account"}
        </h1>
        <h2 className="text-3xl font-bold text-white mb-3">
          {callbackUrl ? (
            "Login to Continue"
          ) : (
            <>
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Fluenta
              </span>
            </>
          )}
        </h2>
        <p className="text-white/80 text-lg">
          Enter your email and password to access your account
        </p>
      </div>

      {/* Login Form */}
      <div className="mb-8">
        <LoginForm />
      </div>

      {/* Footer Links */}
      <div className="space-y-4 text-center">
        <div className="text-white/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
        <div>
          <Link
            href="/forgot-password"
            className="text-purple-300 hover:text-purple-200 font-medium hover:underline transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
