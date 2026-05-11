import { create } from 'zustand';
import {
  defaultUserSettings,
  subscribeUserSettings,
  updateUserSettingsDoc,
  type UserSettingsDoc,
} from '../lib/database';

interface SettingsState {
  userId: string | null;
  isLoading: boolean;
  settings: UserSettingsDoc;
  initializeForUser: (userId: string) => void;
  updateCurrency: (currency: string) => Promise<void>;
  updateNotificationPreferences: (
    updates: Partial<UserSettingsDoc['notificationPreferences']>
  ) => Promise<void>;
  updateSecurity: (updates: Partial<UserSettingsDoc['security']>) => Promise<void>;
  reset: () => void;
}

let settingsSubscription: (() => void) | null = null;

const resetSettingsSubscription = () => {
  settingsSubscription?.();
  settingsSubscription = null;
};

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  userId: null,
  isLoading: false,
  settings: defaultUserSettings(),

  initializeForUser: (userId) => {
    if (get().userId === userId && settingsSubscription) {
      return;
    }

    resetSettingsSubscription();
    set({ userId, isLoading: true, settings: defaultUserSettings() });

    settingsSubscription = subscribeUserSettings(userId, (settings) => {
      set({
        settings,
        isLoading: false,
      });
    });
  },

  updateCurrency: async (currency) => {
    const userId = get().userId;

    if (!userId) {
      throw new Error('You need to be signed in before updating your currency.');
    }

    await updateUserSettingsDoc(userId, { currency });
  },

  updateNotificationPreferences: async (updates) => {
    const userId = get().userId;
    const currentSettings = get().settings;

    if (!userId) {
      throw new Error('You need to be signed in before updating notification settings.');
    }

    await updateUserSettingsDoc(userId, {
      notificationPreferences: {
        ...currentSettings.notificationPreferences,
        ...updates,
      },
    });
  },

  updateSecurity: async (updates) => {
    const userId = get().userId;
    const currentSettings = get().settings;

    if (!userId) {
      throw new Error('You need to be signed in before updating security settings.');
    }

    await updateUserSettingsDoc(userId, {
      security: {
        ...currentSettings.security,
        ...updates,
      },
    });
  },

  reset: () => {
    resetSettingsSubscription();
    set({
      userId: null,
      isLoading: false,
      settings: defaultUserSettings(),
    });
  },
}));
