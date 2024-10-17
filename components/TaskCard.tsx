// components/TaskCard.tsx

import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Contact } from '../data/contactsData';
import { calculateEndDate, calculateDuration } from '../handlers/phases';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: Contact[];
}

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

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, phaseStartDate, contacts }) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [localTask, setLocalTask] = useState<Task>(task);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isNewTask = task.id === '';

  const handleInputChange = (field: keyof Task, value: string) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleStartDateChange = (newStartDate: string) => {
    const newDueDate = calculateEndDate(newStartDate, parseInt(localTask.duration) || 0);
    setLocalTask(prev => ({
      ...prev,
      startDate: newStartDate,
      dueDate: newDueDate,
    }));
    setErrors(prev => ({ ...prev, startDate: '', dueDate: '' }));
  };

  const handleDurationChange = (newDuration: string) => {
    const newDueDate = calculateEndDate(localTask.startDate, parseInt(newDuration) || 0);
    setLocalTask(prev => ({
      ...prev,
      duration: newDuration,
      dueDate: newDueDate,
    }));
  };

  const handleDueDateChange = (newDueDate: string) => {
    const newDuration = calculateDuration(localTask.startDate, newDueDate).toString();
    setLocalTask(prev => ({
      ...prev,
      dueDate: newDueDate,
      duration: newDuration,
    }));
    setErrors(prev => ({ ...prev, dueDate: '' }));
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContacts([...selectedContacts, contact]);
  };

  const handleContactRemove = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(contact => contact.id !== contactId));
  };

  const validateTask = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    if (!localTask.title.trim()) newErrors.title = 'Title is required';
    if (!localTask.startDate) newErrors.startDate = 'Start date is required';
    if (!localTask.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateTask()) {
      onUpdate({ ...localTask, isExpanded: false });
    }
  };

  const handleCancel = () => {
    if (isNewTask) {
      onDelete();
    } else {
      setLocalTask(task);
      onUpdate({ ...task, isExpanded: false });
    }
  };

  return (
    <div className="mb-4 p-4 border rounded">
      {localTask.isExpanded ? (
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Title</label>
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Start Date</label>
              <input
                type="date"
                value={localTask.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={phaseStartDate}
                className={`w-full p-2 border rounded ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Duration (days)</label>
              <input
                type="number"
                value={localTask.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Due Date</label>
              <input
                type="date"
                value={localTask.dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                min={localTask.startDate}
                className={`w-full p-2 border rounded ${errors.dueDate ? 'border-red-500' : ''}`}
              />
              {errors.dueDate && <p className="text-red-500 text-xs">{errors.dueDate}</p>}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Details</label>
            <textarea
              value={localTask.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Add People</label>
            <select 
              onChange={(e) => {
                const selectedContact = contacts.find(contact => contact.id === e.target.value);
                if (selectedContact) {
                  handleContactSelect(selectedContact);
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a person</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
            <ul className="mt-2">
              {selectedContacts.map(contact => (
                <li key={contact.id} className="flex justify-between items-center">
                  <span>{contact.name}</span>
                  <button 
                    onClick={() => handleContactRemove(contact.id)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <FaTrash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span>{localTask.title}</span>
          <span>{localTask.startDate}</span>
          <div>
            <button
              onClick={() => setLocalTask(prev => ({ ...prev, isExpanded: true }))}
              className="mr-2 px-2 py-1 bg-zinc-500 text-white rounded"
            >
              Show
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;