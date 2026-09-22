export type CategoryId = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

export interface Transaction {
  id: string;
  merchantName: string;
  totalAmount: number;
  currency: string;
  date: string; // ISO string YYYY-MM-DD
  categoryId: CategoryId;
  notes?: string;
  imageUri?: string;
  createdAt: string;
}

export interface OCRResult {
  merchantName: string;
  totalAmount: number;
  date: string;
  rawText: string;
  confidence: number;
  detectedItems?: Array<{ name: string; price: number }>;
}

export interface CategorySpending {
  categoryId: CategoryId;
  categoryName: string;
  color: string;
  iconName: string;
  total: number;
  percentage: number;
  count: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  limitAmount: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
