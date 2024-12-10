import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useNotificationStore } from '../store/notificationStore';
import { Edit, Trash2 } from 'lucide-react';
import { UserEditForm } from './user/UserEditForm';
import { DeleteConfirmation } from './DeleteConfirmation';

export const UserManagement: React.FC = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const { users, addUser, deleteUser } = useUserStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addUser(newUser);
      setNewUser({ name: '', email: '' });
      addNotification('Utilisateur créé avec succès', 'success');
    } catch (error) {
      addNotification('Erreur lors de la création de l\'utilisateur', 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete !== null) {
      deleteUser(userToDelete);
      addNotification('Utilisateur supprimé avec succès', 'success');
      setUserToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Ajouter un utilisateur
        </button>
      </form>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingUser(user.id)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Modifier l'utilisateur"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setUserToDelete(user.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Supprimer l'utilisateur"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <UserEditForm
          userId={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {userToDelete !== null && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUserToDelete(null)}
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        />
      )}
    </div>
  );
};