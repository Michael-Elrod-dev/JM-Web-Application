// app/jobs/new/page.tsx

"use client";

import React, { useState, useCallback } from 'react';
import CardFrame from '../../../components/CardFrame';
import JobButton from '../../../components/JobButton';
import PhaseCard from '../../../components/new/NewPhaseCard';
import ClientSearchSelect from '../../../components/new/ClientSearch';
import { FaPlus } from 'react-icons/fa';
import { NewJobData } from '@/app/types/jobs';
import { handleAddPhase, handleDeletePhase, handleCancel, createJob } from '../../../handlers/jobs';

interface Phase {
  id: number;
  title: string;
  startDate: string;
  description: string;
  tasks: Task[];
  materials: Material[];
  notes: Note[];
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

interface Material {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  details: string;
  isExpanded: boolean;
}

interface Note {
  id: string;
  content: string;
  isExpanded: boolean;
}

interface Client {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export default function NewJobPage() {
  const today = new Date().toISOString().split('T')[0];
  const [jobTitle, setJobTitle] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<Phase[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const getInputClassName = (fieldName: string) => {
    const baseClass = "mt-1 block w-full border rounded-md shadow-sm p-2";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300";
    
    return `${baseClass} ${attempted && errors[fieldName] ? errorClass : normalClass}`;
  };

  const handleCreate = async () => {
    // Validate required fields
    const errors: {[key: string]: string} = {};
    if (!jobTitle.trim()) errors.jobTitle = 'Title is required';
    if (!startDate) errors.startDate = 'Start date is required';
    if (!selectedClient && !showNewClientForm) errors.client = 'Client is required';
    if (showNewClientForm) {
      if (!clientName.trim()) errors.clientName = 'Client name is required';
      if (!clientEmail.trim()) errors.clientEmail = 'Client email is required';
      if (!clientPhone.trim()) errors.clientPhone = 'Client phone is required';
    }
  
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAttempted(true);
      return;
    }
  
    const jobData: NewJobData = {
      title: jobTitle,
      startDate,
      location: jobLocation || undefined,
      description: description || undefined,
      client: {
        isNew: showNewClientForm,
        ...(showNewClientForm 
          ? {
              name: clientName,
              email: clientEmail,
              phone: clientPhone,
            }
          : {
              id: selectedClient?.user_id
            }
        ),
      },
    };
  
    try {
      const result = await createJob(jobData);
      // Handle successful creation
      // Redirect to job page or show success message
    } catch (error) {
      // Handle error
      console.error('Failed to create job:', error);
      setErrors({ submit: 'Failed to create job' });
    }
  };

  const handlePhaseUpdate = useCallback((updatedPhase: Phase) => {
    setPhases(prevPhases => 
      prevPhases.map(p => p.id === updatedPhase.id ? updatedPhase : p)
    );
  }, []);

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
    <div className="mx-auto space-y-4">
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
                min={today}
                className={`${getInputClassName('startDate')} [color-scheme:light] text-zinc-900 dark:text-white placeholder-zinc-500 [&:not(:valid)]:text-zinc-500`}
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
                <ClientSearchSelect 
                  onClientSelect={(client) => {
                    setSelectedClient(client);
                    if (client) {
                      setClientName(client.user_name);
                      setClientPhone(client.user_phone);
                      setClientEmail(client.user_email);
                    }
                  }}
                />
              ) : (
              // Keep the existing "new client form" block as is
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
                    setSelectedClient(null);
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

      {phases.map((phase, index) => (
        <PhaseCard 
          key={phase.id} 
          phase={phase}
          phaseNumber={index + 1} 
          onDelete={() => handleDeletePhase(index, phases, setPhases)}
          jobStartDate={startDate}
          onUpdate={handlePhaseUpdate}
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
              handleAddPhase(phases, setPhases, startDate);
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
    </div>
  );
}