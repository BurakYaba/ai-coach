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
  Settings as SettingsIcon,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  // Handle authentication
  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
  }, [session, router]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger
              value="general"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
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

            {/* Notification Permissions Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                    <Bell className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Notification Permissions
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Browser notifications are required for learning reminders
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-row items-start justify-between space-x-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">
                        Browser Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isSupported ? (
                          <>
                            Status:{" "}
                            <span
                              className={`font-medium ${
                                permissionState === "granted"
                                  ? "text-green-600"
                                  : permissionState === "denied"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {permissionState === "granted"
                                ? "Allowed ✓"
                                : permissionState === "denied"
                                  ? "Blocked ✗"
                                  : "Not set"}
                            </span>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                      >
                        {permissionState === "denied"
                          ? "Permission Denied"
                          : "Request Permission"}
                      </Button>
                    )}
                  </div>
                  {permissionState === "denied" && (
                    <p className="text-sm text-red-600 mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      You've blocked notifications. To enable reminders, please
                      update your browser settings.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <SettingsIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your notification and theme preferences
                    </CardDescription>
                  </div>
                </div>
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-700 font-medium">
                              Progress Reminders
                            </FormLabel>
                            <FormDescription className="text-gray-600">
                              Receive browser notifications at your preferred
                              learning times to help maintain your daily study
                              streak
                            </FormDescription>
                            {field.value &&
                              isSupported &&
                              permissionState !== "granted" && (
                                <p className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded border border-amber-200">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-700 font-medium">
                              Weekly Progress Report
                            </FormLabel>
                            <FormDescription className="text-gray-600">
                              Receive a weekly email summarizing your learning
                              progress and achievements
                            </FormDescription>
                            <p className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded border border-amber-200">
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-gray-700 font-medium">
                            Theme
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
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
                          <FormDescription className="text-gray-600">
                            Select your preferred theme for the application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={savingSettings}
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {savingSettings ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
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

            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                    <Key className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your password to keep your account secure
                    </CardDescription>
                  </div>
                </div>
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
                          <FormLabel className="text-gray-700 font-medium">
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your current password"
                              {...field}
                              className="border-2 border-gray-300 focus:border-blue-500"
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
                          <FormLabel className="text-gray-700 font-medium">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your new password"
                              {...field}
                              className="border-2 border-gray-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-600">
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
                          <FormLabel className="text-gray-700 font-medium">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                              className="border-2 border-gray-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={savingPassword}
                        className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
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
    </div>
  );
}
