'use client';

import React from 'react';
import SideNav from '../components/SideNav';
import { Calendar, Users, Star } from 'lucide-react';

interface JobRowProps {
  name: string;
  overdue: number;
  nextWeek: number;
  laterWeeks: number;
  total: number;
}

const DashboardHeader = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-3 flex space-x-4">
        <a href="#" className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">Overview</a>
        <a href="#" className="text-gray-500 hover:text-gray-900">Calendar</a>
        <a href="#" className="text-gray-500 hover:text-gray-900">Contacts</a>
      </div>
    </div>
  </header>
);

const JobRow: React.FC<JobRowProps> = ({ name, overdue, nextWeek, laterWeeks, total }) => (
  <div className="flex items-center border-b py-2">
    <input type="checkbox" className="mr-2" />
    <Star className="mr-2 text-gray-400" />
    <span className="w-32">{name}</span>
    <div className="flex-1 flex">
      <div className="bg-red-500" style={{ width: `${(overdue / total) * 100}%`, height: '20px' }}></div>
      <div className="bg-yellow-500" style={{ width: `${(nextWeek / total) * 100}%`, height: '20px' }}></div>
      <div className="bg-green-500" style={{ width: `${(laterWeeks / total) * 100}%`, height: '20px' }}></div>
    </div>
    <span className="ml-2">{total}</span>
  </div>
);

const Dashboard = () => {
  const jobs = [
    { name: 'Job Name', overdue: 4, nextWeek: 16, laterWeeks: 6, total: 26 },
    { name: 'Job Name', overdue: 2, nextWeek: 0, laterWeeks: 11, total: 13 },
    { name: 'Job Name', overdue: 3, nextWeek: 4, laterWeeks: 1, total: 8 },
    { name: 'Job Name', overdue: 0, nextWeek: 12, laterWeeks: 21, total: 33 },
    { name: 'Job Name', overdue: 0, nextWeek: 3, laterWeeks: 12, total: 15 },
    { name: 'Job Name', overdue: 4, nextWeek: 4, laterWeeks: 9, total: 17 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Jobs</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-2 text-sm font-medium text-gray-500">
                  <span className="w-32"></span>
                  <div className="flex-1 flex">
                    <span className="w-1/3 text-red-500">Overdue</span>
                    <span className="w-1/3 text-yellow-500">Next 7 Days</span>
                    <span className="w-1/3 text-green-500">&gt; 7 Days</span>
                  </div>
                </div>
                {jobs.map((job, index) => (
                  <JobRow key={index} {...job} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;