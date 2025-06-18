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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { encryptCredentials, decryptCredentials } from "@/lib/crypto-utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface SavedCredentials {
  email: string;
  password: string; // This will be encrypted when stored
  rememberMe: boolean;
}

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

  // Use localStorage to persist login credentials (encrypted)
  const [savedCredentials, setSavedCredentials] =
    useLocalStorage<SavedCredentials | null>("fluenta_login_credentials", null);

  // Decrypt credentials for form initialization
  const decryptedCredentials = savedCredentials
    ? decryptCredentials(savedCredentials)
    : null;

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
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: decryptedCredentials?.email || "",
      password: decryptedCredentials?.password || "",
      rememberMe: decryptedCredentials?.rememberMe || false,
    },
  });

  // Update form when savedCredentials change (e.g., on component mount)
  useEffect(() => {
    if (decryptedCredentials) {
      form.setValue("email", decryptedCredentials.email);
      form.setValue("password", decryptedCredentials.password);
      form.setValue("rememberMe", decryptedCredentials.rememberMe);
    }
  }, [decryptedCredentials, form]);

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

    try {
      // Handle remember me functionality
      if (data.rememberMe) {
        // Encrypt and save credentials to localStorage
        const encryptedCredentials = encryptCredentials({
          email: data.email,
          password: data.password,
          rememberMe: true,
        });
        setSavedCredentials(encryptedCredentials);
      } else {
        // Clear saved credentials if remember me is unchecked
        setSavedCredentials(null);
      }

      // First attempt to sign in without redirect
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        // Add remember me flag to session (will be used in auth config)
        rememberMe: data.rememberMe.toString(),
      });

      if (!result?.ok) {
        // Check if this is an email verification error
        if (result?.error?.includes("verify your email")) {
          setEmailVerificationError(result.error);
        }
        // Check if this is a subscription error
        else if (result?.error?.includes("subscription")) {
          setSubscriptionError(result.error);
        }
        // Check if this is a concurrent login error
        else if (result?.error?.includes("already logged in")) {
          setConcurrentLoginError(result.error);
        } else {
          // Make sure to show toast for invalid credentials
          toast({
            title: "Login failed",
            description: result?.error || "Invalid email or password",
            variant: "destructive",
          });
          console.error("Login error:", result?.error);
        }
        setIsLoading(false);
        return;
      }

      // Success - now check the user's role to determine redirect
      try {
        const userResponse = await fetch("/api/user/profile");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userRole = userData.user?.role;
          const hasBranch = !!userData.user?.branch;

          // Show success toast
          toast({
            title: "Success",
            description: data.rememberMe
              ? "Login successful! Your credentials have been saved securely."
              : "Login successful!",
          });

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
          // Fallback to regular dashboard if profile fetch fails
          toast({
            title: "Success",
            description: data.rememberMe
              ? "Login successful! Your credentials have been saved securely."
              : "Login successful!",
          });
          router.push("/dashboard");
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Fallback to regular dashboard if profile fetch fails
        toast({
          title: "Success",
          description: data.rememberMe
            ? "Login successful! Your credentials have been saved securely."
            : "Login successful!",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  // Function to clear saved credentials
  const clearSavedCredentials = () => {
    setSavedCredentials(null);
    form.reset({
      email: "",
      password: "",
      rememberMe: false,
    });
    toast({
      title: "Credentials cleared",
      description: "Saved login credentials have been removed.",
    });
  };

  return (
    <Form {...form}>
      {subscriptionError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription>{subscriptionError}</AlertDescription>
        </Alert>
      )}

      {emailVerificationError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email Verification Required</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{emailVerificationError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResendingVerification}
              className="mt-2"
            >
              {isResendingVerification
                ? "Sending..."
                : "Resend Verification Email"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Concurrent Login Error Alert */}
      {concurrentLoginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-red-600 font-semibold text-center justify-self-center">
            Account Already in Use
          </AlertTitle>
          <AlertDescription className="mt-2 text-center justify-self-center">
            <div className="text-center">{concurrentLoginError}</div>
            <div className="flex justify-center mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConcurrentLoginError(null)}
                  className="w-32 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      setIsLoading(true);

                      // Force login by attempting login with forceLogin flag
                      const result = await signIn("credentials", {
                        email: form.getValues("email"),
                        password: form.getValues("password"),
                        redirect: false,
                        forceLogin: "true", // Special flag to force terminate other sessions
                      });

                      if (result?.ok) {
                        // Clear the concurrent login error
                        setConcurrentLoginError(null);

                        // Show success message
                        toast({
                          title: "Login Successful",
                          description:
                            "Previous session terminated. You are now logged in.",
                        });

                        // Redirect based on user role (same logic as normal login)
                        try {
                          const userResponse = await fetch("/api/user/profile");
                          if (userResponse.ok) {
                            const userData = await userResponse.json();
                            const userRole = userData.user?.role;
                            const hasBranch = !!userData.user?.branch;

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
                      } else {
                        toast({
                          title: "Force Login Failed",
                          description:
                            result?.error ||
                            "Unable to force login. Please try again.",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      console.error("Force login error:", error);
                      toast({
                        title: "Error",
                        description: "Something went wrong during force login.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-32 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  {isLoading ? "Forcing Login..." : "Force Login"}
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Remember me on this device
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Your login credentials will be saved securely for faster
                  access
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        {savedCredentials && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSavedCredentials}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear saved credentials
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
