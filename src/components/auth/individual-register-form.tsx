"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { trackEvent } from "@/lib/google-analytics";

const individualRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type IndividualRegisterFormValues = z.infer<typeof individualRegisterSchema>;

export function IndividualRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<IndividualRegisterFormValues>({
    resolver: zodResolver(individualRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  async function onSubmit(data: IndividualRegisterFormValues) {
    setIsLoading(true);

    // Track registration attempt
    trackEvent(
      "registration_attempt",
      "authentication",
      "individual_credentials"
    );

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          registrationType: "individual",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Track registration failure with specific error
        let errorCategory = "general_error";
        if (result.error?.includes("already exists")) {
          errorCategory = "email_already_exists";
        } else if (result.error?.includes("validation")) {
          errorCategory = "validation_error";
        }

        trackEvent("registration_failed", "authentication", errorCategory);

        // Enhanced error logging
        console.error("Registration failed:", {
          error: result.error,
          errorCategory,
          email: data.email,
          registrationType: "individual",
          timestamp: new Date().toISOString(),
        });

        throw new Error(result.error || "Something went wrong");
      }

      // Track successful registration
      trackEvent(
        "registration_success",
        "authentication",
        "individual_credentials"
      );

      // Track email verification status
      if (result.emailSent) {
        trackEvent(
          "email_verification_sent",
          "authentication",
          result.emailProvider
        );
      } else {
        trackEvent(
          "email_verification_failed",
          "authentication",
          "delivery_failed"
        );
      }

      // Show different message based on whether email was sent
      const emailSentMessage = result.emailSent
        ? "Please check your email and click the verification link to complete your registration."
        : "Account created successfully! Note: Email verification is temporarily unavailable.";

      toast({
        title: "Registration Successful!",
        description: emailSentMessage,
        duration: 8000, // Show longer for important message
      });

      // Redirect to login with a message
      router.push(
        "/login?message=Account created successfully. Please check your email for verification."
      );
    } catch (error) {
      console.error("Registration error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        email: data.email,
        registrationType: "individual",
        timestamp: new Date().toISOString(),
      });

      // Track unexpected errors
      trackEvent("registration_error", "authentication", "unexpected_error");

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
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
              <FormLabel className="text-white font-medium">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        />

        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-200 mb-2">What you get:</h4>
          <ul className="text-sm text-blue-100 space-y-1">
            <li>• 14 days free trial</li>
            <li>• Full access to all learning modules</li>
            <li>• AI-powered personalized feedback</li>
            <li>• After trial: $14.99/month subscription</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Start Free Trial"}
        </Button>
      </form>

      {/* OAuth Registration Options */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/60">
              Or sign up with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          onClick={() => {
            trackEvent(
              "oauth_registration_attempt",
              "authentication",
              "google_individual"
            );
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
          Sign up with Google
        </Button>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
          <p className="text-xs text-blue-200 text-center">
            <strong>Fast & Secure:</strong> OAuth registration skips email
            verification and gets you started instantly with the same 14-day
            free trial.
          </p>
        </div>
      </div>

      <p className="text-xs text-center text-white/60">
        By creating an account, you agree to our terms of service and privacy
        policy.
      </p>
    </Form>
  );
}
