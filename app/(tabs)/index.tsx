import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { Header } from '../../components/ui/Header';
import { MetricCard } from '../../components/ui/MetricCard';
import { BudgetOverview } from '../../components/dashboard/BudgetOverview';
import { QuickScanCTA } from '../../components/dashboard/QuickScanCTA';
import { ManualTransactionCTA } from '../../components/dashboard/ManualTransactionCTA';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { SPACING } from '../../constants/theme';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { transactions, monthlyTotal, monthlyBudget, isLoading, refreshTransactions } = useTransactions();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title="SnapCost"
        subtitle="Pencatat & Pengelola Pengeluaran"
        rightIcon="camera-outline"
        rightAccessibilityLabel="Buka kamera scan resi"
        onRightPress={() => router.push('/(tabs)/scan')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <MetricCard
          label="PENGELUARAN BULAN INI"
          amount={monthlyTotal}
          subtitle={`Terhitung dari ${transactions.length} transaksi`}
        />

        <BudgetOverview totalSpent={monthlyTotal} budgetLimit={monthlyBudget} />

        <QuickScanCTA />

        <ManualTransactionCTA />

        <RecentTransactions
          transactions={transactions}
          onSeeAllPress={() => router.push('/(tabs)/history')}
        />
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
});
