import { useMemo } from 'react';
import type { Transaction } from '../types/Transaction';
import type { TransactionFilters } from '../types/TransactionFilters';
import { isDateInRange } from '../../../shared/utils/dateUtils';

export const useTransactionFilters = (
  transactions: Transaction[],
  filters: TransactionFilters
) => {
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.type && filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.startDate && filters.endDate) {
      result = result.filter(t => 
        isDateInRange(t.date, filters.startDate!, filters.endDate!)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'date':
            comparison = a.date.getTime() - b.date.getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [transactions, filters]);

  return filteredTransactions;
};
