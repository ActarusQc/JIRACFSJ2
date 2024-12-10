import { useTicketStore } from '../store/ticketStore';
import type { Ticket } from '../types';

export const useDragAndDrop = () => {
  const updateTicket = useTicketStore((state) => state.updateTicket);

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Ticket['status']) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    updateTicket(ticketId, { status });
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};