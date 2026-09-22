import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { triggerMediumHaptic } from '../../hooks/useHaptics';

export const QuickScanCTA: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    triggerMediumHaptic();
    router.push('/(tabs)/scan');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Pindai resi belanja"
      style={[
        styles.banner,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        SHADOWS.subtle,
      ]}
    >
      <View style={styles.leftGroup}>
        <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
          <Ionicons name="camera-outline" size={22} color={colors.accent} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Pindai Resi Belanja</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Foto struk fisik untuk catat nominal otomatis
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginVertical: SPACING.xs,
    minHeight: 64,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
