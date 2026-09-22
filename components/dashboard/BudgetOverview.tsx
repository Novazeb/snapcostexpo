import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useTheme } from '../../hooks/useTheme';
import { SPACING } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface BudgetOverviewProps {
  totalSpent: number;
  budgetLimit: number;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ totalSpent, budgetLimit }) => {
  const { colors } = useTheme();

  const percentage = budgetLimit > 0 ? totalSpent / budgetLimit : 0;
  const remaining = Math.max(budgetLimit - totalSpent, 0);
  const isOverBudget = totalSpent > budgetLimit;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="wallet-outline" size={16} color={colors.textSecondary} style={styles.icon} />
          <Text style={[styles.title, { color: colors.textSecondary }]}>ANGGARAN BULAN INI</Text>
        </View>
        <Text style={[styles.percentage, { color: isOverBudget ? colors.danger : colors.textPrimary }]}>
          {Math.round(percentage * 100)}%
        </Text>
      </View>

      <ProgressBar progress={percentage} color={isOverBudget ? colors.danger : colors.accent} height={8} />

      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Sisa Anggaran</Text>
          <Text style={[styles.metaValue, { color: isOverBudget ? colors.danger : colors.textPrimary }]}>
            Rp {remaining.toLocaleString('id-ID')}
          </Text>
        </View>
        <View style={styles.alignRight}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Batas Anggaran</Text>
          <Text style={[styles.metaValue, { color: colors.textSecondary }]}>
            Rp {budgetLimit.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: -0.2,
  },
});
