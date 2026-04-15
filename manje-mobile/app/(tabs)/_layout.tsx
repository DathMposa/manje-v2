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
          height: layout.tabBarHeight,
          paddingBottom: spacing[2],
          paddingTop: spacing[2],
          ...shadow('md'),
        },
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          ...typeScale.labelSmall,
          marginTop: spacing[1],
        },
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
          title: '',
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
        name="budgets"
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  quickAddContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -spacing[4],
  },
  quickAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
