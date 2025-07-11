"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
// Removed unused Card imports
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradientCard } from "@/components/ui/gradient-card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Clock,
  Target,
  Users,
  Shield,
  Languages,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface OnboardingData {
  completed: boolean;
  currentStep: number;
  language: "en" | "tr";
  nativeLanguage: string;
  preferredPracticeTime: string;
  preferredLearningDays: string[];
  reminderTiming: string;
  reasonsForLearning: string[];
  howHeardAbout: string;
  consentDataUsage: boolean;
  consentAnalytics: boolean;
}

interface OnboardingFlowProps {
  initialData: OnboardingData;
}

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

const STEP_INFO = [
  {
    title: "Native Language",
    description: "Help us personalize your experience",
    icon: Languages,
    color: "from-blue-500 to-purple-600",
  },
  {
    title: "Schedule",
    description: "Set your learning routine",
    icon: Calendar,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Goals",
    description: "Define your learning objectives",
    icon: Target,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Discovery",
    description: "Tell us how you found us",
    icon: Users,
    color: "from-teal-500 to-green-500",
  },
  {
    title: "Permissions",
    description: "Privacy and analytics",
    icon: Shield,
    color: "from-pink-500 to-rose-500",
  },
];

export function OnboardingFlow({ initialData }: OnboardingFlowProps) {
  const { update } = useSession();
  const [currentStep, setCurrentStep] = useState(initialData.currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const [formData, setFormData] = useState({
    nativeLanguage: initialData.nativeLanguage,
    preferredPracticeTime: initialData.preferredPracticeTime,
    preferredLearningDays: initialData.preferredLearningDays,
    reminderTiming: initialData.reminderTiming || "1_hour",
    reasonsForLearning: initialData.reasonsForLearning,
    howHeardAbout: initialData.howHeardAbout,
    consentDataUsage: initialData.consentDataUsage,
    consentAnalytics: initialData.consentAnalytics,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep === 1 && !formData.nativeLanguage) {
      toast({
        title: "Required Field",
        description: "Please select your native language.",
        variant: "destructive",
      });
      return;
    }

    if (
      currentStep === 1 &&
      formData.nativeLanguage === "other" &&
      !customLanguage.trim()
    ) {
      toast({
        title: "Required Field",
        description: "Please specify your native language.",
        variant: "destructive",
      });
      return;
    }

    if (
      currentStep === 2 &&
      (!formData.preferredPracticeTime ||
        formData.preferredLearningDays.length === 0 ||
        !formData.reminderTiming)
    ) {
      toast({
        title: "Required Fields",
        description:
          "Please select your preferred practice time, at least one learning day, and reminder timing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3 && formData.reasonsForLearning.length === 0) {
      toast({
        title: "Required Field",
        description: "Please select at least one reason for learning English.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 4 && !formData.howHeardAbout) {
      toast({
        title: "Required Field",
        description: "Please select how you heard about Fluenta AI.",
        variant: "destructive",
      });
      return;
    }

    if (
      currentStep === 5 &&
      (!formData.consentDataUsage || !formData.consentAnalytics)
    ) {
      toast({
        title: "Required Consent",
        description: "Please accept both consent options to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // If "other" is selected, use the custom language value
        nativeLanguage:
          formData.nativeLanguage === "other"
            ? customLanguage
            : formData.nativeLanguage,
      };

      // Save native language to localStorage for tour translations
      if (dataToSend.nativeLanguage) {
        localStorage.setItem(
          "fluenta-native-language",
          dataToSend.nativeLanguage
        );
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: currentStep,
          data: dataToSend,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      if (result.isCompleted) {
        try {
          await update({
            onboardingCompleted: true,
          });
        } catch (error) {
          console.error("OnboardingFlow: Error updating session:", error);
        }

        toast({
          title: "Onboarding Complete!",
          description:
            "Welcome to Fluenta AI! Let's start your learning journey.",
        });

        // Use window.location.href to force a full page reload
        // This ensures the middleware gets the updated JWT token
        window.location.href = "/dashboard";
        return;
      }

      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Saved",
        description: "Your information has been saved. Moving to next step.",
      });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const stepInfo = STEP_INFO[currentStep - 1];
    const StepIcon = stepInfo.icon;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${stepInfo.color} shadow-lg`}
                >
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  What's your native language?
                </h2>
                <p className="text-white/80 text-center text-base">
                  This helps us personalize your learning experience with better
                  translations and cultural context.
                </p>
              </div>
            </div>

            <GradientCard className="p-4" variant="default">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-white">
                    <Globe className="h-4 w-4" />
                    Select your native language
                  </Label>
                  <Select
                    value={formData.nativeLanguage}
                    onValueChange={value =>
                      setFormData({ ...formData, nativeLanguage: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60">
                      <SelectValue placeholder="Choose your native language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      {LANGUAGES.map(language => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.nativeLanguage === "other" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <Label
                      htmlFor="customLanguage"
                      className="text-sm font-medium text-white"
                    >
                      Please specify your native language
                    </Label>
                    <Input
                      id="customLanguage"
                      placeholder="Enter your native language"
                      value={customLanguage}
                      onChange={e => setCustomLanguage(e.target.value)}
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                )}
              </div>
            </GradientCard>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${stepInfo.color} shadow-lg`}
                >
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  Set up your study schedule
                </h2>
                <p className="text-white/80 text-center text-base">
                  Tell us when and how often you'd like to study. We'll send you
                  perfectly timed reminders to keep you motivated.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <GradientCard className="p-4" variant="secondary">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4" />
                    Preferred Practice Time
                  </Label>
                  <Select
                    value={formData.preferredPracticeTime}
                    onValueChange={value =>
                      setFormData({ ...formData, preferredPracticeTime: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60">
                      <SelectValue placeholder="Select your preferred time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      {PRACTICE_TIMES.map(time => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </GradientCard>

              <GradientCard className="p-4" variant="default">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-white">
                    <Calendar className="h-4 w-4" />
                    Preferred Learning Days
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LEARNING_DAYS.map(day => (
                      <div
                        key={day.value}
                        role="button"
                        tabIndex={0}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          formData.preferredLearningDays.includes(day.value)
                            ? "border-primary bg-primary/20 shadow-sm text-white"
                            : "border-white/30 hover:border-primary/50 text-white/80 hover:text-white"
                        }`}
                        onClick={() => {
                          const isSelected =
                            formData.preferredLearningDays.includes(day.value);
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              preferredLearningDays:
                                formData.preferredLearningDays.filter(
                                  d => d !== day.value
                                ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              preferredLearningDays: [
                                ...formData.preferredLearningDays,
                                day.value,
                              ],
                            });
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            const isSelected =
                              formData.preferredLearningDays.includes(
                                day.value
                              );
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                preferredLearningDays:
                                  formData.preferredLearningDays.filter(
                                    d => d !== day.value
                                  ),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferredLearningDays: [
                                  ...formData.preferredLearningDays,
                                  day.value,
                                ],
                              });
                            }
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={day.value}
                            checked={formData.preferredLearningDays.includes(
                              day.value
                            )}
                          />
                          <Label
                            htmlFor={day.value}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {day.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GradientCard>

              <GradientCard className="p-4" variant="accent">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4" />
                    Reminder Timing
                  </Label>
                  <p className="text-sm text-white/70 mb-3">
                    When should we remind you before your study time?
                  </p>
                  <Select
                    value={formData.reminderTiming}
                    onValueChange={value =>
                      setFormData({ ...formData, reminderTiming: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60">
                      <SelectValue placeholder="Select reminder timing" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      {REMINDER_TIMING.map(timing => (
                        <SelectItem key={timing.value} value={timing.value}>
                          {timing.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </GradientCard>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${stepInfo.color} shadow-lg`}
                >
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  Why are you learning English?
                </h2>
                <p className="text-white/80 text-center text-base">
                  Select all that apply. This helps us tailor your learning path
                  and content.
                </p>
              </div>
            </div>

            <GradientCard className="p-4" variant="accent">
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2 text-white">
                  <Target className="h-4 w-4" />
                  Learning Goals
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {REASONS_FOR_LEARNING.map(reason => (
                    <div
                      key={reason.value}
                      role="button"
                      tabIndex={0}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        formData.reasonsForLearning.includes(reason.value)
                          ? "border-primary bg-primary/20 shadow-sm text-white"
                          : "border-white/30 hover:border-primary/50 text-white/80 hover:text-white"
                      }`}
                      onClick={() => {
                        const isSelected = formData.reasonsForLearning.includes(
                          reason.value
                        );
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            reasonsForLearning:
                              formData.reasonsForLearning.filter(
                                r => r !== reason.value
                              ),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            reasonsForLearning: [
                              ...formData.reasonsForLearning,
                              reason.value,
                            ],
                          });
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          const isSelected =
                            formData.reasonsForLearning.includes(reason.value);
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              reasonsForLearning:
                                formData.reasonsForLearning.filter(
                                  r => r !== reason.value
                                ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              reasonsForLearning: [
                                ...formData.reasonsForLearning,
                                reason.value,
                              ],
                            });
                          }
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={reason.value}
                          checked={formData.reasonsForLearning.includes(
                            reason.value
                          )}
                        />
                        <span className="text-2xl">{reason.icon}</span>
                        <Label
                          htmlFor={reason.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {reason.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GradientCard>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${stepInfo.color} shadow-lg`}
                >
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  How did you discover Fluenta AI?
                </h2>
                <p className="text-white/80 text-center text-base">
                  Help us understand how you found us so we can reach more
                  learners like you and improve our community.
                </p>
              </div>
            </div>

            <GradientCard className="p-4" variant="secondary">
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2 text-white">
                  <Users className="h-4 w-4" />
                  Discovery Source
                </Label>
                <Select
                  value={formData.howHeardAbout}
                  onValueChange={value =>
                    setFormData({ ...formData, howHeardAbout: value })
                  }
                >
                  <SelectTrigger className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60">
                    <SelectValue placeholder="Select how you heard about us" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                    {HOW_HEARD_ABOUT.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </GradientCard>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${stepInfo.color} shadow-lg animate-pulse-glow`}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  Almost done! 🎉
                </h2>
                <p className="text-white/80 text-center text-base">
                  Please review and accept our terms to complete your setup and
                  start learning.
                </p>
              </div>
            </div>

            <GradientCard className="p-4" variant="secondary">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium flex items-center gap-2 text-white">
                    <Shield className="h-4 w-4" />
                    Privacy & Analytics
                  </Label>

                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.consentDataUsage
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/30 text-white/80"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="data-usage"
                          checked={formData.consentDataUsage}
                          onCheckedChange={checked =>
                            setFormData({
                              ...formData,
                              consentDataUsage: !!checked,
                            })
                          }
                        />
                        <div className="space-y-2 flex-1">
                          <Label
                            htmlFor="data-usage"
                            className="text-sm font-medium cursor-pointer text-white"
                          >
                            Data Usage Consent
                          </Label>
                          <p className="text-sm text-white/70">
                            I consent to Fluenta AI using my data to provide
                            personalized learning experiences, improve the
                            service, and send relevant notifications about my
                            progress and learning opportunities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.consentAnalytics
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/30 text-white/80"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="analytics"
                          checked={formData.consentAnalytics}
                          onCheckedChange={checked =>
                            setFormData({
                              ...formData,
                              consentAnalytics: !!checked,
                            })
                          }
                        />
                        <div className="space-y-2 flex-1">
                          <Label
                            htmlFor="analytics"
                            className="text-sm font-medium cursor-pointer text-white"
                          >
                            Analytics Consent
                          </Label>
                          <p className="text-sm text-white/70">
                            I consent to Fluenta AI collecting anonymous usage
                            analytics to improve the platform and develop better
                            learning features for all users.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GradientCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GradientCard className="overflow-hidden" variant="default">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-accent to-secondary p-4">
          <div className="text-center space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome to Fluenta AI
            </h1>
            <p className="text-white/90 text-base">
              Let's personalize your English learning journey
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-4 bg-white/5 backdrop-blur-sm">
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between items-center">
              {STEP_INFO.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const StepIcon = step.icon;

                return (
                  <div
                    key={stepNumber}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                          : isCompleted
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                            : "bg-white/20 text-white/60"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs font-medium ${isActive ? "text-white" : "text-white/70"}`}
                      >
                        Step {stepNumber}
                      </div>
                      <div className="text-xs text-white/60 hidden md:block">
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="min-h-[300px]">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center gap-2 px-6 py-3 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-white/20 text-white border-white/30"
              >
                {currentStep} of {totalSteps}
              </Badge>
            </div>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
