import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
  getGoogleConfigurationError,
  getGoogleWebClientId,
  getSupabaseConfigurationError,
  supabase,
} from './supabase';

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
}

export interface AuthSuccessResult {
  user: AppUser;
  isNewUser: boolean;
}

export interface GoogleAuthCancelledResult {
  cancelled: true;
}

type Unsubscribe = () => void;

const toAppUser = (session: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AppUser => ({
  id: session.id,
  email: session.email ?? '',
  displayName:
    (session.user_metadata?.['full_name'] as string | undefined) ??
    (session.user_metadata?.['name'] as string | undefined) ??
    null,
  photoURL: (session.user_metadata?.['avatar_url'] as string | undefined) ?? null,
});

const assertConfigured = () => {
  const error = getSupabaseConfigurationError();

  if (error) {
    throw new Error(error);
  }
};

const configureGoogleSignIn = () => {
  if (Platform.OS === 'web') {
    throw new Error('Google sign-in is only available in Android and iOS builds right now.');
  }

  const googleConfigurationError = getGoogleConfigurationError();

  if (googleConfigurationError) {
    throw new Error(googleConfigurationError);
  }

  GoogleSignin.configure({
    webClientId: getGoogleWebClientId(),
    offlineAccess: false,
    scopes: ['email', 'profile'],
  });
};

export const observeAuthState = (callback: (user: AppUser | null) => void): Unsubscribe => {
  const configurationError = getSupabaseConfigurationError();

  if (configurationError) {
    callback(null);
    return () => undefined;
  }

  supabase.auth.getSession().then(({ data }) => {
    const user = data.session?.user;
    callback(user ? toAppUser(user) : null);
  });

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    callback(user ? toAppUser(user) : null);
  });

  return () => listener.subscription.unsubscribe();
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthSuccessResult> => {
  assertConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw error ?? new Error('Sign in failed. Please try again.');
  }

  return {
    user: toAppUser(data.user),
    isNewUser: false,
  };
};

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<AuthSuccessResult> => {
  assertConfigured();

  const trimmedName = name.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: trimmedName ? { full_name: trimmedName } : undefined,
    },
  });

  if (error || !data.user) {
    throw error ?? new Error('Sign up failed. Please try again.');
  }

  return {
    user: toAppUser(data.user),
    isNewUser: true,
  };
};

export const signInWithGoogle = async (): Promise<AuthSuccessResult | GoogleAuthCancelledResult> => {
  configureGoogleSignIn();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();

  if (isCancelledResponse(response)) {
    return { cancelled: true };
  }

  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new Error('Google sign-in did not return an ID token. Check the Google client setup and try again.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.data.idToken,
  });

  if (error || !data.user) {
    throw error ?? new Error('Google sign-in failed. Please try again.');
  }

  return {
    user: toAppUser(data.user),
    isNewUser: data.user.created_at === data.user.updated_at,
  };
};

export const signOut = async () => {
  await supabase.auth.signOut();

  try {
    if (GoogleSignin.getCurrentUser()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignore Google session cleanup failures after Supabase sign-out succeeds.
  }
};

export const updateCurrentUserDisplayName = async (displayName: string): Promise<AppUser> => {
  assertConfigured();

  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: displayName.trim() || null },
  });

  if (error || !data.user) {
    throw error ?? new Error('You need to be signed in before updating your profile.');
  }

  return toAppUser(data.user);
};

export const getAuthErrorMessage = (error: unknown) => {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        return 'An authentication request is already in progress. Please wait a moment and try again.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services is unavailable on this device. Update it and try again.';
      case statusCodes.SIGN_IN_CANCELLED:
        return 'Google sign-in was cancelled.';
      default:
        break;
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    const message = (error as { message: string }).message.toLowerCase();

    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return 'Invalid email or password. Please try again.';
    }

    if (message.includes('email already registered') || message.includes('user already registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }

    if (message.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }

    if (message.includes('unable to validate email address')) {
      return 'Please enter a valid email address.';
    }

    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Check your connection and try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
