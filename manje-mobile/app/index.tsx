/**
 * App Index
 * Redirects to the appropriate screen based on auth state.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // The root layout handles auth state and redirects
  // This is a fallback that redirects to welcome
  return <Redirect href="/(auth)/welcome" />;
}
