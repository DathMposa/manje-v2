import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, PieChart, GraduationCap, TrendingUp, History } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

const QUICK_ACTIONS = [
  {
    id: 'budget',
    title: 'Create a Budget',
    subtitle: 'Let AI help you build a plan',
    icon: PieChart,
    color: '#6554C0',
    route: '/(tabs)/ai/budget'
  },
  {
    id: 'insights',
    title: 'Spending Insights',
    subtitle: 'Analyze your recent habits',
    icon: TrendingUp,
    color: '#00B8D9',
    route: '/(tabs)/ai/chat?topic=insights'
  },
  {
    id: 'education',
    title: 'Learn & Grow',
    subtitle: 'Financial tips for Malawi',
    icon: GraduationCap,
    color: '#FFAB00',
    route: '/(tabs)/ai/chat?topic=education'
  },
  {
    id: 'advice',
    title: 'General Advice',
    subtitle: 'Ask me anything',
    icon: MessageSquare,
    color: '#36B37E',
    route: '/(tabs)/ai/chat?topic=general'
  }
];

export default function AIChatHomeScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader 
        title="Manje AI" 
        rightAction={
          <TouchableOpacity onPress={() => router.push('/(tabs)/ai/history')} style={styles.headerButton}>
            <History size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <ManjeCharacter mood="wave" size="xl" variant="half" animated showIdleFloat />
          <Text style={[typography.headline.large, { color: colors.text.primary, marginTop: spacing.xl, textAlign: 'center' }]}>
            Hello, Thandiwe!
          </Text>
          <Text style={[typography.body.large, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }]}>
            I'm your personal financial assistant. How can I help you today?
          </Text>
        </View>

        <ClayCard 
          variant="subtle" 
          style={[styles.chatBox, { borderColor: colors.primary.base + '50' }]}
          pressable
          onPress={() => router.push('/(tabs)/ai/chat')}
        >
          <Text style={[typography.body.large, { color: colors.text.muted }]}>
            Ask me a question...
          </Text>
          <View style={[styles.sendButton, { backgroundColor: colors.primary.base }]}>
            <MessageSquare size={16} color={colors.text.inverse} />
          </View>
        </ClayCard>

        <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing['2xl'], marginBottom: spacing.lg }]}>
          Quick Actions
        </Text>

        <View style={styles.grid}>
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: colors.background.card, borderColor: colors.border.light }]}
                activeOpacity={0.7}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: action.color + '15' }]}>
                  <Icon size={24} color={action.color} />
                </View>
                <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: 4 }]}>
                  {action.title}
                </Text>
                <Text style={[typography.label.small, { color: colors.text.secondary }]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  chatBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 24,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  }
});
