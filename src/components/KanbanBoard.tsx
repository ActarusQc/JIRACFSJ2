import React, { useState } from 'react';
import { useTicketStore } from '../store/ticketStore';
import { useStatusStore } from '../store/statusStore';
import { KanbanColumn } from './KanbanColumn';
import { TicketForm } from './TicketForm';
import { Timeline } from './Timeline';

interface KanbanBoardProps {
  viewMode: 'timeline' | 'board';
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ viewMode }) => {
  const [showForm, setShowForm] = useState(false);
  const tickets = useTicketStore((state) => state.tickets);
  const statuses = useStatusStore((state) => state.statuses);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {viewMode === 'timeline' ? (
        <Timeline selectedProjectId={null} />
      ) : (
        <div className="flex-1 min-h-0 overflow-x-auto">
          <div className="flex gap-4 p-4 h-full">
            {statuses.map((status) => (
              <KanbanColumn
                key={status.id}
                title={status.name}
                status={status.name}
                color={status.color}
                tickets={tickets.filter((ticket) => ticket.status === status.name)}
                onAddTicket={status.name === 'À faire' ? () => setShowForm(true) : undefined}
              />
            ))}
          </div>
        </div>
      )}
      
      {showForm && <TicketForm onClose={() => setShowForm(false)} />}
    </div>
  );
};