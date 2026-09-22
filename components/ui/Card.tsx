import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  subtle?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, subtle = false, noPadding = false }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: subtle ? colors.cardSubtle : colors.card,
          borderColor: colors.border,
        },
        noPadding && { padding: 0 },
        SHADOWS.subtle,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
  },
});
