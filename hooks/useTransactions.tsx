import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, CategorySpending } from '../types';
import {
  getAllTransactions,
  insertTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyTotal,
  getCategorySpendingBreakdown,
  getMonthlyBudget,
  setMonthlyBudget,
  clearAllData,
} from '../database/repositories/transactionRepo';
import { triggerSuccessHaptic } from './useHaptics';

interface TransactionsContextType {
  transactions: Transaction[];
  monthlyTotal: number;
  monthlyBudget: number;
  categoryBreakdown: CategorySpending[];
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
  addExpense: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>;
  editExpense: (tx: Transaction) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateBudgetLimit: (limit: number) => Promise<void>;
  resetAll: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [monthlyBudget, setBudgetState] = useState<number>(5000000);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategorySpending[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await getAllTransactions();
      const total = await getMonthlyTotal();
      const budget = await getMonthlyBudget();
      const breakdown = await getCategorySpendingBreakdown();
      setTransactions(list);
      setMonthlyTotal(total);
      setBudgetState(budget);
      setCategoryBreakdown(breakdown);
    } catch (e) {
      console.warn('[useTransactions] refresh error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize DB then load data
    const init = async () => {
      try {
        const { initDatabase } = require('../database/db');
        await initDatabase();
      } catch (e) {
        console.warn('[useTransactions] DB init error:', e);
      }
      await refreshTransactions();
    };
    init();
  }, [refreshTransactions]);

  const addExpense = async (txData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
    const created = await insertTransaction(txData);
    triggerSuccessHaptic();
    await refreshTransactions();
    return created;
  };

  const editExpense = async (tx: Transaction): Promise<void> => {
    await updateTransaction(tx);
    triggerSuccessHaptic();
    await refreshTransactions();
  };

  const removeExpense = async (id: string): Promise<void> => {
    await deleteTransaction(id);
    await refreshTransactions();
  };

  const updateBudgetLimit = async (limit: number): Promise<void> => {
    await setMonthlyBudget(limit);
    await refreshTransactions();
  };

  const resetAll = async (): Promise<void> => {
    await clearAllData();
    await refreshTransactions();
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        monthlyTotal,
        monthlyBudget,
        categoryBreakdown,
        isLoading,
        refreshTransactions,
        addExpense,
        editExpense,
        removeExpense,
        updateBudgetLimit,
        resetAll,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
