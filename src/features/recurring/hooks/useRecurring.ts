import { useState, useEffect } from 'react';
import { recurringService } from '../services/recurringService';
import type { RecurringTransaction } from '../types/RecurringTransaction';
import { useAuthState } from '../../auth/hooks/useAuthState';

export const useRecurring = () => {
  const { user } = useAuthState();
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurring = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await recurringService.getAll(user.uid);
      setRecurring(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recurring transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, [user]);

  const createRecurring = async (
    data: Omit<RecurringTransaction, 'id' | 'userId' | 'createdAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await recurringService.create({ ...data, userId: user.uid });
      await fetchRecurring();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recurring transaction');
      return false;
    }
  };

  const updateRecurring = async (
    id: string,
    data: Partial<Omit<RecurringTransaction, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> => {
    try {
      await recurringService.update(id, data);
      await fetchRecurring();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recurring transaction');
      return false;
    }
  };

  const deleteRecurring = async (id: string): Promise<boolean> => {
    try {
      await recurringService.delete(id);
      await fetchRecurring();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recurring transaction');
      return false;
    }
  };

  return {
    recurring,
    loading,
    error,
    createRecurring,
    updateRecurring,
    deleteRecurring,
    refetch: fetchRecurring,
  };
};
