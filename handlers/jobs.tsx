// handlers/jobs.tsx

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

export const handleCreate = () => {
  // console.log('Create clicked');
  // Logic to create the job (e.g., send data to API)
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
  setSelectedClient: (value: string) => void,
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
  setSelectedClient('');
  setShowNewClientForm(false);
};