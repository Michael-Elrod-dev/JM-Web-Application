// components/TaskCard.tsx

import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Contact } from '../../data/contactsData';
import ContactCard from '../ContactCard';
import { calculateEndDate, calculateDuration } from '../../handlers/phases';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: Contact[];
  isAnyTaskExpanded?: boolean;
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

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, phaseStartDate, contacts, isAnyTaskExpanded }) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [localTask, setLocalTask] = useState<Task>(task);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const isNewTask = task.id === '';

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };
  
  const handleExpand = () => {
    if (!isAnyTaskExpanded || localTask.isExpanded) {
      setLocalTask(prev => ({ ...prev, isExpanded: true }));
    }
  };

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

  const handleContactSelect = (contact: Contact) => {
    setSelectedContacts([...selectedContacts, contact]);
  };

  const handleContactRemove = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(contact => contact.id !== contactId));
  };

  const handleDelete = () => {
    onDelete();
  };

  const validateTask = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    if (!localTask.title.trim()) newErrors.title = 'Title is required';
    if (!localTask.startDate) newErrors.startDate = 'Start date is required';
    if (!localTask.duration) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateTask()) {
      const updatedTask = { ...localTask, isExpanded: false };
      setLocalTask(updatedTask);
      onUpdate(updatedTask);
    }
  };

  const handleCancel = () => {
    if (isNewTask) {
      onDelete();
    } else {
      setLocalTask({ ...task, isExpanded: false });
      onUpdate({ ...task, isExpanded: false });
    }
  };

  return (
    <div className="mb-4 p-4 border rounded">
      {localTask.isExpanded ? (
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Start Date<span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Duration (days)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={localTask.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                min="1"
                className={`w-full p-2 border rounded ${errors.duration ? 'border-red-500' : ''}`}
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
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
                  e.target.value = ''; // Reset select after adding
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a person</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
            <div className="mt-2 space-y-2">
              {selectedContacts.map(contact => (
                <div key={contact.id} className="relative">
                  <ContactCard
                    user_id={parseInt(contact.id)}
                    user_name={contact.name}
                    user_email={contact.email}
                    user_phone={contact.phone}
                    showCheckbox={false}
                  />
                  <button 
                    onClick={() => handleContactRemove(contact.id)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-600"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="mr-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 items-center">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {localTask.title}
          </div>
          <div className="text-center">
            {formatDate(localTask.startDate)}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setLocalTask(prev => ({ ...prev, isExpanded: true }))}
              className="mr-2 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
              disabled={isAnyTaskExpanded && !localTask.isExpanded}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
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