// app/settings/page.tsx
'use client';

import React from 'react';

const SettingsHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

const SettingsForm: React.FC = () => {
  const getInputClassName = (fieldName: string) => {
    const baseClass = "mt-1 block w-full border rounded-md shadow-sm p-2";
    const normalClass = "border-zinc-300";
    const darkModeClass = "dark:bg-zinc-800 dark:text-white dark:border-zinc-600";
    
    return `${baseClass} ${normalClass} ${darkModeClass}`.trim();
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-700 dark:text-white">Contact Information</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-white mb-1">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            placeholder="Joey"
            className={getInputClassName('firstName')}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-white mb-1">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            placeholder="Markowski"
            className={getInputClassName('lastName')}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-white mb-1">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            placeholder="870-213-5683"
            className={getInputClassName('phone')}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-white mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="joeymarkowski@hotmail.com"
            className={getInputClassName('email')}
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md shadow-sm hover:bg-green-600 transition duration-300 mb-3 font-bold">Update</button>
        <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-300 mb-3 font-bold">Change Password</button>
        <button type="button" className="w-full bg-red-500 text-white py-2 rounded-md shadow-sm hover:bg-red-600 transition duration-300 font-bold">Logout</button>
      </form>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SettingsHeader title="Settings" />
      <main className="flex-1 flex justify-center items-center">
        <SettingsForm />
      </main>
    </div>
  );
}