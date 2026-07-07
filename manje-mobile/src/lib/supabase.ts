import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Supabase requires a Storage interface; expo-secure-store has a 2KB value limit per key,
// so we chunk values larger than 1800 bytes across numbered keys.
const CHUNK_SIZE = 1800;

const SecureStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const chunkCount = await SecureStore.getItemAsync(`${key}__chunks`);
    if (chunkCount !== null) {
      const count = parseInt(chunkCount, 10);
      const chunks: string[] = [];
      for (let i = 0; i < count; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}__chunk_${i}`);
        if (chunk === null) return null;
        chunks.push(chunk);
      }
      return chunks.join('');
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks = Math.ceil(value.length / CHUNK_SIZE);
    for (let i = 0; i < chunks; i++) {
      await SecureStore.setItemAsync(`${key}__chunk_${i}`, value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }
    await SecureStore.setItemAsync(`${key}__chunks`, String(chunks));
  },
  removeItem: async (key: string): Promise<void> => {
    const chunkCount = await SecureStore.getItemAsync(`${key}__chunks`);
    if (chunkCount !== null) {
      const count = parseInt(chunkCount, 10);
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}__chunk_${i}`);
      }
      await SecureStore.deleteItemAsync(`${key}__chunks`);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

let cachedReachability:
  | { ok: true; checkedAt: number }
  | { ok: false; checkedAt: number; message: string }
  | null = null;
const REACHABILITY_TTL_MS = 60_000;

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

const getSupabaseHost = () => {
  if (!supabaseUrl) {
    return '';
  }

  try {
    return new URL(supabaseUrl).host;
  } catch {
    return '';
  }
};

export const getSupabaseConfigurationError = () => {
  const missing: string[] = [];

  if (!supabaseUrl) {
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseAnonKey) {
    missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    return `Supabase is not configured yet. Add ${missing.join(', ')} to your app environment first.`;
  }

  try {
    const parsedUrl = new URL(supabaseUrl);

    if (parsedUrl.protocol !== 'https:') {
      return 'Supabase URL must start with https://.';
    }
  } catch {
    return 'EXPO_PUBLIC_SUPABASE_URL is not a valid URL.';
  }

  return null;
};

export const getGoogleWebClientId = () => process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

export const getGoogleConfigurationError = () => {
  if (!getGoogleWebClientId()) {
    return 'Google sign-in is not configured yet. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before using Continue with Google.';
  }

  return null;
};

export const getSupabaseReachabilityError = async () => {
  const configError = getSupabaseConfigurationError();
  if (configError) {
    return configError;
  }

  if (cachedReachability && Date.now() - cachedReachability.checkedAt < REACHABILITY_TTL_MS) {
    return cachedReachability.ok ? null : cachedReachability.message;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    if (!response.ok) {
      const message = `Supabase backend responded with ${response.status}. Check the project status and auth endpoint configuration.`;
      cachedReachability = { ok: false, checkedAt: Date.now(), message };
      return message;
    }

    cachedReachability = { ok: true, checkedAt: Date.now() };
    return null;
  } catch {
    const host = getSupabaseHost() || supabaseUrl;
    const message = `Supabase backend is unreachable at ${host}. Update EXPO_PUBLIC_SUPABASE_URL to the correct project URL and restart Expo.`;
    cachedReachability = { ok: false, checkedAt: Date.now(), message };
    return message;
  } finally {
    clearTimeout(timeout);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
