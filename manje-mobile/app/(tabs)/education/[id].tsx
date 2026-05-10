import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, Share2, GraduationCap } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { useContentStore } from '../../../src/stores';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const article = useContentStore((state) => state.getArticle(String(id)));

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ScreenHeader title="" showBack onBackPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="" showBack onBackPress={() => router.back()} rightAction={<Share2 size={24} color={colors.text.primary} style={{ marginRight: 8 }} />} />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.border.medium }]}>
            <GraduationCap size={48} color={colors.text.inverse} />
          </View>
        )}

        <View style={[styles.contentContainer, { backgroundColor: colors.background.base }]}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: `${colors.primary.base}20` }]}>
              <Text style={[typography.label.small, { color: colors.primary.base }]}>{article.category}</Text>
            </View>
            <View style={styles.timeRow}>
              <Clock size={12} color={colors.text.muted} style={{ marginRight: 4 }} />
              <Text style={[typography.label.small, { color: colors.text.muted }]}>{article.readTime}</Text>
            </View>
          </View>

          <Text style={[typography.display.medium, { color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.xs }]}>{article.title}</Text>

          <Text style={[typography.label.medium, { color: colors.text.muted, marginBottom: spacing.xl }]}>
            Published on {new Date(article.createdAt).toLocaleDateString()}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <Text style={[typography.body.large, { color: colors.text.secondary, lineHeight: 28, marginTop: spacing.lg }]}>{article.body}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePlaceholder: {
    height: 240,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 240,
  },
  contentContainer: {
    padding: 24,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
