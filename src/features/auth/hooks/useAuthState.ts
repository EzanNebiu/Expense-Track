import { useState, useEffect } from 'react';
import type { User } from '../types/User';

// Mock user for development without authentication
const MOCK_USER: User = {
  uid: 'local-user',
  email: 'user@local.dev',
  displayName: 'Local User',
  createdAt: new Date(),
};

export const useAuthState = () => {
  const [user] = useState<User>(MOCK_USER);
  const [loading] = useState(false);

  // Log to verify it's working
  useEffect(() => {
    console.log('✅ useAuthState: User loaded', user);
  }, []);

  return { user, loading };
};
