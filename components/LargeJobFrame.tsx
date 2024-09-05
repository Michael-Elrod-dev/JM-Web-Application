// components/LargeJobFrame.tsx

import React, { useState } from 'react';
import CardFrame from './CardFrame';
import PieChart from './PieChart';

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderDropdown = (label: string, items: string[]) => (
    <div className="mb-4">
      <button
        className="flex justify-between items-center w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
        onClick={() => toggleSection(label)}
      >
        <span className="font-medium">{label}</span>
        <span>{expandedSection === label ? '▲' : '▼'}</span>
      </button>
      {expandedSection === label && (
        <ul className="mt-2 bg-white border border-gray-200 rounded">
          {items.map((item, index) => (
            <li key={index} className="p-2 hover:bg-gray-100">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <CardFrame className="p-6">
      <div className="flex">
        <div className="w-2/3 pr-4">
          <h2 className="text-2xl font-bold mb-2">{jobName}</h2>
          <p className="text-gray-600 mb-6">{dateRange}</p>
          {renderDropdown('Tasks', tasks)}
          {renderDropdown('Materials', materials)}
          {renderDropdown('Workers', workers)}
        </div>
        <div className="w-1/3 bg-white rounded p-4" style={{ height: '300px' }}>
          <PieChart 
            overdue={overdue}
            sevenDaysPlus={sevenDaysPlus}
            nextSevenDays={nextSevenDays}
          />
        </div>
      </div>
      
      <div className="mt-6 w-full h-24 bg-gray-200 rounded">
        {/* Placeholder for timeline */}
      </div>
    </CardFrame>
  );
};

export default LargeJobFrame;