'use client';

import React, { useState, useEffect } from 'react';
import HeaderTabs from './HeaderTabs';

interface JobData {
  id: string;
  name: string;
  overdue: number;
  nextWeek: number;
  laterWeeks: number;
}

const Header: React.FC<{ title: string; tabs: { name: string; href: string }[]; activeTab: string; setActiveTab: (tabName: string) => void }> = ({ title, tabs, activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {!isScrolled && <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>}
        <HeaderTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </header>
  );
};

const JobFrame: React.FC<JobData> = ({ name, overdue, nextWeek, laterWeeks }) => {
  const total = overdue + nextWeek + laterWeeks;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:p-6 flex items-center">
        <input type="checkbox" className="mr-4" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mr-4">{name}</h3>
        </div>
        <div className="flex-1 flex">
          <div className="bg-red-500 flex justify-center items-center text-white" style={{ width: `${(overdue / total) * 100}%`, height: '20px' }}>
            {overdue}
          </div>
          <div className="bg-yellow-500 flex justify-center items-center text-white" style={{ width: `${(nextWeek / total) * 100}%`, height: '20px' }}>
            {nextWeek}
          </div>
          <div className="bg-green-500 flex justify-center items-center text-white" style={{ width: `${(laterWeeks / total) * 100}%`, height: '20px' }}>
            {laterWeeks}
          </div>
        </div>
        <span className="ml-4">{total}</span>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ jobs: JobData[] }> = ({ jobs }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Jobs</h2>
    {jobs.map((job) => (
      <JobFrame key={job.id} {...job} />
    ))}
  </div>
);

const CalendarTab: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Calendar</h2>
    <p>Calendar content goes here.</p>
  </div>
);

const ContactsTab: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacts</h2>
    <p>Contacts content goes here.</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [jobs, setJobs] = useState<JobData[]>([]);

  useEffect(() => {
    // Simulating fetching data from a database
    const fetchJobs = async () => {
      // Replace this with your actual data fetching logic
      const data: JobData[] = [
        { id: '1', name: 'Job 1', overdue: 4, nextWeek: 16, laterWeeks: 6 },
        { id: '2', name: 'Job 2', overdue: 2, nextWeek: 0, laterWeeks: 11 },
        { id: '3', name: 'Job 3', overdue: 3, nextWeek: 4, laterWeeks: 1 },
        { id: '4', name: 'Job 4', overdue: 0, nextWeek: 12, laterWeeks: 21 },
        { id: '5', name: 'Job 5', overdue: 0, nextWeek: 3, laterWeeks: 12 },
        { id: '6', name: 'Job 6', overdue: 4, nextWeek: 4, laterWeeks: 9 },
      ];
      setJobs(data);
    };

    fetchJobs();
  }, []);

  const headerTabs = [
    { name: 'Overview', href: '#' },
    { name: 'Calendar', href: '#' },
    { name: 'Contacts', href: '#' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab jobs={jobs} />;
      case 'Calendar':
        return <CalendarTab />;
      case 'Contacts':
        return <ContactsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <Header title="Dashboard" tabs={headerTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;