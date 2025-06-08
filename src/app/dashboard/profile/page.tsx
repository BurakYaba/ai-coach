"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Smartphone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

const learningTimeOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
];

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  dailyGoal: z
    .number()
    .min(5, { message: "Daily goal must be at least 5 minutes" })
    .max(240, { message: "Daily goal must be less than 240 minutes" }),
  preferredLearningTime: z
    .array(z.string())
    .min(1, { message: "Please select at least one preferred learning time" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);

  // Check for saved credentials
  const [savedCredentials] = useLocalStorage<any>(
    "fluenta_login_credentials",
    null
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      dailyGoal: 30,
      preferredLearningTime: [],
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUserData(data.user);

        // Set form values
        form.reset({
          name: data.user.name,
          dailyGoal: data.user.learningPreferences.dailyGoal,
          preferredLearningTime:
            data.user.learningPreferences.preferredLearningTime,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session, form]);

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    setSuccess("");
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          dailyGoal: values.dailyGoal,
          preferredLearningTime: values.preferredLearningTime,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const data = await response.json();
      setUserData(data.user);
      setSuccess("Profile updated successfully");

      // Update the session data to reflect name change if it changed
      if (session?.user?.name !== values.name) {
        await update({ name: values.name });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to clear saved credentials
  const clearSavedCredentials = () => {
    localStorage.removeItem("fluenta_login_credentials");
    toast({
      title: "Credentials cleared",
      description:
        "Saved login credentials have been removed from this device.",
    });
    // Force a re-render by updating a dummy state or using window.location.reload()
    window.location.reload();
  };

  // Calculate session expiry
  const getSessionInfo = () => {
    if (!session?.user) return null;

    const rememberMe = session.user.rememberMe;
    const sessionDuration = rememberMe ? 30 : 7; // 30 days for remember me, 7 days otherwise

    return {
      rememberMe,
      sessionDuration,
      hasRememberMe: !!savedCredentials,
    };
  };

  const sessionInfo = getSessionInfo();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
            </CardContent>
            <div className="px-6 pb-6">
              <Skeleton className="h-10 w-24 ml-auto" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and learning preferences
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Security & Sessions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle>Security & Sessions</CardTitle>
              <CardDescription>
                Manage your login sessions and security preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Session Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={sessionInfo?.rememberMe ? "default" : "secondary"}
                >
                  {sessionInfo?.sessionDuration} days
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {sessionInfo?.rememberMe
                    ? "Extended (Remember Me)"
                    : "Standard"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Remember Me Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={sessionInfo?.hasRememberMe ? "default" : "outline"}
                >
                  {sessionInfo?.hasRememberMe ? "Enabled" : "Disabled"}
                </Badge>
                {sessionInfo?.hasRememberMe && (
                  <span className="text-sm text-muted-foreground">
                    Credentials saved on this device
                  </span>
                )}
              </div>
            </div>
          </div>

          {sessionInfo?.hasRememberMe && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Saved Login Credentials</p>
                <p className="text-xs text-muted-foreground">
                  Your login credentials are saved securely on this device for
                  faster access
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSavedCredentials}
                className="text-destructive hover:text-destructive"
              >
                Clear Credentials
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Security Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Only use "Remember Me" on trusted devices</li>
              <li>• Clear saved credentials if using a shared computer</li>
              <li>
                • Your session will automatically expire after{" "}
                {sessionInfo?.sessionDuration} days
              </li>
              <li>
                • Log out from all devices if you suspect unauthorized access
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Existing Personal Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-lg">
                {userData?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and learning preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Learning Goal (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={240}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      How many minutes do you want to study each day?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLearningTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Learning Time</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {learningTimeOptions.map(option => (
                        <FormItem
                          key={option.value}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      option.value,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormDescription>
                      When do you prefer to study? We'll send reminders during
                      these times.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
