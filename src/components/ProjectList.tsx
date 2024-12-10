import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTicketStore } from '../store/ticketStore';
import { formatDate } from '../utils/dateUtils';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useNotificationStore } from '../store/notificationStore';

export const ProjectList: React.FC = () => {
  const { projects, deleteProject } = useProjectStore();
  const { tickets, deleteTicket } = useTicketStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const getProjectProgress = (projectId: string) => {
    const projectTickets = tickets.filter((t) => t.projectId === projectId);
    if (projectTickets.length === 0) return 0;
    
    const completed = projectTickets.filter((t) => t.status === 'DONE').length;
    return Math.round((completed / projectTickets.length) * 100);
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProject(projectId);
    setIsEditing(false);
  };

  const handleEditProject = (projectId: string) => {
    setSelectedProject(projectId);
    setIsEditing(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      // Delete all tickets associated with the project
      tickets
        .filter(ticket => ticket.projectId === projectToDelete)
        .forEach(ticket => deleteTicket(ticket.id));
      
      // Delete the project
      deleteProject(projectToDelete);
      addNotification('Projet supprimé avec succès', 'success');
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const progress = getProjectProgress(project.id);
        
        return (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm p-4"
            style={{ borderLeft: `4px solid ${project.color}` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewProject(project.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Voir le projet"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditProject(project.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Modifier le projet"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setProjectToDelete(project.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer le projet"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              {project.startDate && formatDate(project.startDate)}
              {project.startDate && project.endDate && ' - '}
              {project.endDate && formatDate(project.endDate)}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {selectedProject && (
        <ProjectForm
          projectId={selectedProject}
          isEditing={isEditing}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {projectToDelete && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onCancel={() => setProjectToDelete(null)}
          message="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action supprimera également toutes les tâches associées au projet."
        />
      )}
    </div>
  );
};