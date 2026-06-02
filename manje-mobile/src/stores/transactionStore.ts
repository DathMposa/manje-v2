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
import {
  getLocalTransactions,
  saveLocalTransaction,
  updateLocalTransaction,
  markTransactionDeleted,
  markTransactionSynced,
  upsertTransactionFromServer,
} from '../lib/localDatabase';
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

    // Load from SQLite first (instant, works offline)
    try {
      const localTxs = getLocalTransactions(userId);
      if (localTxs.length > 0) {
        const mapped = localTxs.map((t) => ({
          id: t.localId,
          userId,
          title: t.title,
          category: t.category,
          amount: t.amount,
          type: t.type,
          date: t.date,
          note: t.note,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })) as FirestoreTransactionRecord[];
        set({ transactions: sortTransactions(mapped), isLoading: false });
      }
    } catch { /* SQLite not ready yet — will be populated by cloud fetch */ }

    // Then fetch from Supabase (updates SQLite + state)
    transactionSubscription = subscribeUserTransactions(userId, (transactions) => {
      // Upsert each cloud record into SQLite
      transactions.forEach((t) => {
        upsertTransactionFromServer(userId, {
          serverId: t.id,
          userAuthId: userId,
          title: t.title,
          category: t.category,
          amount: t.amount,
          type: t.type,
          date: t.date,
          note: t.note,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        });
      });
      // Re-read from SQLite so local pending items are included too
      try {
        const merged = getLocalTransactions(userId).map((t) => ({
          id: t.serverId ?? t.localId,
          userId,
          title: t.title,
          category: t.category,
          amount: t.amount,
          type: t.type,
          date: t.date,
          note: t.note,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })) as FirestoreTransactionRecord[];
        set({ transactions: sortTransactions(merged), isLoading: false });
      } catch {
        set({ transactions: sortTransactions(transactions), isLoading: false });
      }
    });
  },

  addTransaction: async (input) => {
    const userId = get().userId;

    if (!userId) {
      throw new Error('You need to be signed in before saving a transaction.');
    }

    const payload = createTransactionPayload(input);

    // Save locally first (works offline)
    const localId = saveLocalTransaction(userId, { serverId: null, userAuthId: userId, ...payload });
    const record = { id: localId, ...payload };

    set((state) => ({
      transactions: sortTransactions([record, ...state.transactions]),
    }));

    // Push to Supabase (best-effort — sync engine handles failures later)
    try {
      const serverId = await createUserTransaction(userId, payload);
      markTransactionSynced(localId, serverId);
      // Upgrade in-memory record to use server ID
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === localId ? { ...t, id: serverId } : t
        ),
      }));

      if (payload.type === 'expense' && payload.amount >= 50000) {
        await createUserNotification(userId, {
          type: 'transaction',
          title: 'Large Expense Detected',
          message: `A large transaction of MK ${payload.amount.toLocaleString()} was recorded for ${payload.title}.`,
          read: false,
          actionId: serverId,
          actionRoute: `/(tabs)/transactions/${serverId}`,
        });
      }
    } catch { /* offline — sync engine will push later */ }

    return record;
  },

  updateTransaction: async (id, updates) => {
    const userId = get().userId;
    const current = get().transactions.find((transaction) => transaction.id === id);

    if (!userId || !current) {
      return;
    }

    const merged = {
      title: updates.title === undefined ? current.title : updates.title.trim() || current.title,
      category: updates.category === undefined ? current.category : updates.category.trim() || current.category,
      amount: updates.amount === undefined ? current.amount : Math.max(0, Number(updates.amount) || 0),
      type: updates.type ?? current.type,
      date: updates.date ?? current.date,
      note: updates.note === undefined ? current.note : updates.note.trim() || undefined,
    };

    // Update SQLite first
    updateLocalTransaction(id, merged);

    set((state) => ({
      transactions: sortTransactions(
        state.transactions.map((t) =>
          t.id === id ? { ...t, ...merged, updatedAt: new Date().toISOString() } : t
        )
      ),
    }));

    // Push to Supabase (best-effort)
    try {
      await updateUserTransaction(userId, id, merged);
    } catch { /* offline — sync engine will push later */ }
  },

  deleteTransaction: async (id) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    // Mark deleted locally first (removes from UI instantly)
    markTransactionDeleted(id);

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));

    // Push deletion to Supabase (best-effort)
    try {
      await deleteUserTransaction(userId, id);
    } catch { /* sync engine will handle later */ }
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
