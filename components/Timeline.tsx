"use client";

import React from 'react';

interface TimelineProps {
  phases: {
    id: number;
    name: string;
    startWeek: number;
    endWeek: number;
    color: string;
  }[];
  currentWeek: number;
  totalWeeks: number;
  startDate: string;
  endDate: string;
}

const Timeline: React.FC<TimelineProps> = ({ phases, currentWeek, totalWeeks, startDate, endDate }) => {
  const getWeekPercentage = (week: number) => (week / totalWeeks) * 100;
  const phaseHeight = 28; // Height of each phase bar
  const topMargin = 20; // Space for week indicators
  const requiredHeight = topMargin + phases.length * phaseHeight;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const totalDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  const dateIntervals = 5; // Number of date intervals to show
  const dayInterval = Math.ceil(totalDays / (dateIntervals - 1));

  const getDateString = (daysToAdd: number) => {
    const date = new Date(startDateObj.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="relative w-full rounded overflow-hidden" style={{ height: `${requiredHeight}px` }}>
      {/* Date indicators */}
      <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-zinc-600 dark:text-white/70 px-2">
        {Array.from({ length: dateIntervals }, (_, i) => (
          <span key={i}>{getDateString(i * dayInterval)}</span>
        ))}
      </div>

      {/* Phase bars */}
      {phases.map((phase) => (
        <div
          key={phase.id}
          className="absolute h-6 rounded-full"
          style={{
            left: `${getWeekPercentage(phase.startWeek - 1)}%`,
            width: `${getWeekPercentage(phase.endWeek - phase.startWeek + 1)}%`,
            top: `${topMargin + phase.id * phaseHeight}px`,
            backgroundColor: phase.color,
          }}
        >
          <span className="text-xs font-semibold text-white pl-2 whitespace-nowrap overflow-hidden">
            {phase.name}
          </span>
        </div>
      ))}

      {/* Current week indicator */}
      <div
        className="absolute w-px bg-zinc-600 dark:bg-white/70"
        style={{
          left: `${getWeekPercentage(currentWeek)}%`,
          top: `${topMargin}px`,
          bottom: '0',
        }}
      />
    </div>
  );
};

export default Timeline;