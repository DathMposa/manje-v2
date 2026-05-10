import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import * as FirebaseFirestore from 'firebase/firestore';
import { Platform } from 'react-native';

type FirebaseConfigKey =
  | 'apiKey'
  | 'authDomain'
  | 'projectId'
  | 'storageBucket'
  | 'messagingSenderId'
  | 'appId';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim() ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim() ?? '',
};

const firebaseEnvMap: Record<FirebaseConfigKey, string> = {
  apiKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'EXPO_PUBLIC_FIREBASE_APP_ID',
};

let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

type Auth = FirebaseAuth.Auth;
type AuthPersistence = NonNullable<Parameters<typeof FirebaseAuth.initializeAuth>[1]>['persistence'];
type Firestore = FirebaseFirestore.Firestore;

const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence: (storage: typeof AsyncStorage) => AuthPersistence;
  }
).getReactNativePersistence;

export const getMissingFirebaseEnvVars = () =>
  (Object.entries(firebaseConfig) as Array<[FirebaseConfigKey, string]>)
    .filter(([, value]) => !value)
    .map(([key]) => firebaseEnvMap[key]);

export const isFirebaseConfigured = () => getMissingFirebaseEnvVars().length === 0;

export const getFirebaseConfigurationError = () => {
  const missing = getMissingFirebaseEnvVars();

  if (!missing.length) {
    return null;
  }

  return `Firebase is not configured yet. Add ${missing.join(', ')} to your app environment first.`;
};

export const getGoogleWebClientId = () => process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

export const getGoogleConfigurationError = () => {
  if (!getGoogleWebClientId()) {
    return 'Google sign-in is not configured yet. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before using Continue with Google.';
  }

  return null;
};

export const getFirebaseApp = (): FirebaseApp => {
  const configurationError = getFirebaseConfigurationError();

  if (configurationError) {
    throw new Error(configurationError);
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  return getApp();
};

export const getFirebaseAuth = (): Auth => {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();

  if (Platform.OS === 'web') {
    authInstance = FirebaseAuth.getAuth(app);
    return authInstance;
  }

  try {
    authInstance = FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    authInstance = FirebaseAuth.getAuth(app);
  }

  return authInstance;
};

export const getFirestoreDb = (): Firestore => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();

  try {
    firestoreInstance = FirebaseFirestore.initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    firestoreInstance = FirebaseFirestore.getFirestore(app);
  }

  return firestoreInstance;
};
