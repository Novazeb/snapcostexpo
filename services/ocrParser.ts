import { OCRResult } from '../types';

const MERCHANT_KEYWORDS = [
  'indomaret', 'alfamart', 'starbucks', 'superindo', 'mcdonald', 'cinema xxi',
  'tokopedia', 'shopee', 'grab', 'gojek', 'pln', 'transmart', 'carrefour',
  'lawson', 'familymart', 'circle k', 'hypermart', 'hero', 'ranch market',
  'farmers market', 'solaria', 'excelso', 'janji jiwa', 'mixue', 'kfc',
  'burger king', 'pizza hut', 'subway', 'breadtalk', 'j.co', 'chatime',
  'kopi kenangan', 'dunkin', 'unql', 'zara', 'h&m', 'watsons', 'guardian',
  'k-24', 'kimia farma', 'ace hardware', 'gramedia', 'decathlon'
];

export function parseReceiptText(rawText: string): OCRResult {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let merchantName = 'Toko / Resto';
  let totalAmount = 0;
  let dateStr = new Date().toISOString().split('T')[0];
  const items: Array<{ name: string; price: number }> = [];

  if (lines.length === 0) {
    return {
      merchantName: 'Resi Umum',
      totalAmount: 0,
      date: dateStr,
      rawText,
      confidence: 0,
      detectedItems: [],
    };
  }

  // 1. Merchant Detection
  // Check first 5 lines for known merchants or prominent headers
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const lineLower = lines[i].toLowerCase();
    const match = MERCHANT_KEYWORDS.find((kw) => lineLower.includes(kw));
    if (match) {
      // Capitalize nicely
      merchantName = lines[i]
        .replace(/[^a-zA-Z0-9\s\.\&\-]/g, '')
        .trim();
      break;
    }
  }

  // Fallback: If no match found in keywords, use the first non-generic top line
  if (merchantName === 'Toko / Resto' && lines.length > 0) {
    const candidate = lines[0].replace(/[^a-zA-Z0-9\s\.\&\-]/g, '').trim();
    if (candidate.length > 2 && !candidate.toLowerCase().includes('welcome') && !candidate.toLowerCase().includes('nota')) {
      merchantName = candidate;
    }
  }

  // 2. Date Extraction
  // Patterns: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD MMM YYYY, etc.
  const datePatterns = [
    /\b(\d{4})[-/\.](\d{1,2})[-/\.](\d{1,2})\b/, // YYYY-MM-DD
    /\b(\d{1,2})[-/\.](\d{1,2})[-/\.](\d{4})\b/, // DD-MM-YYYY
    /\b(\d{1,2})[-/\.](\d{1,2})[-/\.](\d{2})\b/,   // DD-MM-YY
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b/i,
  ];

  for (const line of lines) {
    let found = false;
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        if (pattern.source.startsWith('\\b(\\d{4})')) {
          // YYYY-MM-DD
          const y = match[1];
          const m = match[2].padStart(2, '0');
          const d = match[3].padStart(2, '0');
          dateStr = `${y}-${m}-${d}`;
        } else if (pattern.source.startsWith('\\b(\\d{1,2})[-/\\.](\\d{1,2})[-/\\.](\\d{4})')) {
          // DD-MM-YYYY
          const d = match[1].padStart(2, '0');
          const m = match[2].padStart(2, '0');
          const y = match[3];
          dateStr = `${y}-${m}-${d}`;
        } else if (pattern.source.startsWith('\\b(\\d{1,2})[-/\\.](\\d{1,2})[-/\\.](\\d{2})')) {
          // DD-MM-YY
          const d = match[1].padStart(2, '0');
          const m = match[2].padStart(2, '0');
          const y = '20' + match[3];
          dateStr = `${y}-${m}-${d}`;
        }
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // 3. Total Amount Extraction
  // Look for lines containing TOTAL, GRAND TOTAL, HARGA, JUMLAH, NETT, CASH, PAY, RP
  const totalKeywords = ['grand total', 'total akhir', 'total harga', 'jumlah total', 'total', 'subtotal', 'nett', 'bayar', 'rp', 'idr'];
  
  let candidates: number[] = [];

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    const isTotalLine = totalKeywords.some((kw) => lineLower.includes(kw));

    // Extract numbers from the line
    // Handle Indonesian formatting: e.g. 150.000,00 or 150.000 or 150,000
    const numbersInLine = extractAmountsFromText(line);

    if (isTotalLine && numbersInLine.length > 0) {
      candidates.push(...numbersInLine);
    }
  }

  if (candidates.length > 0) {
    // Usually the largest or first total line candidate
    totalAmount = Math.max(...candidates);
  } else {
    // Fallback: extract all numbers in the text and take the maximum plausible amount
    const allAmounts = extractAmountsFromText(rawText);
    if (allAmounts.length > 0) {
      totalAmount = Math.max(...allAmounts.filter((amt) => amt > 1000 && amt < 100000000));
    }
  }

  return {
    merchantName,
    totalAmount,
    date: dateStr,
    rawText,
    confidence: totalAmount > 0 ? 0.92 : 0.65,
    detectedItems: items,
  };
}

function extractAmountsFromText(text: string): number[] {
  const results: number[] = [];

  // Match numbers with thousands separators and decimals: e.g., Rp 150.000, 150,000.00, 150000
  const regex = /(?:Rp|IDR|\$)?\s*([0-9]{1,3}(?:[\.,][0-9]{3})*(?:[\.,][0-9]{2})?|[0-9]+)/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    let cleanStr = match[1];
    if (!cleanStr) continue;

    // Convert Indonesian format (150.000,00) to standard JS float (150000.00)
    if (cleanStr.includes('.') && cleanStr.includes(',')) {
      cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
    } else if (cleanStr.includes('.') && cleanStr.split('.').pop()?.length === 3) {
      // 150.000 -> 150000
      cleanStr = cleanStr.replace(/\./g, '');
    } else if (cleanStr.includes(',') && cleanStr.split(',').pop()?.length === 3) {
      // 150,000 -> 150000
      cleanStr = cleanStr.replace(/,/g, '');
    }

    const val = parseFloat(cleanStr);
    if (!isNaN(val) && val > 0) {
      results.push(val);
    }
  }

  return results;
}
