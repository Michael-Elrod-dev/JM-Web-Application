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
  // console.log('Create clicked');
  // Logic to create the job (e.g., send data to API)
};

// In handlers/jobs.ts
export const handleCancel = (
  setJobTitle: React.Dispatch<React.SetStateAction<string>>,
  setClientName: React.Dispatch<React.SetStateAction<string>>,
  setClientPhone: React.Dispatch<React.SetStateAction<string>>,
  setClientEmail: React.Dispatch<React.SetStateAction<string>>,
  setStartDate: React.Dispatch<React.SetStateAction<string>>,
  setJobLocation: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  setPhases: React.Dispatch<React.SetStateAction<number[]>>,
  setSelectedClient: React.Dispatch<React.SetStateAction<string>>,
  setShowNewClientForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setJobTitle('');
  setClientName('');
  setClientPhone('');
  setClientEmail('');
  setStartDate('');
  setJobLocation('');
  setDescription('');
  setPhases([]);
  setSelectedClient('');
  setShowNewClientForm(false);
};