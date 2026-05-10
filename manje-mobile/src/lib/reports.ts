import type { Budget } from '../stores/budgetStore';
import type { GoalRecord } from '../stores/goalStore';
import type { TransactionRecord } from '../stores/transactionStore';

const DAY_MS = 1000 * 60 * 60 * 24;

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatRange = (start: Date, end: Date) =>
  `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )}`;

const getMonthLabel = (date: Date) => date.toLocaleDateString('en-US', { month: 'short' });

const CATEGORY_LABELS: Record<string, string> = {
  groceries: 'Groceries',
  dining: 'Dining',
  transport: 'Transport',
  utilities: 'Utilities',
  bills: 'Bills',
  healthcare: 'Healthcare',
  shopping: 'Shopping',
  education: 'Education',
  entertainment: 'Entertainment',
  salary: 'Salary',
  freelance: 'Freelance',
  other: 'Other',
};

const formatCategoryName = (category: string) => CATEGORY_LABELS[category] ?? category;

const currentWindow = () => {
  const end = startOfDay(new Date());
  const start = new Date(end.getTime() - 6 * DAY_MS);
  return { start, end };
};

const previousWindow = () => {
  const { start } = currentWindow();
  const end = new Date(start.getTime() - DAY_MS);
  const previousStart = new Date(end.getTime() - 6 * DAY_MS);
  return { start: previousStart, end };
};

const between = (dateIso: string, start: Date, end: Date) => {
  const value = new Date(dateIso).getTime();
  return value >= start.getTime() && value <= end.getTime() + DAY_MS - 1;
};

const sumByType = (transactions: TransactionRecord[], type: TransactionRecord['type']) =>
  transactions.filter((transaction) => transaction.type === type).reduce((sum, transaction) => sum + transaction.amount, 0);

const buildMonthlyTrends = (transactions: TransactionRecord[]) => {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const monthlyTransactions = transactions.filter((transaction) => {
      const value = new Date(transaction.date);
      return value.getMonth() === month && value.getFullYear() === year;
    });

    return {
      month: getMonthLabel(monthDate),
      spent: sumByType(monthlyTransactions, 'expense'),
      income: sumByType(monthlyTransactions, 'income'),
    };
  });
};

export const buildWeeklySummary = (transactions: TransactionRecord[], budgets: Budget[]) => {
  const current = currentWindow();
  const previous = previousWindow();
  const currentTransactions = transactions.filter((transaction) => between(transaction.date, current.start, current.end));
  const previousTransactions = transactions.filter((transaction) => between(transaction.date, previous.start, previous.end));
  const currentSpent = sumByType(currentTransactions, 'expense');
  const previousSpent = sumByType(previousTransactions, 'expense');
  const comparison = previousSpent === 0 ? 0 : Math.round(((currentSpent - previousSpent) / previousSpent) * 100);

  const categorySpend = currentTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((accumulator, transaction) => {
      accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + transaction.amount;
      return accumulator;
    }, {});

  const categories = Object.entries(categorySpend)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([category, spent]) => {
      const budgetCategory = budgets
        .flatMap((budget) => budget.categories)
        .find((item) => item.catKey === category || item.name.toLowerCase() === category.toLowerCase());

      return {
        name: formatCategoryName(category),
        spent,
        limit: budgetCategory?.limit ?? spent,
        categoryKey: category,
      };
    });

  const anomalies: Array<{ message: string; type: 'warning' | 'info' }> = [];

  if (categories[0] && currentSpent > 0 && categories[0].spent / currentSpent >= 0.4) {
    anomalies.push({
      type: 'warning',
      message: `${categories[0].name} made up ${Math.round((categories[0].spent / currentSpent) * 100)}% of your weekly spending.`,
    });
  }

  if (comparison < 0) {
    anomalies.push({
      type: 'info',
      message: `You spent ${Math.abs(comparison)}% less than the previous week.`,
    });
  }

  return {
    week: formatRange(current.start, current.end),
    totalSpent: currentSpent,
    comparison,
    categories,
    anomalies,
  };
};

export const buildFinancialHealth = (
  transactions: TransactionRecord[],
  budgets: Budget[],
  goals: GoalRecord[]
) => {
  const monthlyTrends = buildMonthlyTrends(transactions);
  const currentMonth = monthlyTrends[monthlyTrends.length - 1];
  const budgetUsage = budgets.length
    ? budgets.reduce((sum, budget) => sum + (budget.totalLimit > 0 ? budget.totalSpent / budget.totalLimit : 0), 0) /
      budgets.length
    : 0;
  const budgetAdherence = budgets.length ? clamp(100 - budgetUsage * 100) : 60;
  const savingsRate =
    currentMonth.income > 0
      ? clamp(((currentMonth.income - currentMonth.spent) / currentMonth.income) * 100)
      : 40;
  const emergencyGoal = goals.find((goal) => /emergency/i.test(goal.name));
  const emergencyFund = emergencyGoal
    ? clamp((emergencyGoal.currentAmount / Math.max(emergencyGoal.targetAmount, 1)) * 100)
    : goals.length
      ? clamp(
          goals.reduce((sum, goal) => sum + goal.currentAmount, 0) /
            Math.max(goals.reduce((sum, goal) => sum + goal.targetAmount, 0), 1) *
            100
        )
      : 35;
  const score = Math.round((budgetAdherence + savingsRate + emergencyFund) / 3);
  const status = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work';

  const tips: string[] = [];

  if (savingsRate < 50) {
    tips.push('Try setting aside a fixed amount from every income transaction to improve your savings rate.');
  }

  if (budgetAdherence < 70) {
    tips.push('Review the categories where you are running close to budget and trim one recurring expense this week.');
  }

  if (emergencyFund < 60) {
    tips.push('Building your emergency fund a little at a time will strengthen your overall financial resilience.');
  }

  if (tips.length === 0) {
    tips.push('Your habits are in a healthy place. Keep logging consistently so your trends stay accurate.');
  }

  return {
    score,
    status,
    factors: [
      { name: 'Budget Adherence', score: Math.round(budgetAdherence) },
      { name: 'Savings Rate', score: Math.round(savingsRate) },
      { name: 'Emergency Fund', score: Math.round(emergencyFund) },
    ],
    tips,
  };
};

export const buildSpendingTrends = (transactions: TransactionRecord[]) => {
  const trends = buildMonthlyTrends(transactions);
  const averageSpent =
    trends.length > 0 ? trends.reduce((sum, item) => sum + item.spent, 0) / trends.length : 0;
  const averageSavings =
    trends.length > 0 ? trends.reduce((sum, item) => sum + (item.income - item.spent), 0) / trends.length : 0;
  const last = trends[trends.length - 1];
  const previous = trends[trends.length - 2];
  const spendingChange =
    previous && previous.spent > 0 ? Math.round(((last.spent - previous.spent) / previous.spent) * 100) : 0;
  const savingsChange =
    previous && previous.income - previous.spent !== 0
      ? Math.round(
          (((last.income - last.spent) - (previous.income - previous.spent)) /
            Math.max(Math.abs(previous.income - previous.spent), 1)) *
            100
        )
      : 0;

  return {
    trends,
    averageSpent,
    averageSavings,
    spendingChange,
    savingsChange,
  };
};
