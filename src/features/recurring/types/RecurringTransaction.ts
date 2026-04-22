import type { TransactionType } from '../../transactions/types/TransactionType';
import type { RecurringFrequency } from './RecurringFrequency';

export interface RecurringTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  frequency: RecurringFrequency;
  startDate: Date;
  endDate?: Date;
  lastProcessed?: Date;
  isActive: boolean;
  createdAt: Date;
}
