import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { Header } from '../../components/ui/Header';
import { SpendingPieChart } from '../../components/analytics/SpendingPieChart';
import { MonthlyBarChart } from '../../components/analytics/MonthlyBarChart';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { Card } from '../../components/ui/Card';
import { SPACING } from '../../constants/theme';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { transactions, monthlyTotal, categoryBreakdown } = useTransactions();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Analitik Keuangan" subtitle="Ringkasan & Visualisasi Pengeluaran" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SpendingPieChart data={categoryBreakdown} totalMonthly={monthlyTotal} />

        <MonthlyBarChart transactions={transactions} />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Rincian Per Kategori</Text>

        {categoryBreakdown.map((cat) => (
          <Card key={cat.categoryId} style={styles.catCard}>
            <View style={styles.catRow}>
              <CategoryBadge categoryId={cat.categoryId} size="md" showLabel={true} />
              <View style={styles.amountCol}>
                <Text style={[styles.catTotal, { color: colors.textPrimary }]}>
                  Rp {cat.total.toLocaleString('id-ID')}
                </Text>
                <Text style={[styles.catMeta, { color: colors.textMuted }]}>
                  {cat.count} transaksi • {cat.percentage}%
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  catCard: {
    marginBottom: SPACING.xs,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  catTotal: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  catMeta: {
    fontSize: 12,
    marginTop: 2,
  },
});
