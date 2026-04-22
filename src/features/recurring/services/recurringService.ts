import type { RecurringTransaction } from '../types/RecurringTransaction';

const STORAGE_KEY = 'expense_tracker_recurring';

export const recurringService = {
  async getAll(userId: string): Promise<RecurringTransaction[]> {
    const recurring = this.getAllRecurring();
    return recurring
      .filter(rec => rec.userId === userId)
      .map(rec => ({
        ...rec,
        startDate: new Date(rec.startDate),
        endDate: rec.endDate ? new Date(rec.endDate) : undefined,
        lastProcessed: rec.lastProcessed ? new Date(rec.lastProcessed) : undefined,
        createdAt: new Date(rec.createdAt),
      }));
  },

  async create(data: Omit<RecurringTransaction, 'id' | 'createdAt'>): Promise<string> {
    const recurring = this.getAllRecurring();
    const newRecurring: RecurringTransaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    recurring.push(newRecurring);
    this.saveRecurring(recurring);
    return newRecurring.id;
  },

  async update(id: string, data: Partial<Omit<RecurringTransaction, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const recurring = this.getAllRecurring();
    const index = recurring.findIndex(rec => rec.id === id);
    
    if (index !== -1) {
      recurring[index] = { ...recurring[index], ...data };
      this.saveRecurring(recurring);
    }
  },

  async delete(id: string): Promise<void> {
    const recurring = this.getAllRecurring();
    this.saveRecurring(recurring.filter(rec => rec.id !== id));
  },

  getAllRecurring(): RecurringTransaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecurring(recurring: RecurringTransaction[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recurring));
  },
};
