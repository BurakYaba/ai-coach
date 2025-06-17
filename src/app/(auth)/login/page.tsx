import { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <h1 className="sr-only">
          {callbackUrl
            ? "Login to Continue - Fluenta Account Access"
            : "Login to Your Fluenta Account"}
        </h1>
        <CardTitle className="text-2xl text-center">
          {callbackUrl ? "Login to Continue" : "Welcome back to Fluenta"}
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <div className="text-sm text-center">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
