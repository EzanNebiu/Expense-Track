import { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import type { Budget } from '../types/Budget';
import { useAuthState } from '../../auth/hooks/useAuthState';

export const useBudgets = () => {
  const { user } = useAuthState();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getAll(user.uid);
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const createBudget = async (
    data: Omit<Budget, 'id' | 'userId' | 'createdAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await budgetService.create({ ...data, userId: user.uid });
      await fetchBudgets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
      return false;
    }
  };

  const updateBudget = async (
    id: string,
    data: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> => {
    try {
      await budgetService.update(id, data);
      await fetchBudgets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      return false;
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    try {
      await budgetService.delete(id);
      await fetchBudgets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
      return false;
    }
  };

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
};
