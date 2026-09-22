import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { Header } from '../../components/ui/Header';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { exportTransactionsToCSV } from '../../services/exportService';
import { CATEGORIES } from '../../constants/categories';
import { CategoryId } from '../../types';
import { SPACING, RADIUS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { triggerLightHaptic, triggerMediumHaptic } from '../../hooks/useHaptics';
import { formatReadableDate } from '../../constants/dateUtils';

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const { transactions } = useTransactions();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId | 'all'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCat === 'all' || tx.categoryId === selectedCat;

    return matchesSearch && matchesCat;
  });

  const handleExportCSV = async () => {
    triggerMediumHaptic();
    await exportTransactionsToCSV(filteredTransactions);
  };

  const categoriesList = [
    {
      id: 'all' as const,
      name: 'Semua',
      iconName: 'apps-outline' as const,
      color: colors.accent,
      bg: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
    },
    ...Object.values(CATEGORIES).map((c) => ({
      id: c.id,
      name: c.name,
      iconName: c.iconName as any,
      color: c.color,
      bg: isDark ? c.bgDark : c.bgLight,
    })),
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title="Riwayat Transaksi"
        subtitle={`${filteredTransactions.length} Pengeluaran Ditemukan`}
        rightIcon="download-outline"
        rightAccessibilityLabel="Ekspor transaksi ke CSV"
        onRightPress={handleExportCSV}
      />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Cari toko, merchant, atau catatan..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScroll}
        >
          {categoriesList.map((item) => {
            const isSelected = selectedCat === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  triggerLightHaptic();
                  setSelectedCat(item.id);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? item.bg : colors.card,
                    borderColor: isSelected ? item.color : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={14}
                  color={isSelected ? item.color : colors.textMuted}
                  style={styles.pillIcon}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.filterText,
                    {
                      color: isSelected ? item.color : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transaction List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerLightHaptic();
                router.push(`/transaction/${item.id}`);
              }}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.leftCol}>
                <CategoryBadge categoryId={item.categoryId} size="sm" showLabel={false} />
                <View style={styles.textCol}>
                  <Text style={[styles.merchantName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.merchantName}
                  </Text>
                  <Text style={[styles.notes, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.notes || formatReadableDate(item.date)}
                  </Text>
                </View>
              </View>

              <View style={styles.rightCol}>
                <Text style={[styles.amount, { color: colors.textPrimary }]}>
                  -Rp {item.totalAmount.toLocaleString('id-ID')}
                </Text>
                <Text style={[styles.dateSub, { color: colors.textMuted }]}>
                  {formatReadableDate(item.date)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Tidak Ada Hasil</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Coba ubah kata kunci pencarian atau filter kategori.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterScrollView: {
    flexGrow: 0,
    height: 42,
    marginBottom: SPACING.sm,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  filterPill: {
    flexDirection: 'row',
    height: 34,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
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
  notes: {
    fontSize: 12,
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dateSub: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyState: {
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
