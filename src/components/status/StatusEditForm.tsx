import React, { useState } from 'react';
import { useStatusStore } from '../../store/statusStore';
import { useNotificationStore } from '../../store/notificationStore';
import { X } from 'lucide-react';

interface StatusEditFormProps {
  statusId: number;
  onClose: () => void;
}

export const StatusEditForm: React.FC<StatusEditFormProps> = ({
  statusId,
  onClose,
}) => {
  const { statuses, updateStatus } = useStatusStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const status = statuses.find(s => s.id === statusId);
  
  const [formData, setFormData] = useState({
    name: status?.name || '',
    color: status?.color || '#6366F1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (status && !status.isDefault) {
        updateStatus(statusId, formData);
        addNotification('Statut mis à jour avec succès', 'success');
        onClose();
      }
    } catch (error) {
      addNotification('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  if (!status || status.isDefault) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifier le statut</h2>
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
              Nom du statut
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
            />
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