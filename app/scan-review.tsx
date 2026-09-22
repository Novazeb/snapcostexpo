import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CATEGORIES } from '../constants/categories';
import { CategoryId } from '../types';
import { SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { triggerLightHaptic, triggerSuccessHaptic } from '../hooks/useHaptics';
import { getLocalDateString } from '../constants/dateUtils';

export default function ScanReviewScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { addExpense } = useTransactions();
  const params = useLocalSearchParams<{
    merchantName?: string;
    totalAmount?: string;
    date?: string;
    rawText?: string;
    imageUri?: string;
  }>();

  const [merchantName, setMerchantName] = useState(params.merchantName || '');
  const [totalAmount, setTotalAmount] = useState(params.totalAmount || '');
  const [date, setDate] = useState(params.date || getLocalDateString());
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('food');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const numAmount = parseFloat(totalAmount.replace(/[^0-9]/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Perhatian', 'Masukkan nominal pengeluaran yang valid.');
      return;
    }

    if (!merchantName.trim()) {
      Alert.alert('Perhatian', 'Masukkan nama toko atau merchant.');
      return;
    }

    try {
      setIsSaving(true);
      await addExpense({
        merchantName: merchantName.trim(),
        totalAmount: numAmount,
        currency: 'IDR',
        date: date.trim() || getLocalDateString(),
        categoryId: selectedCategory,
        notes: notes.trim() || undefined,
        imageUri: params.imageUri,
      });

      triggerSuccessHaptic();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan transaksi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Header
        title={params.imageUri ? 'Review Resi' : 'Catat Transaksi Manual'}
        subtitle={params.imageUri ? 'Verifikasi & Konfirmasi Pengeluaran' : 'Input Pengeluaran Baru'}
        rightIcon="close"
        rightAccessibilityLabel={params.imageUri ? 'Tutup review resi' : 'Tutup catat transaksi'}
        onRightPress={handleClose}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Image Thumbnail Preview */}
          {params.imageUri && (
            <View style={[styles.imageContainer, { borderColor: colors.border }]}>
              <Image source={{ uri: params.imageUri }} style={styles.imagePreview} resizeMode="cover" />
            </View>
          )}

          {/* Form Card */}
          <Card style={styles.formCard}>
            {/* Merchant Name */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>NAMA TOKO / MERCHANT</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="storefront-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={merchantName}
                onChangeText={setMerchantName}
                placeholder="Contoh: Indomaret, Starbucks..."
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.textPrimary }]}
              />
            </View>

            {/* Total Amount */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>TOTAL NOMINAL BELANJA</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.currency, { color: colors.textPrimary }]}>Rp</Text>
              <TextInput
                value={totalAmount}
                onChangeText={setTotalAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                style={[styles.amountInput, { color: colors.textPrimary }]}
              />
            </View>

            {/* Date */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>TANGGAL TRANSAKSI</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.textPrimary }]}
              />
            </View>

            {/* Category Selector */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>KATEGORI PENGELUARAN</Text>
            <View style={styles.categoryGrid}>
              {Object.values(CATEGORIES).map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      triggerLightHaptic();
                      setSelectedCategory(cat.id as CategoryId);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.catCard,
                      {
                        backgroundColor: isSelected ? (isDark ? cat.bgDark : cat.bgLight) : colors.card,
                        borderColor: isSelected ? cat.color : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={cat.iconName as any}
                      size={16}
                      color={isSelected ? cat.color : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.catLabel,
                        {
                          color: isSelected ? cat.color : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notes */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>CATATAN (OPSIONAL)</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="create-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Keterangan belanja..."
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.textPrimary }]}
              />
            </View>
          </Card>

          {/* Action Button */}
          <Button
            title="Simpan Transaksi"
            iconName="checkmark"
            onPress={handleSave}
            loading={isSaving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  imageContainer: {
    height: 150,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  formCard: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  catCard: {
    width: '48%',
    margin: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  saveBtn: {
    marginVertical: SPACING.md,
  },
});
