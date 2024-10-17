'use client';

import React, { useState } from 'react';
import ContactCard from '../../components/ContactCard';
import { contacts } from '../../data/contactsData';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">Contacts</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredContacts.map((contact) => (
        <ContactCard key={contact.id} {...contact} />
      ))}
    </div>
  );
}