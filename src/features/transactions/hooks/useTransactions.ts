import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types/Transaction';
import { useAuthState } from '../../auth/hooks/useAuthState';

export const useTransactions = () => {
  const { user } = useAuthState();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false); // Start with false
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user) {
      console.log('⚠️ No user, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔄 Fetching transactions for user:', user.uid);
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll(user.uid);
      console.log('✅ Transactions loaded:', data.length);
      setTransactions(data);
    } catch (err) {
      console.error('❌ Transaction fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      // Don't fail silently - just use empty array
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.uid]);

  const createTransaction = async (
    data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await transactionService.create({ ...data, userId: user.uid });
      await fetchTransactions();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      return false;
    }
  };

  const updateTransaction = async (
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> => {
    try {
      await transactionService.update(id, data);
      await fetchTransactions();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      return false;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      await transactionService.delete(id);
      await fetchTransactions();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      return false;
    }
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};
