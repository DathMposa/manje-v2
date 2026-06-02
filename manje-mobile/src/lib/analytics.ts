import PostHog from 'posthog-react-native';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const posthog = apiKey ? new PostHog(apiKey, { host }) : null;

export const analytics = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog?.identify(userId, properties);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track: (event: string, properties?: Record<string, any>) => {
    posthog?.capture(event, properties);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  screen: (name: string, properties?: Record<string, any>) => {
    posthog?.screen(name, properties);
  },
  reset: () => {
    posthog?.reset();
  },
};
