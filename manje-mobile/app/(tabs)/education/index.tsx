import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, BookOpen, Clock } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { ManjeCharacter } from '../../../src/components/character';
import { useContentStore } from '../../../src/stores';

export default function EducationHubScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const articles = useContentStore((state) => state.articles);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(articles.map((article) => article.category))], [articles]);
  const filteredArticles = useMemo(
    () => articles.filter((article) => activeCategory === 'All' || article.category === activeCategory),
    [activeCategory, articles]
  );
  const featuredArticle = filteredArticles[0];
  const moreArticles = filteredArticles.slice(featuredArticle ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Learn & Grow" showBack onBackPress={() => router.back()} />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.xl }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeCategory === category ? colors.primary.base : colors.background.card,
                  borderColor: activeCategory === category ? colors.primary.base : colors.border.medium,
                },
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[typography.label.medium, { color: activeCategory === category ? colors.text.inverse : colors.text.secondary }]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        {!featuredArticle ? (
          <ClayCard variant="subtle" style={styles.emptyCard}>
            <ManjeCharacter utility="education-host" size={170} animated showIdleFloat />
            <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing.md }]}>No live articles yet</Text>
            <Text style={[typography.body.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }]}>
              Publish articles to the `educationArticles` collection and they’ll appear here.
            </Text>
          </ClayCard>
        ) : (
          <>
            <Text style={[typography.headline.small, { color: colors.text.primary, marginBottom: spacing.md }]}>Featured</Text>

            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/(tabs)/education/${featuredArticle.id}`)}>
              <ClayCard variant="subtle" style={styles.featuredCard}>
                {featuredArticle.imageUrl ? (
                  <Image source={{ uri: featuredArticle.imageUrl }} style={styles.image} />
                ) : (
                  <View style={[styles.imagePlaceholder, { backgroundColor: colors.border.medium }]}>
                    <GraduationCap size={48} color={colors.text.inverse} />
                  </View>
                )}
                <View style={styles.featuredContent}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: `${colors.primary.base}20` }]}>
                      <Text style={[typography.label.small, { color: colors.primary.base }]}>{featuredArticle.category}</Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Clock size={12} color={colors.text.muted} style={{ marginRight: 4 }} />
                      <Text style={[typography.label.small, { color: colors.text.muted }]}>{featuredArticle.readTime}</Text>
                    </View>
                  </View>
                  <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: 12 }]}>{featuredArticle.title}</Text>
                  <Text style={[typography.body.medium, { color: colors.text.secondary, marginTop: spacing.sm }]} numberOfLines={2}>
                    {featuredArticle.summary}
                  </Text>
                </View>
              </ClayCard>
            </TouchableOpacity>

            {!!moreArticles.length && (
              <>
                <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.md }]}>
                  More Articles
                </Text>

                <View style={styles.articleList}>
                  {moreArticles.map((article) => (
                    <TouchableOpacity key={article.id} activeOpacity={0.7} onPress={() => router.push(`/(tabs)/education/${article.id}`)}>
                      <ClayCard variant="subtle" style={styles.articleCard}>
                        <View style={styles.articleCardContent}>
                          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary.base}20` }]}>
                            <BookOpen size={24} color={colors.primary.base} />
                          </View>

                          <View style={styles.articleInfo}>
                            <View style={[styles.smallBadge, { backgroundColor: colors.background.sunken }]}>
                              <Text style={[typography.label.small, { color: colors.text.secondary }]}>{article.category}</Text>
                            </View>
                            <Text style={[typography.headline.small, { color: colors.text.primary, marginVertical: 4 }]}>{article.title}</Text>
                            <View style={styles.timeRow}>
                              <Clock size={12} color={colors.text.muted} style={{ marginRight: 4 }} />
                              <Text style={[typography.label.small, { color: colors.text.muted }]}>{article.readTime}</Text>
                            </View>
                          </View>
                        </View>
                      </ClayCard>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  featuredCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
  },
  featuredContent: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  articleList: {
    gap: 16,
  },
  articleCard: {
    padding: 16,
  },
  articleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  articleInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
});
