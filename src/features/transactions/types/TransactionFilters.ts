import type { TransactionType } from './TransactionType';

export interface TransactionFilters {
  type?: TransactionType | 'all';
  category?: string;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  sortBy?: 'date' | 'amount' | 'category';
  sortOrder?: 'asc' | 'desc';
}
