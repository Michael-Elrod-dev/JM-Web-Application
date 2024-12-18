// components/PhaseCard.tsx
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CardFrame from './CardFrame';
import TasksCard from './TasksCard';
import MaterialsCard from './MaterialsCard';
import SmallCardFrame from './SmallCardFrame';
import { DetailPhaseCardProps } from '../app/types/props';

const PhaseCard: React.FC<DetailPhaseCardProps> = ({ phase, phaseNumber, showTasks = true, showMaterials = true }) => {
  const params = useParams();
  const jobId = params?.id as string;
  const [notes, setNotes] = useState(phase.notes);
  const [newNote, setNewNote] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

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
            note_details: newNote.trim()
          })
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
        <h4 className="text-md font-semibold mb-2">Notes</h4>
        <div className="space-y-2">
          {notes.map((note, index) => {
            const isExpanded = expandedNoteId === index;
            const truncatedNote = note.note_details.length > 50 
              ? `${note.note_details.substring(0, 50)}...`
              : note.note_details;
            const createDate = new Date(note.created_at).toLocaleDateString('en-US', {
              month: 'numeric',
              day: 'numeric'
            });

            return (
              <div
                key={index}
                onClick={() => setExpandedNoteId(isExpanded ? null : index)}
                className="cursor-pointer"
              >
                <SmallCardFrame>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium col-span-1 truncate">
                      {note.note_details}
                    </span>
                    <span className="text-sm text-center col-span-1">{createDate}</span>
                    <span className="text-sm text-right col-span-1">{note.created_by.user_name}</span>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Details:</h5>
                        <SmallCardFrame>
                          <p className="text-sm whitespace-pre-wrap">{note.note_details}</p>
                        </SmallCardFrame>
                      </div>
                    </div>
                  )}
                </SmallCardFrame>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </CardFrame>
  );
};

export default PhaseCard;