// app/contacts/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ContactCard from '@/components/ContactCard';
import { AppUser } from '@/app/types/app_users';
import { fetchUsers } from '@/app/utils/api';

export default function ContactsPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        // console.log('Fetched users:', data);
        setUsers(data);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex-1 px-6 py-4">
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-48 mb-6"></div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 px-6 py-4">
      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-zinc-800"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          No contacts found matching your search.
        </div>
      ) : (
        filteredUsers.map((user) => (
          <ContactCard key={user.user_id} {...user} />
        ))
      )}
    </div>
  );
}