export const COLUMNS = [
  { id: 'TODO' as const, title: 'À faire' },
  { id: 'IN_PROGRESS' as const, title: 'En cours' },
  { id: 'DONE' as const, title: 'Terminé' },
];

export const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
} as const;

export const TIMELINE_COLORS = {
  LOW: 'bg-blue-50 border-blue-500',
  MEDIUM: 'bg-yellow-50 border-yellow-500',
  HIGH: 'bg-red-50 border-red-500',
} as const;