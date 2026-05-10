import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Or Ionicons if preferred, wait, the guide specifically mentions Ionicons, but Feather is mostly compatible. The guide says: `Ionicons chevron-back (24px)`
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { layout, spacing } from '../../theme/spacing';
import { typeScale } from '../../theme/typography';

export interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  onBackPress,
  rightAction,
  transparent = false,
  style,
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const containerStyle: ViewStyle = {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // for absolute title
    paddingHorizontal: layout.screenPaddingH,
    backgroundColor: transparent ? 'transparent' : colors.bg.base,
    borderBottomWidth: transparent ? 0 : 1,
    borderBottomColor: transparent ? 'transparent' : colors.border.light,
  };

  return (
    <View style={[containerStyle, style]}>
      {/* Absolute Title */}
      {!!title && (
        <View style={styles.titleContainer} pointerEvents="none">
          <Text
            style={[
              typeScale['headline.lg'],
              { color: transparent ? colors.text.inverse : colors.text.primary, textAlign: 'center' },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}

      {/* Left Action (Back) */}
      {showBack ? (
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={transparent ? colors.text.inverse : colors.text.primary}
          />
        </Pressable>
      ) : (
        <View style={styles.placeholderButton} />
      )}

      {/* Right Action */}
      <View style={styles.rightActionContainer}>
        {rightAction || <View style={styles.placeholderButton} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    left: 60,
    right: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: layout.touchTargetMin,
    height: layout.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    left: layout.screenPaddingH,
  },
  rightActionContainer: {
    position: 'absolute',
    right: layout.screenPaddingH,
    height: layout.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  placeholderButton: {
    width: layout.touchTargetMin,
  },
});
