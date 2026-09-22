import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { triggerLightHaptic } from '../../hooks/useHaptics';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
}) => {
  const { colors } = useTheme();

  const handleRightPress = () => {
    if (onRightPress) {
      triggerLightHaptic();
      onRightPress();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>

      {rightIcon && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={rightAccessibilityLabel || title}
          style={[
            styles.rightBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleRightPress}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  titleContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  rightBtn: {
    width: 44, // Minimum accessible touch target
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
