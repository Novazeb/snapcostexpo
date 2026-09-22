import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { triggerLightHaptic } from '../../hooks/useHaptics';

export const ManualTransactionCTA: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    triggerLightHaptic();
    router.push('/scan-review');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Tulis transaksi secara manual"
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
          <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Tulis Transaksi Manual</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Input pengeluaran langsung tanpa perlu foto struk
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
    marginBottom: SPACING.xs,
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
