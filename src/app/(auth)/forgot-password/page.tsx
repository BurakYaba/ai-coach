import { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot Password - Fluenta",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Forgot your password?
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
