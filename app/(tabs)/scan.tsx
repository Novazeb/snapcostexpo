import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../../hooks/useTheme';
import { processReceiptImage } from '../../services/ocrService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS } from '../../constants/theme';
import { triggerSuccessHaptic, triggerMediumHaptic } from '../../hooks/useHaptics';

export default function CameraScanScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-outline" size={56} color={colors.textPrimary} />
        <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>Akses Kamera Diperlukan</Text>
        <Text style={[styles.permissionSub, { color: colors.textSecondary }]}>
          SnapCost memerlukan izin kamera untuk memindai resi fisik Anda secara langsung.
        </Text>
        <TouchableOpacity
          style={[styles.permBtn, { backgroundColor: colors.scanBtnBg }]}
          onPress={requestPermission}
          accessibilityRole="button"
        >
          <Text style={[styles.permBtnText, { color: colors.scanBtnText }]}>Berikan Izin Kamera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const processImage = async (uri: string) => {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const ocrResult = await processReceiptImage(manipulated.uri);
      triggerSuccessHaptic();
      router.push({
        pathname: '/scan-review',
        params: {
          merchantName: ocrResult.merchantName,
          totalAmount: ocrResult.totalAmount.toString(),
          date: ocrResult.date,
          rawText: ocrResult.rawText,
          imageUri: manipulated.uri,
        },
      });
    } catch {
      Alert.alert('Gagal', 'Tidak dapat memproses gambar resi. Silakan coba lagi.');
    }
  };

  const handleCapture = async () => {
    if (isProcessing) return;
    triggerMediumHaptic();
    setIsProcessing(true);
    try {
      if (cameraRef.current && Platform.OS !== 'web') {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        await processImage(photo.uri);
      }
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengambil foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    triggerMediumHaptic();
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setIsProcessing(true);
        await processImage(pickerResult.assets[0].uri);
      }
    } catch {
      Alert.alert('Gagal', 'Gagal memproses gambar dari galeri.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualInput = () => {
    triggerMediumHaptic();
    router.push('/scan-review');
  };

  const toggleFlash = () => {
    triggerMediumHaptic();
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} flash={flash} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#FAFAFA' }}>Simulator Kamera Web Mode</Text>
        </View>
      )}

      <View style={styles.overlayContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Tutup kamera"
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pemindai Resi</Text>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={toggleFlash}
            accessibilityRole="button"
            accessibilityLabel="Nyalakan atau matikan lampu kilat"
          >
            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.viewfinderFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.hintText}>Posisikan struk di dalam bingkai</Text>
        </View>

        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={styles.sideControlBtn}
            onPress={handlePickFromGallery}
            accessibilityRole="button"
            accessibilityLabel="Pilih gambar dari galeri"
          >
            <Ionicons name="images-outline" size={24} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Galeri</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCapture}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel="Ambil foto struk"
            style={styles.shutterOuterBtn}
          >
            <View style={styles.shutterInnerBtn}>
              {isProcessing && <ActivityIndicator color="#09090B" size="small" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideControlBtn}
            onPress={handleManualInput}
            accessibilityRole="button"
            accessibilityLabel="Input pengeluaran secara manual"
          >
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Manual</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  permissionTitle: { fontSize: 18, fontWeight: '700', marginTop: SPACING.md, marginBottom: SPACING.xs, letterSpacing: -0.2 },
  permissionSub: { fontSize: 14, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 20 },
  permBtn: { minHeight: 48, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  permBtnText: { fontWeight: '600', fontSize: 15 },
  overlayContainer: { flex: 1, justifyContent: 'space-between', paddingTop: 52, paddingBottom: 36, paddingHorizontal: SPACING.lg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  viewfinderFrame: { height: 380, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', position: 'relative', alignItems: 'center', justifyContent: 'center' },
  hintText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm, overflow: 'hidden' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#FFFFFF' },
  topLeft: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: RADIUS.sm },
  topRight: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: RADIUS.sm },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: RADIUS.sm },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: RADIUS.sm },
  controlsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  sideControlBtn: { alignItems: 'center', justifyContent: 'center', width: 64, height: 64 },
  controlLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '500', marginTop: 4 },
  shutterOuterBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  shutterInnerBtn: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});
