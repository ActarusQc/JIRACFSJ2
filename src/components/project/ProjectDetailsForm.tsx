import React from 'react';

interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
}

interface ProjectDetailsFormProps {
  data: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
  readOnly?: boolean;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Détails du projet</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              readOnly ? 'bg-gray-50' : ''
            }`}
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              readOnly ? 'bg-gray-50' : ''
            }`}
            rows={3}
            readOnly={readOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange({ ...data, startDate: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                readOnly ? 'bg-gray-50' : ''
              }`}
              readOnly={readOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={data.endDate}
              min={data.startDate}
              onChange={(e) => onChange({ ...data, endDate: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                readOnly ? 'bg-gray-50' : ''
              }`}
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur
          </label>
          <input
            type="color"
            value={data.color}
            onChange={(e) => onChange({ ...data, color: e.target.value })}
            className={`w-full h-10 px-1 py-1 border border-gray-300 rounded-md ${
              readOnly ? 'opacity-50' : ''
            }`}
            disabled={readOnly}
          />
        </div>
      </form>
    </div>
  );
};