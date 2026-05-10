import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

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

export const nowIso = () => new Date().toISOString();

const db = () => getFirestoreDb();
const usersCollection = () => collection(db(), 'users');
const userDoc = (uid: string) => doc(usersCollection(), uid);
const settingsDoc = (uid: string) => doc(userDoc(uid), 'preferences', 'settings');

const userSubcollection = (uid: string, key: string) => collection(userDoc(uid), key);

const transactionsCollection = (uid: string) => userSubcollection(uid, 'transactions');
const budgetsCollection = (uid: string) => userSubcollection(uid, 'budgets');
const goalsCollection = (uid: string) => userSubcollection(uid, 'goals');
const billsCollection = (uid: string) => userSubcollection(uid, 'bills');
const notificationsCollection = (uid: string) => userSubcollection(uid, 'notifications');
const supportFeedbackCollection = (uid: string) => userSubcollection(uid, 'supportFeedback');

const transactionDoc = (uid: string, id: string) => doc(transactionsCollection(uid), id);
const budgetDoc = (uid: string, id: string) => doc(budgetsCollection(uid), id);
const goalDoc = (uid: string, id: string) => doc(goalsCollection(uid), id);
const billDoc = (uid: string, id: string) => doc(billsCollection(uid), id);
const notificationDoc = (uid: string, id: string) => doc(notificationsCollection(uid), id);

const educationArticlesCollection = () => collection(db(), 'educationArticles');
const supportFaqsCollection = () => collection(db(), 'supportFaqs');

const subscribeOrderedCollection = <T extends { id: string }>(
  collectionRef: ReturnType<typeof collection>,
  orderField: string,
  onData: (items: T[]) => void,
  transform: (id: string, data: Record<string, unknown>) => T
) =>
  onSnapshot(query(collectionRef, orderBy(orderField, 'desc')), (snapshot) => {
    onData(
      snapshot.docs.map((item) => transform(item.id, item.data() as Record<string, unknown>))
    );
  });

const subscribeAscendingCollection = <T extends { id: string }>(
  collectionRef: ReturnType<typeof collection>,
  orderField: string,
  onData: (items: T[]) => void,
  transform: (id: string, data: Record<string, unknown>) => T
) =>
  onSnapshot(query(collectionRef, orderBy(orderField, 'asc')), (snapshot) => {
    onData(
      snapshot.docs.map((item) => transform(item.id, item.data() as Record<string, unknown>))
    );
  });

const toStringOrUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const toBoolean = (value: unknown, fallback = false) => (typeof value === 'boolean' ? value : fallback);
const toNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const sortByCreatedAtDesc = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

const mapBudgetCategory = (value: unknown): BudgetCategoryDoc => {
  const input = (value ?? {}) as Record<string, unknown>;

  return {
    id: toStringOrUndefined(input.id) ?? `budget_category_${Math.random().toString(36).slice(2, 10)}`,
    name: toStringOrUndefined(input.name) ?? 'Other',
    limit: Math.max(0, toNumber(input.limit)),
    icon: toStringOrUndefined(input.icon) ?? 'circle',
    catKey: toStringOrUndefined(input.catKey) ?? 'other',
  };
};

const mapGoalContribution = (value: unknown): GoalContributionDoc => {
  const input = (value ?? {}) as Record<string, unknown>;

  return {
    id: toStringOrUndefined(input.id) ?? `goal_contribution_${Math.random().toString(36).slice(2, 10)}`,
    amount: Math.max(0, toNumber(input.amount)),
    date: toStringOrUndefined(input.date) ?? nowIso(),
    note: toStringOrUndefined(input.note),
    createdAt: toStringOrUndefined(input.createdAt) ?? nowIso(),
  };
};

