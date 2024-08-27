// components/Settings.tsx
'use client';
import React from 'react';

const SettingsHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
};

const SettingsForm: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" id="name" defaultValue="Joey Markowski" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" id="phone" defaultValue="870-213-5683" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="email" defaultValue="joeymarkowski@hotmail.com" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md shadow-sm hover:bg-green-600 transition duration-300 mb-3">Update</button>
        <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-300 mb-3">Change Password</button>
        <button type="button" className="w-full bg-red-500 text-white py-2 rounded-md shadow-sm hover:bg-red-600 transition duration-300">Logout</button>
      </form>
    </div>
  );
};

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SettingsHeader title="Settings" />
      <main className="flex-1 flex justify-center items-center">
        <SettingsForm />
      </main>
    </div>
  );
};

export default Settings;