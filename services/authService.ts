import { Platform } from 'react-native';

export async function authenticateBiometrics(promptMessage?: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true;
  }

  try {
    const LocalAuth = require('expo-local-authentication');
    const hasHardware = await LocalAuth.hasHardwareAsync();
    if (!hasHardware) return true;

    const isEnrolled = await LocalAuth.isEnrolledAsync();
    if (!isEnrolled) return true;

    const result = await LocalAuth.authenticateAsync({
      promptMessage: promptMessage || 'Verifikasi identitas Anda',
      fallbackLabel: 'Gunakan PIN',
      cancelLabel: 'Batal',
    });

    return result.success;
  } catch (error) {
    console.warn('[AuthService] Biometric auth error:', error);
    return true; // Fail open - don't lock user out
  }
}
