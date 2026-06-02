/**
 * Push notification helpers.
 * Handles permission requests, push token registration, and
 * scheduling local notifications.
 */

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Show notifications as banners even when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// Permission + token
// ---------------------------------------------------------------------------

export const registerForPushNotifications = async (): Promise<string | null> => {
  // Push tokens only work in standalone apps (not Expo Go dev client over tunnel)
  const isPhysicalDevice = Constants.isDevice;
  if (!isPhysicalDevice) {
    return null;
  }

  const existing = await Notifications.getPermissionsAsync();
  // expo-notifications uses PermissionStatus enum — check if permission is granted
  let isGranted = (existing as unknown as { status?: string; granted?: boolean }).granted ??
    (existing as unknown as { status?: string }).status === 'granted';

  if (!isGranted) {
    const result = await Notifications.requestPermissionsAsync();
    isGranted = (result as unknown as { status?: string; granted?: boolean }).granted ??
      (result as unknown as { status?: string }).status === 'granted';
  }

  if (!isGranted) {
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      'f0e8eaaa-3708-4c32-992b-0997d5361434';
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Local notifications (bills, budget alerts, goal milestones)
// ---------------------------------------------------------------------------

export const scheduleBillReminder = async (
  billName: string,
  dueDateIso: string,
  billId: string
): Promise<void> => {
  const dueDate = new Date(dueDateIso);
  // Remind 1 day before due date at 9am
  const triggerDate = new Date(dueDate);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return; // Skip if already past

  await Notifications.scheduleNotificationAsync({
    identifier: `bill-${billId}`,
    content: {
      title: 'Bill Due Tomorrow',
      body: `${billName} is due tomorrow. Don't forget to pay!`,
      data: { route: `/(tabs)/bills/${billId}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
};

export const cancelBillReminder = async (billId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(`bill-${billId}`);
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: data ?? {} },
    trigger: null, // fire immediately
  });
};
