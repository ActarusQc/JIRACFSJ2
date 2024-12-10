import React from 'react';
import { Ticket } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { TIMELINE_COLORS } from '../../constants/kanban';

interface TimelineTicketProps {
  ticket: Ticket;
  style: React.CSSProperties;
  onDragStart: (e: React.MouseEvent, ticket: Ticket, type: 'move' | 'resize') => void;
  isDragging: boolean;
  getStatusLabel: (status: string) => string;
}

export const TimelineTicket: React.FC<TimelineTicketProps> = ({
  ticket,
  style,
  onDragStart,
  isDragging,
  getStatusLabel,
}) => {
  const getProject = useProjectStore((state) => state.getProject);
  const project = ticket.projectId ? getProject(ticket.projectId) : null;

  const getTicketStyle = () => {
    if (project) {
      return {
        backgroundColor: `${project.color}20`,
        borderLeftColor: project.color
      };
    }
    if (ticket.customColor) {
      return {
        backgroundColor: `${ticket.customColor}20`,
        borderLeftColor: ticket.customColor
      };
    }
    return {};
  };

  const getTicketTitle = () => {
    return project ? `${project.name} - ${ticket.title}` : ticket.title;
  };

  return (
    <div
      className="absolute h-[32px] pointer-events-auto"
      style={style}
    >
      <div
        className={`mx-1 h-full border-l-4 rounded-r-lg cursor-move select-none ${
          !ticket.customColor && !ticket.projectId ? TIMELINE_COLORS[ticket.priority] : ''
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={getTicketStyle()}
        onMouseDown={(e) => onDragStart(e, ticket, 'move')}
      >
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium truncate">
            {getTicketTitle()}
          </div>
          <div className="text-[10px] text-gray-500 truncate">
            {getStatusLabel(ticket.status)}
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => onDragStart(e, ticket, 'resize')}
        >
          <div className="w-1 h-4 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};