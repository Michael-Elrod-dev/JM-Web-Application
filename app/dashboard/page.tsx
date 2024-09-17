// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import HeaderTabs from '../../components/HeaderTabs';
import JobFrame from '../../components/JobFrame';
import ContactCard from '../../components/ContactCard';

interface JobData {
  id: string;
  name: string;
  overdue: number;
  nextWeek: number;
  laterWeeks: number;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
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
        {!isScrolled && <h1 className="text-3xl font-bold mb-3">{title}</h1>}
        <HeaderTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </header>
  );
};

const OverviewTab: React.FC<{ jobs: JobData[] }> = ({ jobs }) => (
  <div>
    <div className="flex justify-center items-center space-x-6 mb-6">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-500 mr-2"></div>
        <span className="">Overdue</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
        <span className="">&gt; 7 days</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 mr-2"></div>
        <span className="">Next 7 days</span>
      </div>
    </div>
    {jobs.map((job) => (
      <JobFrame key={job.id} {...job} />
    ))}
  </div>
);

const CalendarTab: React.FC = () => (
  <div className="h-screen">
    <iframe
      src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=YOUR_TIMEZONE"
      style={{ border: 0 }}
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
    ></iframe>
  </div>
);

const ContactsTab: React.FC = () => {
  const [contacts, setContacts] = useState<ContactData[]>([]);

  useEffect(() => {
    // Simulating fetching data from a database
    const fetchContacts = async () => {
      // Replace this with your actual data fetching logic
      const data: ContactData[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(123) 456-7890' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '(234) 567-8901' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '(345) 678-9012' },
      ];
      setContacts(data);
    };

    fetchContacts();
  }, []);

  return (
    <div>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} {...contact} />
      ))}
    </div>
  );
};

export default function DashboardPage() {
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
    <div className="flex min-h-screen">
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
}