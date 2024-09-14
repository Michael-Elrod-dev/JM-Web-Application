import React from 'react';

interface Phase {
  id: number;
  name: string;
  startWeek: number;
  endWeek: number;
  color: string;
}

interface TimelineProps {
  phases: Phase[];
  currentWeek: number;
  totalWeeks: number;
}

const Timeline: React.FC<TimelineProps> = ({ phases, currentWeek, totalWeeks }) => {
  const getWeekPercentage = (week: number) => (week / totalWeeks) * 100;
  const phaseHeight = 28; // Height of each phase bar
  const topMargin = 20; // Space for week indicators
  const requiredHeight = topMargin + phases.length * phaseHeight;

  return (
    <div className="relative w-full rounded overflow-hidden" style={{ height: `${requiredHeight}px` }}>
      {/* Week indicators */}
      <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-gray-600 dark:text-white/70 px-2">
        {Array.from({ length: totalWeeks }, (_, i) => (
          <span key={i}>Week {i + 1}</span>
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
        className="absolute w-px bg-gray-600 dark:bg-white/70"
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