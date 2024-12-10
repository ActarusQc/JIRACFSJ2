import React from 'react';
import { TicketCard } from './TicketCard';
import type { Ticket } from '../types';
import { Plus } from 'lucide-react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface KanbanColumnProps {
  title: string;
  status: string;
  color: string;
  tickets: Ticket[];
  onAddTicket?: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  color,
  tickets,
  onAddTicket,
}) => {
  const { handleDragOver, handleDrop } = useDragAndDrop();

  return (
    <div
      className="flex flex-col flex-shrink-0 w-80 bg-gray-100 rounded-lg"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
            {tickets.length}
          </span>
        </div>
        {onAddTicket && (
          <button
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            onClick={onAddTicket}
            title="Ajouter une carte"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
};