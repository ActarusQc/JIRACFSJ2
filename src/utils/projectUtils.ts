import { Project, Ticket } from '../types';
import { normalizeDate } from './dateUtils';

export type ProjectStatus = 'early' | 'onTime' | 'late';

export interface ProjectProgress {
  completed: number;
  total: number;
  percentage: number;
  status: ProjectStatus;
  delayedTasks: Ticket[];
}

const calculateTaskProgress = (tasks: Ticket[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'Terminé').length;
  return Math.round((completed / tasks.length) * 100);
};

const getDelayedTasks = (tasks: Ticket[], currentDate: Date): Ticket[] => {
  return tasks.filter(task => 
    task.endDate && 
    task.status !== 'Terminé' &&
    normalizeDate(task.endDate) < currentDate
  );
};

const determineProjectStatus = (
  tasks: Ticket[],
  delayedTasks: Ticket[],
  percentage: number
): ProjectStatus => {
  const today = normalizeDate(new Date());
  const tasksWithEndDates = tasks.filter(t => t.endDate);
  
  // If there are no tasks with end dates, project is on time
  if (tasksWithEndDates.length === 0) return 'onTime';

  // Calculate expected progress based on task end dates
  const tasksDueByNow = tasksWithEndDates.filter(t => 
    normalizeDate(t.endDate!) <= today
  ).length;

  // If no tasks are due yet, project is on time
  if (tasksDueByNow === 0) return 'onTime';

  const expectedProgress = Math.round((tasksDueByNow / tasksWithEndDates.length) * 100);

  // If there are delayed tasks, the project is late
  if (delayedTasks.length > 0) return 'late';

  // Compare actual progress with expected progress
  if (percentage >= expectedProgress + 10) return 'early';
  if (percentage < expectedProgress - 10) return 'late';
  return 'onTime';
};

export const getProjectProgress = (
  project: Project,
  tickets: Ticket[]
): ProjectProgress => {
  const projectTickets = tickets.filter(t => t.projectId === project.id);
  const today = normalizeDate(new Date());

  // Basic progress calculations
  const total = projectTickets.length;
  const completed = projectTickets.filter(t => t.status === 'Terminé').length;
  const percentage = calculateTaskProgress(projectTickets);

  // Get delayed tasks
  const delayedTasks = getDelayedTasks(projectTickets, today);

  // Determine project status
  const status = determineProjectStatus(projectTickets, delayedTasks, percentage);

  return {
    completed,
    total,
    percentage,
    status,
    delayedTasks
  };
};