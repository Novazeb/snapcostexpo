import { Category, CategoryId } from '../types';

export const CATEGORIES: Record<CategoryId, Category> = {
  food: {
    id: 'food',
    name: 'Makanan & Minuman',
    iconName: 'fast-food-outline',
    color: '#EF4444', // Red
    bgLight: '#FEF2F2',
    bgDark: 'rgba(239, 68, 68, 0.16)',
  },
  transport: {
    id: 'transport',
    name: 'Transportasi',
    iconName: 'car-outline',
    color: '#3B82F6', // Blue
    bgLight: '#EFF6FF',
    bgDark: 'rgba(59, 130, 246, 0.16)',
  },
  shopping: {
    id: 'shopping',
    name: 'Belanja',
    iconName: 'cart-outline',
    color: '#8B5CF6', // Purple
    bgLight: '#F5F3FF',
    bgDark: 'rgba(139, 92, 246, 0.16)',
  },
  bills: {
    id: 'bills',
    name: 'Tagihan & Utilitas',
    iconName: 'flash-outline',
    color: '#F59E0B', // Amber
    bgLight: '#FFFBEB',
    bgDark: 'rgba(245, 158, 11, 0.16)',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Hiburan',
    iconName: 'film-outline',
    color: '#EC4899', // Pink
    bgLight: '#FDF2F8',
    bgDark: 'rgba(236, 72, 153, 0.16)',
  },
  health: {
    id: 'health',
    name: 'Kesehatan',
    iconName: 'fitness-outline',
    color: '#10B981', // Emerald
    bgLight: '#ECFDF5',
    bgDark: 'rgba(16, 185, 129, 0.16)',
  },
  education: {
    id: 'education',
    name: 'Pendidikan',
    iconName: 'book-outline',
    color: '#06B6D4', // Cyan
    bgLight: '#ECFEFF',
    bgDark: 'rgba(6, 182, 212, 0.16)',
  },
  other: {
    id: 'other',
    name: 'Lainnya',
    iconName: 'cube-outline',
    color: '#71717A', // Neutral Zinc
    bgLight: '#F4F4F5',
    bgDark: 'rgba(113, 113, 122, 0.16)',
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);
