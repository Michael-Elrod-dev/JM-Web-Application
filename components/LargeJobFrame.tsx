import React, { useState } from 'react';
import PieChart from './PieChart';
import Timeline from './Timeline';
import { FaHeart, FaInfoCircle } from 'react-icons/fa';

interface LargeJobFrameProps {
  jobName: string;
  dateRange: string;
  tasks: string[];
  materials: string[];
  workers: string[];
  overdue: number;
  sevenDaysPlus: number;
  nextSevenDays: number;
}

const LargeJobFrame: React.FC<LargeJobFrameProps> = ({ 
  jobName, 
  dateRange, 
  tasks, 
  materials, 
  workers,
  overdue,
  sevenDaysPlus,
  nextSevenDays
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {setIsFavorite(!isFavorite);};

  const renderDropdown = (label: string, items: string[]) => (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">{label}</label>
      <div className="relative">
        <select className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value=""></option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );

  const phases = [
    { id: 0, name: 'Phase 1', startWeek: 1, endWeek: 3, color: '#4299e1' },
    { id: 1, name: 'Phase 2', startWeek: 2, endWeek: 4, color: '#ecc94b' },
    { id: 2, name: 'Phase 3', startWeek: 4, endWeek: 7, color: '#f56565' },
    { id: 3, name: 'Phase 4', startWeek: 5, endWeek: 7, color: '#38b2ac' },
    { id: 4, name: 'Phase 5', startWeek: 7, endWeek: 8, color: '#ed64a6' },
  ];

  // Calculate the required height for the timeline
  const timelineHeight = 20 + phases.length * 28;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg mb-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold mr-4">{jobName}</h2>
          <p className="text-sm text-gray-600 dark:text-white/70">{dateRange}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
          >
            <FaHeart size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <FaInfoCircle size={20}/>
          </button>
        </div>
      </div>
      <div className="flex h-[250px]"> {/* Set a fixed height for this container */}
        <div className="w-2/3 pr-4 flex flex-col justify-between">
          {renderDropdown('Tasks', tasks)}
          {renderDropdown('Materials', materials)}
          {renderDropdown('Workers', workers)}
        </div>
        <div className="w-1/3 h-full"> {/* Make sure the PieChart container takes full height */}
          <PieChart 
            overdue={overdue}
            sevenDaysPlus={sevenDaysPlus}
            nextSevenDays={nextSevenDays}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-md font-medium mb-1">Timeline</label>
        <div className={`w-full`} style={{ height: `${timelineHeight}px` }}>
          <Timeline phases={phases} currentWeek={4} totalWeeks={8} />
        </div>
      </div>
    </div>
  );
};

export default LargeJobFrame;