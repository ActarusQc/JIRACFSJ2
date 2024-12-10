import React from 'react';
import { X } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import { useUserStore } from '../../store/userStore';

interface ProjectTaskFormProps {
  onSubmit: (task: { 
    title: string; 
    description: string;
    startDate: string;
    endDate: string;
    categoryId?: number;
    assignee?: string;
  }) => void;
  onCancel: () => void;
  projectStartDate?: string;
  projectEndDate?: string;
}

export const ProjectTaskForm: React.FC<ProjectTaskFormProps> = ({ 
  onSubmit, 
  onCancel,
  projectStartDate,
  projectEndDate 
}) => {
  const categories = useCategoryStore((state) => state.categories);
  const users = useUserStore((state) => state.users);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    startDate: projectStartDate || '',
    endDate: projectEndDate || '',
    categoryId: undefined as number | undefined,
    assignee: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({ 
        title: '', 
        description: '', 
        startDate: projectStartDate || '',
        endDate: projectEndDate || '',
        categoryId: undefined,
        assignee: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg">
      <div className="space-y-3">
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
            rows={2}
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
              value={formData.assignee}
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
            onClick={onCancel}
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Ajouter la tâche
          </button>
        </div>
      </div>
    </form>
  );
};