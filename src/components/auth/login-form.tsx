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
    if (errorParam === "SubscriptionExpired") {
      setSubscriptionError(
        "Your subscription has expired. Please contact your branch administrator to renew your subscription."
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

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setSubscriptionError(null);

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
        // Check if this is a subscription error
        if (result?.error?.includes("subscription")) {
          setSubscriptionError(result.error);
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
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Expired</AlertTitle>
          <AlertDescription>
            {subscriptionError}
            <div className="mt-2 text-sm">
              Your school's subscription has expired. You will not be able to
              access the learning content until your branch administrator renews
              the subscription.
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
