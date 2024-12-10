import React, { useState } from 'react';
import { useStatusStore } from '../store/statusStore';
import { useNotificationStore } from '../store/notificationStore';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { StatusEditForm } from './status/StatusEditForm';
import { DeleteConfirmation } from './DeleteConfirmation';

export const StatusManagement: React.FC = () => {
  const [newStatus, setNewStatus] = useState({ name: '', color: '#6366F1' });
  const { statuses, addStatus, deleteStatus, reorderStatuses } = useStatusStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addStatus(newStatus);
      setNewStatus({ name: '', color: '#6366F1' });
      addNotification('Statut créé avec succès', 'success');
    } catch (error) {
      addNotification('Erreur lors de la création du statut', 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (statusToDelete !== null) {
      deleteStatus(statusToDelete);
      addNotification('Statut supprimé avec succès', 'success');
      setStatusToDelete(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const draggedStatus = statuses[draggedIndex];
    
    // Permettre le déplacement entre les statuts par défaut
    const draggedRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const draggedMiddle = draggedRect.top + draggedRect.height / 2;

    if (e.clientY < draggedMiddle && index < draggedIndex) {
      reorderStatuses(draggedIndex, index);
      setDraggedIndex(index);
    } else if (e.clientY > draggedMiddle && index > draggedIndex) {
      reorderStatuses(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Gestion des statuts</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du statut
          </label>
          <input
            type="text"
            value={newStatus.name}
            onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
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
            value={newStatus.color}
            onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
            className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Ajouter un statut
        </button>
      </form>

      <div className="space-y-2">
        {statuses.map((status, index) => (
          <div
            key={status.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between p-3 bg-gray-50 rounded-md cursor-move ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
            style={{ borderLeft: `4px solid ${status.color}` }}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">{status.name}</div>
                {status.isDefault && (
                  <div className="text-xs text-gray-500">Statut par défaut</div>
                )}
              </div>
            </div>
            {!status.isDefault && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingStatus(status.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Modifier le statut"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStatusToDelete(status.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer le statut"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingStatus && (
        <StatusEditForm
          statusId={editingStatus}
          onClose={() => setEditingStatus(null)}
        />
      )}

      {statusToDelete !== null && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onCancel={() => setStatusToDelete(null)}
          message="Êtes-vous sûr de vouloir supprimer ce statut ? Cette action est irréversible."
        />
      )}
    </div>
  );
};