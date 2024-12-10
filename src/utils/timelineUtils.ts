import { Ticket } from '../types';

export const calculateTicketLevels = (tickets: Ticket[], days: Date[]) => {
  const ticketsByDay: { [key: string]: string[] } = {};
  const ticketSpans: { [key: string]: { start: number; end: number } } = {};
  const levels: { [key: string]: number } = {};
  const maxLevelByDay: { [key: string]: number } = {};

  tickets.forEach(ticket => {
    if (!ticket.startDate) return;

    const startDate = new Date(ticket.startDate);
    const endDate = ticket.endDate ? new Date(ticket.endDate) : new Date(startDate);
    const weekStart = days[0];

    const start = Math.max(
      0,
      Math.floor((startDate.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000))
    );
    const end = Math.min(
      days.length - 1,
      Math.floor((endDate.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000))
    );

    ticketSpans[ticket.id] = { start, end };

    for (let day = start; day <= end; day++) {
      const dayKey = `day-${day}`;
      if (!ticketsByDay[dayKey]) {
        ticketsByDay[dayKey] = [];
      }
      ticketsByDay[dayKey].push(ticket.id);
    }
  });

  const sortedTickets = tickets
    .filter(t => t.startDate)
    .sort((a, b) => {
      const aStart = new Date(a.startDate!).getTime();
      const bStart = new Date(b.startDate!).getTime();
      return aStart - bStart;
    });

  sortedTickets.forEach(ticket => {
    const span = ticketSpans[ticket.id];
    if (!span) return;

    let level = 0;
    let levelFound = false;

    while (!levelFound) {
      levelFound = true;
      for (let day = span.start; day <= span.end; day++) {
        const dayKey = `day-${day}`;
        const ticketsAtLevel = ticketsByDay[dayKey]
          .filter(id => levels[id] === level);

        if (ticketsAtLevel.length > 0) {
          levelFound = false;
          level++;
          break;
        }
      }
    }

    levels[ticket.id] = level;

    for (let day = span.start; day <= span.end; day++) {
      const dayKey = `day-${day}`;
      maxLevelByDay[dayKey] = Math.max(maxLevelByDay[dayKey] || 0, level);
    }
  });

  return { levels, maxLevelByDay };
};

export const calculateTicketPosition = (ticket: Ticket, days: Date[]) => {
  if (!ticket.startDate) return null;
  
  const startDate = new Date(ticket.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = ticket.endDate ? new Date(ticket.endDate) : new Date(startDate);
  endDate.setHours(23, 59, 59, 999);
  
  const weekStart = days[0];
  weekStart.setHours(0, 0, 0, 0);
  
  const start = Math.max(startDate.getTime(), weekStart.getTime());
  const end = Math.min(endDate.getTime(), days[days.length - 1].getTime());
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const startDay = Math.floor((start - weekStart.getTime()) / msPerDay);
  const endDay = Math.floor((end - weekStart.getTime()) / msPerDay);
  
  return {
    startColumn: startDay,
    span: endDay - startDay + 1
  };
};