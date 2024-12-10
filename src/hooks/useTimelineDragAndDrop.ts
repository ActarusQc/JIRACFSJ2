import { useState, useEffect, useCallback } from 'react';
import { useTicketStore } from '../store/ticketStore';
import { useStatusStore } from '../store/statusStore';
import { Ticket } from '../types';

interface DragState {
  ticketId: string | null;
  type: 'move' | 'resize' | null;
  initialX: number;
  initialDate: Date | null;
  initialEndDate: Date | null;
  initialStatus: string | null;
}

export const useTimelineDragAndDrop = (
  currentDate: Date,
  daysInView: Date[]
) => {
  const [dragState, setDragState] = useState<DragState>({
    ticketId: null,
    type: null,
    initialX: 0,
    initialDate: null,
    initialEndDate: null,
    initialStatus: null,
  });

  const updateTicket = useTicketStore((state) => state.updateTicket);
  const statuses = useStatusStore((state) => state.statuses);

  const getDateFromPosition = useCallback((clientX: number, containerRect: DOMRect) => {
    const dayWidth = containerRect.width / 7;
    const relativeX = clientX - containerRect.left;
    const dayIndex = Math.min(Math.max(Math.floor(relativeX / dayWidth), 0), 6);
    const date = new Date(daysInView[dayIndex]);
    return date;
  }, [daysInView]);

  const getStatusFromPosition = useCallback((clientY: number, containerRect: DOMRect) => {
    const statusHeight = 160; // Hauteur approximative d'une ligne de statut
    const relativeY = clientY - containerRect.top;
    const statusIndex = Math.floor(relativeY / statusHeight);
    return statuses[statusIndex]?.name || statuses[0].name;
  }, [statuses]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = document.querySelector('.timeline-container');
    if (!container || !dragState.initialDate || !dragState.ticketId) return;

    const containerRect = container.getBoundingClientRect();
    const newDate = getDateFromPosition(e.clientX, containerRect);
    const newStatus = getStatusFromPosition(e.clientY, containerRect);

    if (dragState.type === 'move' && dragState.initialEndDate) {
      const dateDiff = newDate.getTime() - dragState.initialDate.getTime();
      const newEndDate = new Date(dragState.initialEndDate.getTime() + dateDiff);
      updateTicket(dragState.ticketId, {
        startDate: newDate,
        endDate: newEndDate,
        status: newStatus,
      });
    } else if (dragState.type === 'resize') {
      updateTicket(dragState.ticketId, {
        endDate: newDate,
      });
    }
  }, [dragState, getDateFromPosition, getStatusFromPosition, updateTicket]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      ticketId: null,
      type: null,
      initialX: 0,
      initialDate: null,
      initialEndDate: null,
      initialStatus: null,
    });
  }, []);

  useEffect(() => {
    if (dragState.ticketId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.ticketId, handleMouseMove, handleMouseUp]);

  const handleDragStart = (
    e: React.MouseEvent,
    ticket: Ticket,
    type: 'move' | 'resize'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragState({
      ticketId: ticket.id,
      type,
      initialX: e.clientX,
      initialDate: ticket.startDate ? new Date(ticket.startDate) : null,
      initialEndDate: ticket.endDate ? new Date(ticket.endDate) : null,
      initialStatus: ticket.status,
    });
  };

  return {
    handleDragStart,
    isDragging: dragState.ticketId !== null,
  };
};