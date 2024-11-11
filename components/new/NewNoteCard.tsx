// components/NewNoteCard.tsx

import React, { useState, useEffect } from 'react';

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onDelete: () => void;
}

interface Note {
  id: string;
  content: string;
  isExpanded: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
    note, 
    onUpdate, 
    onDelete 
  }) => {
    const [localNote, setLocalNote] = useState<Note>(note);

    useEffect(() => {
        setLocalNote(note);
      }, [note]);
    
      const handleSave = () => {
        if (localNote.content.trim()) {
          onUpdate({ ...localNote, isExpanded: false });
        } else {
          onDelete(); // Delete if empty
        }
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          handleSave();
        }
      };
    
      return (
        <div className="mb-4">
          {localNote.isExpanded ? (
            <div className="border rounded p-4 bg-white">
              <textarea
                value={localNote.content}
                onChange={(e) => setLocalNote(prev => ({ ...prev, content: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded mb-2"
                rows={3}
                placeholder="Enter your note..."
                autoFocus // Add autofocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="border rounded p-4 bg-white relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => setLocalNote(prev => ({ ...prev, isExpanded: true }))}
                  className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="whitespace-pre-wrap pr-20">{localNote.content}</p>
            </div>
          )}
        </div>
      );
    };

export default NoteCard;