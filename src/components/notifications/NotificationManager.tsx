"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationManager() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const {
    isSupported,
    permissionState,
    requestPermission,
    scheduleDailyReminder,
  } = useNotifications();

  // Check onboarding completion status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!session?.user?.id) return;

      // First check: if user is on onboarding pages, skip entirely
      if (
        typeof window !== "undefined" &&
        (window.location.pathname === "/onboarding" ||
          window.location.pathname.startsWith("/onboarding/"))
      ) {
        setOnboardingCompleted(false);
        return;
      }

      try {
        // Check onboarding status from API
        const onboardingResponse = await fetch("/api/onboarding/progress");
        if (onboardingResponse.ok) {
          const data = await onboardingResponse.json();
          const completed = data.onboarding?.completed || false;
          setOnboardingCompleted(completed);

          if (!completed) {
            console.log(
              "Skipping notifications setup - onboarding not completed"
            );
            return;
          }
        } else {
          console.warn("Could not fetch onboarding status, assuming completed");
          setOnboardingCompleted(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setOnboardingCompleted(true); // Assume completed on error
      }
    };

    if (session?.user) {
      checkOnboardingStatus();
    }
  }, [session]);

  // Fetch user data for notification preferences
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id || onboardingCompleted !== true) return;

      try {
        // Only proceed with profile/settings fetch if user has definitely completed onboarding
        const profileResponse = await fetch("/api/user/profile");
        if (!profileResponse.ok) {
          console.warn(
            "Could not fetch user profile for notifications:",
            profileResponse.status
          );
          return;
        }

        // Check if response is actually JSON
        const contentType = profileResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn(
            "User profile response is not JSON, skipping notifications setup"
          );
          return;
        }

        const profileData = await profileResponse.json();

        // Fetch user settings for notification preferences
        const settingsResponse = await fetch("/api/user/settings");
        if (!settingsResponse.ok) {
          console.warn(
            "Could not fetch user settings for notifications:",
            settingsResponse.status
          );
          return;
        }

        // Check if settings response is actually JSON
        const settingsContentType =
          settingsResponse.headers.get("content-type");
        if (
          !settingsContentType ||
          !settingsContentType.includes("application/json")
        ) {
          console.warn(
            "User settings response is not JSON, skipping notifications setup"
          );
          return;
        }

        const settingsData = await settingsResponse.json();

        // Combine the data we need
        setUserData({
          preferredLearningTime:
            profileData.user?.learningPreferences?.preferredLearningTime || [],
          dailyGoal: profileData.user?.learningPreferences?.dailyGoal || 30,
          progressReminders: settingsData.settings?.progressReminders,
        });
      } catch (error) {
        console.error("Error fetching user notification preferences:", error);
      }
    };

    if (session?.user && onboardingCompleted === true) {
      fetchUserData();
    }
  }, [session, onboardingCompleted]);

  // Request notification permission if needed
  useEffect(() => {
    if (
      isSupported &&
      !permissionRequested &&
      permissionState === "default" &&
      onboardingCompleted === true
    ) {
      // Only ask for permission after user has used the site for a while
      const askForPermissionTimeout = setTimeout(
        () => {
          requestPermission();
          setPermissionRequested(true);
        },
        5 * 60 * 1000
      ); // Wait 5 minutes before asking

      return () => clearTimeout(askForPermissionTimeout);
    }
  }, [
    isSupported,
    permissionState,
    permissionRequested,
    requestPermission,
    onboardingCompleted,
  ]);

  // Schedule daily reminders based on user preferences
  useEffect(() => {
    if (
      isSupported &&
      permissionState === "granted" &&
      !reminderScheduled &&
      userData &&
      userData.progressReminders &&
      userData.preferredLearningTime &&
      userData.preferredLearningTime.length > 0 &&
      onboardingCompleted === true
    ) {
      scheduleDailyReminder(userData.preferredLearningTime, userData.dailyGoal);
      setReminderScheduled(true);
    }
  }, [
    isSupported,
    permissionState,
    reminderScheduled,
    scheduleDailyReminder,
    userData,
    onboardingCompleted,
  ]);

  // Reschedule reminders if user preferences change
  useEffect(() => {
    if (
      reminderScheduled &&
      isSupported &&
      permissionState === "granted" &&
      userData &&
      userData.progressReminders &&
      userData.preferredLearningTime &&
      userData.preferredLearningTime.length > 0 &&
      onboardingCompleted === true
    ) {
      scheduleDailyReminder(userData.preferredLearningTime, userData.dailyGoal);
    }
  }, [
    userData?.preferredLearningTime,
    userData?.dailyGoal,
    userData?.progressReminders,
    isSupported,
    permissionState,
    reminderScheduled,
    scheduleDailyReminder,
    onboardingCompleted,
  ]);

  // This component doesn't render anything, just manages notifications
  return null;
}
