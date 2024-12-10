import React from 'react';
import { useProjectStore } from '../store/projectStore';

interface ProjectFilterProps {
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string | null) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  selectedProjectId,
  onProjectSelect,
}) => {
  const projects = useProjectStore((state) => state.projects);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onProjectSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedProjectId === null
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tous les projets
      </button>
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectSelect(project.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedProjectId === project.id
              ? 'text-white'
              : 'bg-opacity-20 hover:bg-opacity-30'
          }`}
          style={{
            backgroundColor: selectedProjectId === project.id 
              ? project.color 
              : `${project.color}20`,
            color: selectedProjectId === project.id 
              ? 'white' 
              : project.color,
          }}
        >
          {project.name}
        </button>
      ))}
    </div>
  );
};