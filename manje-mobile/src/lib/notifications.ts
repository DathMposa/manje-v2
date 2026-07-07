/**
 * Push notification helpers.
 * Lazy-load expo-notifications so Expo Go can start without
 * evaluating Android remote-push code at module import time.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let notificationHandlerConfigured = false;

const isExpoGo = () => Constants.executionEnvironment === ExecutionEnvironment.StoreClient && !!Constants.expoGoConfig;

const loadNotificationsModule = async (): Promise<NotificationsModule | null> => {
  if (isExpoGo()) {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications');
  }

  const Notifications = await notificationsModulePromise;
  if (!Notifications) {
    return null;
  }

  if (!notificationHandlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationHandlerConfigured = true;
  }

  return Notifications;
};

export const registerForPushNotifications = async (): Promise<string | null> => {
  // Android remote push registration is not supported in Expo Go.
  if (isExpoGo()) {
    return null;
  }

  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return null;
  }

  const isPhysicalDevice = Constants.isDevice;
  if (!isPhysicalDevice) {
    return null;
  }

  const existing = await Notifications.getPermissionsAsync();
  let isGranted =
    (existing as unknown as { status?: string; granted?: boolean }).granted ??
    (existing as unknown as { status?: string }).status === 'granted';

  if (!isGranted) {
    const result = await Notifications.requestPermissionsAsync();
    isGranted =
      (result as unknown as { status?: string; granted?: boolean }).granted ??
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

export const scheduleBillReminder = async (
  billName: string,
  dueDateIso: string,
  billId: string
): Promise<void> => {
  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return;
  }

  const dueDate = new Date(dueDateIso);
  const triggerDate = new Date(dueDate);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return;

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
  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(`bill-${billId}`);
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: data ?? {} },
    trigger: null,
  });
};
