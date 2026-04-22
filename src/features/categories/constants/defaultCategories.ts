import type { Category } from '../types/Category';

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', color: '#10b981', icon: '💰' },
  { name: 'Freelance', color: '#3b82f6', icon: '💼' },
  { name: 'Investment', color: '#8b5cf6', icon: '📈' },
  { name: 'Gift', color: '#ec4899', icon: '🎁' },
  { name: 'Other Income', color: '#6366f1', icon: '💵' },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', color: '#ef4444', icon: '🍔' },
  { name: 'Transportation', color: '#f59e0b', icon: '🚗' },
  { name: 'Shopping', color: '#ec4899', icon: '🛍️' },
  { name: 'Entertainment', color: '#8b5cf6', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#6366f1', icon: '💡' },
  { name: 'Healthcare', color: '#14b8a6', icon: '⚕️' },
  { name: 'Education', color: '#3b82f6', icon: '📚' },
  { name: 'Travel', color: '#06b6d4', icon: '✈️' },
  { name: 'Rent', color: '#f97316', icon: '🏠' },
  { name: 'Other Expense', color: '#64748b', icon: '📝' },
];

export const createDefaultCategories = (userId: string): Omit<Category, 'id'>[] => {
  const now = new Date();
  
  const incomeCategories = DEFAULT_INCOME_CATEGORIES.map(cat => ({
    userId,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    type: 'income' as const,
    isDefault: true,
    createdAt: now,
  }));

  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map(cat => ({
    userId,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    type: 'expense' as const,
    isDefault: true,
    createdAt: now,
  }));

  return [...incomeCategories, ...expenseCategories];
};
