import { create } from 'zustand';
import {
  createUserBill,
  createUserNotification,
  deleteUserBill,
  subscribeUserBills,
  updateUserBill,
  type BillDoc,
  type BillFrequency,
  type BillPaymentDoc,
  type BillRecord as FirestoreBillRecord,
  type BillStatus,
} from '../lib/firestore';
import { createId, nowIso } from './storage';

export interface BillPaymentRecord extends BillPaymentDoc {}
export interface BillRecord extends FirestoreBillRecord {}

interface BillInput {
  name: string;
  amount: number;
  frequency: BillFrequency;
  nextDueDate: string;
  remindersEnabled: boolean;
}

interface PayBillInput {
  amount: number;
  date?: string;
  note?: string;
}

interface BillState {
  userId: string | null;
  isLoading: boolean;
  bills: BillRecord[];
  initializeForUser: (userId: string) => void;
  addBill: (input: BillInput) => Promise<BillRecord>;
  updateBill: (id: string, updates: Partial<BillInput>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  payBill: (id: string, input: PayBillInput) => Promise<void>;
  getBill: (id: string) => BillRecord | undefined;
  reset: () => void;
}

let billSubscription: (() => void) | null = null;

const sortBills = (bills: BillRecord[]) =>
  [...bills].sort((left, right) => left.nextDueDate.localeCompare(right.nextDueDate));

const resetBillSubscription = () => {
  billSubscription?.();
  billSubscription = null;
};

const deriveBillStatus = (nextDueDate: string): BillStatus => {
  const dueDate = new Date(nextDueDate);
  const today = new Date();
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'urgent';
  }

  if (diffDays <= 3) {
    return 'upcoming';
  }

  return 'upcoming';
};

const advanceDueDate = (dateIso: string, frequency: BillFrequency) => {
  const next = new Date(dateIso);

  if (frequency === 'Weekly') {
    next.setDate(next.getDate() + 7);
  } else if (frequency === 'Monthly') {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next.toISOString();
};

export const formatBillDueDateLabel = (nextDueDate: string) => {
  const dueDate = new Date(nextDueDate);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffMs = startOfDueDate.getTime() - startOfToday.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Tomorrow';
  }

  if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  }

  return dueDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const useBillStore = create<BillState>()((set, get) => ({
  userId: null,
  isLoading: false,
  bills: [],

  initializeForUser: (userId) => {
    if (get().userId === userId && billSubscription) {
      return;
    }

    resetBillSubscription();
    set({ userId, isLoading: true, bills: [] });

    billSubscription = subscribeUserBills(userId, (bills) => {
      set({
        bills: sortBills(bills),
        isLoading: false,
      });
    });
  },

  addBill: async (input) => {
    const userId = get().userId;
    const timestamp = nowIso();

    if (!userId) {
      throw new Error('You need to be signed in before saving a bill.');
    }

    const payload: BillDoc = {
      name: input.name.trim() || 'Untitled bill',
      amount: Math.max(0, Number(input.amount) || 0),
      frequency: input.frequency,
      nextDueDate: input.nextDueDate,
      status: deriveBillStatus(input.nextDueDate),
      remindersEnabled: input.remindersEnabled,
      paymentHistory: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const id = await createUserBill(userId, payload);

    return { id, ...payload };
  },

  updateBill: async (id, updates) => {
    const userId = get().userId;
    const currentBill = get().bills.find((bill) => bill.id === id);

    if (!userId || !currentBill) {
      return;
    }

    const nextDueDate = updates.nextDueDate ?? currentBill.nextDueDate;

    await updateUserBill(userId, id, {
      name: updates.name === undefined ? currentBill.name : updates.name.trim() || currentBill.name,
      amount:
        updates.amount === undefined ? currentBill.amount : Math.max(0, Number(updates.amount) || 0),
      frequency: updates.frequency ?? currentBill.frequency,
      nextDueDate,
      remindersEnabled: updates.remindersEnabled ?? currentBill.remindersEnabled,
      paymentHistory: currentBill.paymentHistory,
      status: currentBill.status === 'paid' ? 'paid' : deriveBillStatus(nextDueDate),
    });
  },

  deleteBill: async (id) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    await deleteUserBill(userId, id);
  },

  payBill: async (id, input) => {
    const userId = get().userId;
    const currentBill = get().bills.find((bill) => bill.id === id);

    if (!userId || !currentBill) {
      return;
    }

    const paymentDate = input.date || nowIso();
    const payment: BillPaymentRecord = {
      id: createId('bill_payment'),
      amount: Math.max(0, Number(input.amount) || 0),
      date: paymentDate,
      note: input.note?.trim() || undefined,
      createdAt: nowIso(),
    };

    await updateUserBill(userId, id, {
      name: currentBill.name,
      amount: currentBill.amount,
      frequency: currentBill.frequency,
      remindersEnabled: currentBill.remindersEnabled,
      nextDueDate: advanceDueDate(paymentDate, currentBill.frequency),
      paymentHistory: [payment, ...currentBill.paymentHistory],
      status: 'paid',
    });

    await createUserNotification(userId, {
      type: 'info',
      title: `Bill Paid: ${currentBill.name}`,
      message: `Payment of MK ${payment.amount.toLocaleString()} was recorded successfully.`,
      read: false,
      actionId: currentBill.id,
      actionRoute: `/(tabs)/bills/${currentBill.id}`,
    });
  },

  getBill: (id) => get().bills.find((bill) => bill.id === id),

  reset: () => {
    resetBillSubscription();
    set({
      userId: null,
      isLoading: false,
      bills: [],
    });
  },
}));