const mapBillPayment = (value: unknown): BillPaymentDoc => {
  const input = (value ?? {}) as Record<string, unknown>;

  return {
    id: toStringOrUndefined(input.id) ?? `bill_payment_${Math.random().toString(36).slice(2, 10)}`,
    amount: Math.max(0, toNumber(input.amount)),
    date: toStringOrUndefined(input.date) ?? nowIso(),
    note: toStringOrUndefined(input.note),
    createdAt: toStringOrUndefined(input.createdAt) ?? nowIso(),
  };
};

export const ensureUserProfile = async (user: UserIdentity, isNewUser?: boolean) => {
  const reference = userDoc(user.id);
  const snapshot = await getDoc(reference);
  const timestamp = nowIso();

  const baseProfile: UserProfileDoc = {
    displayName: user.displayName?.trim() || null,
    email: user.email,
    photoURL: user.photoURL ?? null,
    isOnboarded: snapshot.exists()
      ? toBoolean(snapshot.data().isOnboarded)
      : isNewUser
        ? false
        : false,
    createdAt: snapshot.exists() ? toStringOrUndefined(snapshot.data().createdAt) ?? timestamp : timestamp,
    updatedAt: timestamp,
  };

  await setDoc(reference, baseProfile, { merge: true });
  await ensureUserSettings(user.id);
};

export const subscribeUserProfile = (
  uid: string,
  onData: (profile: UserProfileDoc | null) => void
): Unsubscribe =>
  onSnapshot(userDoc(uid), (snapshot) => {
    if (!snapshot.exists()) {
      onData(null);
      return;
    }

    const data = snapshot.data();

    onData({
      displayName: toStringOrUndefined(data.displayName) ?? null,
      email: toStringOrUndefined(data.email) ?? '',
      photoURL: toStringOrUndefined(data.photoURL) ?? null,
      isOnboarded: toBoolean(data.isOnboarded),
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    });
  });

export const getUserProfileDoc = async (uid: string): Promise<UserProfileDoc | null> => {
  const snapshot = await getDoc(userDoc(uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    displayName: toStringOrUndefined(data.displayName) ?? null,
    email: toStringOrUndefined(data.email) ?? '',
    photoURL: toStringOrUndefined(data.photoURL) ?? null,
    isOnboarded: toBoolean(data.isOnboarded),
    createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
    updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
  };
};

export const updateUserProfileDoc = async (
  uid: string,
  updates: Partial<Pick<UserProfileDoc, 'displayName' | 'photoURL' | 'isOnboarded'>>
) => {
  await setDoc(
    userDoc(uid),
    {
      ...updates,
      updatedAt: nowIso(),
    },
    { merge: true }
  );
};

export const ensureUserSettings = async (uid: string) => {
  const reference = settingsDoc(uid);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    await setDoc(reference, defaultUserSettings());
  }
};

export const subscribeUserSettings = (
  uid: string,
  onData: (settings: UserSettingsDoc) => void
): Unsubscribe =>
  onSnapshot(settingsDoc(uid), async (snapshot) => {
    if (!snapshot.exists()) {
      const defaults = defaultUserSettings();
      await setDoc(settingsDoc(uid), defaults);
      onData(defaults);
      return;
    }

    const data = snapshot.data();

    onData({
      currency: toStringOrUndefined(data.currency) ?? 'MWK',
      notificationPreferences: {
        pushEnabled: toBoolean(data.notificationPreferences?.pushEnabled, true),
        dailyReminder: toBoolean(data.notificationPreferences?.dailyReminder, true),
        budgetAlerts: toBoolean(data.notificationPreferences?.budgetAlerts, true),
        goalMilestones: toBoolean(data.notificationPreferences?.goalMilestones, true),
        weeklyReport: toBoolean(data.notificationPreferences?.weeklyReport, true),
        promotional: toBoolean(data.notificationPreferences?.promotional, false),
      },
      security: {
        biometricEnabled: toBoolean(data.security?.biometricEnabled, true),
        autoLockTimeout: toStringOrUndefined(data.security?.autoLockTimeout) ?? '1 minute',
      },
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    });
  });

