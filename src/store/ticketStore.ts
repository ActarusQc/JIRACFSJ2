import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ticket } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TicketStore {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticket) =>
        set((state) => ({
          tickets: [
            ...state.tickets,
            { ...ticket, id: uuidv4(), createdAt: new Date() },
          ],
        })),
      updateTicket: (id, updates) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id ? { ...ticket, ...updates } : ticket
          ),
        })),
      deleteTicket: (id) =>
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        })),
    }),
    {
      name: 'tickets-storage',
    }
  )
);