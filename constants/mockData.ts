import { Transaction } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    merchantName: 'Starbucks Coffee',
    totalAmount: 68000,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString().split('T')[0], // Today
    categoryId: 'food',
    notes: 'Iced Caramel Macchiato Venti',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'tx-2',
    merchantName: 'Indomaret Point',
    totalAmount: 145500,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString().split('T')[0], // Today
    categoryId: 'shopping',
    notes: 'Belanja bulanan snack & minuman',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'tx-3',
    merchantName: 'GrabCar Express',
    totalAmount: 42000,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString().split('T')[0], // Yesterday
    categoryId: 'transport',
    notes: 'Ongkos ke kantor SCBD',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'tx-4',
    merchantName: 'PLN Token Listrik',
    totalAmount: 250000,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString().split('T')[0],
    categoryId: 'bills',
    notes: 'Pembelian token listrik 200k',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'tx-5',
    merchantName: 'Cinema XXI Plaza Indonesia',
    totalAmount: 120000,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString().split('T')[0],
    categoryId: 'entertainment',
    notes: '2x Tiket Nonton IMAX',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'tx-6',
    merchantName: 'Apotek K-24',
    totalAmount: 85000,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString().split('T')[0],
    categoryId: 'health',
    notes: 'Multivitamin & Suplemen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'tx-7',
    merchantName: 'Superindo Supermarket',
    totalAmount: 389400,
    currency: 'IDR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString().split('T')[0],
    categoryId: 'shopping',
    notes: 'Buah-buahan, Daging, & Sayuran',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
];
