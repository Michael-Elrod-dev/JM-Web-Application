// components/NewJobFrame.tsx

import React, { useState, useEffect } from 'react';
import CardFrame from './CardFrame';
import JobButton from './JobButton';
import PhaseCard from './PhaseCard';
import { FaPlus } from 'react-icons/fa';
import { handleAddPhase, handleDeletePhase, handleCreate, handleCancel } from '../handlers/jobs';

const NewJobFrame: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [estimatedEndDate, setEstimatedEndDate] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<number[]>([]);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Check if required fields are filled
    setIsFormValid(
      jobTitle !== '' &&
      startDate !== '' &&
      duration !== '' &&
      estimatedEndDate !== ''
    );
  }, [jobTitle, startDate, duration, estimatedEndDate]);

  const calculateEndDate = (start: string, durationDays: number) => {
    const date = new Date(start);
    date.setDate(date.getDate() + durationDays);
    return date.toISOString().split('T')[0];
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (duration) {
      setEstimatedEndDate(calculateEndDate(newStartDate, parseInt(duration)));
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    if (startDate) {
      setEstimatedEndDate(calculateEndDate(startDate, parseInt(newDuration)));
    }
  };

  const handleEstimatedEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEstimatedEndDate(newEndDate);
    if (startDate) {
      setDuration(calculateDuration(startDate, newEndDate).toString());
    }
  };

  return (
    <>
      <CardFrame>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-700 dark:text-white">Title*</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
              placeholder="Job title..."
              required
            />
          </div>

        <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 dark:text-white">Start Date*</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-zinc-700 dark:text-white">Duration (days)*</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={handleDurationChange}
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="estimatedEndDate" className="block text-sm font-medium text-zinc-700 dark:text-white">Estimated End Date*</label>
              <input
                type="date"
                id="estimatedEndDate"
                value={estimatedEndDate}
                onChange={handleEstimatedEndDateChange}
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
          onClick={() => handleAddPhase(phases, setPhases)}
          color="default"
          disabled={!isFormValid}
        />
        <JobButton
          title="Create"
          onClick={handleCreate}
          color="green"
        />
        <JobButton
          title="Cancel"
          onClick={() => handleCancel(
            setJobTitle, setClientName, setClientPhone, setClientEmail,
            setStartDate, setDuration, setEstimatedEndDate, setJobLocation, setDescription, setPhases
          )}
          color="red"
        />
      </div>
    </>
  );
};

export default NewJobFrame;