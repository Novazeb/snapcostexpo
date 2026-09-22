import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING } from '../../constants/theme';
import { triggerLightHaptic } from '../../hooks/useHaptics';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  iconName?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  iconName,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    triggerLightHaptic();
    onPress();
  };

  let bg = colors.scanBtnBg;
  let txt = colors.scanBtnText;
  let borderColor = 'transparent';

  if (variant === 'primary') {
    bg = colors.scanBtnBg;
    txt = colors.scanBtnText;
    borderColor = colors.scanBtnBg;
  } else if (variant === 'secondary') {
    bg = colors.cardSubtle;
    txt = colors.textPrimary;
    borderColor = colors.border;
  } else if (variant === 'danger') {
    bg = colors.danger;
    txt = '#FFFFFF';
    borderColor = colors.danger;
  } else if (variant === 'ghost') {
    bg = 'transparent';
    txt = colors.textPrimary;
    borderColor = 'transparent';
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txt} size="small" />
      ) : (
        <>
          {iconName && <Ionicons name={iconName} size={18} color={txt} style={styles.icon} />}
          <Text style={[styles.text, { color: txt }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // 48dp minimum accessible touch target
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  disabled: {
    opacity: 0.45,
  },
});
