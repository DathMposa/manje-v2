/**
 * Sync Engine — pushes pending local changes to Supabase and pulls new
 * server records into the local SQLite database.
 *
 * Strategy: last-write-wins by updated_at timestamp.
 *
 * Usage:
 *   import { runSync } from './syncEngine';
 *   await runSync(userId);  // call after auth, on network restore, or manually
 */

import { supabase } from './supabase';
import {
  getSyncState,
  setSyncStarted,
  setSyncCompleted,
  nowIso,
  // Transactions
  getPendingTransactions,
  markTransactionSynced,
  hardDeleteTransaction,
  upsertTransactionFromServer,
  // Budgets
  getPendingBudgets,
  markBudgetSynced,
  hardDeleteBudget,
  upsertBudgetFromServer,
  // Goals
  getPendingGoals,
  markGoalSynced,
  hardDeleteGoal,
  upsertGoalFromServer,
  // Bills
  getPendingBills,
  markBillSynced,
  hardDeleteBill,
  upsertBillFromServer,
  // Notifications
  getPendingNotifications,
  markNotificationSynced,
  upsertNotificationFromServer,
  type LocalBudgetCategory,
} from './localDatabase';

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export const runSync = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  const state = getSyncState(userId);
  if (state.isSyncing) return { success: true }; // Already running

  setSyncStarted(userId);

  try {
    await pushPendingTransactions(userId);
    await pushPendingBudgets(userId);
    await pushPendingGoals(userId);
    await pushPendingBills(userId);
    await pushPendingNotifications(userId);

    await pullTransactions(userId, state.lastSyncedAt);
    await pullBudgets(userId, state.lastSyncedAt);
    await pullGoals(userId, state.lastSyncedAt);
    await pullBills(userId, state.lastSyncedAt);
    await pullNotifications(userId, state.lastSyncedAt);

    setSyncCompleted(userId);
    return { success: true };
  } catch (err) {
    setSyncCompleted(userId); // Reset syncing flag even on error
    const message = err instanceof Error ? err.message : 'Unknown sync error';
    return { success: false, error: message };
  }
};

/**
 * Seeds the local database from Supabase on first login.
 * Call this once after a successful cloud authentication on a new device.
 */
export const seedFromCloud = async (userId: string): Promise<void> => {
  await pullTransactions(userId, null);
  await pullBudgets(userId, null);
  await pullGoals(userId, null);
  await pullBills(userId, null);
  await pullNotifications(userId, null);
  setSyncCompleted(userId);
};

// ---------------------------------------------------------------------------
// Transactions — push
// ---------------------------------------------------------------------------

const pushPendingTransactions = async (userId: string): Promise<void> => {
  const pending = getPendingTransactions(userId);

  for (const tx of pending) {
    if (tx.syncStatus === 'pending_create') {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          title: tx.title,
          category: tx.category,
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
          note: tx.note ?? null,
          created_at: tx.createdAt,
          updated_at: tx.updatedAt,
        })
        .select('id')
        .single();

      if (!error && data?.id) {
        markTransactionSynced(tx.localId, data.id as string);
      }
    } else if (tx.syncStatus === 'pending_update' && tx.serverId) {
      await supabase
        .from('transactions')
        .update({ title: tx.title, category: tx.category, amount: tx.amount, type: tx.type, date: tx.date, note: tx.note ?? null, updated_at: tx.updatedAt })
        .eq('id', tx.serverId)
        .eq('user_id', userId);
      markTransactionSynced(tx.localId, tx.serverId);
    } else if (tx.syncStatus === 'pending_delete' && tx.serverId) {
      await supabase.from('transactions').delete().eq('id', tx.serverId).eq('user_id', userId);
      hardDeleteTransaction(tx.localId);
    } else if (tx.syncStatus === 'pending_delete' && !tx.serverId) {
      // Never reached server — just delete locally
      hardDeleteTransaction(tx.localId);
    }
  }
};

// ---------------------------------------------------------------------------
// Transactions — pull
// ---------------------------------------------------------------------------

