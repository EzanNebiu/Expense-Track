import { useMemo } from 'react';
import type { Transaction } from '../../transactions/types/Transaction';
import type { DashboardStats } from '../types/DashboardStats';
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculatePercentageChange,
} from '../../../shared/utils/calculations';
import { getCurrentMonthRange, getPreviousMonthRange } from '../../../shared/utils/dateUtils';

export const useDashboardData = (transactions: Transaction[]): DashboardStats => {
  return useMemo(() => {
    const currentMonthRange = getCurrentMonthRange();
    const previousMonthRange = getPreviousMonthRange();

    const currentMonthTransactions = transactions.filter(
      (t) => t.date >= currentMonthRange.start && t.date <= currentMonthRange.end
    );

    const previousMonthTransactions = transactions.filter(
      (t) => t.date >= previousMonthRange.start && t.date <= previousMonthRange.end
    );

    const currentBalance = calculateBalance(transactions);
    const totalIncome = calculateTotalIncome(currentMonthTransactions);
    const totalExpenses = calculateTotalExpenses(currentMonthTransactions);
    const netChange = totalIncome - totalExpenses;

    const previousNet = calculateTotalIncome(previousMonthTransactions) - 
                        calculateTotalExpenses(previousMonthTransactions);
    
    const netChangePercent = calculatePercentageChange(netChange, previousNet);

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      netChange,
      netChangePercent,
    };
  }, [transactions]);
};
