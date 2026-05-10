import { create } from 'zustand';
import {
  createUserBudget,
  deleteUserBudget,
  subscribeUserBudgets,
  updateUserBudget,
  type BudgetCategoryDoc,
  type BudgetDoc,
  type BudgetRecord as FirestoreBudgetRecord,
} from '../lib/firestore';
import { useTransactionStore } from './transactionStore';
import { nowIso } from './storage';

export interface BudgetCategory extends BudgetCategoryDoc {
  spent: number;
}

export interface Budget {
  id: string;
  name: string;
  totalLimit: number;
  totalSpent: number;
  isPrimary: boolean;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

type BudgetSource = FirestoreBudgetRecord;

interface BudgetState {
  userId: string | null;
  isLoading: boolean;
  sourceBudgets: BudgetSource[];
  budgets: Budget[];
  initializeForUser: (userId: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudget: (id: string) => Budget | undefined;
  getPrimaryBudget: () => Budget | undefined;
  recalculateSpending: (transactions: Array<{ amount: number; type: string; category: string }>) => void;
  reset: () => void;
}

let budgetSubscription: (() => void) | null = null;

const categoryToBudgetKey = (category: string) => {
  if (category === 'groceries' || category === 'dining') return 'food';
  if (category === 'transport') return 'transport';
  if (category === 'utilities' || category === 'bills') return 'utilities';
  return category;
};

const resetBudgetSubscription = () => {
  budgetSubscription?.();
  budgetSubscription = null;
};

const sortBudgets = (budgets: Budget[]) =>
  [...budgets].sort((left, right) => Number(right.isPrimary) - Number(left.isPrimary) || right.updatedAt.localeCompare(left.updatedAt));

const deriveBudgetView = (
  sourceBudgets: BudgetSource[],
  transactions: Array<{ amount: number; type: string; category: string }>
): Budget[] =>
  sortBudgets(
    sourceBudgets.map((budget) => {
      const categories = budget.categories.map((category) => {
        const spent = transactions
          .filter((transaction) => transaction.type === 'expense')
          .filter(
            (transaction) =>
              categoryToBudgetKey(transaction.category) === category.catKey ||
              transaction.category.toLowerCase() === category.name.toLowerCase()
          )
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
          ...category,
          spent,
        };
      });

      return {
        id: budget.id,
        name: budget.name,
        totalLimit: budget.totalLimit,
        totalSpent: categories.reduce((sum, category) => sum + category.spent, 0),
        isPrimary: budget.isPrimary,
        categories,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      };
    })
  );

const sanitizeBudgetCategories = (categories: BudgetCategory[]): BudgetCategoryDoc[] =>
  categories.map((category) => ({
    id: category.id,
    name: category.name.trim() || 'Other',
    limit: Math.max(0, Number(category.limit) || 0),
    icon: category.icon || 'circle',
    catKey: category.catKey || 'other',
  }));

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  userId: null,
  isLoading: false,
  sourceBudgets: [],
  budgets: [],

  initializeForUser: (userId) => {
    if (get().userId === userId && budgetSubscription) {
      return;
    }

    resetBudgetSubscription();
    set({ userId, isLoading: true, sourceBudgets: [], budgets: [] });

    budgetSubscription = subscribeUserBudgets(userId, (budgets) => {
      set({
        sourceBudgets: budgets,
        budgets: deriveBudgetView(budgets, useTransactionStore.getState().transactions),
        isLoading: false,
      });
    });
  },

  addBudget: async (budget) => {
    const userId = get().userId;

    if (!userId) {
      throw new Error('You need to be signed in before saving a budget.');
    }

    const existingBudgets = get().sourceBudgets;
    const shouldBePrimary = budget.isPrimary || existingBudgets.length === 0;
    const timestamp = nowIso();

    if (shouldBePrimary) {
      await Promise.all(
        existingBudgets
          .filter((item) => item.isPrimary)
          .map((item) => updateUserBudget(userId, item.id, { isPrimary: false }))
      );
    }

    const payload: BudgetDoc = {
      name: budget.name.trim() || 'My Budget',
      totalLimit: Math.max(0, Number(budget.totalLimit) || 0),
      isPrimary: shouldBePrimary,
      categories: sanitizeBudgetCategories(budget.categories),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createUserBudget(userId, payload);
  },

  updateBudget: async (id, budget) => {
    const userId = get().userId;
    const currentBudget = get().sourceBudgets.find((item) => item.id === id);

    if (!userId || !currentBudget) {
      return;
    }

    if (budget.isPrimary) {
      await Promise.all(
        get()
          .sourceBudgets.filter((item) => item.id !== id && item.isPrimary)
          .map((item) => updateUserBudget(userId, item.id, { isPrimary: false }))
      );
    }

    await updateUserBudget(userId, id, {
      name: budget.name === undefined ? currentBudget.name : budget.name.trim() || currentBudget.name,
      totalLimit:
        budget.totalLimit === undefined
          ? currentBudget.totalLimit
          : Math.max(0, Number(budget.totalLimit) || 0),
      isPrimary: budget.isPrimary ?? currentBudget.isPrimary,
      categories:
        budget.categories === undefined
          ? currentBudget.categories
          : sanitizeBudgetCategories(budget.categories),
    });
  },

  deleteBudget: async (id) => {
    const userId = get().userId;
    const currentBudget = get().sourceBudgets.find((item) => item.id === id);

    if (!userId || !currentBudget) {
      return;
    }

    const remainingBudgets = get().sourceBudgets.filter((item) => item.id !== id);

    if (currentBudget.isPrimary && remainingBudgets.length > 0) {
      await updateUserBudget(userId, remainingBudgets[0].id, { isPrimary: true });
    }

    await deleteUserBudget(userId, id);
  },

  getBudget: (id) => get().budgets.find((budget) => budget.id === id),

  getPrimaryBudget: () => {
    const budgets = get().budgets;
    return budgets.find((budget) => budget.isPrimary) || budgets[0];
  },

  recalculateSpending: (transactions) =>
    set((state) => ({
      budgets: deriveBudgetView(state.sourceBudgets, transactions),
    })),

  reset: () => {
    resetBudgetSubscription();
    set({
      userId: null,
      isLoading: false,
      sourceBudgets: [],
      budgets: [],
    });
  },
}));
