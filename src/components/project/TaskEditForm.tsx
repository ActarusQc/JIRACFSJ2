import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import { useUserStore } from '../../store/userStore';

interface Task {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  categoryId?: number;
  assignee?: string;
}

interface TaskEditFormProps {
  task: Task;
  onSubmit: (task: Task) => void;
  onClose: () => void;
  projectStartDate?: string;
  projectEndDate?: string;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onSubmit,
  onClose,
  projectStartDate,
  projectEndDate
}) => {
  const categories = useCategoryStore((state) => state.categories);
  const users = useUserStore((state) => state.users);
  
  const [formData, setFormData] = useState<Task>({
    title: task.title,
    description: task.description,
    startDate: task.startDate,
    endDate: task.endDate,
    categoryId: task.categoryId,
    assignee: task.assignee
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifier la tâche</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la tâche
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={formData.startDate}
                min={projectStartDate}
                max={projectEndDate || formData.endDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || projectStartDate}
                max={projectEndDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  categoryId: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Aucune catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigné à
              </label>
              <select
                value={formData.assignee || ''}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Non assigné</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};