export const updateUserSettingsDoc = async (uid: string, updates: Partial<UserSettingsDoc>) => {
  await setDoc(
    settingsDoc(uid),
    {
      ...updates,
      updatedAt: nowIso(),
    },
    { merge: true }
  );
};

export const subscribeUserTransactions = (uid: string, onData: (items: TransactionRecord[]) => void) =>
  subscribeOrderedCollection<TransactionRecord>(
    transactionsCollection(uid),
    'date',
    onData,
    (id, data) => ({
      id,
      title: toStringOrUndefined(data.title) ?? 'Untitled transaction',
      category: toStringOrUndefined(data.category) ?? 'other',
      amount: Math.max(0, toNumber(data.amount)),
      type: (toStringOrUndefined(data.type) as TransactionDoc['type']) ?? 'expense',
      date: toStringOrUndefined(data.date) ?? nowIso(),
      note: toStringOrUndefined(data.note),
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const createUserTransaction = async (uid: string, input: TransactionDoc) => {
  const reference = await addDoc(transactionsCollection(uid), input);
  return reference.id;
};

export const updateUserTransaction = async (
  uid: string,
  id: string,
  updates: Partial<TransactionDoc>
) => {
  await updateDoc(transactionDoc(uid, id), {
    ...updates,
    updatedAt: nowIso(),
  });
};

export const deleteUserTransaction = async (uid: string, id: string) => {
  await deleteDoc(transactionDoc(uid, id));
};

export const subscribeUserBudgets = (uid: string, onData: (items: BudgetRecord[]) => void) =>
  subscribeOrderedCollection<BudgetRecord>(
    budgetsCollection(uid),
    'updatedAt',
    onData,
    (id, data) => ({
      id,
      name: toStringOrUndefined(data.name) ?? 'My Budget',
      totalLimit: Math.max(0, toNumber(data.totalLimit)),
      isPrimary: toBoolean(data.isPrimary),
      categories: Array.isArray(data.categories) ? data.categories.map(mapBudgetCategory) : [],
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const createUserBudget = async (uid: string, input: BudgetDoc) => {
  const reference = await addDoc(budgetsCollection(uid), input);
  return reference.id;
};

export const updateUserBudget = async (uid: string, id: string, updates: Partial<BudgetDoc>) => {
  await updateDoc(budgetDoc(uid, id), {
    ...updates,
    updatedAt: nowIso(),
  });
};

export const deleteUserBudget = async (uid: string, id: string) => {
  await deleteDoc(budgetDoc(uid, id));
};

export const subscribeUserGoals = (uid: string, onData: (items: GoalRecord[]) => void) =>
  subscribeOrderedCollection<GoalRecord>(
    goalsCollection(uid),
    'updatedAt',
    onData,
    (id, data) => ({
      id,
      name: toStringOrUndefined(data.name) ?? 'Untitled goal',
      targetAmount: Math.max(0, toNumber(data.targetAmount)),
      currentAmount: Math.max(0, toNumber(data.currentAmount)),
      deadline: toStringOrUndefined(data.deadline),
      contributions: Array.isArray(data.contributions)
        ? sortByCreatedAtDesc(data.contributions.map(mapGoalContribution))
        : [],
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const createUserGoal = async (uid: string, input: GoalDoc) => {
  const reference = await addDoc(goalsCollection(uid), input);
  return reference.id;
};

export const updateUserGoal = async (uid: string, id: string, updates: Partial<GoalDoc>) => {
  await updateDoc(goalDoc(uid, id), {
    ...updates,
    updatedAt: nowIso(),
  });
};

export const deleteUserGoal = async (uid: string, id: string) => {
  await deleteDoc(goalDoc(uid, id));
};

export const subscribeUserBills = (uid: string, onData: (items: BillRecord[]) => void) =>
  subscribeOrderedCollection<BillRecord>(
    billsCollection(uid),
    'nextDueDate',
    onData,
    (id, data) => ({
      id,
      name: toStringOrUndefined(data.name) ?? 'Untitled bill',
      amount: Math.max(0, toNumber(data.amount)),
      frequency: (toStringOrUndefined(data.frequency) as BillFrequency) ?? 'Monthly',
      nextDueDate: toStringOrUndefined(data.nextDueDate) ?? nowIso(),
      status: (toStringOrUndefined(data.status) as BillStatus) ?? 'upcoming',
      remindersEnabled: toBoolean(data.remindersEnabled, true),
      paymentHistory: Array.isArray(data.paymentHistory)
        ? sortByCreatedAtDesc(data.paymentHistory.map(mapBillPayment))
        : [],
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const createUserBill = async (uid: string, input: BillDoc) => {
  const reference = await addDoc(billsCollection(uid), input);
  return reference.id;
};

export const updateUserBill = async (uid: string, id: string, updates: Partial<BillDoc>) => {
  await updateDoc(billDoc(uid, id), {
    ...updates,
    updatedAt: nowIso(),
  });
};

export const deleteUserBill = async (uid: string, id: string) => {
  await deleteDoc(billDoc(uid, id));
};

export const subscribeUserNotifications = (
  uid: string,
  onData: (items: NotificationRecord[]) => void
) =>
  subscribeOrderedCollection<NotificationRecord>(
    notificationsCollection(uid),
    'createdAt',
    onData,
    (id, data) => ({
      id,
      type: (toStringOrUndefined(data.type) as NotificationType) ?? 'info',
      title: toStringOrUndefined(data.title) ?? 'Notification',
      message: toStringOrUndefined(data.message) ?? '',
      read: toBoolean(data.read),
      actionId: toStringOrUndefined(data.actionId),
      actionRoute: toStringOrUndefined(data.actionRoute),
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
    })
  );

export const markNotificationRead = async (uid: string, id: string, read = true) => {
  await updateDoc(notificationDoc(uid, id), { read });
};

export const createUserNotification = async (
  uid: string,
  input: Omit<NotificationDoc, 'createdAt'> & { createdAt?: string }
) => {
  await addDoc(notificationsCollection(uid), {
    ...input,
    createdAt: input.createdAt ?? nowIso(),
  } satisfies NotificationDoc);
};

export const subscribeEducationArticles = (
  onData: (items: EducationArticleRecord[]) => void
) =>
  subscribeOrderedCollection<EducationArticleRecord>(
    educationArticlesCollection(),
    'createdAt',
    (items) => onData(items.filter((item) => item.published)),
    (id, data) => ({
      id,
      title: toStringOrUndefined(data.title) ?? 'Untitled article',
      category: toStringOrUndefined(data.category) ?? 'Education',
      readTime: toStringOrUndefined(data.readTime) ?? '1 min read',
      summary: toStringOrUndefined(data.summary) ?? '',
      body: toStringOrUndefined(data.body) ?? '',
      imageUrl: toStringOrUndefined(data.imageUrl),
      published: toBoolean(data.published, true),
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const subscribeSupportFaqs = (onData: (items: SupportFaqRecord[]) => void) =>
  subscribeAscendingCollection<SupportFaqRecord>(
    supportFaqsCollection(),
    'order',
    onData,
    (id, data) => ({
      id,
      question: toStringOrUndefined(data.question) ?? '',
      answer: toStringOrUndefined(data.answer) ?? '',
      order: toNumber(data.order),
      createdAt: toStringOrUndefined(data.createdAt) ?? nowIso(),
      updatedAt: toStringOrUndefined(data.updatedAt) ?? nowIso(),
    })
  );

export const submitSupportFeedback = async (uid: string, message: string) => {
  await addDoc(supportFeedbackCollection(uid), {
    message: message.trim(),
    createdAt: nowIso(),
  } satisfies SupportFeedbackDoc);
};
