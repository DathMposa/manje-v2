import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';
import { ClayCard } from './ClayCard';
import { Button } from './Button';
import { ManjeText } from './ManjeText';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  icon = 'alert-circle',
  loading = false,
}: ConfirmModalProps) {
  const { colors, shadow } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          entering={FadeIn.duration(200)}
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centered}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View entering={FadeInUp.duration(300).delay(100)}>
                <ClayCard variant="clay" style={[styles.modalCard, shadow('md')]}
                  bgColor={colors.bg.card}
                >
                  {/* Icon */}
                  <View style={[styles.iconContainer, { 
                    backgroundColor: confirmVariant === 'danger' 
                      ? colors.status?.danger?.bg || '#fee2e2'
                      : colors.primary?.subtle || '#e0e7ff'
                  }]}>
                    <Feather 
                      name={icon} 
                      size={28} 
                      color={confirmVariant === 'danger' 
                        ? colors.status?.danger?.base || '#dc2626'
                        : colors.primary?.default || '#4f46e5'
                      } 
                    />
                  </View>

                  {/* Title */}
                  <ManjeText
                    variant="headline.sm"
                    style={[styles.title, { color: colors.text.primary }]}
                  >
                    {title}
                  </ManjeText>

                  {/* Message */}
                  <ManjeText
                    variant="body.md"
                    style={[styles.message, { color: colors.text.secondary }]}
                  >
                    {message}
                  </ManjeText>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    {cancelText ? (
                      <Button
                        title={cancelText}
                        onPress={onClose}
                        variant="ghost"
                        size="md"
                        style={{ ...styles.button, flex: 1 }}
                        textStyle={{ color: colors.text.secondary }}
                      />
                    ) : null}
                    <Button
                      title={confirmText}
                      onPress={onConfirm}
                      variant="primary"
                      size="md"
                      loading={loading}
                      style={StyleSheet.flatten([
                        styles.button,
                        cancelText ? { flex: 1 } : { width: '100%' },
                        confirmVariant === 'danger' && { 
                          backgroundColor: colors.status?.danger?.base || '#dc2626' 
                        }
                      ])}
                    />
                  </View>
                </ClayCard>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing[6],
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: spacing[6],
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    width: '100%',
  },
  button: {
    borderRadius: radius.xl,
  },
});
