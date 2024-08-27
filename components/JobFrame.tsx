// components/JobFrame.tsx

import React from 'react';
import CardFrame from './CardFrame';

interface JobData {
  id: string;
  name: string;
  overdue: number;
  nextWeek: number;
  laterWeeks: number;
}

const JobFrame: React.FC<JobData> = ({ name, overdue, nextWeek, laterWeeks }) => {
  const total = overdue + nextWeek + laterWeeks;

  return (
    <CardFrame>
      <div className="flex items-center">
        <input type="checkbox" className="mr-4" />
        <div className="w-1/4">
          <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>
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