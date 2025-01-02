"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Timeline from "./Timeline";
import Image from "next/image";
import { JobDetailView, TaskView, MaterialView } from "../app/types/views";

const LargeJobFrame: React.FC<JobDetailView> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const renderDropdown = (
    label: string,
    items: TaskView[] | MaterialView[] | string[]
  ) => {
    // Convert label for dropdown placeholder
    const displayLabel =
      label === "Tasks"
        ? "Tasks"
        : label === "Materials"
        ? "Materials"
        : "Contacts";

    return (
      <div className="mb-8">
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline dark:text-white"
            onChange={() => {}}
            value=""
            style={{ maxHeight: "240px" }}
          >
            <option value="" disabled>
              {displayLabel} {/* Placeholder text inside the dropdown */}
            </option>
            {label === "Contacts"
              ? (items as string[]).map((name, index) => (
                  <option key={`contact-${index}`} value={name}>
                    {name}
                  </option>
                ))
              : (items as (TaskView | MaterialView)[]).map((item) => {
                  if (label === "Tasks") {
                    const task = item as TaskView;
                    return (
                      <option
                        key={`task-${task.task_id}`}
                        className={`${
                          task.task_status === "Complete"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                        value={`${task.task_title}-${task.task_status}`}
                      >
                        {task.task_title}
                      </option>
                    );
                  } else {
                    const material = item as MaterialView;
                    return (
                      <option
                        key={`material-${material.material_id}`}
                        className={`${
                          material.material_status === "Complete"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                        value={`${material.material_title}-${material.material_status}`}
                      >
                        {material.material_title}
                      </option>
                    );
                  }
                })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="fill-current h-4 w-4 text-zinc-500 dark:text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const startDate = props.job_startdate;
  const endDate = props.phases[props.phases.length - 1]?.endDate;
  const total = props.overdue + props.nextSevenDays + props.sevenDaysPlus;

  return (
    <div className="bg-white dark:bg-zinc-800 shadow-md overflow-hidden sm:rounded-lg mb-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold mr-4">{props.jobName}</h2>
          <p className="text-lg text-zinc-600 dark:text-white/70">
            {props.dateRange}
          </p>
        </div>
        <Link
          href={`/jobs/${props.id}`}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
        >
          View
        </Link>
      </div>

      <div className="flex h-[250px]">
        <div className="w-2/3 pr-4 flex flex-col pt-8">
          {renderDropdown("Tasks", props.tasks)}
          {renderDropdown("Materials", props.materials)}
          {props.workers.length > 0 &&
            renderDropdown("Contacts", props.workers)}
        </div>
        <div
          className="w-1/3 h-full relative cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src="/placeholder-floorplan.jpg"
            alt="Floor Plan"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="my-2">
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
            {props.overdue > 0 && (
              <div
                className="bg-red-500 flex items-center justify-center"
                style={{ width: `${(props.overdue / total) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {props.overdue}
                </span>
              </div>
            )}
            {props.nextSevenDays > 0 && (
              <div
                className="bg-yellow-500 flex items-center justify-center"
                style={{ width: `${(props.nextSevenDays / total) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {props.nextSevenDays}
                </span>
              </div>
            )}
            {props.sevenDaysPlus > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center"
                style={{ width: `${(props.sevenDaysPlus / total) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {props.sevenDaysPlus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div
          className="w-full"
          style={{ height: `${20 + props.phases.length * 28}px` }}
        >
          <Timeline
            phases={props.phases}
            startDate={startDate}
            endDate={endDate}
            currentWeek={props.currentWeek}
          />
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold">Floor Plan</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Download
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="relative h-[80vh] w-full">
              <Image
                src="/placeholder-floorplan.jpg"
                alt="Floor Plan"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LargeJobFrame;
