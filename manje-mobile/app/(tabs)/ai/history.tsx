import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Clock, Search, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { Input } from '../../../src/components/common/Input';

const HISTORY = [
  {
    id: '1',
    topic: 'Budget Creation',
    preview: 'Let\'s build a budget together. What\'s your main priority this month?',
    time: 'Today, 2:30 PM',
    type: 'budget'
  },
  {
    id: '2',
    topic: 'Spending Insights',
    preview: 'I noticed you spent 30% more on Groceries this week.',
    time: 'Yesterday, 9:15 AM',
    type: 'insights'
  },
  {
    id: '3',
    topic: 'Saving Tips',
    preview: 'Here are 3 ways to reduce your utility bills in Malawi...',
    time: '12 Apr 2026',
    type: 'education'
  }
];

export default function ChatHistoryScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const [search, setSearch] = React.useState('');

  const filteredHistory = HISTORY.filter(item => 
    item.topic.toLowerCase().includes(search.toLowerCase()) ||
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader 
        title="Chat History" 
        showBack 
        onBackPress={() => router.back()}
      />
      
      <View style={[styles.searchContainer, { paddingHorizontal: spacing.xl }]}>
        <Input
          label=""
          placeholder="Search conversations..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Search size={20} color={colors.text.muted} />}
        />
      </View>
      
      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing['4xl'] }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.historyItem, { borderBottomColor: colors.border.light }]}
            activeOpacity={0.7}
            onPress={() => router.push(`/(tabs)/ai/chat?topic=${item.type}`)}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary.base + '20' }]}>
              <MessageSquare size={20} color={colors.primary.base} />
            </View>
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={[typography.headline.small, { color: colors.text.primary }]}>{item.topic}</Text>
                <Text style={[typography.label.small, { color: colors.text.muted }]}>{item.time}</Text>
              </View>
              <Text style={[typography.body.medium, { color: colors.text.secondary, marginTop: 4 }]} numberOfLines={1}>
                {item.preview}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
