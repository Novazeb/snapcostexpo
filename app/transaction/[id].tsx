import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { CategoryId, Transaction } from '../../types';
import { SPACING, RADIUS } from '../../constants/theme';
import { triggerLightHaptic, triggerSuccessHaptic, triggerWarningHaptic } from '../../hooks/useHaptics';
import { formatReadableDate } from '../../constants/dateUtils';

export default function TransactionDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, editExpense, removeExpense } = useTransactions();

  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [merchantName, setMerchantName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('food');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const found = transactions.find((t) => t.id === id);
    if (found) {
      setCurrentTx(found);
      setMerchantName(found.merchantName);
      setTotalAmount(found.totalAmount.toString());
      setDate(found.date);
      setCategoryId(found.categoryId);
      setNotes(found.notes || '');
    }
  }, [id, transactions]);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!currentTx) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Transaksi tidak ditemukan.</Text>
        <Button title="Kembali" onPress={handleClose} style={{ marginTop: SPACING.md }} />
      </SafeAreaView>
    );
  }

  const handleUpdate = async () => {
    const numAmount = parseFloat(totalAmount.replace(/[^0-9]/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Perhatian', 'Nominal pengeluaran tidak valid.');
      return;
    }

    if (!merchantName.trim()) {
      Alert.alert('Perhatian', 'Nama toko tidak boleh kosong.');
      return;
    }

    await editExpense({
      ...currentTx,
      merchantName: merchantName.trim(),
      totalAmount: numAmount,
      date: date.trim(),
      categoryId,
      notes: notes.trim() || undefined,
    });

    triggerSuccessHaptic();
    setIsEditing(false);
  };

  const handleDelete = () => {
    triggerWarningHaptic();
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus catatan transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await removeExpense(currentTx.id);
            handleClose();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Header
        title={isEditing ? 'Edit Transaksi' : 'Detail Transaksi'}
        subtitle={`ID: ${currentTx.id}`}
        rightIcon="close"
        rightAccessibilityLabel="Tutup detail transaksi"
        onRightPress={handleClose}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentTx.imageUri && (
            <View style={[styles.imageBox, { borderColor: colors.border }]}>
              <Image source={{ uri: currentTx.imageUri }} style={styles.image} resizeMode="cover" />
            </View>
          )}

          <Card style={styles.card}>
            {isEditing ? (
              <>
                <Text style={[styles.label, { color: colors.textSecondary }]}>NAMA TOKO</Text>
                <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <TextInput
                    value={merchantName}
                    onChangeText={setMerchantName}
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>

                <Text style={[styles.label, { color: colors.textSecondary }]}>TOTAL HARGA (RP)</Text>
                <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <TextInput
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    keyboardType="numeric"
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>

                <Text style={[styles.label, { color: colors.textSecondary }]}>TANGGAL (YYYY-MM-DD)</Text>
                <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <TextInput
                    value={date}
                    onChangeText={setDate}
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>

                <Text style={[styles.label, { color: colors.textSecondary }]}>CATATAN</Text>
                <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Keterangan..."
                    placeholderTextColor={colors.textMuted}
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>

                <Button title="Simpan Perubahan" onPress={handleUpdate} style={styles.btnMargin} />
              </>
            ) : (
              <>
                <View style={styles.topInfo}>
                  <CategoryBadge categoryId={currentTx.categoryId} size="lg" />
                  <Text style={[styles.amountBig, { color: colors.textPrimary }]}>
                    Rp {currentTx.totalAmount.toLocaleString('id-ID')}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Merchant / Toko</Text>
                  <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{currentTx.merchantName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Tanggal</Text>
                  <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{formatReadableDate(currentTx.date)}</Text>
                </View>

                {currentTx.notes && (
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Catatan</Text>
                    <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{currentTx.notes}</Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Waktu Input</Text>
                  <Text style={[styles.infoVal, { color: colors.textMuted }]}>
                    {new Date(currentTx.createdAt).toLocaleString('id-ID')}
                  </Text>
                </View>

                <View style={styles.btnRow}>
                  <Button
                    title="Edit"
                    iconName="create-outline"
                    variant="secondary"
                    onPress={() => {
                      triggerLightHaptic();
                      setIsEditing(true);
                    }}
                    style={{ flex: 1, marginRight: SPACING.xs }}
                  />
                  <Button
                    title="Hapus"
                    iconName="trash-outline"
                    variant="danger"
                    onPress={handleDelete}
                    style={{ flex: 1, marginLeft: SPACING.xs }}
                  />
                </View>
              </>
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  imageBox: {
    height: 180,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginBottom: SPACING.lg,
  },
  topInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  amountBig: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: SPACING.md,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 3,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  inputBox: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
  },
  btnMargin: {
    marginTop: SPACING.lg,
  },
});
