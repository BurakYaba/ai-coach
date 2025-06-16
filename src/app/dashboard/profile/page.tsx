"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Smartphone,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  // Handle authentication
  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
  }, [session, router]);

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
            <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-gray-600">
              Manage your account information and learning preferences
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Personal Information Card */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Update your personal information and learning preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-lg font-semibold text-gray-700">
                    {userData?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {userData?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="border-2 border-gray-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">
                          This is the name that will be displayed on your
                          profile
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
                        <FormLabel className="text-gray-700 font-medium">
                          Daily Learning Goal (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={5}
                            max={240}
                            {...field}
                            onChange={e =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">
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
                        <FormLabel className="text-gray-700 font-medium">
                          Preferred Learning Time
                        </FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {learningTimeOptions.map(option => (
                            <FormItem
                              key={option.value}
                              className="flex items-center space-x-2 space-y-0 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
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
                              <FormLabel className="text-sm font-normal cursor-pointer text-gray-700">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormDescription className="text-gray-500">
                          When do you prefer to study? We'll send reminders
                          during these times.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Security & Sessions Card */}
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Security & Sessions
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your login sessions and security preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Session Duration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        sessionInfo?.rememberMe ? "default" : "secondary"
                      }
                      className="bg-blue-100 text-blue-800"
                    >
                      {sessionInfo?.sessionDuration} days
                    </Badge>
                    <span className="text-sm text-blue-700">
                      {sessionInfo?.rememberMe
                        ? "Extended (Remember Me)"
                        : "Standard"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Remember Me Status
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        sessionInfo?.hasRememberMe ? "default" : "outline"
                      }
                      className={
                        sessionInfo?.hasRememberMe
                          ? "bg-purple-100 text-purple-800"
                          : ""
                      }
                    >
                      {sessionInfo?.hasRememberMe ? "Enabled" : "Disabled"}
                    </Badge>
                    {sessionInfo?.hasRememberMe && (
                      <span className="text-sm text-purple-700">
                        Credentials saved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {sessionInfo?.hasRememberMe && (
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-800">
                      Saved Login Credentials
                    </p>
                    <p className="text-xs text-yellow-700">
                      Your login credentials are saved securely on this device
                      for faster access
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSavedCredentials}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    Clear Credentials
                  </Button>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  Security Tips
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Only use "Remember Me" on trusted devices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Clear saved credentials if using a shared computer
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Your session will automatically expire after{" "}
                    {sessionInfo?.sessionDuration} days
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Log out from all devices if you suspect unauthorized access
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
