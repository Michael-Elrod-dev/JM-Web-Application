// components/Note.tsx
import React, { useState } from 'react';

interface NoteProps {
  note_details: string;
  created_at: string;
  created_by: {
    user_name: string;
  };
}

export default function Note({ note_details, created_at, created_by }: NoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all border border-gray-100"
    >
      {!isExpanded ? (
        <div className="flex items-center justify-between">
          <div className="flex-1 truncate pr-4 text-gray-700">
            {note_details.substring(0, 50)}
            {note_details.length > 50 && '...'}
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap px-4">
            {formatDate(created_at)}
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {created_by.user_name}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-gray-700 whitespace-pre-wrap">{note_details}</div>
          <div className="text-sm text-gray-500 flex justify-between mt-2 pt-2 border-t border-gray-100">
            <span>{formatDate(created_at)}</span>
            <span>{created_by.user_name}</span>
          </div>
        </div>
      )}
    </div>
  );
}