import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import {
  getGoogleConfigurationError,
  getSupabaseReachabilityError,
  getGoogleWebClientId,
  getSupabaseConfigurationError,
  supabase,
} from './supabase';

export interface AppUser {
  id: string;
  email: string;
  phone?: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

// Format Malawian numbers to E.164 for Africa's Talking
export function toE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('265')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+265${cleaned.slice(1)}`;
  return `+265${cleaned}`;
}

// Country codes for phone input - re-export from components
export { countryCodes, defaultCountryCode, type CountryCode } from '../components/common/CountryCodePicker';

export interface AuthSuccessResult {
  user: AppUser;
  isNewUser: boolean;
}

export interface GoogleAuthCancelledResult {
  cancelled: true;
}

export interface EmailConfirmationPendingResult {
  confirmationPending: true;
  email: string;
}

export interface OtpSentResult {
  otpSent: true;
  phone: string;
}

export interface PasswordResetEmailSentResult {
  emailSent: true;
}

type Unsubscribe = () => void;

const GOOGLE_SIGN_IN_NATIVE_MODULE_ERROR =
  'Google sign-in requires a development/production build. Expo Go does not include the Google native module.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadGoogleSignInModule = async (): Promise<any> => {
  try {
    return await import('@react-native-google-signin/google-signin');
  } catch {
    throw new Error(GOOGLE_SIGN_IN_NATIVE_MODULE_ERROR);
  }
};

const toAppUser = (session: {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: Record<string, unknown>;
}): AppUser => ({
  id: session.id,
  email: session.email ?? '',
  phone: session.phone ?? null,
  displayName:
    (session.user_metadata?.['full_name'] as string | undefined) ??
    (session.user_metadata?.['name'] as string | undefined) ??
    null,
  photoURL: (session.user_metadata?.['avatar_url'] as string | undefined) ?? null,
});

const assertConfigured = async () => {
  const error = getSupabaseConfigurationError();

  if (error) {
    throw new Error(error);
  }

  const reachabilityError = await getSupabaseReachabilityError();

  if (reachabilityError) {
    throw new Error(reachabilityError);
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
  await assertConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw error ?? new Error('Sign in failed. Please try again.');
  }

  return {
    user: toAppUser(data.user),
    isNewUser: false,
  };
};

const getPasswordResetRedirectUrl = () => {
  if (Platform.OS === 'web') {
    return undefined;
  }

  return Linking.createURL('/reset-password');
};

export const requestPasswordReset = async (email: string): Promise<PasswordResetEmailSentResult> => {
  await assertConfigured();

  const redirectTo = getPasswordResetRedirectUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });

  if (error) {
    throw error;
  }

  return { emailSent: true };
};

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<AuthSuccessResult | EmailConfirmationPendingResult> => {
  await assertConfigured();

  const trimmedName = name.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: trimmedName ? { full_name: trimmedName } : undefined,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Sign up failed. Please try again.');
  }

  if (!data.session) {
    return { confirmationPending: true, email };
  }

  return {
    user: toAppUser(data.user),
    isNewUser: true,
  };
};

export const sendPhoneOtp = async (rawPhone: string): Promise<OtpSentResult> => {
  await assertConfigured();

  const phone = toE164(rawPhone);
  console.log('Attempting to send OTP to:', phone);

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    console.error('Supabase OTP Error details:', {
      message: error.message,
      status: error.status,
      name: error.name,
      // @ts-ignore
      code: error.code
    });
    throw error;
  }

  console.log('OTP sent successfully. Response:', data);
  return {
    otpSent: true,
    phone,
  };
};

export const verifyPhoneOtp = async (phone: string, token: string): Promise<AuthSuccessResult> => {
  await assertConfigured();

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error || !data.user) {
    throw error ?? new Error('Verification failed. Please try again.');
  }

  return {
    user: toAppUser(data.user),
    isNewUser: data.user.created_at === data.user.updated_at,
  };
};

export const signInWithGoogle = async (): Promise<AuthSuccessResult | GoogleAuthCancelledResult> => {
  configureGoogleSignIn();
  await assertConfigured();

  let GoogleSigninModule;
  let isCancelledResponse: (response: unknown) => boolean;
  let isSuccessResponse: (response: unknown) => boolean;

  try {
    const module = await loadGoogleSignInModule();
    GoogleSigninModule = module.GoogleSignin;
    isCancelledResponse = module.isCancelledResponse;
    isSuccessResponse = module.isSuccessResponse;
  } catch {
    throw new Error(GOOGLE_SIGN_IN_NATIVE_MODULE_ERROR);
  }

  GoogleSigninModule.configure({
    webClientId: getGoogleWebClientId(),
    offlineAccess: false,
    scopes: ['email', 'profile'],
  });

  if (Platform.OS === 'android') {
    await GoogleSigninModule.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSigninModule.signIn();

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

  // Attempt Google sign-out only if native module is available
  try {
    let GoogleSigninModule;
    try {
      const module = await loadGoogleSignInModule();
      GoogleSigninModule = module.GoogleSignin;
    } catch {
      // Module not available (Expo Go), skip Google sign-out
      return;
    }

    if (GoogleSigninModule.getCurrentUser()) {
      await GoogleSigninModule.signOut();
    }
  } catch {
    // Ignore Google session cleanup failures after Supabase sign-out succeeds.
  }
};

export const updateCurrentUserDisplayName = async (displayName: string): Promise<AppUser> => {
  await assertConfigured();

  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: displayName.trim() || null },
  });

  if (error || !data.user) {
    throw error ?? new Error('You need to be signed in before updating your profile.');
  }

  return toAppUser(data.user);
};

export const getAuthErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
    const code = (error as { code: string }).code;

    if (code.includes('IN_PROGRESS')) {
      return 'An authentication request is already in progress. Please wait a moment and try again.';
    }

    if (code.includes('PLAY_SERVICES_NOT_AVAILABLE')) {
      return 'Google Play Services is unavailable on this device. Update it and try again.';
    }

    if (code.includes('SIGN_IN_CANCELLED')) {
      return 'Google sign-in was cancelled.';
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    const message = (error as { message: string }).message.toLowerCase();

    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return 'Invalid credentials. Please try again.';
    }

    if (message.includes('email already registered') || message.includes('user already registered')) {
      return 'An account with this email or phone already exists.';
    }

    if (message.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }

    if (message.includes('unable to validate email address')) {
      return 'Please enter a valid email address.';
    }

    if (message.includes('invalid phone number')) {
      return 'Please enter a valid phone number with country code.';
    }

    if (message.includes('token has expired')) {
      return 'The OTP has expired. Please request a new one.';
    }

    if (message.includes('invalid token')) {
      return 'Invalid OTP. Please check and try again.';
    }

    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Check your connection and try again.';
    }

    if (message.includes('redirect') || message.includes('redirect_to')) {
      return 'Password reset redirect is not allowed by Supabase. Add your app deep link URL to the Auth Redirect URLs list and try again.';
    }

    if (message.includes('supabase backend is unreachable')) {
      return (error as { message: string }).message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
