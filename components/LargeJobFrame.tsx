"use client";

import React from 'react';
import Link from 'next/link';
import PieChart from './PieChart';
import Timeline from './Timeline';

interface Phase {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
}

interface JobProps {
  id: number;
  jobName: string;
  dateRange: string;
  currentWeek: number;
  phases: Phase[];
  overdue: number;
  sevenDaysPlus: number;
  nextSevenDays: number;
  tasks: string[];
  materials: string[];
  workers: string[];
}

const LargeJobFrame: React.FC<JobProps> = (props) => {
  const renderDropdown = (label: string, items: string[]) => (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1 text-zinc-700 dark:text-white">{label}</label>
      <div className="relative">
        <select className="block appearance-none w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline dark:text-white">
          {items.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg className="fill-current h-4 w-4 text-zinc-500 dark:text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );

  // Get the actual start and end dates from the phases
  const startDate = props.phases[0]?.startDate;
  const endDate = props.phases[props.phases.length - 1]?.endDate;

  console.log('Job Date Range:', {
    startDate,
    endDate,
    phases: props.phases
  });

  // Calculate the required height for the timeline
  const timelineHeight = 20 + props.phases.length * 28;

  return (
    <div className="bg-white dark:bg-zinc-800 shadow-md overflow-hidden sm:rounded-lg mb-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold mr-4">{props.jobName}</h2>
          <p className="text-lg text-zinc-600 dark:text-white/70">{props.dateRange}</p>
        </div>
        <Link 
          href={`/jobs/${props.id}`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          View
        </Link>
      </div>

      <div className="flex h-[250px]">
        <div className="w-2/3 pr-4 flex flex-col justify-between">
          {renderDropdown('Tasks', props.tasks)}
          {renderDropdown('Materials', props.materials)}
          {renderDropdown('Workers', props.workers)}
        </div>
        <div className="w-1/3 h-full">
          <PieChart 
            overdue={props.overdue}
            sevenDaysPlus={props.sevenDaysPlus}
            nextSevenDays={props.nextSevenDays}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-md font-medium mb-1">Timeline</label>
        <div className="w-full" style={{ height: `${timelineHeight}px` }}>
          <Timeline 
            phases={props.phases}
            startDate={startDate}
            endDate={endDate}
            currentWeek={props.currentWeek}
          />
        </div>
      </div>
    </div>
  );
};

export default LargeJobFrame;