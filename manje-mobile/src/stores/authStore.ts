/**
 * Auth Store
 * Manages Supabase authentication and profile state using Zustand.
 */

import { create } from 'zustand';
import {
  ensureUserProfile,
  getUserProfileDoc,
  subscribeUserProfile,
  updateUserProfileDoc,
} from '../lib/database';
import {
  getAuthErrorMessage,
  observeAuthState,
  signInWithEmail as signInWithEmailRequest,
  signInWithGoogle as signInWithGoogleRequest,
  signOut as signOutRequest,
  signUpWithEmail as signUpWithEmailRequest,
  updateCurrentUserDisplayName,
  type AppUser,
  type AuthSuccessResult,
  type GoogleAuthCancelledResult,
} from '../lib/auth';
import { useBillStore } from './billStore';
import { useBudgetStore } from './budgetStore';
import { useGoalStore } from './goalStore';
import { useNotificationStore } from './notificationStore';
import { useSettingsStore } from './settingsStore';
import { useTransactionStore } from './transactionStore';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
}

export interface AuthResult {
  user: User;
  isOnboarded: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  initializeAuth: () => Promise<() => void>;
  setOnboarded: (value: boolean) => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult | GoogleAuthCancelledResult>;
  signOut: () => Promise<void>;
}

let profileSubscription: (() => void) | null = null;
let activeProfileUserId: string | null = null;

const toStoreUser = (user: AppUser): User => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL ?? null,
});

const resetProfileSubscription = () => {
  profileSubscription?.();
  profileSubscription = null;
  activeProfileUserId = null;
};

const clearDomainStores = () => {
  useBillStore.getState().reset();
  useTransactionStore.getState().reset();
  useGoalStore.getState().reset();
  useBudgetStore.getState().reset();
  useNotificationStore.getState().reset();
  useSettingsStore.getState().reset();
};

const syncSignedOutState = (set: (partial: Partial<AuthState>) => void) => {
  resetProfileSubscription();
  clearDomainStores();
  set({
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    isLoading: false,
  });
};

const attachUserProfile = async (
  set: (partial: Partial<AuthState>) => void,
  authUser: AppUser,
  isNewUser?: boolean
) => {
  const storeUser = toStoreUser(authUser);

  await ensureUserProfile(storeUser, isNewUser);

  if (activeProfileUserId !== storeUser.id) {
    resetProfileSubscription();
    activeProfileUserId = storeUser.id;
    profileSubscription = subscribeUserProfile(storeUser.id, (profile) => {
      set({
        user: {
          ...storeUser,
          displayName: profile?.displayName ?? storeUser.displayName,
          photoURL: profile?.photoURL ?? storeUser.photoURL,
          email: profile?.email ?? storeUser.email,
        },
        isAuthenticated: true,
        isOnboarded: profile?.isOnboarded ?? false,
        isLoading: false,
      });
    });
  }

  const profile = await getUserProfileDoc(storeUser.id);

  set({
    user: {
      ...storeUser,
      displayName: profile?.displayName ?? storeUser.displayName,
      photoURL: profile?.photoURL ?? storeUser.photoURL,
      email: profile?.email ?? storeUser.email,
    },
    isAuthenticated: true,
    isOnboarded: profile?.isOnboarded ?? false,
    isLoading: false,
  });

  return {
    user: {
      ...storeUser,
      displayName: profile?.displayName ?? storeUser.displayName,
      photoURL: profile?.photoURL ?? storeUser.photoURL,
      email: profile?.email ?? storeUser.email,
    },
    isOnboarded: profile?.isOnboarded ?? false,
  };
};

const finalizeAuthSuccess = async (
  set: (partial: Partial<AuthState>) => void,
  result: AuthSuccessResult
) => attachUserProfile(set, result.user, result.isNewUser);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,

  initializeAuth: async () => {
    set({ isLoading: true });

    return observeAuthState((user) => {
      if (!user) {
        syncSignedOutState(set);
        return;
      }

      void attachUserProfile(set, user);
    });
  },

  setOnboarded: async (value) => {
    const userId = get().user?.id;

    if (!userId) {
      throw new Error('You need to be signed in before updating onboarding.');
    }

    await updateUserProfileDoc(userId, { isOnboarded: value });
    set({ isOnboarded: value });
  },

  updateProfile: async (displayName) => {
    const currentUser = get().user;

    if (!currentUser) {
      throw new Error('You need to be signed in before updating your profile.');
    }

    const nextDisplayName = displayName.trim();

    await updateCurrentUserDisplayName(nextDisplayName);
    await updateUserProfileDoc(currentUser.id, { displayName: nextDisplayName || null });

    set({
      user: {
        ...currentUser,
        displayName: nextDisplayName || null,
      },
    });
  },

  signInWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailRequest(email, password);
      return await finalizeAuthSuccess(set, result);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signUpWithEmail: async (name, email, password) => {
    try {
      const result = await signUpWithEmailRequest(name, email, password);
      return await finalizeAuthSuccess(set, result);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithGoogleRequest();

      if ('cancelled' in result) {
        return result;
      }

      return await finalizeAuthSuccess(set, result);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signOut: async () => {
    await signOutRequest();
    syncSignedOutState(set);
  },
}));

export default useAuthStore;
