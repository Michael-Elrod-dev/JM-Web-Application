// components/new/ClientSearch.tsx
import React, { useState, useEffect } from "react";
import { User } from "../../app/types/database";

interface Props {
  onClientSelect: (client: User | null) => void;
}

export default function ClientSearchSelect({ onClientSelect }: Props) {
  const [search, setSearch] = useState("");
  const [allClients, setAllClients] = useState<User[]>([]);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all clients on component mount
  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/clients");
        const data = await response.json();
        setAllClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClients();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = document.getElementById(
        "client-search-container"
      );
      if (searchContainer && !searchContainer.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter clients based on search input
  useEffect(() => {
    if (search.trim()) {
      const filtered = allClients.filter(
        (client) =>
          client.user_name.toLowerCase().includes(search.toLowerCase()) ||
          client.user_email.toLowerCase().includes(search.toLowerCase()) ||
          (client.user_phone && client.user_phone.includes(search))
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(allClients);
    }
  }, [search, allClients]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div id="client-search-container" className="flex-grow h-[64px] relative">
      <label className="block text-sm font-medium text-zinc-700 dark:text-white">
        Select Client
      </label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
          placeholder="Search clients..."
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400">
            Loading...
          </div>
        )}

        {isOpen && (
          <div
            className="absolute w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-lg max-h-32 overflow-auto z-50"
            role="listbox"
          >
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client.user_id}
                  className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                  onClick={() => {
                    onClientSelect(client);
                    setSearch(client.user_name);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={search === client.user_name}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{client.user_name}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {client.user_email}
                    </span>
                    {client.user_phone && (
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {client.user_phone}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                No clients found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
