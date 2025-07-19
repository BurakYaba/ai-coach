"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { trackEvent } from "@/lib/google-analytics";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [emailVerificationError, setEmailVerificationError] = useState<
    string | null
  >(null);
  const [concurrentLoginError, setConcurrentLoginError] = useState<
    string | null
  >(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showedMessageToast, setShowedMessageToast] = useState(false);

  // Check for subscription error in URL params
  useEffect(() => {
    // For App Router, we need to use the URLSearchParams API
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    const messageParam = params.get("message");

    if (errorParam === "SubscriptionExpired") {
      setSubscriptionError(
        "Your subscription has expired. Please contact your branch administrator to renew your subscription."
      );
    } else if (errorParam === "session_terminated") {
      setConcurrentLoginError(
        messageParam ||
          "Your session has been terminated. This may be due to a login from another device."
      );
    }

    // Show toast for generic message (e.g., after registration)
    if (messageParam && !showedMessageToast) {
      toast({
        title: "Notice",
        description: messageParam,
        duration: 7000,
      });
      setShowedMessageToast(true);
    }
  }, [showedMessageToast]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResendVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsResendingVerification(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: result.message,
          duration: 5000,
        });
        setEmailVerificationError(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send verification email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setSubscriptionError(null);
    setEmailVerificationError(null);
    setConcurrentLoginError(null);

    // Track login attempt
    trackEvent("login_attempt", "authentication", "credentials");

    try {
      // First attempt to sign in without redirect
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok) {
        // Track specific login errors for analytics
        let errorCategory = "general_error";

        // Check if this is an email verification error
        if (result?.error?.includes("verify your email")) {
          errorCategory = "email_verification_required";
          setEmailVerificationError(result.error);
        }
        // Check if this is a subscription error
        else if (result?.error?.includes("subscription")) {
          errorCategory = "subscription_error";
          setSubscriptionError(result.error);
        }
        // Check if this is a concurrent login error
        else if (result?.error?.includes("already logged in")) {
          errorCategory = "concurrent_login";
          setConcurrentLoginError(result.error);
        }
        // Check if this is invalid credentials
        else if (result?.error?.includes("Invalid email or password")) {
          errorCategory = "invalid_credentials";
        } else {
          // Make sure to show toast for invalid credentials
          toast({
            title: "Login failed",
            description: result?.error || "Invalid email or password",
            variant: "destructive",
          });
        }

        // Track login failure with specific error type
        trackEvent("login_failed", "authentication", errorCategory);

        // Enhanced error logging
        console.error("Login failed:", {
          error: result?.error,
          errorCategory,
          email: data.email,
          timestamp: new Date().toISOString(),
        });

        return;
      }

      // Track successful login
      trackEvent("login_success", "authentication", "credentials");

      // Success - now check the user's role and subscription status to determine redirect
      try {
        // Get session to check for expired user status
        const sessionResponse = await fetch("/api/auth/session");
        const sessionData = await sessionResponse.json();

        // Check if user is expired and redirect to pricing
        if (sessionData?.user?.isExpiredUser) {
          trackEvent(
            "login_expired_user",
            "authentication",
            "subscription_expired"
          );
          toast({
            title: "Subscription Expired",
            description:
              "Your free trial has expired. Please choose a subscription plan to continue.",
            variant: "destructive",
          });
          router.push("/pricing?expired=true");
          return;
        }

        const userResponse = await fetch("/api/user/profile");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userRole = userData.user?.role;
          const hasBranch = !!userData.user?.branch;
          const onboardingCompleted = sessionData?.user?.onboardingCompleted;

          // Track user role for analytics
          trackEvent("login_redirect", "authentication", userRole);

          // Show success toast
          toast({
            title: "Success",
            description: "Login successful!",
          });

          // Check if user needs to complete onboarding
          if (!onboardingCompleted && userRole === "user") {
            router.push("/onboarding");
            return;
          }

          // If user is a school_admin and has a branch, redirect to school-admin dashboard
          if (userRole === "school_admin" && hasBranch) {
            router.push("/school-admin");
          }
          // If user is a system admin, also redirect to admin dashboard
          else if (userRole === "admin") {
            router.push("/admin");
          }
          // Otherwise redirect to regular dashboard
          else {
            router.push("/dashboard");
          }
        } else {
          // Fallback to dashboard if profile fetch fails
          router.push("/dashboard");
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Fallback to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        email: data.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });

      // Track unexpected errors
      trackEvent("login_error", "authentication", "unexpected_error");

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-white/80">
          Sign in to your account to continue
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="username"
                    {...field}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-white/60 hover:text-white hover:bg-white/10"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          {/* Email Verification Error */}
          {emailVerificationError && (
            <Alert className="border-orange-500/50 bg-orange-500/10">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <AlertTitle className="text-orange-200">
                Email Verification Required
              </AlertTitle>
              <AlertDescription className="text-orange-300">
                {emailVerificationError}
                <Button
                  variant="link"
                  className="h-auto p-0 text-orange-200 hover:text-orange-100 underline ml-1"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                >
                  {isResendingVerification
                    ? "Sending..."
                    : "Resend verification email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Subscription Error */}
          {subscriptionError && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-200">
                Subscription Required
              </AlertTitle>
              <AlertDescription className="text-red-300">
                {subscriptionError}
              </AlertDescription>
            </Alert>
          )}

          {/* Concurrent Login Error */}
          {concurrentLoginError && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertTitle className="text-yellow-200">
                Session Conflict
              </AlertTitle>
              <AlertDescription className="text-yellow-300 space-y-2">
                <p>{concurrentLoginError}</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-yellow-500/20 border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/30"
                    disabled={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const result = await signIn("credentials", {
                          email: form.getValues("email"),
                          password: form.getValues("password"),
                          redirect: false,
                          forceLogin: "true",
                        });

                        if (!result?.ok) {
                          toast({
                            title: "Force login failed",
                            description:
                              result?.error || "Invalid email or password",
                            variant: "destructive",
                          });
                          return;
                        }

                        // Add retry logic to ensure session is established after force login
                        let sessionData = null;
                        let retryCount = 0;
                        const maxRetries = 3;

                        while (retryCount < maxRetries) {
                          try {
                            // Small delay before each attempt
                            if (retryCount > 0) {
                              await new Promise(resolve =>
                                setTimeout(resolve, 1000)
                              );
                            }

                            const sessionResponse =
                              await fetch("/api/auth/session");
                            const data = await sessionResponse.json();

                            // Check if we have a valid session with user ID
                            if (data?.user?.id) {
                              sessionData = data;
                              break;
                            }

                            retryCount++;
                          } catch (error) {
                            retryCount++;
                            if (retryCount >= maxRetries) {
                              throw error;
                            }
                          }
                        }

                        if (!sessionData?.user?.id) {
                          // If session still not available, use router.refresh() and redirect
                          router.refresh();
                          router.push("/dashboard");
                          return;
                        }

                        // Redirect based on user role and subscription status (same logic as normal login)
                        try {
                          // Check if user is expired and redirect to pricing
                          if (sessionData?.user?.isExpiredUser) {
                            router.push("/pricing?expired=true");
                            return;
                          }

                          const userResponse = await fetch("/api/user/profile");
                          if (userResponse.ok) {
                            const userData = await userResponse.json();
                            const userRole = userData.user?.role;
                            const hasBranch = !!userData.user?.branch;
                            const onboardingCompleted =
                              sessionData?.user?.onboardingCompleted;

                            // Show success toast
                            toast({
                              title: "Success",
                              description: "Force login successful!",
                            });

                            // Check if user needs to complete onboarding
                            if (!onboardingCompleted && userRole === "user") {
                              router.push("/onboarding");
                              return;
                            }

                            if (userRole === "school_admin" && hasBranch) {
                              router.push("/school-admin");
                            } else if (userRole === "admin") {
                              router.push("/admin");
                            } else {
                              router.push("/dashboard");
                            }
                          } else {
                            router.push("/dashboard");
                          }
                        } catch (profileError) {
                          router.push("/dashboard");
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description:
                            "Something went wrong. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Force Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      {/* OAuth Sign In Options */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/60">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          onClick={() => {
            trackEvent("oauth_login_attempt", "authentication", "google");
            signIn("google", { callbackUrl: "/onboarding" });
          }}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="link"
          className="text-white/80 hover:text-white"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot your password?
        </Button>
      </div>
    </div>
  );
}
