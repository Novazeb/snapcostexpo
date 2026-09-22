import { Platform } from 'react-native';

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const Notifications = require('expo-notifications');

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pengingat SnapCost',
        body: 'Catat pengeluaran hari ini untuk memantau anggaran Anda.',
        sound: true,
      },
      trigger: {
        type: 'daily' as any,
        hour,
        minute,
      },
    });
  } catch (error) {
    console.warn('[Notifications] Schedule error:', error);
  }
}