const pullTransactions = async (userId: string, since: string | null): Promise<void> => {
  let query = supabase
    .from('transactions')
    .select('id,title,category,amount,type,date,note,created_at,updated_at')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (since) {
    query = query.gt('updated_at', since);
  }

  const { data } = await query;
  if (!data) return;

  for (const row of data) {
    upsertTransactionFromServer(userId, {
      serverId: row.id as string,
      userAuthId: userId,
      title: row.title as string,
      category: row.category as string,
      amount: row.amount as number,
      type: row.type as 'expense' | 'income' | 'transfer',
      date: row.date as string,
      note: (row.note as string) ?? undefined,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    });
  }
};

// ---------------------------------------------------------------------------
// Budgets — push
// ---------------------------------------------------------------------------

const pushPendingBudgets = async (userId: string): Promise<void> => {
  const pending = getPendingBudgets(userId);

  for (const b of pending) {
    if (b.syncStatus === 'pending_create') {
      const { data, error } = await supabase
        .from('budgets')
        .insert({ user_id: userId, name: b.name, total_limit: b.totalLimit, is_primary: b.isPrimary, categories: b.categories, created_at: b.createdAt, updated_at: b.updatedAt })
        .select('id')
        .single();
      if (!error && data?.id) markBudgetSynced(b.localId, data.id as string);
    } else if (b.syncStatus === 'pending_update' && b.serverId) {
      await supabase
        .from('budgets')
        .update({ name: b.name, total_limit: b.totalLimit, is_primary: b.isPrimary, categories: b.categories, updated_at: b.updatedAt })
        .eq('id', b.serverId).eq('user_id', userId);
      markBudgetSynced(b.localId, b.serverId);
    } else if (b.syncStatus === 'pending_delete' && b.serverId) {
      await supabase.from('budgets').delete().eq('id', b.serverId).eq('user_id', userId);
      hardDeleteBudget(b.localId);
    } else if (b.syncStatus === 'pending_delete' && !b.serverId) {
      hardDeleteBudget(b.localId);
    }
  }
};

// ---------------------------------------------------------------------------
// Budgets — pull
// ---------------------------------------------------------------------------

const pullBudgets = async (userId: string, since: string | null): Promise<void> => {
  let query = supabase
    .from('budgets')
    .select('id,name,total_limit,is_primary,categories,created_at,updated_at')
    .eq('user_id', userId);
  if (since) query = query.gt('updated_at', since);

  const { data } = await query;
  if (!data) return;

  for (const row of data) {
    upsertBudgetFromServer(userId, {
      serverId: row.id as string,
      userAuthId: userId,
      name: row.name as string,
      totalLimit: row.total_limit as number,
      isPrimary: Boolean(row.is_primary),
      categories: (row.categories as LocalBudgetCategory[]) ?? [],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    });
  }
};

// ---------------------------------------------------------------------------
// Goals — push
// ---------------------------------------------------------------------------

const pushPendingGoals = async (userId: string): Promise<void> => {
  const pending = getPendingGoals(userId);

  for (const g of pending) {
    if (g.syncStatus === 'pending_create') {
      const { data, error } = await supabase
        .from('goals')
        .insert({ user_id: userId, name: g.name, target_amount: g.targetAmount, current_amount: g.currentAmount, deadline: g.deadline ?? null, created_at: g.createdAt, updated_at: g.updatedAt })
        .select('id').single();
      if (!error && data?.id) markGoalSynced(g.localId, data.id as string);
    } else if (g.syncStatus === 'pending_update' && g.serverId) {
      await supabase.from('goals').update({ name: g.name, target_amount: g.targetAmount, current_amount: g.currentAmount, deadline: g.deadline ?? null, updated_at: g.updatedAt }).eq('id', g.serverId).eq('user_id', userId);
      markGoalSynced(g.localId, g.serverId);
    } else if (g.syncStatus === 'pending_delete' && g.serverId) {
      await supabase.from('goals').delete().eq('id', g.serverId).eq('user_id', userId);
      hardDeleteGoal(g.localId);
    } else if (g.syncStatus === 'pending_delete' && !g.serverId) {
      hardDeleteGoal(g.localId);
    }
  }
};

// ---------------------------------------------------------------------------
// Goals — pull
// ---------------------------------------------------------------------------

