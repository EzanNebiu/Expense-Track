import type { Category } from '../types/Category';

const STORAGE_KEY = 'expense_tracker_categories';

export const categoryService = {
  async getAll(userId: string): Promise<Category[]> {
    const categories = this.getAllCategories();
    return categories
      .filter(cat => cat.userId === userId)
      .map(cat => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
      }));
  },

  async create(data: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    const categories = this.getAllCategories();
    const newCategory: Category = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory.id;
  },

  async createBatch(categories: Omit<Category, 'id'>[]): Promise<void> {
    const existing = this.getAllCategories();
    const newCategories = categories.map(cat => ({
      ...cat,
      id: crypto.randomUUID(),
    }));
    
    this.saveCategories([...existing, ...newCategories]);
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const categories = this.getAllCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data };
      this.saveCategories(categories);
    }
  },

  async delete(id: string): Promise<void> {
    const categories = this.getAllCategories();
    this.saveCategories(categories.filter(cat => cat.id !== id));
  },

  getAllCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  },
};
