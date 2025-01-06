"use client";

import React from "react";
import { TimelineProps } from "../../app/types/props";

const Timeline: React.FC<TimelineProps> = ({
  phases,
  startDate,
  endDate,
  currentWeek,
}) => {
  const phaseHeight = 28;
  const topMargin = 20;
  const requiredHeight = topMargin + phases.length * phaseHeight;

  const parseDate = (dateStr: string) => {
    // Handle both YYYY-MM-DD and MM/DD formats
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    const [month, day] = dateStr.split("/");
    return new Date(
      new Date().getFullYear(),
      parseInt(month) - 1,
      parseInt(day)
    );
  };

  const startDateObj = parseDate(startDate);
  const endDateObj = parseDate(endDate);
  const totalDays = Math.ceil(
    (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getPositionPercentage = (date: string) => {
    const dateObj = new Date(date); // Phase dates should be in YYYY-MM-DD format
    const daysDiff = Math.ceil(
      (dateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    const percentage = (daysDiff / totalDays) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getPhaseWidth = (phaseStartDate: string, phaseEndDate: string) => {
    const startObj = new Date(phaseStartDate);
    const endObj = new Date(phaseEndDate);
    const phaseDays = Math.ceil(
      (endObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    const percentage = (phaseDays / totalDays) * 100;
    return Math.max(1, Math.min(100, percentage));
  };

  // Calculate date markers
  const dateIntervals = 5;
  const dayInterval = Math.ceil(totalDays / (dateIntervals - 1));
  const getDateString = (daysToAdd: number) => {
    const date = new Date(
      startDateObj.getTime() + daysToAdd * 24 * 60 * 60 * 1000
    );
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Calculate current week position
  const getCurrentWeekPosition = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Check if today is within the timeline range
    if (today < startDateObj || today > endDateObj) {
      return null; // Return null if outside range
    }

    const daysSinceStart = Math.ceil(
      (today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.min(100, Math.max(0, (daysSinceStart / totalDays) * 100));
  };

  return (
    <div
      className="relative w-full rounded overflow-hidden"
      style={{ height: `${requiredHeight}px` }}
    >
      {/* Date indicators */}
      <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-zinc-600 dark:text-white/70 px-2">
        {Array.from({ length: dateIntervals }, (_, i) => (
          <span key={i}>{getDateString(i * dayInterval)}</span>
        ))}
      </div>

      {/* Phase bars */}
      {phases.map((phase, index) => (
        <div
          key={phase.id}
          className="absolute h-6 rounded-full"
          style={{
            left: `${getPositionPercentage(phase.startDate)}%`,
            width: `${getPhaseWidth(phase.startDate, phase.endDate)}%`,
            top: `${topMargin + index * phaseHeight}px`,
            backgroundColor: phase.color,
          }}
        >
          <div className="w-full h-full px-2 flex items-center">
            <span className="text-xs font-semibold text-white truncate">
              {phase.name}
            </span>
          </div>
        </div>
      ))}

      {/* Current week indicator */}
      {getCurrentWeekPosition() !== null && (
        <div
          className="absolute bg-zinc-600 dark:bg-white/70 rounded-full"
          style={{
            left: `${getCurrentWeekPosition()}%`,
            top: `${topMargin}px`,
            bottom: "0",
            width: "4px",
            transform: "translateX(-50%)",
          }}
        />
      )}
    </div>
  );
};

export default Timeline;
