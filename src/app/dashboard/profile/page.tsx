"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Smartphone,
  User,
  Settings,
  ArrowLeft,
  Globe,
  Target,
  Calendar,
  Languages,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

const LANGUAGES = [
  { value: "turkish", label: "Turkish" },
  { value: "english", label: "English" },
  { value: "german", label: "German" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
  { value: "italian", label: "Italian" },
  { value: "russian", label: "Russian" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "other", label: "Other (specify)" },
];

const PRACTICE_TIMES = [
  { value: "early_morning", label: "Early Morning (6-9 AM)" },
  { value: "mid_morning", label: "Mid Morning (9 AM-12 PM)" },
  { value: "afternoon", label: "Afternoon (12-5 PM)" },
  { value: "early_evening", label: "Early Evening (5-8 PM)" },
  { value: "late_evening", label: "Late Evening (8-10 PM)" },
];

const REMINDER_TIMING = [
  { value: "30_min", label: "30 minutes before" },
  { value: "1_hour", label: "1 hour before" },
  { value: "2_hours", label: "2 hours before" },
];

const LEARNING_DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const REASONS_FOR_LEARNING = [
  { value: "work", label: "Work/Professional Development", icon: "💼" },
  { value: "education", label: "Education/Academic", icon: "🎓" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "personal", label: "Personal Interest", icon: "💡" },
  { value: "immigration", label: "Immigration", icon: "🌍" },
  { value: "social", label: "Social/Communication", icon: "👥" },
  { value: "other", label: "Other", icon: "📝" },
];

const HOW_HEARD_ABOUT = [
  { value: "search_engine", label: "Search Engine (Google, Bing, etc.)" },
  { value: "ai_assistant", label: "AI Assistant (ChatGPT, Claude, etc.)" },
  { value: "friend_recommendation", label: "Friend/Family Recommendation" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "reddit", label: "Reddit/Forum" },
  { value: "advertisement", label: "Online Advertisement" },
  { value: "app_store", label: "App Store/Play Store" },
  { value: "school", label: "School/Institution" },
  { value: "blog", label: "Blog/Article" },
  { value: "podcast", label: "Podcast" },
  { value: "other", label: "Other" },
];

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  nativeLanguage: z
    .string()
    .min(1, { message: "Please select your native language" }),
  preferredPracticeTime: z
    .string()
    .min(1, { message: "Please select preferred practice time" }),
  preferredLearningDays: z
    .array(z.string())
    .min(1, { message: "Please select at least one learning day" }),
  reminderTiming: z
    .string()
    .min(1, { message: "Please select reminder timing" }),
  reasonsForLearning: z
    .array(z.string())
    .min(1, { message: "Please select at least one reason" }),
  howHeardAbout: z
    .string()
    .min(1, { message: "Please select how you heard about us" }),
  consentDataUsage: z
    .boolean()
    .refine(val => val === true, { message: "Data usage consent is required" }),
  consentAnalytics: z
    .boolean()
    .refine(val => val === true, { message: "Analytics consent is required" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileContent() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [customLanguage, setCustomLanguage] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      nativeLanguage: "",
      preferredPracticeTime: "",
      preferredLearningDays: [],
      reminderTiming: "",
      reasonsForLearning: [],
      howHeardAbout: "",
      consentDataUsage: false,
      consentAnalytics: false,
    },
  });

  // Handle authentication - fixed to handle loading states properly
  useEffect(() => {
    // Don't redirect during loading state or initial hydration
    if (status === "loading") return;

    // Only redirect if we're sure there's no session
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

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

        // Set form values including onboarding data
        const nativeLanguage = data.user.onboarding?.nativeLanguage || "";
        form.reset({
          name: data.user.name,
          nativeLanguage: nativeLanguage,
          preferredPracticeTime:
            data.user.onboarding?.preferredPracticeTime || "",
          preferredLearningDays:
            data.user.onboarding?.preferredLearningDays || [],
          reminderTiming: data.user.onboarding?.reminderTiming || "",
          reasonsForLearning: data.user.onboarding?.reasonsForLearning || [],
          howHeardAbout: data.user.onboarding?.howHeardAbout || "",
          consentDataUsage: data.user.onboarding?.consentDataUsage || false,
          consentAnalytics: data.user.onboarding?.consentAnalytics || false,
        });

        // Set custom language if native language is not in the predefined list
        const predefinedLanguages = [
          "turkish",
          "english",
          "german",
          "french",
          "spanish",
          "italian",
          "russian",
          "arabic",
          "chinese",
          "japanese",
          "korean",
        ];
        if (nativeLanguage && !predefinedLanguages.includes(nativeLanguage)) {
          setCustomLanguage(nativeLanguage);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if session is authenticated and loaded
    if (status === "authenticated" && session?.user) {
      fetchUserData();
    }
  }, [status, session, form]);

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
          onboarding: {
            nativeLanguage:
              values.nativeLanguage === "other"
                ? customLanguage
                : values.nativeLanguage,
            preferredPracticeTime: values.preferredPracticeTime,
            preferredLearningDays: values.preferredLearningDays,
            reminderTiming: values.reminderTiming,
            reasonsForLearning: values.reasonsForLearning,
            howHeardAbout: values.howHeardAbout,
            consentDataUsage: values.consentDataUsage,
            consentAnalytics: values.consentAnalytics,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const data = await response.json();
      setUserData(data.user);
      setSuccess("Profile updated successfully");

      // Save native language to localStorage for tour translations
      const nativeLanguage =
        values.nativeLanguage === "other"
          ? customLanguage
          : values.nativeLanguage;
      if (nativeLanguage) {
        localStorage.setItem("fluenta-native-language", nativeLanguage);
      }

      // DISABLED AGAIN: session.update() is corrupting JWT tokens for old testing users
      // Even with defensive error handling, this call seems to invalidate sessions
      console.log("Session update disabled - name will update on next login");

      // if (session?.user?.name !== values.name) {
      //   try {
      //     await update({ name: values.name });
      //     console.log("Session name updated successfully");
      //   } catch (error) {
      //     console.warn("Failed to update session name (continuing):", error);
      //   }
      // }
    } catch (err: any) {
      console.error(`❌ CLIENT: Profile update failed:`, err.message);
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
      console.log("🔄 Profile update completed:", {
        timestamp: new Date().toISOString(),
      });
    }
  };

  if (status === "loading" || isLoading) {
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

  // Don't render if not authenticated
  if (status !== "authenticated" || !session?.user) {
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                {/* Name */}
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
                        This is the name that will be displayed on your profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Learning Background Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Learning Background
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your language background and location preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Native Language */}
                  <FormField
                    control={form.control}
                    name="nativeLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Native Language
                        </FormLabel>
                        <div className="space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500">
                                <SelectValue placeholder="Select your native language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                              {LANGUAGES.map(language => (
                                <SelectItem
                                  key={language.value}
                                  value={language.value}
                                >
                                  {language.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {field.value === "other" && (
                            <Input
                              placeholder="Enter your native language"
                              value={customLanguage}
                              onChange={e => setCustomLanguage(e.target.value)}
                              className="border-2 border-gray-300 focus:border-purple-500"
                            />
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Study Schedule Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Study Schedule
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your learning schedule and preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preferred Practice Time */}
                <FormField
                  control={form.control}
                  name="preferredPracticeTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Practice Time
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-orange-500">
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                          {PRACTICE_TIMES.map(time => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Learning Days */}
                <FormField
                  control={form.control}
                  name="preferredLearningDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Preferred Learning Days
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {LEARNING_DAYS.map(day => (
                          <FormItem
                            key={day.value}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                id={day.value}
                                checked={field.value?.includes(day.value)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      day.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(d => d !== day.value)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <Label
                              htmlFor={day.value}
                              className="text-sm font-medium"
                            >
                              {day.label}
                            </Label>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reminder Timing */}
                <FormField
                  control={form.control}
                  name="reminderTiming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Reminder Timing
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-orange-500">
                            <SelectValue placeholder="Select reminder timing" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                          {REMINDER_TIMING.map(timing => (
                            <SelectItem key={timing.value} value={timing.value}>
                              {timing.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Learning Goals Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Learning Goals
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Why are you learning English?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reasons for Learning */}
                <FormField
                  control={form.control}
                  name="reasonsForLearning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Select all that apply
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {REASONS_FOR_LEARNING.map(reason => (
                          <FormItem
                            key={reason.value}
                            className="flex items-center space-x-2 space-y-0 p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(reason.value)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      reason.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        r => r !== reason.value
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <span className="text-xl">{reason.icon}</span>
                            <Label className="text-sm font-normal cursor-pointer">
                              {reason.label}
                            </Label>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Discovery & Consent Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Discovery & Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      How you found us and privacy preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* How Heard About */}
                <FormField
                  control={form.control}
                  name="howHeardAbout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        How did you hear about Fluenta AI?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select how you heard about us" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                          {HOW_HEARD_ABOUT.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data Usage Consent */}
                <FormField
                  control={form.control}
                  name="consentDataUsage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Data Usage Consent</FormLabel>
                        <FormDescription>
                          I consent to Fluenta AI using my data to provide
                          personalized learning experiences, improve the
                          service, and send relevant notifications.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Analytics Consent */}
                <FormField
                  control={form.control}
                  name="consentAnalytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Analytics Consent</FormLabel>
                        <FormDescription>
                          I consent to Fluenta AI collecting anonymous usage
                          analytics to improve the platform and develop better
                          learning features.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
