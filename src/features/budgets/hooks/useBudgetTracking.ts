import { useMemo } from 'react';
import type { Budget } from '../types/Budget';
import type { Transaction } from '../../transactions/types/Transaction';
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

interface BudgetTracking {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export const useBudgetTracking = (
  budgets: Budget[],
  transactions: Transaction[],
  categoryName: Record<string, string>
): BudgetTracking[] => {
  return useMemo(() => {
    const now = new Date();

    return budgets.map((budget) => {
      let periodStart: Date;
      let periodEnd: Date;

      switch (budget.period) {
        case 'weekly':
          periodStart = startOfWeek(now);
          periodEnd = endOfWeek(now);
          break;
        case 'monthly':
          periodStart = startOfMonth(now);
          periodEnd = endOfMonth(now);
          break;
        case 'yearly':
          periodStart = startOfYear(now);
          periodEnd = endOfYear(now);
          break;
      }

      const categoryForBudget = categoryName[budget.categoryId];
      
      const spent = transactions
        .filter((t) => {
          const isExpense = t.type === 'expense';
          const matchesCategory = t.category === categoryForBudget;
          const inPeriod = t.date >= periodStart && t.date <= periodEnd;
          return isExpense && matchesCategory && inPeriod;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;
      const isOverBudget = spent > budget.amount;

      return {
        budget,
        spent,
        remaining,
        percentage,
        isOverBudget,
      };
    });
  }, [budgets, transactions, categoryName]);
};
