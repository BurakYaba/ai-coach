"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent double API calls in development mode
      if (hasCalledAPI.current) {
        return;
      }
      hasCalledAPI.current = true;

      const token = searchParams?.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus("success");
          setMessage(
            result.message || "Your email has been verified successfully!"
          );

          // Redirect to English login after 3 seconds
          setTimeout(() => {
            router.push(
              "/en/login?message=Email verified successfully! You can now log in."
            );
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.error || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {status === "loading" && "Verifying Email"}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <CardDescription>
              {status === "loading" &&
                "Please wait while we verify your email address..."}
              {status === "success" &&
                "Welcome to Fluenta! Your account is now active."}
              {status === "error" &&
                "There was an issue verifying your email address."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">{message}</p>
                <p className="text-sm text-gray-500">
                  You will be redirected to the login page in a few seconds...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <p className="text-red-600 font-medium">{message}</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/en/login">Go to Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/en/register">Create New Account</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <Card className="w-full">
              <CardContent className="text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p>Loading verification page...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
