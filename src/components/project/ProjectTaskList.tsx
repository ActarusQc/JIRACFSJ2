import React from 'react';
import { X, Plus, Calendar, User, Tag, Edit } from 'lucide-react';
import { ProjectTaskForm } from './ProjectTaskForm';
import { TaskEditForm } from './TaskEditForm';
import { formatDate } from '../../utils/dateUtils';
import { useCategoryStore } from '../../store/categoryStore';

interface Task {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  categoryId?: number;
  assignee?: string;
}

interface ProjectTaskListProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onRemoveTask: (index: number) => void;
  onUpdateTask?: (index: number, task: Task) => void;
  projectName: string;
  projectColor: string;
  projectStartDate?: string;
  projectEndDate?: string;
  readOnly?: boolean;
}

export const ProjectTaskList: React.FC<ProjectTaskListProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  projectName,
  projectColor,
  projectStartDate,
  projectEndDate,
  readOnly = false
}) => {
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = React.useState<number | null>(null);
  const categories = useCategoryStore((state) => state.categories);

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    return category?.name;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Tâches du projet</h3>
        {!readOnly && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter une tâche
          </button>
        )}
      </div>

      {showTaskForm && (
        <div className="mb-4">
          <ProjectTaskForm
            onSubmit={(task) => {
              onAddTask(task);
              setShowTaskForm(false);
            }}
            onCancel={() => setShowTaskForm(false)}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
          />
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-md flex justify-between items-start"
            style={{ borderLeft: `4px solid ${projectColor}` }}
          >
            <div className="flex-1">
              <div className="font-medium">
                {projectName ? `${projectName} - ${task.title}` : task.title}
              </div>
              <div className="text-sm text-gray-500 mb-2">{task.description}</div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                {(task.startDate || task.endDate) && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {task.startDate && formatDate(new Date(task.startDate))}
                      {task.startDate && task.endDate && ' - '}
                      {task.endDate && formatDate(new Date(task.endDate))}
                    </span>
                  </div>
                )}
                {task.assignee && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{task.assignee}</span>
                  </div>
                )}
                {task.categoryId && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{getCategoryName(task.categoryId)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!readOnly && (
                <button
                  onClick={() => setEditingTaskIndex(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {!readOnly && (
                <button
                  onClick={() => onRemoveTask(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingTaskIndex !== null && onUpdateTask && (
        <TaskEditForm
          task={tasks[editingTaskIndex]}
          onSubmit={(updatedTask) => {
            onUpdateTask(editingTaskIndex, updatedTask);
            setEditingTaskIndex(null);
          }}
          onClose={() => setEditingTaskIndex(null)}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
        />
      )}
    </div>
  );
};