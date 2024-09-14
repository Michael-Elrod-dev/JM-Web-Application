// components/NewJobFrame.tsx

import React, { useState } from 'react';
import CardFrame from './CardFrame';

const NewJobFrame: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleAddPhase = () => {
    console.log('Add a Phase clicked');
    // Logic to add a new phase
  };

  const handleCreate = () => {
    console.log('Create clicked');
    // Logic to create the job (e.g., send data to API)
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    // Logic to reset all fields
    setJobTitle('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setStartDate('');
    setEndDate('');
    setJobLocation('');
    setDescription('');
  };

  return (
    <CardFrame>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Job title..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Name Here"
            />
          </div>
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone Number</label>
            <input
              type="tel"
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="999-999-9999"
            />
          </div>
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="client@gmail.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Estimated End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Job Location</label>
          <input
            type="text"
            id="jobLocation"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Address where the property is located..."
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="This is a detailed or high level description of the job..."
          ></textarea>
        </div>
      </div>
    </CardFrame>
  );
};

export default NewJobFrame;