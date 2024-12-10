import React from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { Ticket } from '../types';
import { useProjectStore } from '../store/projectStore';
import { useCategoryStore } from '../store/categoryStore';
import { formatDate } from '../utils/dateUtils';
import { COLUMNS, PRIORITY_COLORS } from '../constants/kanban';

interface TicketDetailsPopupProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetailsPopup: React.FC<TicketDetailsPopupProps> = ({
  ticket,
  onClose,
}) => {
  const getProject = useProjectStore((state) => state.getProject);
  const categories = useCategoryStore((state) => state.categories);

  const project = ticket.projectId ? getProject(ticket.projectId) : null;
  const category = ticket.categoryId
    ? categories.find((c) => c.id === ticket.categoryId)
    : null;

  const getStatusLabel = (status: string) => {
    const column = COLUMNS.find((col) => col.id === status);
    return column ? column.title : status;
  };

  const getTicketStyle = () => {
    if (project) {
      return {
        borderColor: project.color,
        backgroundColor: `${project.color}10`,
      };
    }
    if (ticket.customColor) {
      return {
        borderColor: ticket.customColor,
        backgroundColor: `${ticket.customColor}10`,
      };
    }
    return {};
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {project ? `${project.name} - ${ticket.title}` : ticket.title}
            </h2>
            <div
              className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                !ticket.customColor && !project ? PRIORITY_COLORS[ticket.priority] : ''
              }`}
              style={getTicketStyle()}
            >
              {ticket.priority}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
            <p className="text-gray-600">{ticket.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Statut</h3>
              <p className="text-gray-600">{getStatusLabel(ticket.status)}</p>
            </div>
            {category && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </h3>
                <div className="flex items-center text-gray-600">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{category.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ticket.assignee && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Assigné à
                </h3>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>{ticket.assignee}</span>
                </div>
              </div>
            )}
            {(ticket.startDate || ticket.endDate) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Dates</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {ticket.startDate && formatDate(ticket.startDate)}
                    {ticket.startDate && ticket.endDate && ' - '}
                    {ticket.endDate && formatDate(ticket.endDate)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Date de création
            </h3>
            <p className="text-gray-600">
              {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};