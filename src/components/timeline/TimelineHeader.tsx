import React from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineHeaderProps {
  viewMode: 'week' | 'month';
  onNavigate: (direction: 'prev' | 'next') => void;
  onToggleViewMode: () => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  viewMode,
  onNavigate,
  onToggleViewMode,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={onToggleViewMode}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <CalendarDays className="w-4 h-4" />
        {viewMode === 'week' ? 'Vue mensuelle' : 'Vue hebdomadaire'}
      </button>
    </div>
  );
};