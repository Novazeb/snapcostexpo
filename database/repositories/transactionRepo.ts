import { getDatabase, memoryStore, memoryMonthlyLimit } from '../db';
import { Transaction, CategoryId, CategorySpending } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import { Platform } from 'react-native';

export async function getAllTransactions(): Promise<Transaction[]> {
  if (Platform.OS === 'web') {
    return [...memoryStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  try {
    const db = await getDatabase();
    if (!db) return [...memoryStore];

    const rows: Array<{
      id: string;
      merchant_name: string;
      total_amount: number;
      currency: string;
      date: string;
      category_id: string;
      notes: string | null;
      image_uri: string | null;
      created_at: string;
    }> = await db.getAllAsync('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');

    return rows.map((r: any) => ({
      id: r.id,
      merchantName: r.merchant_name,
      totalAmount: r.total_amount,
      currency: r.currency,
      date: r.date,
      categoryId: r.category_id as CategoryId,
      notes: r.notes || undefined,
      imageUri: r.image_uri || undefined,
      createdAt: r.created_at,
    }));
  } catch (error) {
    console.error('[transactionRepo] getAllTransactions error:', error);
    return [...memoryStore];
  }
}

export async function insertTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
  const newTx: Transaction = {
    ...tx,
    id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  };

  if (Platform.OS === 'web') {
    memoryStore.unshift(newTx);
    return newTx;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        `INSERT INTO transactions (id, merchant_name, total_amount, currency, date, category_id, notes, image_uri, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTx.id,
          newTx.merchantName,
          newTx.totalAmount,
          newTx.currency,
          newTx.date,
          newTx.categoryId,
          newTx.notes || null,
          newTx.imageUri || null,
          newTx.createdAt,
        ]
      );
    }
  } catch (error) {
    console.error('[transactionRepo] insertTransaction error:', error);
    memoryStore.unshift(newTx);
  }

  return newTx;
}

export async function updateTransaction(tx: Transaction): Promise<void> {
  if (Platform.OS === 'web') {
    const idx = memoryStore.findIndex((item) => item.id === tx.id);
    if (idx !== -1) {
      memoryStore[idx] = tx;
    }
    return;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        `UPDATE transactions SET merchant_name = ?, total_amount = ?, currency = ?, date = ?, category_id = ?, notes = ?, image_uri = ?
         WHERE id = ?`,
        [tx.merchantName, tx.totalAmount, tx.currency, tx.date, tx.categoryId, tx.notes || null, tx.imageUri || null, tx.id]
      );
    }
  } catch (error) {
    console.error('[transactionRepo] updateTransaction error:', error);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  if (Platform.OS === 'web') {
    const idx = memoryStore.findIndex((item) => item.id === id);
    if (idx !== -1) {
      memoryStore.splice(idx, 1);
    }
    return;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    }
  } catch (error) {
    console.error('[transactionRepo] deleteTransaction error:', error);
  }
}

export async function getMonthlyTotal(yearMonth?: string): Promise<number> {
  const ym = yearMonth || new Date().toISOString().substring(0, 7);
  const txs = await getAllTransactions();
  return txs
    .filter((tx) => tx.date.startsWith(ym))
    .reduce((sum, tx) => sum + tx.totalAmount, 0);
}

export async function getCategorySpendingBreakdown(yearMonth?: string): Promise<CategorySpending[]> {
  const ym = yearMonth || new Date().toISOString().substring(0, 7);
  const txs = await getAllTransactions();
  const monthlyTxs = txs.filter((tx) => tx.date.startsWith(ym));
  const totalMonthlySpend = monthlyTxs.reduce((sum, tx) => sum + tx.totalAmount, 0);

  const categoryMap: Record<string, { total: number; count: number }> = {};

  monthlyTxs.forEach((tx) => {
    if (!categoryMap[tx.categoryId]) {
      categoryMap[tx.categoryId] = { total: 0, count: 0 };
    }
    categoryMap[tx.categoryId].total += tx.totalAmount;
    categoryMap[tx.categoryId].count += 1;
  });

  const breakdown: CategorySpending[] = Object.keys(CATEGORIES).map((catId) => {
    const cat = CATEGORIES[catId as CategoryId];
    const data = categoryMap[catId] || { total: 0, count: 0 };
    const percentage = totalMonthlySpend > 0 ? Math.round((data.total / totalMonthlySpend) * 100) : 0;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      iconName: cat.iconName,
      total: data.total,
      percentage,
      count: data.count,
    };
  });

  return breakdown.sort((a, b) => b.total - a.total);
}

export async function getMonthlyBudget(yearMonth?: string): Promise<number> {
  const ym = yearMonth || new Date().toISOString().substring(0, 7);

  if (Platform.OS === 'web') {
    return memoryMonthlyLimit;
  }

  try {
    const db = await getDatabase();
    if (!db) return memoryMonthlyLimit;

    const row: { limit_amount: number } | null = await db.getFirstAsync(
      'SELECT limit_amount FROM budgets WHERE month = ?',
      [ym]
    );

    return row ? row.limit_amount : 5000000;
  } catch (error) {
    return memoryMonthlyLimit;
  }
}

export async function setMonthlyBudget(limitAmount: number, yearMonth?: string): Promise<void> {
  const ym = yearMonth || new Date().toISOString().substring(0, 7);

  if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).memoryMonthlyLimit = limitAmount;
    return;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        'INSERT OR REPLACE INTO budgets (month, limit_amount) VALUES (?, ?)',
        [ym, limitAmount]
      );
    }
  } catch (error) {
    console.error('[transactionRepo] setMonthlyBudget error:', error);
  }
}

export async function clearAllData(): Promise<void> {
  if (Platform.OS === 'web') {
    memoryStore.length = 0;
    return;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.runAsync('DELETE FROM transactions');
    }
  } catch (error) {
    console.error('[transactionRepo] clearAllData error:', error);
  }
}
