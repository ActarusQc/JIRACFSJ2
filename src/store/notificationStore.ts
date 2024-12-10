import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '../types';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: uuidv4(),
          message,
          type,
          createdAt: new Date(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));