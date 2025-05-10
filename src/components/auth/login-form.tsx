"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setSubscriptionError(null);

    try {
      // First attempt to sign in without redirect
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if this is a subscription error
        if (result.error.includes("subscription")) {
          setSubscriptionError(result.error);
        } else {
          toast.error(result.error);
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
          router.push("/dashboard");
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Fallback to regular dashboard if profile fetch fails
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {subscriptionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Expired</AlertTitle>
          <AlertDescription>
            {subscriptionError}
            <div className="mt-2 text-sm">
              Please contact your branch administrator to renew your
              subscription.
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
