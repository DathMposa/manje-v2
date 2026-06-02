import { create } from 'zustand';
import {
  createGoalContribution,
  createUserGoal,
  createUserNotification,
  deleteUserGoal,
  subscribeUserGoals,
  updateUserGoal,
  type GoalContributionDoc,
  type GoalDoc,
  type GoalRecord as FirestoreGoalRecord,
} from '../lib/database';
import {
  getLocalGoals,
  upsertGoalFromServer,
} from '../lib/localDatabase';
import { createId, nowIso } from './storage';

export interface GoalContribution extends GoalContributionDoc {}

export interface GoalRecord extends FirestoreGoalRecord {}

interface GoalInput {
  name: string;
  targetAmount: number;
  deadline?: string;
}

interface ContributionInput {
  amount: number;
  date?: string;
  note?: string;
}

interface GoalState {
  userId: string | null;
  isLoading: boolean;
  goals: GoalRecord[];
  initializeForUser: (userId: string) => void;
  addGoal: (input: GoalInput) => Promise<GoalRecord>;
  updateGoal: (id: string, updates: Partial<GoalInput>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addContribution: (goalId: string, input: ContributionInput) => Promise<GoalContribution | undefined>;
  getGoal: (id: string) => GoalRecord | undefined;
  reset: () => void;
}

let goalSubscription: (() => void) | null = null;

const sortGoals = (goals: GoalRecord[]) =>
  [...goals].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

const resetGoalSubscription = () => {
  goalSubscription?.();
  goalSubscription = null;
};

export const useGoalStore = create<GoalState>()((set, get) => ({
  userId: null,
  isLoading: false,
  goals: [],

  initializeForUser: (userId) => {
    if (get().userId === userId && goalSubscription) {
      return;
    }

    resetGoalSubscription();
    set({ userId, isLoading: true, goals: [] });

    // Load from SQLite first
    try {
      const localGoals = getLocalGoals(userId);
      if (localGoals.length > 0) {
        const mapped = localGoals.map((g) => ({
          id: g.localId,
          userId,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.deadline,
          contributions: [],
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        })) as FirestoreGoalRecord[];
        set({ goals: sortGoals(mapped), isLoading: false });
      }
    } catch { /* SQLite not ready */ }

    goalSubscription = subscribeUserGoals(userId, (goals) => {
      goals.forEach((g) => {
        upsertGoalFromServer(userId, {
          serverId: g.id,
          userAuthId: userId,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.deadline,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        });
      });
      set({ goals: sortGoals(goals), isLoading: false });
    });
  },

  addGoal: async (input) => {
    const userId = get().userId;
    const timestamp = nowIso();

    if (!userId) {
      throw new Error('You need to be signed in before saving a goal.');
    }

    const payload: GoalDoc = {
      name: input.name.trim() || 'Untitled goal',
      targetAmount: Math.max(0, Number(input.targetAmount) || 0),
      currentAmount: 0,
      deadline: input.deadline?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
      contributions: [],
    };

    const id = await createUserGoal(userId, payload);

    return { id, ...payload };
  },

  updateGoal: async (id, updates) => {
    const userId = get().userId;
    const currentGoal = get().goals.find((goal) => goal.id === id);

    if (!userId || !currentGoal) {
      return;
    }

    await updateUserGoal(userId, id, {
      name: updates.name === undefined ? currentGoal.name : updates.name.trim() || currentGoal.name,
      targetAmount:
        updates.targetAmount === undefined
          ? currentGoal.targetAmount
          : Math.max(0, Number(updates.targetAmount) || 0),
      deadline:
        updates.deadline === undefined
          ? currentGoal.deadline
          : updates.deadline.trim() || undefined,
      currentAmount: currentGoal.currentAmount,
    });
  },

  deleteGoal: async (id) => {
    const userId = get().userId;

    if (!userId) {
      return;
    }

    await deleteUserGoal(userId, id);
  },

  addContribution: async (goalId, input) => {
    const userId = get().userId;
    const goal = get().goals.find((item) => item.id === goalId);

    if (!userId || !goal) {
      return undefined;
    }

    const contributionAmount = Math.max(0, Number(input.amount) || 0);
    const createdAt = nowIso();
    const date = input.date || createdAt;

    const contributionId = await createGoalContribution(userId, goal.id, {
      amount: contributionAmount,
      date,
      note: input.note?.trim() || undefined,
      createdAt,
    });

    const contribution: GoalContribution = {
      id: contributionId,
      amount: contributionAmount,
      date,
      note: input.note?.trim() || undefined,
      createdAt,
    };

    const currentAmount = goal.currentAmount + contribution.amount;

    await updateUserGoal(userId, goal.id, {
      currentAmount,
    });

    const progress = Math.min((currentAmount / Math.max(goal.targetAmount, 1)) * 100, 100);

    await createUserNotification(userId, {
      type: 'goal',
      title: `Goal Update: ${goal.name}`,
      message: `You're now ${Math.round(progress)}% of the way to your ${goal.name} goal.`,
      read: false,
      actionId: goal.id,
      actionRoute: `/(tabs)/goals/${goal.id}`,
    });

    return contribution;
  },

  getGoal: (id) => get().goals.find((goal) => goal.id === id),

  reset: () => {
    resetGoalSubscription();
    set({
      userId: null,
      isLoading: false,
      goals: [],
    });
  },
}));
