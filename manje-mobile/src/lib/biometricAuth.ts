/**
 * Biometric authentication helpers.
 * Wraps expo-local-authentication and expo-secure-store for offline device auth.
 *
 * Flow:
 *  1. After a successful cloud sign-in, call setLocalAuthUserId(userId).
 *  2. On subsequent app launches, call getLocalAuthUserId() — if a value
 *     is returned, show the biometric-lock screen instead of welcome.
 *  3. Call authenticateWithBiometrics() to unlock.
 *  4. On sign-out, call clearLocalAuth() to remove the stored userId.
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LOCAL_AUTH_USER_KEY = '@manje:local_auth_user_id';
const BIOMETRIC_ATTEMPTS_KEY = '@manje:biometric_attempts';
const MAX_ATTEMPTS = 5;

// ---------------------------------------------------------------------------
// SecureStore helpers
// ---------------------------------------------------------------------------

export const getLocalAuthUserId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(LOCAL_AUTH_USER_KEY);
  } catch {
    return null;
  }
};

export const setLocalAuthUserId = async (userId: string): Promise<void> => {
  await SecureStore.setItemAsync(LOCAL_AUTH_USER_KEY, userId);
  // Reset attempt counter when a new user is stored
  await SecureStore.deleteItemAsync(BIOMETRIC_ATTEMPTS_KEY);
};

export const clearLocalAuth = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(LOCAL_AUTH_USER_KEY);
  await SecureStore.deleteItemAsync(BIOMETRIC_ATTEMPTS_KEY);
};

// ---------------------------------------------------------------------------
// Attempt tracking
// ---------------------------------------------------------------------------

const getAttempts = async (): Promise<number> => {
  const val = await SecureStore.getItemAsync(BIOMETRIC_ATTEMPTS_KEY);
  return val ? parseInt(val, 10) : 0;
};

const incrementAttempts = async (): Promise<number> => {
  const current = await getAttempts();
  const next = current + 1;
  await SecureStore.setItemAsync(BIOMETRIC_ATTEMPTS_KEY, String(next));
  return next;
};

export const resetAttempts = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(BIOMETRIC_ATTEMPTS_KEY);
};

export const isLockedOut = async (): Promise<boolean> => {
  const attempts = await getAttempts();
  return attempts >= MAX_ATTEMPTS;
};

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export type BiometricAvailability =
  | 'available'      // hardware + enrolled
  | 'not_enrolled'   // hardware but no biometrics enrolled
  | 'not_supported'; // no hardware

export const checkBiometricAvailability = async (): Promise<BiometricAvailability> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return 'not_supported';

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return 'not_enrolled';

  return 'available';
};

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export type BiometricResult =
  | { success: true }
  | { success: false; reason: 'cancelled' | 'locked_out' | 'failed' | 'error'; attemptsLeft?: number };

export const authenticateWithBiometrics = async (
  promptMessage = 'Unlock Manje'
): Promise<BiometricResult> => {
  if (await isLockedOut()) {
    return { success: false, reason: 'locked_out' };
  }

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: false,
    });

    if (result.success) {
      await resetAttempts();
      return { success: true };
    }

    if (result.error === 'user_cancel' || result.error === 'system_cancel') {
      return { success: false, reason: 'cancelled' };
    }

    const attempts = await incrementAttempts();
    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);

    if (attemptsLeft === 0) {
      return { success: false, reason: 'locked_out' };
    }

    return { success: false, reason: 'failed', attemptsLeft };
  } catch {
    return { success: false, reason: 'error' };
  }
};
