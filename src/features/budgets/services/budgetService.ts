import type { Budget } from '../types/Budget';

const STORAGE_KEY = 'expense_tracker_budgets';

export const budgetService = {
  async getAll(userId: string): Promise<Budget[]> {
    const budgets = this.getAllBudgets();
    return budgets
      .filter(budget => budget.userId === userId)
      .map(budget => ({
        ...budget,
        startDate: new Date(budget.startDate),
        endDate: budget.endDate ? new Date(budget.endDate) : undefined,
        createdAt: new Date(budget.createdAt),
      }));
  },

  async create(data: Omit<Budget, 'id' | 'createdAt'>): Promise<string> {
    const budgets = this.getAllBudgets();
    const newBudget: Budget = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    budgets.push(newBudget);
    this.saveBudgets(budgets);
    return newBudget.id;
  },

  async update(id: string, data: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const budgets = this.getAllBudgets();
    const index = budgets.findIndex(budget => budget.id === id);
    
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...data };
      this.saveBudgets(budgets);
    }
  },

  async delete(id: string): Promise<void> {
    const budgets = this.getAllBudgets();
    this.saveBudgets(budgets.filter(budget => budget.id !== id));
  },

  getAllBudgets(): Budget[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  },
};
