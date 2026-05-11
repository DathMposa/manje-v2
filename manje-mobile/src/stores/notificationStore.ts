import { create } from 'zustand';
import {
  markNotificationRead,
  subscribeUserNotifications,
  type NotificationRecord,
} from '../lib/database';

interface NotificationState {
  userId: string | null;
  isLoading: boolean;
  notifications: NotificationRecord[];
  initializeForUser: (userId: string) => void;
  markRead: (id: string, read?: boolean) => Promise<void>;
  getNotification: (id: string) => NotificationRecord | undefined;
  unreadCount: () => number;
  reset: () => void;
}

let notificationSubscription: (() => void) | null = null;

const resetNotificationSubscription = () => {
  notificationSubscription?.();
  notificationSubscription = null;
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  userId: null,
  isLoading: false,
  notifications: [],

  initializeForUser: (userId) => {
    if (get().userId === userId && notificationSubscription) {
      return;
    }

    resetNotificationSubscription();
    set({ userId, isLoading: true, notifications: [] });

    notificationSubscription = subscribeUserNotifications(userId, (notifications) => {
      set({
        notifications,
        isLoading: false,
      });
    });
  },

  markRead: async (id, read = true) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    await markNotificationRead(userId, id, read);
  },

  getNotification: (id) => get().notifications.find((notification) => notification.id === id),

  unreadCount: () => get().notifications.filter((notification) => !notification.read).length,

  reset: () => {
    resetNotificationSubscription();
    set({
      userId: null,
      isLoading: false,
      notifications: [],
    });
  },
}));
