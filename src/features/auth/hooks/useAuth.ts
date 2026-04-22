import { useState } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/User';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.register(email, password);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.login(email, password);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    signOut,
    loading,
    error,
  };
};
