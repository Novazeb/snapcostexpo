import { Platform, Alert } from 'react-native';
import { Transaction } from '../types';

export async function exportTransactionsToCSV(transactions: Transaction[]): Promise<void> {
  if (transactions.length === 0) {
    Alert.alert('Info', 'Tidak ada transaksi untuk diekspor.');
    return;
  }

  try {
    const header = 'ID,Merchant,Amount,Currency,Date,Category,Notes\n';
    const rows = transactions
      .map(
        (tx) =>
          `"${tx.id}","${tx.merchantName}",${tx.totalAmount},"${tx.currency}","${tx.date}","${tx.categoryId}","${tx.notes || ''}"`
      )
      .join('\n');

    const csvContent = header + rows;

    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Export CSV hanya tersedia di perangkat mobile.');
      return;
    }

    const FileSystem = require('expo-file-system');
    const Sharing = require('expo-sharing');

    const fileUri = FileSystem.documentDirectory + `snapcost_export_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transaksi SnapCost',
      });
    } else {
      Alert.alert('Info', `File tersimpan di: ${fileUri}`);
    }
  } catch (error) {
    console.warn('[ExportService] Error:', error);
    Alert.alert('Error', 'Gagal mengekspor data.');
  }
}
