import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { useTheme } from '../../hooks/useTheme';
import { SPACING } from '../../constants/theme';

interface MetricCardProps {
  label: string;
  amount: number;
  currency?: string;
  subtitle?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  amount,
  currency = 'Rp',
  subtitle,
  accentColor,
}) => {
  const { colors } = useTheme();
  const formattedAmount = amount.toLocaleString('id-ID');

  return (
    <Card style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.amountRow}>
        <Text style={[styles.currency, { color: accentColor || colors.accent }]}>{currency} </Text>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>{formattedAmount}</Text>
      </View>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.md + 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: SPACING.xs + 2,
    letterSpacing: -0.1,
  },
});
