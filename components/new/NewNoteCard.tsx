// components/NewNoteCard.tsx

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

  const handleDone = () => {
    if (localNote.content.trim()) {
      onUpdate({ ...localNote, isExpanded: false });
    } else {
      onDelete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleDone();
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
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleDone}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Done
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
        <div className="border rounded p-4 bg-white relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => setLocalNote(prev => ({ ...prev, isExpanded: true }))}
              className="text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <FaTrash size={18} />
            </button>
          </div>
          <p className="whitespace-pre-wrap pr-20">{localNote.content}</p>
        </div>
      )}
    </div>
  );
};

export default NoteCard;