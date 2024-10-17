// app/jobs/[id]/page.tsx

import React from 'react';
import DetailedJobView from '../../../components/DetailedJobView';
import { jobs } from '../../../data/jobsData';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find(j => j.id.toString() === params.id);

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <DetailedJobView
      jobName={job.jobName}
      dateRange={job.dateRange}
      phases={job.phases}
      currentWeek={job.currentWeek}
      totalWeeks={job.totalWeeks}
      overdue={job.overdue}
      nextSevenDays={job.nextSevenDays}
      sevenDaysPlus={job.sevenDaysPlus}
    />
  );
}