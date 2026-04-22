import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/Category';
import { useAuthState } from '../../auth/hooks/useAuthState';
import { createDefaultCategories } from '../constants/defaultCategories';

export const useCategories = () => {
  const { user } = useAuthState();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // Start with false
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!user) {
      console.log('⚠️ No user, skipping categories fetch');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔄 Fetching categories for user:', user.uid);
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll(user.uid);
      
      if (data.length === 0) {
        console.log('📝 Creating default categories');
        const defaultCategories = createDefaultCategories(user.uid);
        await categoryService.createBatch(defaultCategories);
        const newData = await categoryService.getAll(user.uid);
        console.log('✅ Default categories created:', newData.length);
        setCategories(newData);
      } else {
        console.log('✅ Categories loaded:', data.length);
        setCategories(data);
      }
    } catch (err) {
      console.error('❌ Category fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      // Use empty array on error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user?.uid]);

  const createCategory = async (
    data: Omit<Category, 'id' | 'userId' | 'createdAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await categoryService.create({ ...data, userId: user.uid });
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      return false;
    }
  };

  const updateCategory = async (
    id: string,
    data: Partial<Omit<Category, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> => {
    try {
      await categoryService.update(id, data);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await categoryService.delete(id);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      return false;
    }
  };

  const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
    return categories.filter(cat => cat.type === type || cat.type === 'both');
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    refetch: fetchCategories,
  };
};
