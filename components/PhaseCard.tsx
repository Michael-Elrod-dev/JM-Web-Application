// components/PhaseCard.tsx
import React, { useState } from 'react';
import CardFrame from './CardFrame';
import TasksCard from './TasksCard';
import MaterialsCard from './MaterialsCard';
import SmallCardFrame from './SmallCardFrame';

interface User {
  user_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
}

interface Task {
  task_id: number;
  task_title: string;
  task_startdate: string;
  task_duration: number;
  task_status: string;
  task_description: string;
  users: User[];
}

interface Material {
  material_id: number;
  material_title: string;
  material_duedate: string;
  material_status: string;
  material_description: string;
  users: User[];
}

interface PhaseCardProps {
  phase: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    color: string;
    tasks: Task[];
    materials: Material[];
    note: string[];
  };
  phaseNumber: number;
  showTasks: boolean;
  showMaterials: boolean;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, phaseNumber, showTasks, showMaterials }) => {
  const [notes, setNotes] = useState(phase.note);
  const [newNote, setNewNote] = useState('');

  // Format dates for display
  const startDate = new Date(phase.startDate).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  const endDate = new Date(phase.endDate).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  return (
    <CardFrame>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Phase {phaseNumber} - {phase.name}
        </h3>
        <span className="text-md">
          {startDate} - {endDate}
        </span>
      </div>
      
      <div className="space-y-4">
        {showTasks && phase.tasks.length > 0 && (
          <div>
            <TasksCard tasks={phase.tasks} />
          </div>
        )}
        
        {showMaterials && phase.materials.length > 0 && (
          <div>
            <MaterialsCard materials={phase.materials} />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Notes:</h4>
        {notes.map((note, index) => (
          <SmallCardFrame key={index}>
            <p className="text-sm">{note}</p>
          </SmallCardFrame>
        ))}
        <div className="mt-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Note
          </button>
        </div>
      </div>
    </CardFrame>
  );
};

export default PhaseCard;