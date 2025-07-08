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
  Globe,
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  MapPin,
  Languages,
  Star,
  Mail,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

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
  nativeLanguage: z
    .string()
    .min(1, { message: "Please select your native language" }),
  country: z.string().min(1, { message: "Please select your country" }),
  region: z.string().min(1, { message: "Please enter your region" }),
  preferredPracticeTime: z
    .string()
    .min(1, { message: "Please select preferred practice time" }),
  preferredLearningDays: z
    .array(z.string())
    .min(1, { message: "Please select at least one learning day" }),
  reasonsForLearning: z
    .array(z.string())
    .min(1, { message: "Please select at least one reason" }),
  dailyStudyTimeGoal: z.number().min(5).max(240),
  weeklyStudyTimeGoal: z.number().min(35).max(1680),
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
  const [customLanguage, setCustomLanguage] = useState("");

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
      nativeLanguage: "",
      country: "",
      region: "",
      preferredPracticeTime: "",
      preferredLearningDays: [],
      reasonsForLearning: [],
      dailyStudyTimeGoal: 30,
      weeklyStudyTimeGoal: 210,
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

        // Set form values including onboarding data
        const nativeLanguage = data.user.onboarding?.nativeLanguage || "";
        form.reset({
          name: data.user.name,
          dailyGoal: data.user.learningPreferences.dailyGoal,
          preferredLearningTime:
            data.user.learningPreferences.preferredLearningTime,
          nativeLanguage: nativeLanguage,
          country: data.user.onboarding?.country || "",
          region: data.user.onboarding?.region || "",
          preferredPracticeTime:
            data.user.onboarding?.preferredPracticeTime || "",
          preferredLearningDays:
            data.user.onboarding?.preferredLearningDays || [],
          reasonsForLearning: data.user.onboarding?.reasonsForLearning || [],
          dailyStudyTimeGoal: data.user.onboarding?.dailyStudyTimeGoal || 30,
          weeklyStudyTimeGoal: data.user.onboarding?.weeklyStudyTimeGoal || 210,
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
          onboarding: {
            nativeLanguage:
              values.nativeLanguage === "other"
                ? customLanguage
                : values.nativeLanguage,
            country: values.country,
            region: values.region,
            preferredPracticeTime: values.preferredPracticeTime,
            preferredLearningDays: values.preferredLearningDays,
            reasonsForLearning: values.reasonsForLearning,
            dailyStudyTimeGoal: values.dailyStudyTimeGoal,
            weeklyStudyTimeGoal: values.weeklyStudyTimeGoal,
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

  // Add a new function to test engagement emails
  const sendTestEmail = async (type: string) => {
    try {
      const response = await fetch("/api/engagement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data:
            type === "achievement"
              ? {
                  achievement: {
                    name: "Test Achievement",
                    description:
                      "This is a test achievement to demonstrate the email system",
                    xpReward: 100,
                    category: "testing",
                  },
                }
              : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Email Sent!",
          description: `Test ${type.replace("_", " ")} email sent successfully.`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send test email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
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
                {/* Daily Goal */}
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
                {/* Preferred Learning Time */}
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
                            <Label className="text-sm font-normal cursor-pointer text-gray-700">
                              {option.label}
                            </Label>
                          </FormItem>
                        ))}
                      </div>
                      <FormDescription className="text-gray-500">
                        When do you prefer to study? We'll send reminders during
                        these times.
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
                            <SelectContent>
                              <SelectItem value="turkish">Turkish</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="russian">Russian</SelectItem>
                              <SelectItem value="arabic">Arabic</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="korean">Korean</SelectItem>
                              <SelectItem value="other">
                                Other (specify)
                              </SelectItem>
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

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Country
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="turkey">Turkey</SelectItem>
                            <SelectItem value="united_states">
                              United States
                            </SelectItem>
                            <SelectItem value="united_kingdom">
                              United Kingdom
                            </SelectItem>
                            <SelectItem value="germany">Germany</SelectItem>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="spain">Spain</SelectItem>
                            <SelectItem value="italy">Italy</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Region/City */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Region/City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your region or city"
                          {...field}
                          className="border-2 border-gray-300 focus:border-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Study Goals & Schedule Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Study Goals & Schedule
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your learning schedule and time commitments
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
                        <SelectContent>
                          <SelectItem value="morning">
                            Morning (6 AM - 12 PM)
                          </SelectItem>
                          <SelectItem value="afternoon">
                            Afternoon (12 PM - 6 PM)
                          </SelectItem>
                          <SelectItem value="evening">
                            Evening (6 PM - 12 AM)
                          </SelectItem>
                          <SelectItem value="night">
                            Night (12 AM - 6 AM)
                          </SelectItem>
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
                        {[
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                          "sunday",
                        ].map(day => (
                          <FormItem
                            key={day}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                id={day}
                                checked={field.value?.includes(day)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      day,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(d => d !== day)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <Label htmlFor={day} className="capitalize text-sm">
                              {day.slice(0, 3)}
                            </Label>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Study Time Goal */}
                  <FormField
                    control={form.control}
                    name="dailyStudyTimeGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Daily Study Time Goal (minutes)
                        </FormLabel>
                        <Select
                          onValueChange={value =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-300 focus:border-orange-500">
                              <SelectValue placeholder="Select daily goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Weekly Study Time Goal */}
                  <FormField
                    control={form.control}
                    name="weeklyStudyTimeGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Weekly Study Time Goal (minutes)
                        </FormLabel>
                        <Select
                          onValueChange={value =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-300 focus:border-orange-500">
                              <SelectValue placeholder="Select weekly goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="105">
                              105 minutes (15 min × 7 days)
                            </SelectItem>
                            <SelectItem value="210">
                              210 minutes (30 min × 7 days)
                            </SelectItem>
                            <SelectItem value="315">
                              315 minutes (45 min × 7 days)
                            </SelectItem>
                            <SelectItem value="420">
                              420 minutes (1 hour × 7 days)
                            </SelectItem>
                            <SelectItem value="630">
                              630 minutes (1.5 hours × 7 days)
                            </SelectItem>
                            <SelectItem value="840">
                              840 minutes (2 hours × 7 days)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Learning Motivation Card */}
            <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Learning Motivation
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your reasons for learning English
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Reasons for Learning */}
                <FormField
                  control={form.control}
                  name="reasonsForLearning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Why are you learning English?
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          {
                            value: "work",
                            label: "Work/Professional Development",
                          },
                          { value: "education", label: "Education/Academic" },
                          { value: "travel", label: "Travel" },
                          { value: "personal", label: "Personal Interest" },
                          { value: "immigration", label: "Immigration" },
                          { value: "social", label: "Social/Communication" },
                          { value: "other", label: "Other" },
                        ].map(reason => (
                          <FormItem
                            key={reason.value}
                            className="flex items-center space-x-2 space-y-0 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
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

        {/* Skill Assessment Results Card */}
        {userData?.onboarding?.skillAssessment && (
          <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Skill Assessment Results
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your current English proficiency level
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div>
                  <h4 className="font-semibold text-indigo-800">CEFR Level</h4>
                  <p className="text-sm text-indigo-600">
                    Your overall proficiency level
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-800">
                    {userData.onboarding.skillAssessment.ceferLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(userData.onboarding.skillAssessment.scores).map(
                  ([skill, score]) => (
                    <div key={skill} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {skill}
                        </span>
                        <span className="text-sm text-gray-600">
                          {score as number}/100
                        </span>
                      </div>
                      <Progress value={score as number} className="h-2" />
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.onboarding.skillAssessment.strengths.map(
                      (strength: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {strength}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Areas to Improve
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.onboarding.skillAssessment.weakAreas.map(
                      (area: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          {area}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Engagement Testing Card */}
        <Card className="border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
                <Mail className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">
                  Engagement System Test
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Test the email notification system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test the engagement email system to see how reminders and
              notifications work.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => sendTestEmail("study_reminder")}
                className="flex items-center gap-2 border-2 border-blue-300 hover:bg-blue-50"
              >
                <Clock className="h-4 w-4" />
                Study Reminder
              </Button>

              <Button
                variant="outline"
                onClick={() => sendTestEmail("weekly_progress")}
                className="flex items-center gap-2 border-2 border-green-300 hover:bg-green-50"
              >
                <TrendingUp className="h-4 w-4" />
                Weekly Report
              </Button>

              <Button
                variant="outline"
                onClick={() => sendTestEmail("achievement")}
                className="flex items-center gap-2 border-2 border-yellow-300 hover:bg-yellow-50"
              >
                <Star className="h-4 w-4" />
                Achievement
              </Button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 <strong>Note:</strong> These are test emails that will be
                sent to your registered email address. Make sure your email
                settings allow notifications from Fluenta AI.
              </p>
            </div>
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
                    variant={sessionInfo?.rememberMe ? "default" : "secondary"}
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
                    variant={sessionInfo?.hasRememberMe ? "default" : "outline"}
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
                    Your login credentials are saved securely on this device for
                    faster access
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
  );
}
