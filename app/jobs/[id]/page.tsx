// app/jobs/[id]/page.tsx

import React from 'react';
import DetailedJobView from '../../../components/DetailedJobView';
import { jobs } from '../../../data/jobsData';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find(j => j.id.toString() === params.id);

  if (!job) {
    return <div>Job not found</div>;
  }

  return <DetailedJobView {...job} />;
}