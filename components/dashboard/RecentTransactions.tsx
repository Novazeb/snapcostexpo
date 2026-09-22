import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../../types';
import { CategoryBadge } from '../ui/CategoryBadge';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { triggerLightHaptic } from '../../hooks/useHaptics';
import { formatReadableDate } from '../../constants/dateUtils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSeeAllPress?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onSeeAllPress }) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleTxPress = (id: string) => {
    triggerLightHaptic();
    router.push(`/transaction/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transaksi Terakhir</Text>
        {onSeeAllPress && (
          <TouchableOpacity
            onPress={onSeeAllPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
          >
            <Text style={[styles.seeAll, { color: colors.accent }]}>Lihat Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada catatan pengeluaran.</Text>
        </View>
      ) : (
        transactions.slice(0, 5).map((tx) => (
          <TouchableOpacity
            key={tx.id}
            activeOpacity={0.7}
            onPress={() => handleTxPress(tx.id)}
            style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.leftCol}>
              <CategoryBadge categoryId={tx.categoryId} size="sm" showLabel={false} />
              <View style={styles.textCol}>
                <Text style={[styles.merchantName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {tx.merchantName}
                </Text>
                <Text style={[styles.dateStr, { color: colors.textMuted }]}>
                  {formatReadableDate(tx.date)}
                </Text>
              </View>
            </View>
            <Text style={[styles.amount, { color: colors.textPrimary }]}>
              -Rp {tx.totalAmount.toLocaleString('id-ID')}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  emptyText: {
    marginTop: SPACING.sm,
    fontSize: 13,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.xs,
    minHeight: 60,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textCol: {
    marginLeft: SPACING.sm + 2,
    flex: 1,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  dateStr: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
