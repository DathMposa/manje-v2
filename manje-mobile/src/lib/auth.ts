import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type Unsubscribe,
  type User as FirebaseUser,
  type UserCredential,
} from '@firebase/auth';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
  getFirebaseAuth,
  getFirebaseConfigurationError,
  getGoogleConfigurationError,
  getGoogleWebClientId,
} from './firebase';

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

const toAppUser = (user: FirebaseUser): AppUser => ({
  id: user.uid,
  email: user.email ?? '',
  displayName: user.displayName,
  photoURL: user.photoURL,
});

const getAdditionalInfo = (credential: UserCredential) => getAdditionalUserInfo(credential);

const getConfiguredAuth = () => {
  const configurationError = getFirebaseConfigurationError();

  if (configurationError) {
    throw new Error(configurationError);
  }

  return getFirebaseAuth();
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
  const configurationError = getFirebaseConfigurationError();

  if (configurationError) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(getConfiguredAuth(), (user) => {
    callback(user ? toAppUser(user) : null);
  });
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthSuccessResult> => {
  const result = await signInWithEmailAndPassword(getConfiguredAuth(), email, password);

  return {
    user: toAppUser(result.user),
    isNewUser: getAdditionalInfo(result)?.isNewUser ?? false,
  };
};

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<AuthSuccessResult> => {
  const auth = getConfiguredAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const trimmedName = name.trim();

  if (trimmedName) {
    await updateProfile(result.user, { displayName: trimmedName });
  }

  return {
    user: {
      id: result.user.uid,
      email: result.user.email ?? email,
      displayName: trimmedName || result.user.displayName,
      photoURL: result.user.photoURL,
    },
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

  const credential = GoogleAuthProvider.credential(response.data.idToken);
  const result = await signInWithCredential(getConfiguredAuth(), credential);

  return {
    user: toAppUser(result.user),
    isNewUser: getAdditionalInfo(result)?.isNewUser ?? false,
  };
};

export const signOut = async () => {
  await firebaseSignOut(getConfiguredAuth());

  try {
    if (GoogleSignin.getCurrentUser()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignore Google session cleanup failures after Firebase sign-out succeeds.
  }
};

export const updateCurrentUserDisplayName = async (displayName: string) => {
  const auth = getConfiguredAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('You need to be signed in before updating your profile.');
  }

  await updateProfile(currentUser, { displayName: displayName.trim() || null });

  return toAppUser(currentUser);
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

  if (typeof error === 'object' && error && 'code' in error && typeof error.code === 'string') {
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        return 'This email already uses a different sign-in method. Sign in with that method first, then try Google again later.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-login-credentials':
        return 'Invalid email or password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/missing-password':
        return 'Please enter your password.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      default:
        break;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
