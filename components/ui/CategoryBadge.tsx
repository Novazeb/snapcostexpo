import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING } from '../../constants/theme';

interface CategoryBadgeProps {
  categoryId: CategoryId;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryId,
  size = 'md',
  showLabel = true,
}) => {
  const { isDark } = useTheme();
  const cat = CATEGORIES[categoryId] || CATEGORIES.other;

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
  const paddingH = size === 'sm' ? SPACING.sm : size === 'md' ? SPACING.sm + 2 : SPACING.md;
  const paddingV = size === 'sm' ? 3 : size === 'md' ? 5 : 7;
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 12 : 14;

  const bg = isDark ? cat.bgDark : cat.bgLight;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}
    >
      <Ionicons
        name={cat.iconName as any}
        size={iconSize}
        color={cat.color}
        style={showLabel ? styles.icon : undefined}
      />
      {showLabel && (
        <Text style={[styles.label, { color: cat.color, fontSize }]}>{cat.name}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
