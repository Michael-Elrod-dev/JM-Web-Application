// handlers/jobs.tsx

import { NewJobData } from '@/app/types/jobs';

interface Task {
  id: string;
  title: string;
  startDate: string;
  duration: string;
  dueDate: string;
  status: string;
  details: string;
  isExpanded: boolean;
}

interface Material {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  details: string;
  isExpanded: boolean;
}

interface Note {
  id: string;
  content: string;
  isExpanded: boolean;
}

interface Phase {
  id: number;
  title: string;
  startDate: string;
  description: string;
  tasks: Task[];
  materials: Material[];
  notes: Note[];
}

interface Client {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

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
export const handleAddPhase = (
  phases: Phase[], 
  setPhases: React.Dispatch<React.SetStateAction<Phase[]>>,
  jobStartDate?: string
) => {
  const newPhase: Phase = {
    id: Date.now(),
    title: '',
    startDate: jobStartDate || '',
    description: '',
    tasks: [],
    materials: [],
    notes: []
  };
  setPhases([...phases, newPhase]);
};

export const handleDeletePhase = (
  index: number,
  phases: Phase[],
  setPhases: (phases: Phase[]) => void
) => {
  const newPhases = phases.filter((_, i) => i !== index);
  setPhases(newPhases);
};

export const handleCancel = (
  setJobTitle: (value: string) => void,
  setClientName: (value: string) => void,
  setClientPhone: (value: string) => void,
  setClientEmail: (value: string) => void,
  setStartDate: (value: string) => void,
  setJobLocation: (value: string) => void,
  setDescription: (value: string) => void,
  setPhases: (value: Phase[]) => void,
  setSelectedClient: (value: Client | null) => void,
  setShowNewClientForm: (value: boolean) => void
) => {
  setJobTitle('');
  setClientName('');
  setClientPhone('');
  setClientEmail('');
  setStartDate('');
  setJobLocation('');
  setDescription('');
  setPhases([]);
  setSelectedClient(null);
  setShowNewClientForm(false);
};