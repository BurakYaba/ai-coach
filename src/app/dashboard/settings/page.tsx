"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  AlertCircle,
  Key,
  Moon,
  Sun,
  Laptop,
  Bell,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/use-notifications";

const settingsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  progressReminders: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notification hooks
  const { isSupported, permissionState, requestPermission } =
    useNotifications();
  const [notificationPermissionRequested, setNotificationPermissionRequested] =
    useState(false);

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      emailNotifications: true,
      progressReminders: true,
      theme: "system",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();

        // Set form values
        settingsForm.reset({
          emailNotifications: data.settings.emailNotifications,
          progressReminders: data.settings.progressReminders,
          theme: data.settings.theme,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        setSettingsError("Failed to load settings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchSettings();
    }
  }, [session, settingsForm]);

  // Check if permission state changes after requesting
  useEffect(() => {
    if (notificationPermissionRequested) {
      setNotificationPermissionRequested(false);
      if (permissionState === "granted") {
        setSettingsSuccess("Notification permission granted!");
      } else if (permissionState === "denied") {
        setSettingsError(
          "Notification permission denied. You won't receive reminders."
        );
      }
    }
  }, [permissionState, notificationPermissionRequested]);

  // Handle settings form submission
  const onSubmitSettings = async (values: SettingsFormValues) => {
    setSettingsSuccess("");
    setSettingsError("");
    setSavingSettings(true);

    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSettingsSuccess("Settings updated successfully");

      // If progress reminders are enabled but notifications aren't granted, show a hint
      if (
        values.progressReminders &&
        isSupported &&
        permissionState !== "granted"
      ) {
        setSettingsSuccess(
          "Settings updated. Enable browser notifications for reminders to work."
        );
      }
    } catch (err: any) {
      setSettingsError(
        err.message || "An error occurred while updating settings"
      );
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle requesting notification permission
  const handleRequestNotificationPermission = async () => {
    if (isSupported) {
      const result = await requestPermission();
      setNotificationPermissionRequested(true);
    } else {
      setSettingsError(
        "Browser notifications are not supported in your browser."
      );
    }
  };

  // Handle password form submission
  const onSubmitPassword = async (values: PasswordFormValues) => {
    setPasswordSuccess("");
    setPasswordError("");
    setSavingPassword(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPasswordError(
        err.message || "An error occurred while changing password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {settingsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{settingsError}</AlertDescription>
            </Alert>
          )}

          {settingsSuccess && (
            <Alert className="bg-green-50 text-green-800 border border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{settingsSuccess}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Notification Permissions</CardTitle>
              </div>
              <CardDescription>
                Browser notifications are required for learning reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        Browser Notifications
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isSupported ? (
                          <>
                            Status:{" "}
                            {permissionState === "granted"
                              ? "Allowed ✓"
                              : permissionState === "denied"
                                ? "Blocked ✗"
                                : "Not set"}
                          </>
                        ) : (
                          "Your browser doesn't support notifications"
                        )}
                      </p>
                    </div>
                    {isSupported && permissionState !== "granted" && (
                      <Button
                        variant="outline"
                        onClick={handleRequestNotificationPermission}
                        disabled={permissionState === "denied"}
                      >
                        {permissionState === "denied"
                          ? "Permission Denied"
                          : "Request Permission"}
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {permissionState === "denied" && (
                    <span className="text-red-500">
                      You've blocked notifications. To enable reminders, please
                      update your browser settings.
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notification and theme preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form
                  onSubmit={settingsForm.handleSubmit(onSubmitSettings)}
                  className="space-y-6"
                >
                  <FormField
                    control={settingsForm.control}
                    name="progressReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Progress Reminders</FormLabel>
                          <FormDescription>
                            Receive browser notifications at your preferred
                            learning times to help maintain your daily study
                            streak
                          </FormDescription>
                          {field.value &&
                            isSupported &&
                            permissionState !== "granted" && (
                              <p className="text-sm text-amber-500 mt-2">
                                You need to allow browser notifications for
                                reminders to work
                              </p>
                            )}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Weekly Progress Report</FormLabel>
                          <FormDescription>
                            Receive a weekly email summarizing your learning
                            progress and achievements
                          </FormDescription>
                          <p className="text-sm text-amber-500 mt-2">
                            Coming soon! Email reporting feature is currently
                            under development.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                <span>Light</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                <span>Dark</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Laptop className="h-4 w-4" />
                                <span>System</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your preferred theme for the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingSettings}>
                      {savingSettings ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          {passwordSuccess && (
            <Alert className="bg-green-50 text-green-800 border border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{passwordSuccess}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters long
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingPassword}>
                      {savingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