const pullGoals = async (userId: string, since: string | null): Promise<void> => {
  let query = supabase.from('goals').select('id,name,target_amount,current_amount,deadline,created_at,updated_at').eq('user_id', userId);
  if (since) query = query.gt('updated_at', since);
  const { data } = await query;
  if (!data) return;
  for (const row of data) {
    upsertGoalFromServer(userId, { serverId: row.id as string, userAuthId: userId, name: row.name as string, targetAmount: row.target_amount as number, currentAmount: row.current_amount as number, deadline: (row.deadline as string) ?? undefined, createdAt: row.created_at as string, updatedAt: row.updated_at as string });
  }
};

// ---------------------------------------------------------------------------
// Bills — push
// ---------------------------------------------------------------------------

const pushPendingBills = async (userId: string): Promise<void> => {
  const pending = getPendingBills(userId);
  for (const b of pending) {
    if (b.syncStatus === 'pending_create') {
      const { data, error } = await supabase.from('bills').insert({ user_id: userId, name: b.name, amount: b.amount, frequency: b.frequency, next_due_date: b.nextDueDate, status: b.status, reminders_enabled: b.remindersEnabled, created_at: b.createdAt, updated_at: b.updatedAt }).select('id').single();
      if (!error && data?.id) markBillSynced(b.localId, data.id as string);
    } else if (b.syncStatus === 'pending_update' && b.serverId) {
      await supabase.from('bills').update({ name: b.name, amount: b.amount, frequency: b.frequency, next_due_date: b.nextDueDate, status: b.status, reminders_enabled: b.remindersEnabled, updated_at: b.updatedAt }).eq('id', b.serverId).eq('user_id', userId);
      markBillSynced(b.localId, b.serverId);
    } else if (b.syncStatus === 'pending_delete' && b.serverId) {
      await supabase.from('bills').delete().eq('id', b.serverId).eq('user_id', userId);
      hardDeleteBill(b.localId);
    } else if (b.syncStatus === 'pending_delete' && !b.serverId) {
      hardDeleteBill(b.localId);
    }
  }
};

// ---------------------------------------------------------------------------
// Bills — pull
// ---------------------------------------------------------------------------

const pullBills = async (userId: string, since: string | null): Promise<void> => {
  let query = supabase.from('bills').select('id,name,amount,frequency,next_due_date,status,reminders_enabled,created_at,updated_at').eq('user_id', userId);
  if (since) query = query.gt('updated_at', since);
  const { data } = await query;
  if (!data) return;
  for (const row of data) {
    upsertBillFromServer(userId, { serverId: row.id as string, userAuthId: userId, name: row.name as string, amount: row.amount as number, frequency: row.frequency as string, nextDueDate: row.next_due_date as string, status: row.status as string, remindersEnabled: Boolean(row.reminders_enabled), createdAt: row.created_at as string, updatedAt: row.updated_at as string });
  }
};

// ---------------------------------------------------------------------------
// Notifications — push
// ---------------------------------------------------------------------------

const pushPendingNotifications = async (userId: string): Promise<void> => {
  const pending = getPendingNotifications(userId);
  for (const n of pending) {
    if (n.syncStatus === 'pending_create') {
      const { data, error } = await supabase.from('notifications').insert({ user_id: userId, type: n.type, title: n.title, message: n.message, read: n.read, action_id: n.actionId ?? null, action_route: n.actionRoute ?? null, created_at: n.createdAt }).select('id').single();
      if (!error && data?.id) markNotificationSynced(n.localId, data.id as string);
    }
    // Notifications are not updated or hard-deleted via sync — they're read-only from cloud
  }
};

// ---------------------------------------------------------------------------
// Notifications — pull
// ---------------------------------------------------------------------------

const pullNotifications = async (userId: string, since: string | null): Promise<void> => {
  let query = supabase.from('notifications').select('id,type,title,message,read,action_id,action_route,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  if (since) query = query.gt('created_at', since);
  const { data } = await query;
  if (!data) return;
  for (const row of data) {
    upsertNotificationFromServer(userId, { serverId: row.id as string, userAuthId: userId, type: row.type as string, title: row.title as string, message: row.message as string, read: Boolean(row.read), actionId: (row.action_id as string) ?? undefined, actionRoute: (row.action_route as string) ?? undefined, createdAt: row.created_at as string });
  }
};
