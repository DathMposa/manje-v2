import { ImageSourcePropType } from 'react-native';

export const MANJE_MOODS = [
  'wave',
  'happy',
  'thinking',
  'celebrate',
  'concern',
  'encourage',
  'sleep',
  'surprise',
  'tip',
  'focus',
] as const;

export const MANJE_VARIANTS = ['full', 'half', 'badge'] as const;

export const MANJE_UTILITY_POSES = [
  'dashboard-guide',
  'budget-planner',
  'quick-tip',
  'empty-state',
  'education-host',
  'bill-reminder',
  'secure-account',
  'pen-cheek-tip',
] as const;

export type ManjeMood = (typeof MANJE_MOODS)[number];
export type ManjeVariant = (typeof MANJE_VARIANTS)[number];
export type ManjeUtilityPose = (typeof MANJE_UTILITY_POSES)[number];

type CoreMood = Exclude<ManjeMood, 'tip' | 'focus'>;

const moodAssets: Record<CoreMood, Record<ManjeVariant, ImageSourcePropType>> = {
  wave: {
    full: require('../../../assets/character/wave/wave-full.png'),
    half: require('../../../assets/character/wave/wave-half.png'),
    badge: require('../../../assets/character/wave/wave-badge.png'),
  },
  happy: {
    full: require('../../../assets/character/happy/happy-full.png'),
    half: require('../../../assets/character/happy/happy-half.png'),
    badge: require('../../../assets/character/happy/happy-badge.png'),
  },
  thinking: {
    full: require('../../../assets/character/thinking/thinking-full.png'),
    half: require('../../../assets/character/thinking/thinking-half.png'),
    badge: require('../../../assets/character/thinking/thinking-badge.png'),
  },
  celebrate: {
    full: require('../../../assets/character/celebrate/celebrate-full.png'),
    half: require('../../../assets/character/celebrate/celebrate-half.png'),
    badge: require('../../../assets/character/celebrate/celebrate-badge.png'),
  },
  concern: {
    full: require('../../../assets/character/concern/concern-full.png'),
    half: require('../../../assets/character/concern/concern-half.png'),
    badge: require('../../../assets/character/concern/concern-badge.png'),
  },
  encourage: {
    full: require('../../../assets/character/encourage/encourage-full.png'),
    half: require('../../../assets/character/encourage/encourage-half.png'),
    badge: require('../../../assets/character/encourage/encourage-badge.png'),
  },
  sleep: {
    full: require('../../../assets/character/sleep/sleep-full.png'),
    half: require('../../../assets/character/sleep/sleep-half.png'),
    badge: require('../../../assets/character/sleep/sleep-badge.png'),
  },
  surprise: {
    full: require('../../../assets/character/surprise/surprise-full.png'),
    half: require('../../../assets/character/surprise/surprise-half.png'),
    badge: require('../../../assets/character/surprise/surprise-badge.png'),
  },
};

export const characterAssets: Record<ManjeMood, Record<ManjeVariant, ImageSourcePropType>> = {
  ...moodAssets,
  tip: moodAssets.happy,
  focus: moodAssets.concern,
};

export const characterUtilityAssets: Record<ManjeUtilityPose, ImageSourcePropType> = {
  'dashboard-guide': require('../../../assets/character/utility/dashboard-guide.png'),
  'budget-planner': require('../../../assets/character/utility/budget-planner.png'),
  'quick-tip': require('../../../assets/character/utility/quick-tip.png'),
  'empty-state': require('../../../assets/character/utility/empty-state.png'),
  'education-host': require('../../../assets/character/utility/education-host.png'),
  'bill-reminder': require('../../../assets/character/utility/bill-reminder.png'),
  'secure-account': require('../../../assets/character/utility/secure-account.png'),
  'pen-cheek-tip': require('../../../assets/character/utility/pen-cheek-tip.png'),
};
