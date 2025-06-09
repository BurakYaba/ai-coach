import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password - Fluenta",
  description: "Set your new password",
};

export default function ResetPasswordPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Reset your password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
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
