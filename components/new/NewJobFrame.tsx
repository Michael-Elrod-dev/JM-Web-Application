// components/NewJobFrame.tsx

import React, { useState } from 'react';
import CardFrame from '../CardFrame';
import JobButton from '../JobButton';
import PhaseCard from './NewPhaseCard';
import { FaPlus } from 'react-icons/fa';
import { handleAddPhase, handleDeletePhase, handleCreate, handleCancel } from '../../handlers/jobs';

const NewJobFrame: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<number[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Dummy data for existing clients - replace with your actual data source
  const existingClients = [
    { id: 1, name: "Client A" },
    { id: 2, name: "Client B" },
    { id: 3, name: "Client C" },
  ];

  const getInputClassName = (value: string) => {
    const baseClass = "mt-1 block w-full border rounded-md shadow-sm p-2";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300";
    
    return `${baseClass} ${attempted && !value && errors[value] ? errorClass : normalClass}`;
  };

  const handleInputChange = (field: string, value: string) => {
    switch(field) {
      case 'jobTitle':
        setJobTitle(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <CardFrame>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-700 dark:text-white">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className={getInputClassName('jobTitle')}
              placeholder="Job title..."
              required
            />
            {attempted && errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 dark:text-white">
              Start Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={getInputClassName('startDate')}
              required
            />
            {attempted && errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
            <div>
              <label htmlFor="jobLocation" className="block text-sm font-medium text-zinc-700 dark:text-white">Job Location</label>
              <input
                type="text"
                id="jobLocation"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                placeholder="Address where the property is located..."
              />
            </div>
          </div>

          {/* Client Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {!showNewClientForm ? (
                // Show dropdown when not adding new client
                <div className="flex-grow h-[64px]">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-white">Select Client</label>
                  <select 
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a client</option>
                    {existingClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                // Show input fields when adding new client
                <div className="flex-grow grid grid-cols-3 gap-4 h-[64px]">
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-zinc-700 dark:text-white">Client Name</label>
                    <input
                      type="text"
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="Name Here"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-zinc-700 dark:text-white">Client Phone Number</label>
                    <input
                      type="tel"
                      id="clientPhone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="999-999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-zinc-700 dark:text-white">Client Email</label>
                    <input
                      type="email"
                      id="clientEmail"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="client@gmail.com"
                    />
                  </div>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => {
                  setShowNewClientForm(!showNewClientForm);
                  if (!showNewClientForm) {
                    setSelectedClient('');
                  } else {
                    setClientName('');
                    setClientPhone('');
                    setClientEmail('');
                  }
                }}
                className="mt-6 px-4 py-2 bg-zinc-500 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                {showNewClientForm ? 'Select Client' : 'Add New Client'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-white">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
              placeholder="This is a detailed or high level description of the job..."
            ></textarea>
          </div>
        </div>
      </CardFrame>

      {phases.map((_, index) => (
        <PhaseCard 
          key={index} 
          phaseNumber={index + 1} 
          onDelete={() => handleDeletePhase(index, phases, setPhases)}
          jobStartDate={startDate}
        />
      ))}

      <div className="flex justify-end space-x-4 mt-4 w-full">
        <JobButton
          title="Add a Phase"
          icon={FaPlus}
          onClick={() => {
            setAttempted(true);
            const newErrors: {[key: string]: string} = {};
            if (!jobTitle.trim()) newErrors.jobTitle = 'Title is required';
            if (!startDate) newErrors.startDate = 'Start date is required';
            setErrors(newErrors);
            
            if (Object.keys(newErrors).length === 0) {
              handleAddPhase(phases, setPhases);
            }
          }}
          color="default"
        />
        <JobButton
          title="Save Job"
          onClick={handleCreate}
          color="green"
        />
        <JobButton
          title="Cancel"
          onClick={() => handleCancel(
            setJobTitle, 
            setClientName, 
            setClientPhone, 
            setClientEmail,
            setStartDate, 
            setJobLocation, 
            setDescription, 
            setPhases,
            setSelectedClient,
            setShowNewClientForm
          )}
          color="red"
        />
      </div>
    </>
  );
};

export default NewJobFrame;