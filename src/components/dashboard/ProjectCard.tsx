import React from 'react';
import { Project, Ticket } from '../../types';
import { ProjectProgress } from '../../utils/projectUtils';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface ProjectCardProps {
  project: Project;
  progress: ProjectProgress;
  onViewDetails: () => void;
}

const statusConfig = {
  early: {
    icon: CheckCircle,
    text: 'En avance',
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  onTime: {
    icon: Clock,
    text: 'Dans les temps',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  late: {
    icon: AlertTriangle,
    text: 'En retard',
    color: 'text-red-600',
    bg: 'bg-red-50'
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  progress,
  onViewDetails
}) => {
  const StatusIcon = statusConfig[progress.status].icon;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onViewDetails}
      style={{ borderLeft: `4px solid ${project.color}` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full ${statusConfig[progress.status].bg} ${statusConfig[progress.status].color}`}>
          <StatusIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{statusConfig[progress.status].text}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm text-gray-500">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tâches terminées</span>
          <span className="font-medium text-gray-700">
            {progress.completed} / {progress.total}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tâches en retard</span>
          <span className="font-medium text-red-600">
            {progress.delayedTasks.length}
          </span>
        </div>
        {(project.startDate || project.endDate) && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Période</span>
            <span className="font-medium text-gray-700">
              {project.startDate && formatDate(project.startDate)}
              {project.startDate && project.endDate && ' - '}
              {project.endDate && formatDate(project.endDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};