// components/new/ClientSearch.tsx
import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

interface Client {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface Props {
  onClientSelect: (client: Client | null) => void;
}

export default function ClientSearchSelect({ onClientSelect }: Props) {
  const [search, setSearch] = useState('');
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all clients on component mount
  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/clients');
        const data = await response.json();
        setAllClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClients();
  }, []);

  // Filter clients based on search input
  useEffect(() => {
    if (search.trim()) {
      const filtered = allClients.filter(client => 
        client.user_name.toLowerCase().includes(search.toLowerCase()) ||
        client.user_email.toLowerCase().includes(search.toLowerCase()) ||
        client.user_phone.includes(search)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(allClients);
    }
  }, [search, allClients]);

  return (
    <div className="flex-grow h-[64px]">
      <label className="block text-sm font-medium text-zinc-700 dark:text-white">Select Client</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2 text-zinc-900"
          placeholder="Search clients..."
        />
        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400">
            Loading...
          </div>
        )}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client.user_id}
                  className="px-4 py-2 hover:bg-zinc-100 cursor-pointer"
                  onClick={() => {
                    onClientSelect(client);
                    setSearch(client.user_name);
                    setIsOpen(false);
                  }}
                >
                  {client.user_name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-zinc-500">No clients found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}