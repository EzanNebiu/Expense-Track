export const APP_NAME = 'Expense Track';

export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
};

export const DATE_FORMAT = {
  DISPLAY: 'MMM dd, yyyy',
  CHART: 'MMM yyyy',
  FULL: 'MMMM dd, yyyy',
};

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const BUDGET_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const RECURRING_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;
