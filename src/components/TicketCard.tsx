import React, { useState } from 'react';
import { Ticket } from '../types';
import { AlertCircle, Calendar, Clock, MoreVertical, Trash, Eye } from 'lucide-react';
import { PRIORITY_COLORS } from '../constants/kanban';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { TicketForm } from './TicketForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { TicketDetailsPopup } from './TicketDetailsPopup';
import { useTicketStore } from '../store/ticketStore';
import { useProjectStore } from '../store/projectStore';
import { useNotificationStore } from '../store/notificationStore';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { handleDragStart } = useDragAndDrop();
  const deleteTicket = useTicketStore((state) => state.deleteTicket);
  const getProject = useProjectStore((state) => state.getProject);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const project = ticket.projectId ? getProject(ticket.projectId) : null;

  const handleDelete = () => {
    deleteTicket(ticket.id);
    addNotification('Ticket deleted successfully', 'success');
    setShowDeleteConfirm(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTicketStyle = () => {
    if (project) {
      return {
        borderColor: project.color,
        backgroundColor: `${project.color}10`
      };
    }
    if (ticket.customColor) {
      return {
        borderColor: ticket.customColor,
        backgroundColor: `${ticket.customColor}10`
      };
    }
    return {};
  };

  return (
    <>
      <div
        id={ticket.id}
        draggable
        onDragStart={(e) => handleDragStart(e, ticket.id)}
        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group border-l-4"
        style={getTicketStyle()}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              !ticket.customColor && !project ? PRIORITY_COLORS[ticket.priority] : ''
            }`}
            style={project ? {
              backgroundColor: `${project.color}20`,
              color: project.color
            } : ticket.customColor ? {
              backgroundColor: `${ticket.customColor}20`,
              color: ticket.customColor
            } : {}}
          >
            {ticket.priority}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowActions(false);
                        setShowEditForm(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <h4 className="font-medium text-gray-900 mb-2">
          {project ? `${project.name} - ${ticket.title}` : ticket.title}
        </h4>
        <p className="text-sm text-gray-500 mb-4">{ticket.description}</p>
        <div className="space-y-2">
          {(ticket.startDate || ticket.endDate) && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {ticket.startDate && formatDate(ticket.startDate)}
                {ticket.startDate && ticket.endDate && ' - '}
                {ticket.endDate && formatDate(ticket.endDate)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.assignee && (
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{ticket.assignee}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {showEditForm && (
        <TicketForm
          initialData={ticket}
          onClose={() => setShowEditForm(false)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {showDetails && (
        <TicketDetailsPopup
          ticket={ticket}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};