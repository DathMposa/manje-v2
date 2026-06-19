import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { HelpCircle, Mail, MessageCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ClayCard } from '../../../src/components/common/ClayCard';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';
import { useAuthStore, useContentStore } from '../../../src/stores';
import { submitSupportFeedback } from '../../../src/lib/database';

export default function SupportScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const user = useAuthStore((state) => state.user);
  const faqs = useContentStore((state) => state.faqs);

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@manje.app?subject=Manje App Support Request');
  };

  const handleSendFeedback = async () => {
    if (!user || !feedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    await submitSupportFeedback(user.id, feedback);
    setFeedback('');
    setIsSubmitting(false);
    Alert.alert('Thank you', 'Your feedback was submitted successfully.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScreenHeader title="Help & Support" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['4xl'] }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary.base}20` }]}>
            <HelpCircle size={32} color={colors.primary.base} />
          </View>
          <Text style={[typography.headline.medium, { color: colors.text.primary, marginTop: spacing.lg, textAlign: 'center' }]}>
            How can we help?
          </Text>
        </View>

        <View style={styles.contactOptions}>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.background.card, borderColor: colors.border.light }]} onPress={handleContactSupport}>
            <View style={[styles.contactIcon, { backgroundColor: `${colors.primary.base}15` }]}>
              <Mail size={24} color={colors.primary.base} />
            </View>
            <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing.sm }]}>Email Us</Text>
            <Text style={[typography.label.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: 4 }]}>Typically replies within 24 hours</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.background.card, borderColor: colors.border.light }]} onPress={handleContactSupport}>
            <View style={[styles.contactIcon, { backgroundColor: colors.status.success.bg }]}>
              <MessageCircle size={24} color={colors.status.success.base} />
            </View>
            <Text style={[typography.headline.small, { color: colors.text.primary, marginTop: spacing.sm }]}>Live Chat</Text>
            <Text style={[typography.label.medium, { color: colors.text.secondary, textAlign: 'center', marginTop: 4 }]}>Contact us to request support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[typography.headline.small, { color: colors.text.primary }]}>Frequently Asked Questions</Text>
        </View>

        <ClayCard variant="subtle" style={styles.faqCard}>
          {faqs.length === 0 ? (
            <View style={styles.emptyFaq}>
              <Text style={[typography.body.medium, { color: colors.text.secondary }]}>
                Add rows to the `support_faqs` table in Supabase to publish help content here.
              </Text>
            </View>
          ) : (
            faqs.map((faq, index) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <View
                  key={faq.id}
                  style={[
                    styles.faqItem,
                    index < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border.light },
                  ]}
                >
                  <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFaq(faq.id)} activeOpacity={0.7}>
                    <Text style={[typography.body.large, { color: colors.text.primary, flex: 1, paddingRight: 16 }]}>{faq.question}</Text>
                    <ChevronRight size={20} color={colors.text.muted} style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }} />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <Text style={[typography.body.medium, { color: colors.text.secondary }]}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ClayCard>

        <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
          <Text style={[typography.headline.small, { color: colors.text.primary }]}>Send Feedback</Text>
        </View>

        <ClayCard variant="subtle" style={styles.feedbackCard}>
          <Text style={[typography.body.medium, { color: colors.text.secondary, marginBottom: spacing.md }]}>
            Have an idea to improve Manje or found a bug? Your feedback is stored with your account in Supabase.
          </Text>
          <Input label="" placeholder="Tell us what you think..." value={feedback} onChangeText={setFeedback} multiline numberOfLines={4} />
          <View style={{ marginTop: spacing.md }}>
            <Button title="Submit Feedback" onPress={() => void handleSendFeedback()} disabled={!feedback.trim() || !user} loading={isSubmitting} variant="primary" />
          </View>
        </ClayCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  contactCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  faqCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  emptyFaq: {
    padding: 16,
  },
  faqItem: {
    padding: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  feedbackCard: {
    padding: 20,
  },
});
