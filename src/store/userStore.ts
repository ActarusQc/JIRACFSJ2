import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updates: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: number) => void;
  getUsers: () => User[];
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (userData) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              id: state.users.length + 1,
              ...userData,
            },
          ],
        })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      getUsers: () => get().users,
    }),
    {
      name: 'users-storage',
    }
  )
);