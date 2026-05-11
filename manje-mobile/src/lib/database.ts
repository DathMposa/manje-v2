import { supabase } from './supabase';

export const nowIso = () => new Date().toISOString();

// ─────────────────────────────────────────────
// Shared types (kept identical to firestore.ts
// so all stores compile without changes)
// ─────────────────────────────────────────────

export interface UserProfileDoc {
  displayName: string | null;
  email: string;
  photoURL?: string | null;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDoc {
  title: string;
  category: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoryDoc {
  id: string;
  name: string;
  limit: number;
  icon: string;
  catKey: string;
}

export interface BudgetDoc {
  name: string;
  totalLimit: number;
  isPrimary: boolean;
  categories: BudgetCategoryDoc[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalContributionDoc {
  id: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface GoalDoc {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  contributions: GoalContributionDoc[];
  createdAt: string;
  updatedAt: string;
}

export interface BillPaymentDoc {
  id: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export type BillStatus = 'urgent' | 'upcoming' | 'paid';
export type BillFrequency = 'Weekly' | 'Monthly' | 'Yearly';

export interface BillDoc {
  name: string;
  amount: number;
  frequency: BillFrequency;
  nextDueDate: string;
  status: BillStatus;
  remindersEnabled: boolean;
  paymentHistory: BillPaymentDoc[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'alert' | 'goal' | 'insight' | 'transaction' | 'info';

export interface NotificationDoc {
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionId?: string;
  actionRoute?: string;
  createdAt: string;
}

export interface EducationArticleDoc {
  title: string;
  category: string;
  readTime: string;
  summary: string;
  body: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettingsDoc {
  currency: string;
  notificationPreferences: {
    pushEnabled: boolean;
    dailyReminder: boolean;
    budgetAlerts: boolean;
    goalMilestones: boolean;
    weeklyReport: boolean;
    promotional: boolean;
  };
  security: {
    biometricEnabled: boolean;
    autoLockTimeout: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportFaqDoc {
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportFeedbackDoc {
  message: string;
  createdAt: string;
}

export interface UserIdentity {
  id: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
}

export interface TransactionRecord extends TransactionDoc {
  id: string;
}

export interface BudgetRecord extends BudgetDoc {
  id: string;
}

export interface GoalRecord extends GoalDoc {
  id: string;
}

export interface BillRecord extends BillDoc {
  id: string;
}

export interface NotificationRecord extends NotificationDoc {
  id: string;
}

export interface EducationArticleRecord extends EducationArticleDoc {
  id: string;
}

export interface SupportFaqRecord extends SupportFaqDoc {
  id: string;
}

export const defaultUserSettings = (): UserSettingsDoc => {
  const timestamp = nowIso();

  return {
    currency: 'MWK',
    notificationPreferences: {
      pushEnabled: true,
      dailyReminder: true,
      budgetAlerts: true,
      goalMilestones: true,
      weeklyReport: true,
      promotional: false,
    },
    security: {
      biometricEnabled: true,
      autoLockTimeout: '1 minute',
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

// ─────────────────────────────────────────────
// Row-to-domain mappers
// ─────────────────────────────────────────────

const toStringOrUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const toBoolean = (value: unknown, fallback = false) =>
  typeof value === 'boolean' ? value : fallback;

const toNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string;
  photo_url: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
};

type SettingsRow = {
  currency: string;
  notification_preferences: unknown;
  security: unknown;
  created_at: string;
  updated_at: string;
};

type TransactionRow = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: string;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

type BudgetRow = {
  id: string;
  name: string;
  total_limit: number;
  is_primary: boolean;
  categories: unknown;
  created_at: string;
  updated_at: string;
};

type GoalRow = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

type GoalContributionRow = {
  id: string;
  goal_id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
};

type BillRow = {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  next_due_date: string;
  status: string;
  reminders_enabled: boolean;
  created_at: string;
  updated_at: string;
};

type BillPaymentRow = {
  id: string;
  bill_id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
};

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_id: string | null;
  action_route: string | null;
  created_at: string;
};

type ArticleRow = {
  id: string;
  title: string;
  category: string;
  read_time: string;
  summary: string;
  body: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  order: number;
  created_at: string;
  updated_at: string;
};

const mapProfile = (row: ProfileRow): UserProfileDoc => ({
  displayName: row.display_name,
  email: row.email,
  photoURL: row.photo_url,
  isOnboarded: row.is_onboarded,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSettings = (row: SettingsRow): UserSettingsDoc => {
  const np = (row.notification_preferences ?? {}) as Record<string, unknown>;
  const sec = (row.security ?? {}) as Record<string, unknown>;

  return {
    currency: toStringOrUndefined(row.currency) ?? 'MWK',
    notificationPreferences: {
      pushEnabled: toBoolean(np['pushEnabled'], true),
      dailyReminder: toBoolean(np['dailyReminder'], true),
      budgetAlerts: toBoolean(np['budgetAlerts'], true),
      goalMilestones: toBoolean(np['goalMilestones'], true),
      weeklyReport: toBoolean(np['weeklyReport'], true),
      promotional: toBoolean(np['promotional'], false),
    },
    security: {
      biometricEnabled: toBoolean(sec['biometricEnabled'], true),
      autoLockTimeout: toStringOrUndefined(sec['autoLockTimeout']) ?? '1 minute',
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapTransaction = (row: TransactionRow): TransactionRecord => ({
  id: row.id,
  title: toStringOrUndefined(row.title) ?? 'Untitled transaction',
  category: toStringOrUndefined(row.category) ?? 'other',
  amount: Math.max(0, toNumber(row.amount)),
  type: (row.type as TransactionDoc['type']) ?? 'expense',
  date: row.date,
  note: toStringOrUndefined(row.note),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapBudget = (row: BudgetRow): BudgetRecord => ({
  id: row.id,
  name: toStringOrUndefined(row.name) ?? 'My Budget',
  totalLimit: Math.max(0, toNumber(row.total_limit)),
  isPrimary: toBoolean(row.is_primary),
  categories: Array.isArray(row.categories) ? (row.categories as BudgetCategoryDoc[]) : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapGoal = (row: GoalRow, contributions: GoalContributionDoc[]): GoalRecord => ({
  id: row.id,
  name: toStringOrUndefined(row.name) ?? 'Untitled goal',
  targetAmount: Math.max(0, toNumber(row.target_amount)),
  currentAmount: Math.max(0, toNumber(row.current_amount)),
  deadline: row.deadline ?? undefined,
  contributions,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapContribution = (row: GoalContributionRow): GoalContributionDoc => ({
  id: row.id,
  amount: Math.max(0, toNumber(row.amount)),
  date: row.date,
  note: toStringOrUndefined(row.note),
  createdAt: row.created_at,
});

const mapBill = (row: BillRow, payments: BillPaymentDoc[]): BillRecord => ({
  id: row.id,
  name: toStringOrUndefined(row.name) ?? 'Untitled bill',
  amount: Math.max(0, toNumber(row.amount)),
  frequency: (row.frequency as BillFrequency) ?? 'Monthly',
  nextDueDate: row.next_due_date,
  status: (row.status as BillStatus) ?? 'upcoming',
  remindersEnabled: toBoolean(row.reminders_enabled, true),
  paymentHistory: payments,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPayment = (row: BillPaymentRow): BillPaymentDoc => ({
  id: row.id,
  amount: Math.max(0, toNumber(row.amount)),
  date: row.date,
  note: toStringOrUndefined(row.note),
  createdAt: row.created_at,
});

const mapNotification = (row: NotificationRow): NotificationRecord => ({
  id: row.id,
  type: (row.type as NotificationType) ?? 'info',
  title: toStringOrUndefined(row.title) ?? 'Notification',
  message: row.message ?? '',
  read: toBoolean(row.read),
  actionId: toStringOrUndefined(row.action_id),
  actionRoute: toStringOrUndefined(row.action_route),
  createdAt: row.created_at,
});

// ─────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────

export const ensureUserProfile = async (user: UserIdentity, _isNewUser?: boolean) => {
  const timestamp = nowIso();

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      display_name: user.displayName?.trim() || null,
      photo_url: user.photoURL ?? null,
      updated_at: timestamp,
    },
    { onConflict: 'id', ignoreDuplicates: false }
  );

  if (error) {
    throw error;
  }
};

export const getUserProfileDoc = async (uid: string): Promise<UserProfileDoc | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProfile(data as ProfileRow);
};

export const subscribeUserProfile = (
  uid: string,
  onData: (profile: UserProfileDoc | null) => void
) => {
  getUserProfileDoc(uid).then(onData);
  return () => undefined;
};

export const updateUserProfileDoc = async (
  uid: string,
  updates: Partial<Pick<UserProfileDoc, 'displayName' | 'photoURL' | 'isOnboarded'>>
) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.displayName !== undefined) {
    payload['display_name'] = updates.displayName;
  }

  if (updates.photoURL !== undefined) {
    payload['photo_url'] = updates.photoURL;
  }

  if (updates.isOnboarded !== undefined) {
    payload['is_onboarded'] = updates.isOnboarded;
  }

  const { error } = await supabase.from('profiles').update(payload).eq('id', uid);

  if (error) {
    throw error;
  }
};

// ─────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────

export const ensureUserSettings = async (uid: string) => {
  const { data } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', uid)
    .single();

  if (!data) {
    const defaults = defaultUserSettings();

    await supabase.from('user_settings').insert({
      user_id: uid,
      currency: defaults.currency,
      notification_preferences: defaults.notificationPreferences,
      security: defaults.security,
    });
  }
};

export const subscribeUserSettings = (
  uid: string,
  onData: (settings: UserSettingsDoc) => void
) => {
  supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', uid)
    .single()
    .then(({ data }) => {
      onData(data ? mapSettings(data as SettingsRow) : defaultUserSettings());
    });

  return () => undefined;
};

export const updateUserSettingsDoc = async (uid: string, updates: Partial<UserSettingsDoc>) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.currency !== undefined) {
    payload['currency'] = updates.currency;
  }

  if (updates.notificationPreferences !== undefined) {
    payload['notification_preferences'] = updates.notificationPreferences;
  }

  if (updates.security !== undefined) {
    payload['security'] = updates.security;
  }

  const { error } = await supabase.from('user_settings').update(payload).eq('user_id', uid);

  if (error) {
    throw error;
  }
};

// ─────────────────────────────────────────────
// Transactions
// ─────────────────────────────────────────────

export const subscribeUserTransactions = (
  uid: string,
  onData: (items: TransactionRecord[]) => void
) => {
  supabase
    .from('transactions')
    .select('*')
    .eq('user_id', uid)
    .order('date', { ascending: false })
    .then(({ data }) => {
      onData((data ?? []).map((r) => mapTransaction(r as TransactionRow)));
    });

  return () => undefined;
};

export const createUserTransaction = async (uid: string, input: TransactionDoc): Promise<string> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: uid,
      title: input.title,
      category: input.category,
      amount: input.amount,
      type: input.type,
      date: input.date,
      note: input.note ?? null,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create transaction.');
  }

  return (data as { id: string }).id;
};

export const updateUserTransaction = async (
  uid: string,
  id: string,
  updates: Partial<TransactionDoc>
) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.title !== undefined) payload['title'] = updates.title;
  if (updates.category !== undefined) payload['category'] = updates.category;
  if (updates.amount !== undefined) payload['amount'] = updates.amount;
  if (updates.type !== undefined) payload['type'] = updates.type;
  if (updates.date !== undefined) payload['date'] = updates.date;
  if (updates.note !== undefined) payload['note'] = updates.note ?? null;

  const { error } = await supabase
    .from('transactions')
    .update(payload)
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const deleteUserTransaction = async (uid: string, id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

// ─────────────────────────────────────────────
// Budgets
// ─────────────────────────────────────────────

export const subscribeUserBudgets = (
  uid: string,
  onData: (items: BudgetRecord[]) => void
) => {
  supabase
    .from('budgets')
    .select('*')
    .eq('user_id', uid)
    .order('updated_at', { ascending: false })
    .then(({ data }) => {
      onData((data ?? []).map((r) => mapBudget(r as BudgetRow)));
    });

  return () => undefined;
};

export const createUserBudget = async (uid: string, input: BudgetDoc): Promise<string> => {
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: uid,
      name: input.name,
      total_limit: input.totalLimit,
      is_primary: input.isPrimary,
      categories: input.categories,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create budget.');
  }

  return (data as { id: string }).id;
};

export const updateUserBudget = async (uid: string, id: string, updates: Partial<BudgetDoc>) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.name !== undefined) payload['name'] = updates.name;
  if (updates.totalLimit !== undefined) payload['total_limit'] = updates.totalLimit;
  if (updates.isPrimary !== undefined) payload['is_primary'] = updates.isPrimary;
  if (updates.categories !== undefined) payload['categories'] = updates.categories;

  const { error } = await supabase
    .from('budgets')
    .update(payload)
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const deleteUserBudget = async (uid: string, id: string) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

// ─────────────────────────────────────────────
// Goals
// ─────────────────────────────────────────────

const fetchGoalContributions = async (goalId: string): Promise<GoalContributionDoc[]> => {
  const { data } = await supabase
    .from('goal_contributions')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((r) => mapContribution(r as GoalContributionRow));
};

export const subscribeUserGoals = (
  uid: string,
  onData: (items: GoalRecord[]) => void
) => {
  supabase
    .from('goals')
    .select('*')
    .eq('user_id', uid)
    .order('updated_at', { ascending: false })
    .then(async ({ data }) => {
      const rows = (data ?? []) as GoalRow[];
      const goals = await Promise.all(
        rows.map(async (row) => {
          const contributions = await fetchGoalContributions(row.id);
          return mapGoal(row, contributions);
        })
      );
      onData(goals);
    });

  return () => undefined;
};

export const createUserGoal = async (uid: string, input: GoalDoc): Promise<string> => {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: uid,
      name: input.name,
      target_amount: input.targetAmount,
      current_amount: input.currentAmount,
      deadline: input.deadline ?? null,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create goal.');
  }

  return (data as { id: string }).id;
};

export const updateUserGoal = async (uid: string, id: string, updates: Partial<GoalDoc>) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.name !== undefined) payload['name'] = updates.name;
  if (updates.targetAmount !== undefined) payload['target_amount'] = updates.targetAmount;
  if (updates.currentAmount !== undefined) payload['current_amount'] = updates.currentAmount;
  if ('deadline' in updates) payload['deadline'] = updates.deadline ?? null;

  const { error } = await supabase
    .from('goals')
    .update(payload)
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const deleteUserGoal = async (uid: string, id: string) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const createGoalContribution = async (
  uid: string,
  goalId: string,
  input: Omit<GoalContributionDoc, 'id'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('goal_contributions')
    .insert({
      goal_id: goalId,
      user_id: uid,
      amount: input.amount,
      date: input.date,
      note: input.note ?? null,
      created_at: input.createdAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create goal contribution.');
  }

  return (data as { id: string }).id;
};

// ─────────────────────────────────────────────
// Bills
// ─────────────────────────────────────────────

const fetchBillPayments = async (billId: string): Promise<BillPaymentDoc[]> => {
  const { data } = await supabase
    .from('bill_payments')
    .select('*')
    .eq('bill_id', billId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((r) => mapPayment(r as BillPaymentRow));
};

export const subscribeUserBills = (
  uid: string,
  onData: (items: BillRecord[]) => void
) => {
  supabase
    .from('bills')
    .select('*')
    .eq('user_id', uid)
    .order('next_due_date', { ascending: true })
    .then(async ({ data }) => {
      const rows = (data ?? []) as BillRow[];
      const bills = await Promise.all(
        rows.map(async (row) => {
          const payments = await fetchBillPayments(row.id);
          return mapBill(row, payments);
        })
      );
      onData(bills);
    });

  return () => undefined;
};

export const createUserBill = async (uid: string, input: BillDoc): Promise<string> => {
  const { data, error } = await supabase
    .from('bills')
    .insert({
      user_id: uid,
      name: input.name,
      amount: input.amount,
      frequency: input.frequency,
      next_due_date: input.nextDueDate,
      status: input.status,
      reminders_enabled: input.remindersEnabled,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create bill.');
  }

  return (data as { id: string }).id;
};

export const updateUserBill = async (uid: string, id: string, updates: Partial<BillDoc>) => {
  const payload: Record<string, unknown> = { updated_at: nowIso() };

  if (updates.name !== undefined) payload['name'] = updates.name;
  if (updates.amount !== undefined) payload['amount'] = updates.amount;
  if (updates.frequency !== undefined) payload['frequency'] = updates.frequency;
  if (updates.nextDueDate !== undefined) payload['next_due_date'] = updates.nextDueDate;
  if (updates.status !== undefined) payload['status'] = updates.status;
  if (updates.remindersEnabled !== undefined) payload['reminders_enabled'] = updates.remindersEnabled;

  const { error } = await supabase
    .from('bills')
    .update(payload)
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const deleteUserBill = async (uid: string, id: string) => {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const createBillPayment = async (
  uid: string,
  billId: string,
  input: Omit<BillPaymentDoc, 'id'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('bill_payments')
    .insert({
      bill_id: billId,
      user_id: uid,
      amount: input.amount,
      date: input.date,
      note: input.note ?? null,
      created_at: input.createdAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create bill payment.');
  }

  return (data as { id: string }).id;
};

// ─────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────

export const subscribeUserNotifications = (
  uid: string,
  onData: (items: NotificationRecord[]) => void
) => {
  supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      onData((data ?? []).map((r) => mapNotification(r as NotificationRow)));
    });

  return () => undefined;
};

export const markNotificationRead = async (uid: string, id: string, read = true) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read })
    .eq('id', id)
    .eq('user_id', uid);

  if (error) {
    throw error;
  }
};

export const createUserNotification = async (
  uid: string,
  input: Omit<NotificationDoc, 'createdAt'> & { createdAt?: string }
) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: uid,
    type: input.type,
    title: input.title,
    message: input.message,
    read: input.read,
    action_id: input.actionId ?? null,
    action_route: input.actionRoute ?? null,
    created_at: input.createdAt ?? nowIso(),
  });

  if (error) {
    throw error;
  }
};

// ─────────────────────────────────────────────
// Education Articles
// ─────────────────────────────────────────────

export const subscribeEducationArticles = (
  onData: (items: EducationArticleRecord[]) => void
) => {
  supabase
    .from('education_articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      onData(
        (data ?? []).map((r) => {
          const row = r as ArticleRow;

          return {
            id: row.id,
            title: toStringOrUndefined(row.title) ?? 'Untitled article',
            category: toStringOrUndefined(row.category) ?? 'Education',
            readTime: toStringOrUndefined(row.read_time) ?? '1 min read',
            summary: row.summary ?? '',
            body: row.body ?? '',
            imageUrl: toStringOrUndefined(row.image_url),
            published: row.published,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        })
      );
    });

  return () => undefined;
};

// ─────────────────────────────────────────────
// Support FAQs
// ─────────────────────────────────────────────

export const subscribeSupportFaqs = (onData: (items: SupportFaqRecord[]) => void) => {
  supabase
    .from('support_faqs')
    .select('*')
    .order('order', { ascending: true })
    .then(({ data }) => {
      onData(
        (data ?? []).map((r) => {
          const row = r as FaqRow;

          return {
            id: row.id,
            question: toStringOrUndefined(row.question) ?? '',
            answer: toStringOrUndefined(row.answer) ?? '',
            order: row.order,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        })
      );
    });

  return () => undefined;
};

// ─────────────────────────────────────────────
// Support Feedback
// ─────────────────────────────────────────────

export const submitSupportFeedback = async (uid: string, message: string) => {
  const { error } = await supabase.from('support_feedback').insert({
    user_id: uid,
    message: message.trim(),
    created_at: nowIso(),
  });

  if (error) {
    throw error;
  }
};
