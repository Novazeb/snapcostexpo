import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { scheduleDailyReminder } from '../../services/notificationService';
import { authenticateBiometrics } from '../../services/authService';
import { SPACING, RADIUS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { triggerLightHaptic, triggerMediumHaptic, triggerWarningHaptic } from '../../hooks/useHaptics';
import { PreloadScreen } from '../../components/ui/PreloadScreen';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { monthlyBudget, updateBudgetLimit, resetAll } = useTransactions();

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [dailyNotification, setDailyNotification] = useState(true);
  const [reminderHour, setReminderHour] = useState(20);
  const [reminderMinute, setReminderMinute] = useState(0);

  const [showPreloadPreview, setShowPreloadPreview] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(monthlyBudget.toString());

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [tempHour, setTempHour] = useState('20');
  const [tempMinute, setTempMinute] = useState('00');

  const handleToggleBiometrics = async (val: boolean) => {
    triggerLightHaptic();
    if (val) {
      const success = await authenticateBiometrics('Konfirmasi pengaktifan keamanan biometrik');
      if (success) {
        setBiometricsEnabled(true);
      } else {
        Alert.alert('Info', 'Gagal memverifikasi biometrik.');
        setBiometricsEnabled(false);
      }
    } else {
      setBiometricsEnabled(false);
    }
  };

  const handleToggleNotification = async (val: boolean) => {
    triggerLightHaptic();
    setDailyNotification(val);
    if (val) {
      await scheduleDailyReminder(reminderHour, reminderMinute);
    }
  };

  const handleOpenTimeModal = () => {
    triggerLightHaptic();
    setTempHour(String(reminderHour).padStart(2, '0'));
    setTempMinute(String(reminderMinute).padStart(2, '0'));
    setIsTimeModalOpen(true);
  };

  const handleSaveReminderTime = async () => {
    triggerMediumHaptic();
    const h = parseInt(tempHour, 10);
    const m = parseInt(tempMinute, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Format Waktu Salah', 'Jam harus antara 00-23 dan menit antara 00-59.');
      return;
    }
    setReminderHour(h);
    setReminderMinute(m);
    setIsTimeModalOpen(false);
    if (dailyNotification) {
      await scheduleDailyReminder(h, m);
    }
  };

  const handleSaveBudget = async () => {
    triggerMediumHaptic();
    const val = parseFloat(tempBudgetInput.replace(/[^0-9]/g, ''));
    if (!isNaN(val) && val > 0) {
      await updateBudgetLimit(val);
      setIsBudgetModalOpen(false);
    } else {
      Alert.alert('Perhatian', 'Masukkan jumlah anggaran yang valid.');
    }
  };

  const handleResetData = () => {
    triggerWarningHaptic();
    Alert.alert(
      'Hapus Data',
      'Apakah Anda yakin ingin menghapus seluruh transaksi lokal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            Alert.alert('Berhasil', 'Data transaksi telah dibersihkan.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Pengaturan" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section: Keamanan & Privasi */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>KEAMANAN & PRIVASI</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.leftRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
                <Ionicons name="finger-print-outline" size={20} color={colors.textPrimary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Proteksi Biometrik</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleToggleBiometrics}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Section: Anggaran Bulanan */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ANGGARAN & TARGET</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            accessibilityRole="button"
            onPress={() => {
              triggerLightHaptic();
              setTempBudgetInput(monthlyBudget.toString());
              setIsBudgetModalOpen(true);
            }}
          >
            <View style={styles.leftRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
                <Ionicons name="wallet-outline" size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.titleCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Batas Anggaran Bulanan
                </Text>
                <Text style={[styles.budgetSubtitle, { color: colors.accent }]}>
                  Rp {monthlyBudget.toLocaleString('id-ID')} / bulan
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Section: Notifikasi & Tampilan */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>TAMPILAN & NOTIFIKASI</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.leftRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
                <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color={colors.textPrimary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Mode Gelap</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                triggerLightHaptic();
                toggleTheme();
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOpenTimeModal}
              style={styles.leftRow}
              accessibilityRole="button"
              accessibilityLabel="Atur jam pengingat harian"
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.titleCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Pengingat Harian</Text>
                <View style={styles.timeTag}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={dailyNotification ? colors.accent : colors.textMuted}
                    style={{ marginRight: 3 }}
                  />
                  <Text
                    style={[
                      styles.timeTagText,
                      { color: dailyNotification ? colors.accent : colors.textMuted },
                    ]}
                  >
                    {String(reminderHour).padStart(2, '0')}:{String(reminderMinute).padStart(2, '0')} WIB
                  </Text>
                  {dailyNotification && (
                    <Text style={[styles.timeTagEdit, { color: colors.textSecondary }]}> · Ubah Jam</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <Switch
              value={dailyNotification}
              onValueChange={handleToggleNotification}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Section: Data Management */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>MANAJEMEN DATA & APP INFO</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              triggerLightHaptic();
              setShowPreloadPreview(true);
            }}
            accessibilityRole="button"
          >
            <View style={styles.leftRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSubtle }]}>
                <Ionicons name="play-circle-outline" size={20} color={colors.accent} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Preview Animasi Preload</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.settingRow} onPress={handleResetData} accessibilityRole="button">
            <View style={styles.leftRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.danger }]}>Hapus Seluruh Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </TouchableOpacity>
        </Card>

        <View style={styles.appInfoContainer}>
          <Text style={[styles.appInfoText, { color: colors.textMuted }]}>SnapCost Expo v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Budget Limit Config Modal */}
      <Modal visible={isBudgetModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Atur Anggaran Bulanan</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Masukkan nominal batas maksimum pengeluaran bulanan Anda.
            </Text>

            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.currencyPrefix, { color: colors.textPrimary }]}>Rp</Text>
              <TextInput
                value={tempBudgetInput}
                onChangeText={setTempBudgetInput}
                keyboardType="numeric"
                style={[styles.modalInput, { color: colors.textPrimary }]}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Batal"
                variant="secondary"
                onPress={() => setIsBudgetModalOpen(false)}
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
              <Button
                title="Simpan"
                variant="primary"
                onPress={handleSaveBudget}
                style={{ flex: 1, marginLeft: SPACING.xs }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Daily Reminder Time Modal */}
      <Modal visible={isTimeModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Atur Jam Pengingat Harian</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Pilih waktu notifikasi harian untuk mencatat pengeluaran Anda.
            </Text>

            {/* Time Input Row */}
            <View style={styles.timeInputRow}>
              <View style={[styles.timeInputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.timeLabel, { color: colors.textMuted }]}>JAM (00-23)</Text>
                <TextInput
                  value={tempHour}
                  onChangeText={(val) => setTempHour(val.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                  style={[styles.timeDigit, { color: colors.textPrimary }]}
                />
              </View>

              <Text style={[styles.timeColon, { color: colors.textPrimary }]}>:</Text>

              <View style={[styles.timeInputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.timeLabel, { color: colors.textMuted }]}>MENIT (00-59)</Text>
                <TextInput
                  value={tempMinute}
                  onChangeText={(val) => setTempMinute(val.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                  style={[styles.timeDigit, { color: colors.textPrimary }]}
                />
              </View>
            </View>

            {/* Quick Presets */}
            <Text style={[styles.presetTitle, { color: colors.textMuted }]}>PILIHAN CEPAT</Text>
            <View style={styles.presetContainer}>
              {[
                { label: '07:00', h: '07', m: '00' },
                { label: '12:00', h: '12', m: '00' },
                { label: '18:00', h: '18', m: '00' },
                { label: '20:00', h: '20', m: '00' },
                { label: '21:00', h: '21', m: '00' },
              ].map((p) => {
                const isActive = tempHour === p.h && tempMinute === p.m;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => {
                      triggerLightHaptic();
                      setTempHour(p.h);
                      setTempMinute(p.m);
                    }}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isActive
                          ? (isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5')
                          : colors.cardSubtle,
                        borderColor: isActive ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color: isActive ? colors.accent : colors.textSecondary,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Batal"
                variant="secondary"
                onPress={() => setIsTimeModalOpen(false)}
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
              <Button
                title="Simpan"
                variant="primary"
                onPress={handleSaveReminderTime}
                style={{ flex: 1, marginLeft: SPACING.xs }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {showPreloadPreview && (
        <PreloadScreen onFinish={() => setShowPreloadPreview(false)} duration={2200} />
      )}
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  card: {
    marginBottom: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.sm,
  },
  titleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  budgetSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  timeTagText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  timeTagEdit: {
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalBox: {
    width: '100%',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modalSub: {
    fontSize: 13,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: SPACING.xs,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  timeInputBox: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timeDigit: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
    width: '100%',
  },
  timeColon: {
    fontSize: 26,
    fontWeight: '700',
    marginHorizontal: SPACING.sm,
  },
  presetTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  modalBtnRow: {
    flexDirection: 'row',
  },
});
