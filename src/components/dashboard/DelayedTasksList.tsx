import React from 'react';
import { Ticket } from '../../types';
import { AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useProjectStore } from '../../store/projectStore';

interface DelayedTasksListProps {
  tasks: Ticket[];
  onTaskClick: (task: Ticket) => void;
}

export const DelayedTasksList: React.FC<DelayedTasksListProps> = ({ 
  tasks,
  onTaskClick
}) => {
  const getProject = useProjectStore((state) => state.getProject);

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        Aucune tâche en retard
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const project = task.projectId ? getProject(task.projectId) : null;
        return (
          <div
            key={task.id}
            className="bg-red-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-red-100 transition-colors"
            onClick={() => onTaskClick(task)}
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-red-900">
                {project ? `${project.name} - ${task.title}` : task.title}
              </div>
              <div className="text-sm text-red-700 mt-1">{task.description}</div>
              <div className="text-sm text-red-600 mt-2">
                Date limite : {task.endDate && formatDate(task.endDate)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};