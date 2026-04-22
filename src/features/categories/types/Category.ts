import type { TransactionType } from '../../transactions/types/TransactionType';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType | 'both';
  isDefault: boolean;
  createdAt: Date;
}
