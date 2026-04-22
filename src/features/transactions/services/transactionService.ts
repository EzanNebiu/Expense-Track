import type { Transaction } from '../types/Transaction';

const STORAGE_KEY = 'expense_tracker_transactions';

export const transactionService = {
  async getAll(userId: string): Promise<Transaction[]> {
    const transactions = this.getAllTransactions();
    return transactions
      .filter(txn => txn.userId === userId)
      .map(txn => ({
        ...txn,
        date: new Date(txn.date),
        createdAt: new Date(txn.createdAt),
        updatedAt: new Date(txn.updatedAt),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const transactions = this.getAllTransactions();
    const now = new Date();
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction.id;
  },

  async update(id: string, data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const transactions = this.getAllTransactions();
    const index = transactions.findIndex(txn => txn.id === id);
    
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...data,
        updatedAt: new Date(),
      };
      this.saveTransactions(transactions);
    }
  },

  async delete(id: string): Promise<void> {
    const transactions = this.getAllTransactions();
    this.saveTransactions(transactions.filter(txn => txn.id !== id));
  },

  getAllTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },
};
