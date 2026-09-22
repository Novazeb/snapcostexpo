import { Platform } from 'react-native';
import { INITIAL_TRANSACTIONS } from '../constants/mockData';
import { Transaction } from '../types';

let dbInstance: any = null;
let memoryStore: Transaction[] = [...INITIAL_TRANSACTIONS];
let memoryMonthlyLimit: number = 5000000;

export async function getDatabase(): Promise<any> {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!dbInstance) {
    try {
      const SQLite = require('expo-sqlite');
      if (typeof SQLite.openDatabaseAsync === 'function') {
        dbInstance = await SQLite.openDatabaseAsync('snapcost.db');
      } else if (typeof SQLite.openDatabase === 'function') {
        dbInstance = SQLite.openDatabase('snapcost.db');
      }
    } catch (e) {
      console.warn('[SnapCost DB] expo-sqlite not available:', e);
      return null;
    }
  }
  return dbInstance;
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('[SnapCost DB] Web mode - using memory store.');
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        merchant_name TEXT NOT NULL,
        total_amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'IDR',
        date TEXT NOT NULL,
        category_id TEXT NOT NULL,
        notes TEXT,
        image_uri TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS budgets (
        month TEXT PRIMARY KEY NOT NULL,
        limit_amount REAL NOT NULL
      );
    `);

    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM transactions');
    if (result && result.count === 0) {
      for (const tx of INITIAL_TRANSACTIONS) {
        await db.runAsync(
          'INSERT INTO transactions (id, merchant_name, total_amount, currency, date, category_id, notes, image_uri, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [tx.id, tx.merchantName, tx.totalAmount, tx.currency, tx.date, tx.categoryId, tx.notes || null, tx.imageUri || null, tx.createdAt]
        );
      }
      const currentMonth = new Date().toISOString().substring(0, 7);
      await db.runAsync('INSERT OR REPLACE INTO budgets (month, limit_amount) VALUES (?, ?)', [currentMonth, 5000000]);
    }
  } catch (error) {
    console.warn('[SnapCost DB Init Error]', error);
  }
}

export { memoryStore, memoryMonthlyLimit };
