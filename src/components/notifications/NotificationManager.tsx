"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationManager() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const {
    isSupported,
    permissionState,
    requestPermission,
    scheduleDailyReminder,
  } = useNotifications();

  useEffect(() => {
    // Setup notifications for authenticated users
    if (session?.user) {
      setupNotifications();
    }
  }, [session, status]);

  const setupNotifications = async () => {
    try {
      // Setup push notifications or other notification systems
      // Removed unused notificationsEnabled state

      // Fetch user data for notification preferences
      await fetchUserData();

      // Request notification permission if needed
      await requestPermissionIfNeeded();

      // Schedule daily reminders based on user preferences
      await scheduleDailyReminderBasedOnPreferences();
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };

  // Fetch user data for notification preferences
  const fetchUserData = async () => {
    if (!session?.user?.id) return;

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
      const settingsContentType = settingsResponse.headers.get("content-type");
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

  // Request notification permission if needed
  const requestPermissionIfNeeded = async () => {
    if (isSupported && !permissionRequested && permissionState === "default") {
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
  };

  // Schedule daily reminders based on user preferences
  const scheduleDailyReminderBasedOnPreferences = async () => {
    if (
      isSupported &&
      permissionState === "granted" &&
      !reminderScheduled &&
      userData &&
      userData.progressReminders &&
      userData.preferredLearningTime &&
      userData.preferredLearningTime.length > 0
    ) {
      scheduleDailyReminder(userData.preferredLearningTime, userData.dailyGoal);
      setReminderScheduled(true);
    }
  };

  // Reschedule reminders if user preferences change
  useEffect(() => {
    if (
      reminderScheduled &&
      isSupported &&
      permissionState === "granted" &&
      userData &&
      userData.progressReminders &&
      userData.preferredLearningTime &&
      userData.preferredLearningTime.length > 0
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
  ]);

  // This component manages notifications in the background
  return null;
}
