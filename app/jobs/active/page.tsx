"use client";

import React, { useState, useEffect } from "react";
import LargeJobFrame from "../../../components/LargeJobFrame";
import { useSearchParams } from "next/navigation";
import { JobDetailView } from "../../types/views";

export default function ActiveJobsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
  );
  const [jobs, setJobs] = useState<JobDetailView[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs?view=detailed&status=active");
        const data = await response.json();
            
        const transformedJobs = data.jobs.map((job: any): JobDetailView => ({
          id: job.job_id,
          jobName: job.job_title,
          job_startdate: job.job_startdate,
          dateRange: job.date_range,
          currentWeek: job.current_week,
          phases: job.phases.map((phase: any) => ({
            id: phase.id,
            name: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            color: phase.color,
            tasks: [],
            materials: [],
            notes: [],
          })),
          overdue: job.overdue,
          nextSevenDays: job.nextSevenDays,
          sevenDaysPlus: job.sevenDaysPlus,
          tasks: job.tasks.map((task: any) => ({
            task_id: Math.random(),  // Still need this as we're not getting id from API
            task_title: task.task_title,
            task_startdate: '',      // Still need defaults for these as they're not in API
            task_duration: 0,
            task_status: task.task_status,
            task_description: '',
            users: []
          })),
          materials: job.materials.map((material: any) => ({
            material_id: Math.random(),  // Still need this as we're not getting id from API
            material_title: material.material_title,
            material_duedate: '',       // Still need defaults for these as they're not in API
            material_status: material.material_status,
            material_description: '',
            users: []
          })),
          workers: job.workers || [],
        }));

        setJobs(transformedJobs);
        
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
}, []);

  const searchTerms = searchQuery
    .split(",")
    .map((term) => term.trim().toLowerCase());
  const filteredJobs = jobs.filter(
    (job) =>
      searchTerms.length === 0 ||
      searchTerms.some((term) => job.jobName.toLowerCase().includes(term))
  );

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs (comma-separated for multiple)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredJobs.map((job) => (
        <LargeJobFrame
          key={job.id}
          id={job.id}
          jobName={job.jobName}
          job_startdate={job.job_startdate}
          dateRange={job.dateRange}
          currentWeek={job.currentWeek}
          phases={job.phases}
          overdue={job.overdue}
          sevenDaysPlus={job.sevenDaysPlus}
          nextSevenDays={job.nextSevenDays}
          tasks={job.tasks}
          materials={job.materials}
          workers={job.workers}
        />
      ))}
    </>
  );
}
