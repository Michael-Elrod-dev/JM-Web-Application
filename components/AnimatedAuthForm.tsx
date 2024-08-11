'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AnimatedAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle authentication
    // For this example, we'll just navigate to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className={`bg-white p-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isLogin ? 'w-96' : 'w-96 h-auto'}`}>
        <h2 className="text-3xl font-extrabold mb-6 text-center">{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit} className={`transition-all duration-300 ease-in-out ${isLogin ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          {/* Login Form */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember Me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-300">Login</button>
        </form>

        <form onSubmit={handleSubmit} className={`transition-all duration-300 ease-in-out ${isLogin ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          {/* Signup Form */}
          <div className="mb-4">
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" id="signup-email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="signup-password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" id="confirm-password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex mb-4 space-x-4">
            <div className="flex-1">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" id="first-name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" id="last-name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-300">Create Account</button>
        </form>

        <div className="mt-4">
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition duration-300">
            <Image src="/logo.png" alt="Google" width={20} height={20} className="mr-2" />
            {isLogin ? 'Login with Google' : 'Signup with Google'}
          </button>
        </div>
        <div className="text-center my-2 text-sm text-gray-500">or</div>
        <button 
          onClick={toggleForm}
          className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-300"
        >
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
};

export default AnimatedAuthForm;