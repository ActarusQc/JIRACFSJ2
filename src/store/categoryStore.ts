import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types';

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: number, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: number) => void;
  getCategories: () => Category[];
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: (categoryData) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              id: state.categories.length + 1,
              ...categoryData,
            },
          ],
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
      getCategories: () => get().categories,
    }),
    {
      name: 'categories-storage',
    }
  )
);