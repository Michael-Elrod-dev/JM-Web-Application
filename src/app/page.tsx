'use client';

import React from 'react';
import { Home, List, Star, User, Settings, Moon } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-8">
        <div className="text-white"><Home size={24} /></div>
        <div className="text-gray-500"><List size={24} /></div>
        <div className="text-gray-500"><Star size={24} /></div>
        <div className="text-gray-500"><User size={24} /></div>
        <div className="mt-auto text-gray-500"><Settings size={24} /></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">Remember Me</label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login</button>
          </form>
          <div className="mt-4">
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center">
              <span className="mr-2">G</span>
              Login with Google
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">or</div>
          <div className="mt-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Signup</button>
          </div>
          <div className="mt-4">
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center">
              <span className="mr-2">G</span>
              Signup with Google
            </button>
          </div>
        </div>
      </div>

      {/* Dark mode toggle */}
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
        <Moon size={24} />
      </button>
    </div>
  );
};

export default LoginPage;