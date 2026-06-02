import { create } from 'zustand';
import {
  markNotificationRead,
  subscribeUserNotifications,
  type NotificationRecord,
} from '../lib/database';
import {
  getLocalNotifications,
  markNotificationRead as markLocalNotificationRead,
  upsertNotificationFromServer,
} from '../lib/localDatabase';

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

    // Load from SQLite first (instant, offline)
    try {
      const localNotes = getLocalNotifications(userId);
      if (localNotes.length > 0) {
        const mapped = localNotes.map((n) => ({
          id: n.serverId ?? n.localId,
          userId,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          actionId: n.actionId,
          actionRoute: n.actionRoute,
          createdAt: n.createdAt,
        })) as NotificationRecord[];
        set({ notifications: mapped, isLoading: false });
      }
    } catch { /* SQLite not ready */ }

    notificationSubscription = subscribeUserNotifications(userId, (notifications) => {
      notifications.forEach((n) => {
        upsertNotificationFromServer(userId, {
          serverId: n.id,
          userAuthId: userId,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          actionId: n.actionId,
          actionRoute: n.actionRoute,
          createdAt: n.createdAt,
        });
      });
      set({ notifications, isLoading: false });
    });
  },

  markRead: async (id, read = true) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    // Mark in SQLite first
    try { markLocalNotificationRead(id); } catch { /* ignore */ }

    try {
      await markNotificationRead(userId, id, read);
    } catch { /* offline */ }
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
