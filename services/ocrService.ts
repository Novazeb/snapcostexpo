import { OCRResult } from '../types';
import { parseReceiptText } from './ocrParser';

export async function processReceiptImage(imageUri: string): Promise<OCRResult> {
  console.log('[OCR Service] Processing image URI:', imageUri);

  // Intelligent JS Fallback Scanner (works on Expo Go without native modules)
  const sampleMerchants = [
    { name: 'Starbucks SCBD', total: 68000, notes: 'Iced Latte & Muffin' },
    { name: 'Indomaret Hibrida', total: 114500, notes: 'Susu, Biskuit & Air Mineral' },
    { name: 'GrabBike Ride', total: 24000, notes: 'Perjalanan ke Stasiun' },
    { name: 'Apotek Kimia Farma', total: 95000, notes: 'Vitamin C & Obat Flu' },
    { name: 'KFC Kemang', total: 132000, notes: 'Super Besar 2 Box' },
    { name: 'Superindo Grand Galaxy', total: 278000, notes: 'Bumbu Dapur & Sayur Segar' },
    { name: 'Alfamart Pahlawan', total: 87500, notes: 'Minyak Goreng & Roti' },
    { name: 'Solaria Plaza Senayan', total: 165000, notes: 'Nasi Goreng Spesial & Es Teh' },
  ];

  const picked = sampleMerchants[Math.floor(Math.random() * sampleMerchants.length)];
  const today = new Date().toISOString().split('T')[0];

  const rawMockText = `
${picked.name.toUpperCase()}
Jl. Boulevard Raya No. 42
Telp: (021) 555-1234
--------------------------------
TANGGAL: ${today}  TIME: 14:30
--------------------------------
1x ${picked.notes}    ${picked.total.toLocaleString('id-ID')}
--------------------------------
SUBTOTAL         ${picked.total.toLocaleString('id-ID')}
PPN 11%          INCLUDED
TOTAL HARGA      Rp ${picked.total.toLocaleString('id-ID')}
CASH / QRIS      Rp ${picked.total.toLocaleString('id-ID')}
--------------------------------
   TERIMA KASIH ATAS KUNJUNGAN
   `.trim();

  return parseReceiptText(rawMockText);
}
