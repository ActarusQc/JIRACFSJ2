import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeekView } from './timeline/WeekView';
import { MonthView } from './timeline/MonthView';

interface TimelineProps {
  selectedProjectId: string | null;
}

export const Timeline: React.FC<TimelineProps> = ({ selectedProjectId }) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (viewMode === 'week') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(today.setDate(diff));
    }
    return new Date(today.setDate(1));
  });

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'week' ? 'month' : 'week';
    setViewMode(newMode);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newMode === 'week') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      setCurrentDate(new Date(today.setDate(diff)));
    } else {
      setCurrentDate(new Date(today.setDate(1)));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('next')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={toggleViewMode}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <CalendarDays className="w-4 h-4" />
          {viewMode === 'week' ? 'Vue mensuelle' : 'Vue hebdomadaire'}
        </button>
      </div>
      {viewMode === 'week' ? (
        <WeekView currentDate={currentDate} selectedProjectId={selectedProjectId} />
      ) : (
        <MonthView currentDate={currentDate} selectedProjectId={selectedProjectId} />
      )}
    </div>
  );
};