/**
 * Tabs Layout
 * Bottom tab navigation for main app screens.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { layout, spacing, radius } from '../../src/theme/spacing';
import { typeScale } from '../../src/theme/typography';
import { springPresets } from '../../src/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarIconProps {
  name: keyof typeof Feather.glyphMap;
  color: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, focused }) => {
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, springPresets.snappy);
      setTimeout(() => {
        scale.value = withSpring(1, springPresets.snappy);
      }, 150);
    }
  }, [focused]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <Feather name={name} size={24} color={color} />
    </Animated.View>
  );
};

const HIDDEN_TABS = [
  'transactions/[id]',
  'transactions/index',
  'transactions/edit/[id]',
  'settings/support',
  'settings/security',
  'settings/privacy',
  'settings/notifications',
  'settings/index',
  'settings/delete-account',
  'settings/currency',
  'reports/trends',
  'reports/index',
  'reports/health',
  'notifications/[id]',
  'notifications/index',
  'goals/[id]',
  'goals/index',
  'goals/edit/[id]',
  'goals/create/index',
  'goals/contribute/[id]',
  'education/[id]',
  'education/index',
  'budgets/[id]',
  'budgets/create/manual',
  'budgets/edit/[id]',
  'bills/[id]',
  'bills/pay/[id]',
  'bills/index',
  'bills/edit/[id]',
  'bills/create/index',
  'ai/index',
  'ai/history',
  'ai/chat',
  'ai/budget'
];

export default function TabsLayout() {
  const { colors, shadow, isDark } = useTheme();
  const router = useRouter();
  
  const handleQuickAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/quick-add');
  };
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.card,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 25,
          paddingTop: 10,
          ...shadow('md'),
        },
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          ...typeScale.labelSmall,
          marginTop: 2, 
        },
        tabBarItemStyle: {
          height: 50,
          paddingBottom: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="activity" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="quick-add"
        options={{
          title: 'Add',
          tabBarLabel: () => null, // Hide label for the FAB button
          tabBarButton: () => (
            <View style={styles.quickAddContainer}>
              <AnimatedPressable
                onPress={handleQuickAdd}
                style={[
                  styles.quickAddButton,
                  { backgroundColor: colors.primary.default },
                  shadow('lg'),
                ]}
              >
                <Feather name="plus" size={28} color={colors.text.inverse} />
              </AnimatedPressable>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="budgets/index"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="pie-chart" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />

      {HIDDEN_TABS.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            href: null,
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  quickAddContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25, // Adjusted to compensate for the larger tab bar padding
  },
  quickAddButton: {
    width: 60, // Increased size slightly to make it stand out more
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
