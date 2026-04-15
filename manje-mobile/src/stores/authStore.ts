/**
 * Auth Store
 * Manages authentication state using Zustand.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const setItemAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export interface User {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setOnboarded: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  signOut: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'manje_auth_token';
const ONBOARDED_KEY = 'manje_onboarded';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  setOnboarded: async (value) => {
    await setItemAsync(ONBOARDED_KEY, value ? 'true' : 'false');
    set({ isOnboarded: value });
  },
  
  setLoading: (value) => {
    set({ isLoading: value });
  },
  
  signOut: async () => {
    await deleteItemAsync(AUTH_TOKEN_KEY);
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuthState: async () => {
    try {
      set({ isLoading: true });
      
      // Check if user has completed onboarding
      const onboarded = await getItemAsync(ONBOARDED_KEY);
      
      // For now, we'll simulate auth check
      // In production, this would verify Firebase auth state
      const token = await getItemAsync(AUTH_TOKEN_KEY);
      
      set({
        isOnboarded: onboarded === 'true',
        isAuthenticated: !!token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth state:', error);
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
