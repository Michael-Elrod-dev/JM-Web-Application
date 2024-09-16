// handlers/jobs.tsx

import { SetStateAction, Dispatch } from 'react';

export const handleAddPhase = (
  phases: number[],
  setPhases: Dispatch<SetStateAction<number[]>>
) => {
  setPhases([...phases, phases.length]);
};

export const handleDeletePhase = (
  index: number,
  phases: number[],
  setPhases: Dispatch<SetStateAction<number[]>>
) => {
  const newPhases = phases.filter((_, i) => i !== index);
  setPhases(newPhases);
};

export const handleCreate = () => {
  console.log('Create clicked');
  // Logic to create the job (e.g., send data to API)
};

export const handleCancel = (
  setJobTitle: Dispatch<SetStateAction<string>>,
  setClientName: Dispatch<SetStateAction<string>>,
  setClientPhone: Dispatch<SetStateAction<string>>,
  setClientEmail: Dispatch<SetStateAction<string>>,
  setStartDate: Dispatch<SetStateAction<string>>,
  setDuration: Dispatch<SetStateAction<string>>, // Changed from setEndDate
  setEstimatedEndDate: Dispatch<SetStateAction<string>>, // Added this line
  setJobLocation: Dispatch<SetStateAction<string>>,
  setDescription: Dispatch<SetStateAction<string>>,
  setPhases: Dispatch<SetStateAction<number[]>>
) => {
  console.log('Cancel clicked');
  setJobTitle('');
  setClientName('');
  setClientPhone('');
  setClientEmail('');
  setStartDate('');
  setDuration(''); // Changed from setEndDate('')
  setEstimatedEndDate(''); // Added this line
  setJobLocation('');
  setDescription('');
  setPhases([]);
};