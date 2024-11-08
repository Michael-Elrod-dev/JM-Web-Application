// components/JobFrame.tsx

import React from 'react';
import CardFrame from './CardFrame';

interface JobData {
  id: string;
  name: string;
  overdue: number;
  nextWeek: number;
  laterWeeks: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const JobFrame: React.FC<JobData> = ({ id, name, overdue, nextWeek, laterWeeks, isSelected, onSelect }) => {
  const total = overdue + nextWeek + laterWeeks;

  return (
    <CardFrame>
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => onSelect(id)}
      >
        <input 
          type="checkbox" 
          className="mr-4" 
          checked={isSelected}
          onChange={() => onSelect(id)}
          onClick={(e) => e.stopPropagation()} // Prevent double-triggering
        />
        <div className="w-1/4">
          <h3 className="text-lg font-medium truncate">{name}</h3>
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex-1 flex mr-4">
            {overdue > 0 && (
              <div className="bg-red-500 flex justify-center items-center text-white" style={{ width: `${(overdue / total) * 100}%`, height: '20px' }}>
                {overdue}
              </div>
            )}
            {nextWeek > 0 && (
              <div className="bg-yellow-500 flex justify-center items-center text-white" style={{ width: `${(nextWeek / total) * 100}%`, height: '20px' }}>
                {nextWeek}
              </div>
            )}
            {laterWeeks > 0 && (
              <div className="bg-green-500 flex justify-center items-center text-white" style={{ width: `${(laterWeeks / total) * 100}%`, height: '20px' }}>
                {laterWeeks}
              </div>
            )}
          </div>
          <span className="w-12 text-right">{total}</span>
        </div>
      </div>
    </CardFrame>
  );
};

export default JobFrame;