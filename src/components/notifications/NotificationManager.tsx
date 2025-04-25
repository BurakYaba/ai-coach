"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationManager() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const {
    isSupported,
    permissionState,
    requestPermission,
    scheduleDailyReminder,
  } = useNotifications();

  // Fetch user data for notification preferences
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch user profile for learning times and daily goal
        const profileResponse = await fetch("/api/user/profile");
        if (!profileResponse.ok) return;

        const profileData = await profileResponse.json();

        // Fetch user settings for notification preferences
        const settingsResponse = await fetch("/api/user/settings");
        if (!settingsResponse.ok) return;

        const settingsData = await settingsResponse.json();

        // Combine the data we need
        setUserData({
          preferredLearningTime:
            profileData.user.learningPreferences.preferredLearningTime || [],
          dailyGoal: profileData.user.learningPreferences.dailyGoal || 30,
          progressReminders: settingsData.settings.progressReminders,
        });
      } catch (error) {
        console.error("Error fetching user notification preferences:", error);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  // Request notification permission if needed
  useEffect(() => {
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
  }, [isSupported, permissionState, permissionRequested, requestPermission]);

  // Schedule daily reminders based on user preferences
  useEffect(() => {
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
  }, [
    isSupported,
    permissionState,
    reminderScheduled,
    scheduleDailyReminder,
    userData,
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

  // This component doesn't render anything, just manages notifications
  return null;
}
