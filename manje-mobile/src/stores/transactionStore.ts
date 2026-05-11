import { create } from 'zustand';
import {
  createUserNotification,
  createUserTransaction,
  deleteUserTransaction,
  subscribeUserTransactions,
  updateUserTransaction,
  type TransactionDoc,
  type TransactionRecord as FirestoreTransactionRecord,
} from '../lib/database';
import { nowIso } from './storage';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface TransactionRecord extends FirestoreTransactionRecord {}

interface TransactionInput {
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date?: string;
  note?: string;
}

interface TransactionState {
  userId: string | null;
  isLoading: boolean;
  transactions: TransactionRecord[];
  initializeForUser: (userId: string) => void;
  addTransaction: (input: TransactionInput) => Promise<TransactionRecord>;
  updateTransaction: (id: string, updates: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransaction: (id: string) => TransactionRecord | undefined;
  reset: () => void;
}

let transactionSubscription: (() => void) | null = null;

const sortTransactions = (transactions: TransactionRecord[]) =>
  [...transactions].sort((left, right) => right.date.localeCompare(left.date));

const resetTransactionSubscription = () => {
  transactionSubscription?.();
  transactionSubscription = null;
};

const createTransactionPayload = (input: TransactionInput): TransactionDoc => {
  const timestamp = nowIso();

  return {
    title: input.title.trim() || 'Untitled transaction',
    category: input.category.trim() || 'other',
    amount: Math.max(0, Number(input.amount) || 0),
    type: input.type,
    date: input.date || timestamp,
    note: input.note?.trim() || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  userId: null,
  isLoading: false,
  transactions: [],

  initializeForUser: (userId) => {
    if (get().userId === userId && transactionSubscription) {
      return;
    }

    resetTransactionSubscription();
    set({ userId, isLoading: true, transactions: [] });

    transactionSubscription = subscribeUserTransactions(userId, (transactions) => {
      set({
        transactions: sortTransactions(transactions),
        isLoading: false,
      });
    });
  },

  addTransaction: async (input) => {
    const userId = get().userId;

    if (!userId) {
      throw new Error('You need to be signed in before saving a transaction.');
    }

    const payload = createTransactionPayload(input);
    const id = await createUserTransaction(userId, payload);
    const record = { id, ...payload };

    if (record.type === 'expense' && record.amount >= 50000) {
      await createUserNotification(userId, {
        type: 'transaction',
        title: 'Large Expense Detected',
        message: `A large transaction of MK ${record.amount.toLocaleString()} was recorded for ${record.title}.`,
        read: false,
        actionId: id,
        actionRoute: `/(tabs)/transactions/${id}`,
      });
    }

    return record;
  },

  updateTransaction: async (id, updates) => {
    const userId = get().userId;
    const current = get().transactions.find((transaction) => transaction.id === id);

    if (!userId || !current) {
      return;
    }

    await updateUserTransaction(userId, id, {
      title: updates.title === undefined ? current.title : updates.title.trim() || current.title,
      category: updates.category === undefined ? current.category : updates.category.trim() || current.category,
      amount:
        updates.amount === undefined
          ? current.amount
          : Math.max(0, Number(updates.amount) || 0),
      type: updates.type ?? current.type,
      date: updates.date ?? current.date,
      note: updates.note === undefined ? current.note : updates.note.trim() || undefined,
    });
  },

  deleteTransaction: async (id) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    await deleteUserTransaction(userId, id);
  },

  getTransaction: (id) => get().transactions.find((transaction) => transaction.id === id),

  reset: () => {
    resetTransactionSubscription();
    set({
      userId: null,
      isLoading: false,
      transactions: [],
    });
  },
}));
