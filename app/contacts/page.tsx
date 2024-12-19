// app/contacts/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import ContactCard from "@/components/ContactCard";
import { User } from "@/app/types/database";
import { fetchUsers } from "@/app/utils/api";

type FilterType = "all" | "workers" | "clients";

export default function ContactsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.user_first_name} ${user.user_last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeFilter) {
      case "clients":
        return user.user_type === "Client" && matchesSearch;
      case "workers":
        return user.user_type !== "Client" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  if (loading)
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-48 mb-6"></div>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1">
      <header className="sticky top-0 z-10 transition-all bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold">Contacts</h1>
            <div className="flex gap-2">
              {(["all", "workers", "clients"] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors 
                    ${
                      activeFilter === filter
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 pb-6 sm:px-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No contacts found matching your search.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <ContactCard
                  key={user.user_id}
                  user_id={user.user_id}
                  user_first_name={user.user_first_name}
                  user_last_name={user.user_last_name}
                  user_email={user.user_email}
                  user_phone={user.user_phone || ""}
                  showCheckbox={false}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
