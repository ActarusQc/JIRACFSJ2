import React, { useState } from 'react';
import { useCategoryStore } from '../store/categoryStore';
import { useNotificationStore } from '../store/notificationStore';
import { Edit, Trash2 } from 'lucide-react';
import { CategoryEditForm } from './category/CategoryEditForm';
import { DeleteConfirmation } from './DeleteConfirmation';

export const CategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366F1' });
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addCategory(newCategory);
      setNewCategory({ name: '', color: '#6366F1' });
      addNotification('Catégorie créée avec succès', 'success');
    } catch (error) {
      addNotification('Erreur lors de la création de la catégorie', 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete !== null) {
      deleteCategory(categoryToDelete);
      addNotification('Catégorie supprimée avec succès', 'success');
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Gestion des catégories</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la catégorie
          </label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur
          </label>
          <input
            type="color"
            value={newCategory.color}
            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
            className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Ajouter une catégorie
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <div className="flex-1">
              <div className="font-medium">{category.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingCategory(category.id)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Modifier la catégorie"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCategoryToDelete(category.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Supprimer la catégorie"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCategory && (
        <CategoryEditForm
          categoryId={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {categoryToDelete !== null && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onCancel={() => setCategoryToDelete(null)}
          message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
        />
      )}
    </div>
  );
};