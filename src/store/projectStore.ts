import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (projectData) => {
        const id = uuidv4();
        set((state) => ({
          projects: [
            ...state.projects,
            { ...projectData, id, createdAt: new Date() },
          ],
        }));
        return id;
      },
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      getProject: (id) => get().projects.find((p) => p.id === id),
    }),
    {
      name: 'projects-storage',
    }
  )
);