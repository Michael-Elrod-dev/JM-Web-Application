// components/DetailedJobView.tsx
"use client";

import React, { useState } from 'react';
import Timeline from './Timeline';
import HeaderTabs from './HeaderTabs';
import CardFrame from './CardFrame';

interface DetailedJobViewProps {
  jobName: string;
  dateRange: string;
  phases: {
    id: number;
    name: string;
    startWeek: number;
    endWeek: number;
    color: string;
  }[];
  currentWeek: number;
  totalWeeks: number;
  overdue: number;
  nextSevenDays: number;
  sevenDaysPlus: number;
}

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
  const total = overdue + nextSevenDays + sevenDaysPlus;

  const tabs = [
    { name: "Overview", href: "#" },
    { name: "Tasks", href: "#" },
    { name: "Materials", href: "#" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <CardFrame>
            <h3 className="text-lg font-semibold mb-2">Overview Content</h3>
            <p>This is the overview of the job.</p>
          </CardFrame>
        );
      case "Tasks":
        return (
          <CardFrame>
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <ul>
              <li>Task 1</li>
              <li>Task 2</li>
              <li>Task 3</li>
            </ul>
          </CardFrame>
        );
      case "Materials":
        return (
          <CardFrame>
            <h3 className="text-lg font-semibold mb-2">Materials</h3>
            <ul>
              <li>Material 1</li>
              <li>Material 2</li>
              <li>Material 3</li>
            </ul>
          </CardFrame>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{jobName}</h1>
          <span className="text-lg text-zinc-600 dark:text-zinc-400">{dateRange}</span>
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
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
};

export default DetailedJobView;