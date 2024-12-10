import { useEffect } from 'react';
import { useTicketStore } from '../store/ticketStore';

export const useLocalStorage = () => {
  const tickets = useTicketStore((state) => state.tickets);

  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets);
      parsedTickets.forEach((ticket: any) => {
        ticket.createdAt = new Date(ticket.createdAt);
      });
      useTicketStore.setState({ tickets: parsedTickets });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);
};