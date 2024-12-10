import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Status } from '../types';

interface StatusStore {
  statuses: Status[];
  addStatus: (status: Omit<Status, 'id'>) => void;
  updateStatus: (id: number, updates: Partial<Omit<Status, 'id'>>) => void;
  deleteStatus: (id: number) => void;
  reorderStatuses: (fromIndex: number, toIndex: number) => void;
  getStatuses: () => Status[];
}

export const useStatusStore = create<StatusStore>()(
  persist(
    (set, get) => ({
      statuses: [
        { id: 1, name: 'À faire', color: '#6366F1', isDefault: true },
        { id: 2, name: 'En cours', color: '#F59E0B', isDefault: true },
        { id: 3, name: 'Terminé', color: '#10B981', isDefault: true },
      ],
      addStatus: (statusData) =>
        set((state) => ({
          statuses: [
            ...state.statuses,
            {
              id: Math.max(...state.statuses.map((s) => s.id), 0) + 1,
              ...statusData,
              isDefault: false,
            },
          ],
        })),
      updateStatus: (id, updates) =>
        set((state) => ({
          statuses: state.statuses.map((status) =>
            status.id === id && !status.isDefault
              ? { ...status, ...updates }
              : status
          ),
        })),
      deleteStatus: (id) =>
        set((state) => ({
          statuses: state.statuses.filter(
            (status) => status.id !== id || status.isDefault
          ),
        })),
      reorderStatuses: (fromIndex, toIndex) =>
        set((state) => {
          const newStatuses = [...state.statuses];
          const [movedStatus] = newStatuses.splice(fromIndex, 1);
          newStatuses.splice(toIndex, 0, movedStatus);
          return { statuses: newStatuses };
        }),
      getStatuses: () => get().statuses,
    }),
    {
      name: 'statuses-storage',
    }
  )
);