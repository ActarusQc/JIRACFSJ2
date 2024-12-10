import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTicketStore } from '../store/ticketStore';
import { TicketDetailsPopup } from './TicketDetailsPopup';
import type { Ticket } from '../types';

export const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const tickets = useTicketStore((state) => state.tickets);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredTickets = query ? tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(query.toLowerCase()) ||
      ticket.description.toLowerCase().includes(query.toLowerCase()) ||
      ticket.assignee?.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="relative">
      <div className={`flex items-center ${isExpanded ? 'w-64' : 'w-8'} transition-all duration-200`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <Search className="h-5 w-5" />
        </button>
        {isExpanded && (
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-2 pr-3 py-1 border-b-2 border-gray-200 focus:border-indigo-500 outline-none text-sm"
            autoFocus
          />
        )}
      </div>
      {isExpanded && query && (
        <div className="absolute mt-1 w-64 bg-white rounded-md shadow-lg max-h-60 overflow-auto z-10">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="font-medium">{ticket.title}</div>
                <div className="text-sm text-gray-500">{ticket.status}</div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">Aucun résultat trouvé</div>
          )}
        </div>
      )}

      {selectedTicket && (
        <TicketDetailsPopup
          ticket={selectedTicket}
          onClose={() => {
            setSelectedTicket(null);
            setQuery('');
            setIsExpanded(false);
          }}
        />
      )}
    </div>
  );
};