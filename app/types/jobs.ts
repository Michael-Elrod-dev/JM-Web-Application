// app/types/jobs.ts

export interface NewJobData {
    title: string;
    startDate: string;
    location?: string;
    description?: string;
    client: {
      isNew: boolean;
      id?: number;
      name?: string;
      email?: string;
      phone?: string;
    };
  }
  
  // handlers/jobs.ts
  export const createJob = async (jobData: NewJobData) => {
    try {
      const response = await fetch('/api/jobs/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };