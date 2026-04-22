import type { User } from '../types/User';

const STORAGE_KEYS = {
  USERS: 'expense_tracker_users',
  CURRENT_USER: 'expense_tracker_current_user',
};

type StoredUser = User & { password: string };

export const authService = {
  async register(email: string, password: string): Promise<User> {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (password.length < 6) {
      throw new Error('Password is too weak. Please use at least 6 characters');
    }

    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('This email is already registered');
    }

    const newUser: User = {
      uid: crypto.randomUUID(),
      email,
      createdAt: new Date(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    this.setCurrentUser(newUser);
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Incorrect email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const currentUser = this.getCurrentUser();
    callback(currentUser);
    
    return () => {};
  },

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
    };
  },

  getUsers(): StoredUser[] {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!usersJson) return [];
    
    return JSON.parse(usersJson).map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
};
