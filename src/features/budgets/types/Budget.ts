import type { BudgetPeriod } from './BudgetPeriod';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}
