import { useMemo } from 'react';
import type { Transaction } from '../../transactions/types/Transaction';
import type { MonthlyData } from '../types/MonthlyData';
import { calculateTotalIncome, calculateTotalExpenses } from '../../../shared/utils/calculations';
import { getLastNMonths, getMonthName } from '../../../shared/utils/dateUtils';

export const useMonthlyStats = (transactions: Transaction[], months: number = 6): MonthlyData[] => {
  return useMemo(() => {
    const monthDates = getLastNMonths(months);
    
    return monthDates.map((monthDate) => {
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(
        (t) => t.date >= monthStart && t.date <= monthEnd
      );

      const income = calculateTotalIncome(monthTransactions);
      const expenses = calculateTotalExpenses(monthTransactions);

      return {
        month: getMonthName(monthDate),
        income,
        expenses,
        net: income - expenses,
      };
    });
  }, [transactions, months]);
};
