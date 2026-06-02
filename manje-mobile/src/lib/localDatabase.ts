/**
 * Local SQLite database layer for offline-first support.
 *
 * Every table mirrors the Supabase schema and adds:
 *   local_id    — stable local UUID (primary key, never changes)
 *   server_id   — Supabase UUID, null until first sync
 *   sync_status — 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
 */

import * as SQLite from 'expo-sqlite';

// ---------------------------------------------------------------------------
// Database initialisation
// ---------------------------------------------------------------------------

let _db: SQLite.SQLiteDatabase | null = null;

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!_db) {
    _db = SQLite.openDatabaseSync('manje.db');
  }
  return _db;
};

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const nowIso = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// Schema migrations
// ---------------------------------------------------------------------------

const SCHEMA_VERSION = 1;

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS _schema_version (version INTEGER PRIMARY KEY);

CREATE TABLE IF NOT EXISTS user_profile (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  is_onboarded INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS user_settings (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL UNIQUE,
  currency TEXT DEFAULT 'MWK',
  notification_preferences TEXT NOT NULL DEFAULT '{}',
  security TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS transactions (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS budgets (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  name TEXT NOT NULL,
  total_limit REAL NOT NULL,
  is_primary INTEGER DEFAULT 0,
  categories TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS goals (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  current_amount REAL DEFAULT 0,
  deadline TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS goal_contributions (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  goal_local_id TEXT NOT NULL,
  goal_server_id TEXT,
  user_auth_id TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create',
  FOREIGN KEY (goal_local_id) REFERENCES goals(local_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bills (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  frequency TEXT NOT NULL,
  next_due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  reminders_enabled INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS bill_payments (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  bill_local_id TEXT NOT NULL,
  bill_server_id TEXT,
  user_auth_id TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create',
  FOREIGN KEY (bill_local_id) REFERENCES bills(local_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  local_id TEXT PRIMARY KEY,
  server_id TEXT,
  user_auth_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  action_id TEXT,
  action_route TEXT,
  created_at TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending_create'
);

CREATE TABLE IF NOT EXISTS sync_state (
  user_auth_id TEXT PRIMARY KEY,
  last_synced_at TEXT,
  is_syncing INTEGER DEFAULT 0
);
`;

export const initLocalDatabase = async (): Promise<void> => {
  const db = getDb();

  // Run all CREATE TABLE statements
  await db.execAsync(CREATE_TABLES);

  // Check schema version
  const rows = db.getAllSync<{ version: number }>('SELECT version FROM _schema_version LIMIT 1');
  if (!rows.length) {
    db.runSync('INSERT INTO _schema_version (version) VALUES (?)', [SCHEMA_VERSION]);
  }
};

// ---------------------------------------------------------------------------
// Sync types
// ---------------------------------------------------------------------------

export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export interface LocalTransaction {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  title: string;
  category: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export const getLocalTransactions = (userAuthId: string): LocalTransaction[] => {
  const db = getDb();
  return db
    .getAllSync<Record<string, unknown>>(
      "SELECT * FROM transactions WHERE user_auth_id = ? AND sync_status != 'pending_delete' ORDER BY date DESC",
      [userAuthId]
    )
    .map(mapTransaction);
};

export const saveLocalTransaction = (userAuthId: string, input: Omit<LocalTransaction, 'localId' | 'syncStatus'>): string => {
  const db = getDb();
  const localId = uuid();
  db.runSync(
    'INSERT INTO transactions (local_id, server_id, user_auth_id, title, category, amount, type, date, note, created_at, updated_at, sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [localId, input.serverId ?? null, userAuthId, input.title, input.category, input.amount, input.type, input.date, input.note ?? null, input.createdAt, input.updatedAt, 'pending_create']
  );
  return localId;
};

export const updateLocalTransaction = (localId: string, updates: Partial<LocalTransaction>): void => {
  const db = getDb();
  const now = nowIso();
  db.runSync(
    'UPDATE transactions SET title=COALESCE(?,title), category=COALESCE(?,category), amount=COALESCE(?,amount), type=COALESCE(?,type), date=COALESCE(?,date), note=?, updated_at=?, sync_status=CASE WHEN sync_status=\'pending_create\' THEN \'pending_create\' ELSE \'pending_update\' END WHERE local_id=?',
    [updates.title ?? null, updates.category ?? null, updates.amount ?? null, updates.type ?? null, updates.date ?? null, updates.note ?? null, now, localId]
  );
};

export const markTransactionDeleted = (localId: string): void => {
  const db = getDb();
  db.runSync("UPDATE transactions SET sync_status='pending_delete' WHERE local_id=?", [localId]);
};

export const markTransactionSynced = (localId: string, serverId: string): void => {
  const db = getDb();
  db.runSync("UPDATE transactions SET server_id=?, sync_status='synced' WHERE local_id=?", [serverId, localId]);
};

export const upsertTransactionFromServer = (userAuthId: string, row: Omit<LocalTransaction, 'localId' | 'syncStatus'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>(
    'SELECT local_id FROM transactions WHERE server_id = ?',
    [row.serverId]
  );
  if (existing) {
    db.runSync(
      "UPDATE transactions SET title=?,category=?,amount=?,type=?,date=?,note=?,updated_at=?,sync_status='synced' WHERE local_id=?",
      [row.title, row.category, row.amount, row.type, row.date, row.note ?? null, row.updatedAt, existing.local_id]
    );
  } else {
    const localId = uuid();
    db.runSync(
      "INSERT INTO transactions (local_id,server_id,user_auth_id,title,category,amount,type,date,note,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'synced')",
      [localId, row.serverId, userAuthId, row.title, row.category, row.amount, row.type, row.date, row.note ?? null, row.createdAt, row.updatedAt]
    );
  }
};

const mapTransaction = (r: Record<string, unknown>): LocalTransaction => ({
  localId: r.local_id as string,
  serverId: (r.server_id as string) ?? null,
  userAuthId: r.user_auth_id as string,
  title: r.title as string,
  category: r.category as string,
  amount: r.amount as number,
  type: r.type as 'expense' | 'income' | 'transfer',
  date: r.date as string,
  note: (r.note as string) ?? undefined,
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
  syncStatus: r.sync_status as SyncStatus,
});

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

export interface LocalBudgetCategory {
  id: string;
  catKey: string;
  name: string;
  limit: number;
  spent: number;
  icon?: string;
}

export interface LocalBudget {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  name: string;
  totalLimit: number;
  isPrimary: boolean;
  categories: LocalBudgetCategory[];
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export const getLocalBudgets = (userAuthId: string): LocalBudget[] => {
  const db = getDb();
  return db
    .getAllSync<Record<string, unknown>>(
      "SELECT * FROM budgets WHERE user_auth_id = ? AND sync_status != 'pending_delete'",
      [userAuthId]
    )
    .map(mapBudget);
};

export const saveLocalBudget = (userAuthId: string, input: Omit<LocalBudget, 'localId' | 'syncStatus' | 'totalSpent'>): string => {
  const db = getDb();
  const localId = uuid();
  db.runSync(
    'INSERT INTO budgets (local_id,server_id,user_auth_id,name,total_limit,is_primary,categories,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [localId, input.serverId ?? null, userAuthId, input.name, input.totalLimit, input.isPrimary ? 1 : 0, JSON.stringify(input.categories), input.createdAt, input.updatedAt, 'pending_create']
  );
  return localId;
};

export const updateLocalBudget = (localId: string, updates: Partial<Omit<LocalBudget, 'totalSpent'>>): void => {
  const db = getDb();
  const now = nowIso();
  db.runSync(
    "UPDATE budgets SET name=COALESCE(?,name), total_limit=COALESCE(?,total_limit), is_primary=COALESCE(?,is_primary), categories=COALESCE(?,categories), updated_at=?, sync_status=CASE WHEN sync_status='pending_create' THEN 'pending_create' ELSE 'pending_update' END WHERE local_id=?",
    [updates.name ?? null, updates.totalLimit ?? null, updates.isPrimary !== undefined ? (updates.isPrimary ? 1 : 0) : null, updates.categories ? JSON.stringify(updates.categories) : null, now, localId]
  );
};

export const markBudgetDeleted = (localId: string): void => {
  const db = getDb();
  db.runSync("UPDATE budgets SET sync_status='pending_delete' WHERE local_id=?", [localId]);
};

export const markBudgetSynced = (localId: string, serverId: string): void => {
  const db = getDb();
  db.runSync("UPDATE budgets SET server_id=?, sync_status='synced' WHERE local_id=?", [serverId, localId]);
};

export const upsertBudgetFromServer = (userAuthId: string, row: Omit<LocalBudget, 'localId' | 'syncStatus' | 'totalSpent'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>('SELECT local_id FROM budgets WHERE server_id=?', [row.serverId]);
  if (existing) {
    db.runSync(
      "UPDATE budgets SET name=?,total_limit=?,is_primary=?,categories=?,updated_at=?,sync_status='synced' WHERE local_id=?",
      [row.name, row.totalLimit, row.isPrimary ? 1 : 0, JSON.stringify(row.categories), row.updatedAt, existing.local_id]
    );
  } else {
    const localId = uuid();
    db.runSync(
      "INSERT INTO budgets (local_id,server_id,user_auth_id,name,total_limit,is_primary,categories,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,'synced')",
      [localId, row.serverId, userAuthId, row.name, row.totalLimit, row.isPrimary ? 1 : 0, JSON.stringify(row.categories), row.createdAt, row.updatedAt]
    );
  }
};

const mapBudget = (r: Record<string, unknown>): LocalBudget => {
  let categories: LocalBudgetCategory[] = [];
  try { categories = JSON.parse(r.categories as string) as LocalBudgetCategory[]; } catch { /* ignore */ }
  return {
    localId: r.local_id as string,
    serverId: (r.server_id as string) ?? null,
    userAuthId: r.user_auth_id as string,
    name: r.name as string,
    totalLimit: r.total_limit as number,
    isPrimary: Boolean(r.is_primary),
    categories,
    totalSpent: 0,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    syncStatus: r.sync_status as SyncStatus,
  };
};

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export interface LocalGoal {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export const getLocalGoals = (userAuthId: string): LocalGoal[] => {
  const db = getDb();
  return db
    .getAllSync<Record<string, unknown>>(
      "SELECT * FROM goals WHERE user_auth_id=? AND sync_status!='pending_delete'",
      [userAuthId]
    )
    .map(mapGoal);
};

export const saveLocalGoal = (userAuthId: string, input: Omit<LocalGoal, 'localId' | 'syncStatus'>): string => {
  const db = getDb();
  const localId = uuid();
  db.runSync(
    'INSERT INTO goals (local_id,server_id,user_auth_id,name,target_amount,current_amount,deadline,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [localId, input.serverId ?? null, userAuthId, input.name, input.targetAmount, input.currentAmount, input.deadline ?? null, input.createdAt, input.updatedAt, 'pending_create']
  );
  return localId;
};

export const updateLocalGoal = (localId: string, updates: Partial<LocalGoal>): void => {
  const db = getDb();
  const now = nowIso();
  db.runSync(
    "UPDATE goals SET name=COALESCE(?,name),target_amount=COALESCE(?,target_amount),current_amount=COALESCE(?,current_amount),deadline=COALESCE(?,deadline),updated_at=?,sync_status=CASE WHEN sync_status='pending_create' THEN 'pending_create' ELSE 'pending_update' END WHERE local_id=?",
    [updates.name ?? null, updates.targetAmount ?? null, updates.currentAmount ?? null, updates.deadline ?? null, now, localId]
  );
};

export const markGoalDeleted = (localId: string): void => {
  const db = getDb();
  db.runSync("UPDATE goals SET sync_status='pending_delete' WHERE local_id=?", [localId]);
};

export const markGoalSynced = (localId: string, serverId: string): void => {
  const db = getDb();
  db.runSync("UPDATE goals SET server_id=?,sync_status='synced' WHERE local_id=?", [serverId, localId]);
};

export const upsertGoalFromServer = (userAuthId: string, row: Omit<LocalGoal, 'localId' | 'syncStatus'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>('SELECT local_id FROM goals WHERE server_id=?', [row.serverId]);
  if (existing) {
    db.runSync(
      "UPDATE goals SET name=?,target_amount=?,current_amount=?,deadline=?,updated_at=?,sync_status='synced' WHERE local_id=?",
      [row.name, row.targetAmount, row.currentAmount, row.deadline ?? null, row.updatedAt, existing.local_id]
    );
  } else {
    const localId = uuid();
    db.runSync(
      "INSERT INTO goals (local_id,server_id,user_auth_id,name,target_amount,current_amount,deadline,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,'synced')",
      [localId, row.serverId, userAuthId, row.name, row.targetAmount, row.currentAmount, row.deadline ?? null, row.createdAt, row.updatedAt]
    );
  }
};

const mapGoal = (r: Record<string, unknown>): LocalGoal => ({
  localId: r.local_id as string,
  serverId: (r.server_id as string) ?? null,
  userAuthId: r.user_auth_id as string,
  name: r.name as string,
  targetAmount: r.target_amount as number,
  currentAmount: r.current_amount as number,
  deadline: (r.deadline as string) ?? undefined,
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
  syncStatus: r.sync_status as SyncStatus,
});

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------

export interface LocalBill {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  name: string;
  amount: number;
  frequency: string;
  nextDueDate: string;
  status: string;
  remindersEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export const getLocalBills = (userAuthId: string): LocalBill[] => {
  const db = getDb();
  return db
    .getAllSync<Record<string, unknown>>(
      "SELECT * FROM bills WHERE user_auth_id=? AND sync_status!='pending_delete'",
      [userAuthId]
    )
    .map(mapBill);
};

export const saveLocalBill = (userAuthId: string, input: Omit<LocalBill, 'localId' | 'syncStatus'>): string => {
  const db = getDb();
  const localId = uuid();
  db.runSync(
    'INSERT INTO bills (local_id,server_id,user_auth_id,name,amount,frequency,next_due_date,status,reminders_enabled,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [localId, input.serverId ?? null, userAuthId, input.name, input.amount, input.frequency, input.nextDueDate, input.status, input.remindersEnabled ? 1 : 0, input.createdAt, input.updatedAt, 'pending_create']
  );
  return localId;
};

export const updateLocalBill = (localId: string, updates: Partial<LocalBill>): void => {
  const db = getDb();
  const now = nowIso();
  db.runSync(
    "UPDATE bills SET name=COALESCE(?,name),amount=COALESCE(?,amount),frequency=COALESCE(?,frequency),next_due_date=COALESCE(?,next_due_date),status=COALESCE(?,status),reminders_enabled=COALESCE(?,reminders_enabled),updated_at=?,sync_status=CASE WHEN sync_status='pending_create' THEN 'pending_create' ELSE 'pending_update' END WHERE local_id=?",
    [updates.name ?? null, updates.amount ?? null, updates.frequency ?? null, updates.nextDueDate ?? null, updates.status ?? null, updates.remindersEnabled !== undefined ? (updates.remindersEnabled ? 1 : 0) : null, now, localId]
  );
};

export const markBillDeleted = (localId: string): void => {
  const db = getDb();
  db.runSync("UPDATE bills SET sync_status='pending_delete' WHERE local_id=?", [localId]);
};

export const markBillSynced = (localId: string, serverId: string): void => {
  const db = getDb();
  db.runSync("UPDATE bills SET server_id=?,sync_status='synced' WHERE local_id=?", [serverId, localId]);
};

export const upsertBillFromServer = (userAuthId: string, row: Omit<LocalBill, 'localId' | 'syncStatus'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>('SELECT local_id FROM bills WHERE server_id=?', [row.serverId]);
  if (existing) {
    db.runSync(
      "UPDATE bills SET name=?,amount=?,frequency=?,next_due_date=?,status=?,reminders_enabled=?,updated_at=?,sync_status='synced' WHERE local_id=?",
      [row.name, row.amount, row.frequency, row.nextDueDate, row.status, row.remindersEnabled ? 1 : 0, row.updatedAt, existing.local_id]
    );
  } else {
    const localId = uuid();
    db.runSync(
      "INSERT INTO bills (local_id,server_id,user_auth_id,name,amount,frequency,next_due_date,status,reminders_enabled,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'synced')",
      [localId, row.serverId, userAuthId, row.name, row.amount, row.frequency, row.nextDueDate, row.status, row.remindersEnabled ? 1 : 0, row.createdAt, row.updatedAt]
    );
  }
};

const mapBill = (r: Record<string, unknown>): LocalBill => ({
  localId: r.local_id as string,
  serverId: (r.server_id as string) ?? null,
  userAuthId: r.user_auth_id as string,
  name: r.name as string,
  amount: r.amount as number,
  frequency: r.frequency as string,
  nextDueDate: r.next_due_date as string,
  status: r.status as string,
  remindersEnabled: Boolean(r.reminders_enabled),
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
  syncStatus: r.sync_status as SyncStatus,
});

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface LocalNotification {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionId?: string;
  actionRoute?: string;
  createdAt: string;
  syncStatus: SyncStatus;
}

export const getLocalNotifications = (userAuthId: string): LocalNotification[] => {
  const db = getDb();
  return db
    .getAllSync<Record<string, unknown>>(
      "SELECT * FROM notifications WHERE user_auth_id=? AND sync_status!='pending_delete' ORDER BY created_at DESC",
      [userAuthId]
    )
    .map(mapNotification);
};

export const saveLocalNotification = (userAuthId: string, input: Omit<LocalNotification, 'localId' | 'syncStatus'>): string => {
  const db = getDb();
  const localId = uuid();
  db.runSync(
    'INSERT INTO notifications (local_id,server_id,user_auth_id,type,title,message,read,action_id,action_route,created_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [localId, input.serverId ?? null, userAuthId, input.type, input.title, input.message, input.read ? 1 : 0, input.actionId ?? null, input.actionRoute ?? null, input.createdAt, 'pending_create']
  );
  return localId;
};

export const markNotificationRead = (localId: string): void => {
  const db = getDb();
  db.runSync("UPDATE notifications SET read=1,sync_status=CASE WHEN sync_status='pending_create' THEN 'pending_create' ELSE 'pending_update' END WHERE local_id=?", [localId]);
};

export const markNotificationSynced = (localId: string, serverId: string): void => {
  const db = getDb();
  db.runSync("UPDATE notifications SET server_id=?,sync_status='synced' WHERE local_id=?", [serverId, localId]);
};

export const upsertNotificationFromServer = (userAuthId: string, row: Omit<LocalNotification, 'localId' | 'syncStatus'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>('SELECT local_id FROM notifications WHERE server_id=?', [row.serverId]);
  if (!existing) {
    const localId = uuid();
    db.runSync(
      "INSERT INTO notifications (local_id,server_id,user_auth_id,type,title,message,read,action_id,action_route,created_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,?,'synced')",
      [localId, row.serverId, userAuthId, row.type, row.title, row.message, row.read ? 1 : 0, row.actionId ?? null, row.actionRoute ?? null, row.createdAt]
    );
  }
};

const mapNotification = (r: Record<string, unknown>): LocalNotification => ({
  localId: r.local_id as string,
  serverId: (r.server_id as string) ?? null,
  userAuthId: r.user_auth_id as string,
  type: r.type as string,
  title: r.title as string,
  message: r.message as string,
  read: Boolean(r.read),
  actionId: (r.action_id as string) ?? undefined,
  actionRoute: (r.action_route as string) ?? undefined,
  createdAt: r.created_at as string,
  syncStatus: r.sync_status as SyncStatus,
});

// ---------------------------------------------------------------------------
// Sync state helpers
// ---------------------------------------------------------------------------

export const getSyncState = (userAuthId: string): { lastSyncedAt: string | null; isSyncing: boolean } => {
  const db = getDb();
  const row = db.getFirstSync<{ last_synced_at: string | null; is_syncing: number }>(
    'SELECT last_synced_at, is_syncing FROM sync_state WHERE user_auth_id=?',
    [userAuthId]
  );
  return row
    ? { lastSyncedAt: row.last_synced_at, isSyncing: Boolean(row.is_syncing) }
    : { lastSyncedAt: null, isSyncing: false };
};

export const setSyncStarted = (userAuthId: string): void => {
  const db = getDb();
  db.runSync(
    'INSERT INTO sync_state (user_auth_id, is_syncing) VALUES (?,1) ON CONFLICT(user_auth_id) DO UPDATE SET is_syncing=1',
    [userAuthId]
  );
};

export const setSyncCompleted = (userAuthId: string): void => {
  const db = getDb();
  db.runSync(
    "INSERT INTO sync_state (user_auth_id,last_synced_at,is_syncing) VALUES (?,?,0) ON CONFLICT(user_auth_id) DO UPDATE SET last_synced_at=?,is_syncing=0",
    [userAuthId, nowIso(), nowIso()]
  );
};

// ---------------------------------------------------------------------------
// Pending rows for sync engine
// ---------------------------------------------------------------------------

export const getPendingTransactions = (userAuthId: string) =>
  getDb().getAllSync<Record<string, unknown>>(
    "SELECT * FROM transactions WHERE user_auth_id=? AND sync_status!='synced'",
    [userAuthId]
  ).map(mapTransaction);

export const getPendingBudgets = (userAuthId: string) =>
  getDb().getAllSync<Record<string, unknown>>(
    "SELECT * FROM budgets WHERE user_auth_id=? AND sync_status!='synced'",
    [userAuthId]
  ).map(mapBudget);

export const getPendingGoals = (userAuthId: string) =>
  getDb().getAllSync<Record<string, unknown>>(
    "SELECT * FROM goals WHERE user_auth_id=? AND sync_status!='synced'",
    [userAuthId]
  ).map(mapGoal);

export const getPendingBills = (userAuthId: string) =>
  getDb().getAllSync<Record<string, unknown>>(
    "SELECT * FROM bills WHERE user_auth_id=? AND sync_status!='synced'",
    [userAuthId]
  ).map(mapBill);

export const getPendingNotifications = (userAuthId: string) =>
  getDb().getAllSync<Record<string, unknown>>(
    "SELECT * FROM notifications WHERE user_auth_id=? AND sync_status!='synced'",
    [userAuthId]
  ).map(mapNotification);

// ---------------------------------------------------------------------------
// User profile (needed for offline biometric auth)
// ---------------------------------------------------------------------------

export interface LocalUserProfile {
  localId: string;
  serverId: string | null;
  userAuthId: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getLocalUserProfile = (userAuthId: string): LocalUserProfile | null => {
  const db = getDb();
  const row = db.getFirstSync<Record<string, unknown>>(
    'SELECT * FROM user_profile WHERE user_auth_id=? LIMIT 1',
    [userAuthId]
  );
  if (!row) return null;
  return {
    localId: row.local_id as string,
    serverId: (row.server_id as string) ?? null,
    userAuthId: row.user_auth_id as string,
    displayName: (row.display_name as string) ?? null,
    email: (row.email as string) ?? null,
    photoUrl: (row.photo_url as string) ?? null,
    isOnboarded: Boolean(row.is_onboarded),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
};

export const saveLocalUserProfile = (profile: Omit<LocalUserProfile, 'localId'>): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ local_id: string }>(
    'SELECT local_id FROM user_profile WHERE user_auth_id=?',
    [profile.userAuthId]
  );
  if (existing) {
    db.runSync(
      "UPDATE user_profile SET server_id=?,display_name=?,email=?,photo_url=?,is_onboarded=?,updated_at=?,sync_status='synced' WHERE user_auth_id=?",
      [profile.serverId ?? null, profile.displayName, profile.email, profile.photoUrl, profile.isOnboarded ? 1 : 0, profile.updatedAt, profile.userAuthId]
    );
  } else {
    const localId = uuid();
    db.runSync(
      "INSERT INTO user_profile (local_id,server_id,user_auth_id,display_name,email,photo_url,is_onboarded,created_at,updated_at,sync_status) VALUES (?,?,?,?,?,?,?,?,?,'synced')",
      [localId, profile.serverId ?? null, profile.userAuthId, profile.displayName, profile.email, profile.photoUrl, profile.isOnboarded ? 1 : 0, profile.createdAt, profile.updatedAt]
    );
  }
};

// Physical delete after server confirms deletion
export const hardDeleteTransaction = (localId: string): void => {
  getDb().runSync('DELETE FROM transactions WHERE local_id=?', [localId]);
};

export const hardDeleteBudget = (localId: string): void => {
  getDb().runSync('DELETE FROM budgets WHERE local_id=?', [localId]);
};

export const hardDeleteGoal = (localId: string): void => {
  getDb().runSync('DELETE FROM goals WHERE local_id=?', [localId]);
};

export const hardDeleteBill = (localId: string): void => {
  getDb().runSync('DELETE FROM bills WHERE local_id=?', [localId]);
};
