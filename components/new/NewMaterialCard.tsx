import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Contact } from '../../data/contactsData';
import ContactCard from '../ContactCard';

interface MaterialCardProps {
  material: Material;
  onUpdate: (updatedMaterial: Material) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: Contact[];
}

interface Material {
  id: string;
  title: string;
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
}) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [localMaterial, setLocalMaterial] = useState<Material>(material);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (material.id === '' && !material.dueDate) {
      setLocalMaterial(prev => ({
        ...prev,
        dueDate: phaseStartDate
      }));
    }
  }, [material.id, material.dueDate, phaseStartDate]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00Z');
    // Use UTC methods to avoid timezone shifts
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleInputChange = (field: keyof Material, value: string) => {
    if (field === 'dueDate') {
      // Only validate that material can't be due before phase starts
      if (new Date(value) >= new Date(phaseStartDate)) {
        setLocalMaterial(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
      } else {
        setErrors(prev => ({ 
          ...prev, 
          dueDate: 'Due date cannot be before phase start date' 
        }));
      }
    } else {
      setLocalMaterial(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    if (!localMaterial.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDone = () => {
    if (validateMaterial()) {
      const updatedMaterial = {
        ...localMaterial,
        isExpanded: false
      };
      onUpdate(updatedMaterial);
      setLocalMaterial(updatedMaterial);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded">
      {localMaterial.isExpanded ? (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
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
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Due Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={localMaterial.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={phaseStartDate}
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
              onClick={handleDone}
              className="mr-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Done
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
            {formatDate(localMaterial.dueDate)}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                const updatedMaterial = { ...localMaterial, isExpanded: true };
                setLocalMaterial(updatedMaterial);
                onUpdate(updatedMaterial);
              }}
              className="mr-2 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default MaterialCard;