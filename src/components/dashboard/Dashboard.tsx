import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useTicketStore } from '../../store/ticketStore';
import { getProjectProgress } from '../../utils/projectUtils';
import { ProjectCard } from './ProjectCard';
import { DelayedTasksList } from './DelayedTasksList';
import { ProjectForm } from '../ProjectForm';
import { TicketDetailsPopup } from '../TicketDetailsPopup';
import type { Ticket } from '../../types';

export const Dashboard: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  const tickets = useTicketStore((state) => state.tickets);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);

  const projectsProgress = projects.map(project => ({
    project,
    progress: getProjectProgress(project, tickets)
  }));

  const allDelayedTasks = projectsProgress.reduce(
    (acc, { progress }) => [...acc, ...progress.delayedTasks],
    [] as typeof tickets
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Progression des projets</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projectsProgress.map(({ project, progress }) => (
              <ProjectCard
                key={project.id}
                project={project}
                progress={progress}
                onViewDetails={() => setSelectedProject(project.id)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tâches en retard</h2>
          <DelayedTasksList 
            tasks={allDelayedTasks}
            onTaskClick={setSelectedTicket}
          />
        </div>
      </div>

      {selectedProject && (
        <ProjectForm
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {selectedTicket && (
        <TicketDetailsPopup
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};