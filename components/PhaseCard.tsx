// components/PhaseCard.tsx
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CardFrame from './CardFrame';
import Note from './NoteCard';
import TasksCard from './TasksCard';
import MaterialsCard from './MaterialsCard';
import SmallCardFrame from './SmallCardFrame';
import { DetailPhaseCardProps } from '../app/types/props';

const PhaseCard: React.FC<DetailPhaseCardProps> = ({ 
  phase, 
  phaseNumber, 
  showTasks = true, 
  showMaterials = true 
}) => {
  const params = useParams();
  const jobId = params?.id as string;
  const [notes, setNotes] = useState(phase.notes);
  const [newNote, setNewNote] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  // Format dates for display
  const startDate = new Date(phase.startDate).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });
  const endDate = new Date(phase.endDate).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phase_id: phase.phase_id,
            note_details: newNote.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add note');
        }

        const data = await response.json();
        setNotes([...notes, data.note]);
        setNewNote('');
      } catch (error) {
        console.error('Failed to add note:', error);
      }
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
        {/* Notes Section Title */}
        <h4 className="text-md font-semibold mb-2">Notes</h4>

        {/* Display Existing Notes */}
        <div className="space-y-2 mb-4">
          {notes.map((note, index) => (
            <SmallCardFrame key={index}>
              <Note
                {...note}
                onClick={() => setExpandedNoteId(expandedNoteId === index ? null : index)}
                isExpanded={expandedNoteId === index}
              />
            </SmallCardFrame>
          ))}
        </div>

        {/* Add New Note Section */}
        <SmallCardFrame>
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Add New Note</h5>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your note here..."
              className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 shadow-sm"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        </SmallCardFrame>
      </div>
    </CardFrame>
  );
};

export default PhaseCard;