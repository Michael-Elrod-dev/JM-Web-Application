import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Contact } from '../../data/contactsData';
import ContactCard from '../ContactCard';
import { calculateDuration } from '../../handlers/phases';

interface MaterialCardProps {
  material: Material;
  onUpdate: (updatedMaterial: Material) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: Contact[];
  isAnyMaterialExpanded?: boolean;
}

interface Material {
  id: string;
  title: string;
  startDate: string;
  duration: string;
  dueDate: string;
  status: string;
  details: string;
  isExpanded: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ 
  material, 
  onUpdate, 
  onDelete, 
  phaseStartDate, 
  contacts,
  isAnyMaterialExpanded 
}) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [localMaterial, setLocalMaterial] = useState<Material>(material);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [attempted, setAttempted] = useState(false);
  const isNewMaterial = material.id === '';

  // Add date formatting function
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleInputChange = (field: keyof Material, value: string) => {
    setLocalMaterial(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleStartDateChange = (newStartDate: string) => {
    setLocalMaterial(prev => ({
      ...prev,
      startDate: newStartDate,
    }));
    setErrors(prev => ({ ...prev, startDate: '' }));
  };

  const handleDueDateChange = (newDueDate: string) => {
    const newDuration = calculateDuration(localMaterial.startDate, newDueDate).toString();
    setLocalMaterial(prev => ({
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

  const validateMaterial = (): boolean => {
    setAttempted(true);
    const newErrors: {[key: string]: string} = {};
    if (!localMaterial.title.trim()) newErrors.title = 'Title is required';
    if (!localMaterial.startDate) newErrors.startDate = 'Start date is required';
    if (!localMaterial.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateMaterial()) {
      onUpdate({ ...localMaterial, isExpanded: false });
    }
  };

  const handleCancel = () => {
    if (isNewMaterial) {
      onDelete();
    } else {
      setLocalMaterial(material);
      onUpdate({ ...material, isExpanded: false });
    }
  };

  return (
    <div className="mb-4 p-4 border rounded">
      {localMaterial.isExpanded ? (
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localMaterial.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-2 border rounded ${attempted && errors.title ? 'border-red-500' : ''}`}
            />
            {attempted && errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={localMaterial.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={phaseStartDate}
                className={`w-full p-2 border rounded ${attempted && errors.startDate ? 'border-red-500' : ''}`}
              />
              {attempted && errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Due Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={localMaterial.dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                min={localMaterial.startDate}
                className={`w-full p-2 border rounded ${attempted && errors.dueDate ? 'border-red-500' : ''}`}
              />
              {attempted && errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Details</label>
            <textarea
              value={localMaterial.details}
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
                <div key={contact.id} className="relative [&>*]:py-[2px]">
                  <ContactCard
                    user_id={parseInt(contact.id)}
                    user_name={contact.name}
                    user_email={contact.email}
                    user_phone={contact.phone}
                    showCheckbox={false}
                  />
                  <button 
                    onClick={() => handleContactRemove(contact.id)}
                    className="absolute top-0.5 right-2 text-zinc-400 hover:text-zinc-600"
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
            {localMaterial.title}
          </div>
          <div className="text-center">
            {formatDate(localMaterial.startDate)}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setLocalMaterial(prev => ({ ...prev, isExpanded: true }))}
              className="mr-2 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
              disabled={isAnyMaterialExpanded && !localMaterial.isExpanded}
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


export default MaterialCard;