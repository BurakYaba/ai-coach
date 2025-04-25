import { useCallback, useEffect, useState } from "react";

/**
 * Hook to manage browser notifications for progress reminders
 */
export function useNotifications() {
  const [permissionState, setPermissionState] = useState<
    NotificationPermission | "default"
  >("default");
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported and get permission status
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const supported = "Notification" in window;
      setIsSupported(supported);

      if (supported) {
        setPermissionState(Notification.permission);
      }
    }
  }, []);

  // Request permission to show notifications
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  // Send a notification
  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permissionState !== "granted") return null;

      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          ...options,
        });

        return notification;
      } catch (error) {
        console.error("Error sending notification:", error);
        return null;
      }
    },
    [isSupported, permissionState]
  );

  // Schedule a notification for a specific time
  const scheduleNotification = useCallback(
    (title: string, scheduledTime: Date, options?: NotificationOptions) => {
      if (!isSupported || permissionState !== "granted") return null;

      const now = new Date();
      const timeToWait = scheduledTime.getTime() - now.getTime();

      if (timeToWait <= 0) return null;

      // Store the scheduled notification in localStorage
      const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Save notification data
      const scheduledNotifications = JSON.parse(
        localStorage.getItem("scheduledNotifications") || "[]"
      );
      scheduledNotifications.push({
        id: notificationId,
        title,
        options,
        scheduledTime: scheduledTime.toISOString(),
      });
      localStorage.setItem(
        "scheduledNotifications",
        JSON.stringify(scheduledNotifications)
      );

      // Set timeout to trigger notification
      const timeoutId = setTimeout(() => {
        sendNotification(title, options);
        // Remove from storage after sending
        removeScheduledNotification(notificationId);
      }, timeToWait);

      // Store timeout ID in memory
      return { id: notificationId, timeoutId };
    },
    [isSupported, permissionState, sendNotification]
  );

  // Remove a scheduled notification
  const removeScheduledNotification = useCallback((notificationId: string) => {
    try {
      const scheduledNotifications = JSON.parse(
        localStorage.getItem("scheduledNotifications") || "[]"
      );
      const updatedNotifications = scheduledNotifications.filter(
        (notification: any) => notification.id !== notificationId
      );
      localStorage.setItem(
        "scheduledNotifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error("Error removing scheduled notification:", error);
    }
  }, []);

  // Check learning time and schedule reminder
  const scheduleDailyReminder = useCallback(
    (preferredTimes: string[], dailyGoal: number) => {
      if (!isSupported || permissionState !== "granted") return null;

      // Clear existing reminders first
      const existingReminders = JSON.parse(
        localStorage.getItem("scheduledNotifications") || "[]"
      );
      existingReminders.forEach((reminder: any) => {
        removeScheduledNotification(reminder.id);
      });

      // Get current date
      const now = new Date();
      const reminderTime = new Date();

      // Map preferred times to hours
      const timeMap: Record<string, number> = {
        morning: 9, // 9 AM
        afternoon: 14, // 2 PM
        evening: 18, // 6 PM
        night: 21, // 9 PM
      };

      // Find the next preferred time
      let selectedTime = preferredTimes[0];
      let hourToSchedule = timeMap[selectedTime] || 9;

      // If the first preferred time is already past, find next available time
      for (const time of preferredTimes) {
        const hour = timeMap[time];
        if (hour > now.getHours()) {
          selectedTime = time;
          hourToSchedule = hour;
          break;
        }
      }

      // Set reminder time
      reminderTime.setHours(hourToSchedule, 0, 0, 0);

      // If the time is already past today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      return scheduleNotification("Learning Reminder", reminderTime, {
        body: `Time for your ${dailyGoal}-minute study session! Keep your streak going.`,
        tag: "learning-reminder",
      });
    },
    [
      isSupported,
      permissionState,
      scheduleNotification,
      removeScheduledNotification,
    ]
  );

  return {
    isSupported,
    permissionState,
    requestPermission,
    sendNotification,
    scheduleNotification,
    removeScheduledNotification,
    scheduleDailyReminder,
  };
}
