// components/DetailedJobView.tsx
"use client";

import React, { useState } from 'react';
import Timeline from './Timeline';
import HeaderTabs from './HeaderTabs';
import CardFrame from './CardFrame';
import PhaseCard from './PhaseCard';
import ContactCard from './ContactCard';
import TasksCard from './TasksCard';
import MaterialsCard from './MaterialsCard';
import { Job } from '../data/jobsData';

interface DetailedJobViewProps extends Job {}

// Fake contact data
const fakeContacts = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '456-789-0123' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '567-890-1234' },
];

const DetailedJobView: React.FC<DetailedJobViewProps> = ({
  jobName,
  dateRange,
  phases,
  currentWeek,
  totalWeeks,
  overdue,
  nextSevenDays,
  sevenDaysPlus,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const total = overdue + nextSevenDays + sevenDaysPlus;

  const tabs = [
    { name: "Overview", href: "#" },
    { name: "My Items", href: "#" },
    { name: "Tasks", href: "#" },
    { name: "Materials", href: "#" },
    { name: "Contacts", href: "#" },
  ];

  const renderPhaseCards = () => {
    return phases.map((phase) => (
      <PhaseCard
        key={phase.id}
        phase={phase}
        showTasks={activeTab === "Overview" || activeTab === "My Items" || activeTab === "Tasks"}
        showMaterials={activeTab === "Overview" || activeTab === "My Items" || activeTab === "Materials"}
      />
    ));
  };

  const renderContacts = () => {
    const filteredContacts = fakeContacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );

    return (
      <>
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
          <ContactCard
            key={contact.id}
            id={contact.id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
          />
        ))}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{jobName}</h1>
          <span className="text-lg">{dateRange}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <CardFrame>
          <Timeline 
            phases={phases} 
            currentWeek={currentWeek} 
            totalWeeks={totalWeeks} 
            startDate={dateRange.split(' - ')[0]} 
            endDate={dateRange.split(' - ')[1]}
          />
        </CardFrame>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Status</h2>
        <CardFrame>
          <div className="flex items-center justify-center space-x-8 mb-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Overdue</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
              <span>Next 7 days</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span>&gt; 7 days</span>
            </div>
          </div>
          <div className="relative h-6">
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
              <div 
                className="bg-red-500 flex items-center justify-center" 
                style={{width: `${(overdue / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{overdue}</span>
              </div>
              <div 
                className="bg-yellow-500 flex items-center justify-center" 
                style={{width: `${(nextSevenDays / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{nextSevenDays}</span>
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center" 
                style={{width: `${(sevenDaysPlus / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{sevenDaysPlus}</span>
              </div>
            </div>
          </div>
        </CardFrame>
      </section>

      <section className="mb-8">
        <HeaderTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {activeTab === "Contacts" ? renderContacts() : renderPhaseCards()}
        </div>
      </section>
    </div>
  );
};

export default DetailedJobView;