import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const getSupabaseConfigurationError = () => {
  const missing: string[] = [];

  if (!supabaseUrl) {
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseAnonKey) {
    missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length === 0) {
    return null;
  }

  return `Supabase is not configured yet. Add ${missing.join(', ')} to your app environment first.`;
};

export const getGoogleWebClientId = () => process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? '';

export const getGoogleConfigurationError = () => {
  if (!getGoogleWebClientId()) {
    return 'Google sign-in is not configured yet. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before using Continue with Google.';
  }

  return null;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
