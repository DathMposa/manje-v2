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
  sendPhoneOtp as sendPhoneOtpRequest,
  verifyPhoneOtp as verifyPhoneOtpRequest,
  signInWithEmail as signInWithEmailRequest,
  signInWithGoogle as signInWithGoogleRequest,
  signOut as signOutRequest,
  signUpWithEmail as signUpWithEmailRequest,
  updateCurrentUserDisplayName,
  type AppUser,
  type AuthSuccessResult,
  type GoogleAuthCancelledResult,
  type EmailConfirmationPendingResult,
  type OtpSentResult,
} from '../lib/auth';
import { analytics } from '../lib/analytics';
import { initLocalDatabase, getLocalUserProfile, saveLocalUserProfile } from '../lib/localDatabase';
import { getLocalAuthUserId, setLocalAuthUserId, clearLocalAuth, authenticateWithBiometrics } from '../lib/biometricAuth';
import { seedFromCloud } from '../lib/syncEngine';
import { registerForPushNotifications } from '../lib/notifications';
import { useBillStore } from './billStore';
import { useBudgetStore } from './budgetStore';
import { useGoalStore } from './goalStore';
import { useNotificationStore } from './notificationStore';
import { useSettingsStore } from './settingsStore';
import { useTransactionStore } from './transactionStore';

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface AuthResult {
  user: User;
  isOnboarded: boolean;
}

export type BiometricAuthState = 'idle' | 'required' | 'authenticating' | 'authenticated' | 'failed' | 'locked_out';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  localAuthUserId: string | null;
  biometricAuthState: BiometricAuthState;
  initializeAuth: () => Promise<() => void>;
  authenticateBiometric: () => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<OtpSentResult>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<AuthResult | EmailConfirmationPendingResult>;
  signInWithGoogle: () => Promise<AuthResult | GoogleAuthCancelledResult>;
  signOut: () => Promise<void>;
}

let profileSubscription: (() => void) | null = null;
let activeProfileUserId: string | null = null;

const toStoreUser = (user: AppUser): User => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
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
) => {
  const authResult = await attachUserProfile(set, result.user, result.isNewUser);

  // Persist user profile locally and seed SQLite with cloud data
  void (async () => {
    try {
      saveLocalUserProfile({
        serverId: authResult.user.id,
        userAuthId: authResult.user.id,
        displayName: authResult.user.displayName,
        email: authResult.user.email ?? null,
        photoUrl: authResult.user.photoURL ?? null,
        isOnboarded: authResult.isOnboarded,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await setLocalAuthUserId(authResult.user.id);
      await seedFromCloud(authResult.user.id);
    } catch (e) {
      console.warn('[AuthStore] Failed to seed local DB after auth', e);
    }

    // Register push token (best-effort)
    try {
      await registerForPushNotifications();
    } catch { /* ignore */ }
  })();

  return authResult;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,
  localAuthUserId: null,
  biometricAuthState: 'idle',

  initializeAuth: async () => {
    set({ isLoading: true });

    // Ensure the local SQLite database schema is ready
    try {
      await initLocalDatabase();
    } catch (e) {
      console.warn('[AuthStore] Failed to init local DB', e);
    }

    // Check if the user has previously signed in on this device
    const localUserId = await getLocalAuthUserId();
    if (localUserId) {
      // Don't wait for Supabase — show biometric lock immediately
      set({ localAuthUserId: localUserId, biometricAuthState: 'required', isLoading: false });
    }

    // Also start the Supabase session observation in the background
    return observeAuthState((user) => {
      if (!user) {
        // Only redirect to welcome if there's no local auth pending
        const { biometricAuthState } = get();
        if (biometricAuthState !== 'required' && biometricAuthState !== 'authenticating') {
          syncSignedOutState(set);
        }
        return;
      }

      void attachUserProfile(set, user);
    });
  },

  authenticateBiometric: async () => {
    const localUserId = get().localAuthUserId;
    if (!localUserId) return;

    set({ biometricAuthState: 'authenticating' });

    const result = await authenticateWithBiometrics('Unlock Manje');

    if (result.success) {
      // Load the user profile from SQLite
      try {
        const profile = getLocalUserProfile(localUserId);
        if (profile) {
          set({
            user: {
              id: localUserId,
              email: profile.email,
              displayName: profile.displayName,
              photoURL: profile.photoUrl,
            },
            isAuthenticated: true,
            isOnboarded: profile.isOnboarded,
            biometricAuthState: 'authenticated',
            isLoading: false,
          });
        }
      } catch (e) {
        console.warn('[AuthStore] Failed to load local profile', e);
      }
    } else if (result.reason === 'locked_out') {
      set({ biometricAuthState: 'locked_out' });
    } else if (result.reason !== 'cancelled') {
      set({ biometricAuthState: 'failed' });
    } else {
      // User cancelled — go back to required state
      set({ biometricAuthState: 'required' });
    }
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

  sendPhoneOtp: async (phone) => {
    try {
      return await sendPhoneOtpRequest(phone);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  verifyPhoneOtp: async (phone, token) => {
    try {
      const result = await verifyPhoneOtpRequest(phone, token);
      const auth = await finalizeAuthSuccess(set, result);
      analytics.identify(auth.user.id, { method: 'phone' });
      analytics.track('auth_signin_success', { method: 'phone' });
      return auth;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailRequest(email, password);
      const auth = await finalizeAuthSuccess(set, result);
      analytics.identify(auth.user.id, { method: 'email' });
      analytics.track('auth_signin_success', { method: 'email' });
      return auth;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signUpWithEmail: async (name, email, password) => {
    try {
      const result = await signUpWithEmailRequest(name, email, password);
      if ('confirmationPending' in result) {
        return result;
      }
      const auth = await finalizeAuthSuccess(set, result);
      analytics.identify(auth.user.id, { method: 'email' });
      analytics.track('auth_signup_success', { method: 'email' });
      return auth;
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

      const auth = await finalizeAuthSuccess(set, result);
      analytics.identify(auth.user.id, { method: 'google' });
      analytics.track('auth_signin_success', { method: 'google' });
      return auth;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signOut: async () => {
    analytics.track('auth_signout');
    analytics.reset();
    await clearLocalAuth();
    await signOutRequest();
    set({ localAuthUserId: null, biometricAuthState: 'idle' });
    syncSignedOutState(set);
  },
}));

export default useAuthStore;
