// components/PhaseCard.tsx

import React, { useState, useEffect } from 'react';
import { Contact, contacts } from '../data/contactsData';
import CardFrame from './CardFrame';
import TaskCard from './TaskCard';
import MaterialCard from './MaterialCard';

import {
  calculateEndDate,
  calculateDuration,
  handleStartDateChange,
  handleDurationChange,
  handleEndDateChange,
  toggleExpansion,
  deleteItem,
  addItem,
} from '../handlers/phases';

interface PhaseCardProps {
  phaseNumber: number;
  onDelete: () => void;
  jobStartDate: string;
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
  startDate: string;
  duration: string;
  dueDate: string;
  status: string;
  details: string;
  isExpanded: boolean;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phaseNumber, onDelete, jobStartDate }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(jobStartDate);
  const [duration, setDuration] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material | null>(null);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  useEffect(() => {
    if (startDate && duration) {
      const end = calculateEndDate(startDate, parseInt(duration));
      setEndDate(end);
    }
  }, [startDate, duration]);

  const handlePhaseStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStartDateChange(e.target.value, jobStartDate, duration, setStartDate, setEndDate);
  };

  const handlePhaseDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDurationChange(e.target.value, startDate, setDuration, setEndDate);
  };

  const handlePhaseEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleEndDateChange(e.target.value, startDate, setEndDate, setDuration);
  };

  const addNewTask = () => {
    setIsAddingTask(true);
  };

  const saveTask = (newTask: Task) => {
    addItem(tasks, setTasks, { ...newTask, isExpanded: false });
    setIsAddingTask(false);
  };

  const cancelNewTask = () => {
    setIsAddingTask(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskId: string) => {
    deleteItem(tasks, taskId, setTasks);
  };

  const addNewMaterial = () => {
    setIsAddingMaterial(true);
  };

  const saveMaterial = (newMaterial: Material) => {
    addItem(materials, setMaterials, { ...newMaterial, isExpanded: false });
    setIsAddingMaterial(false);
  };

  const cancelNewMaterial = () => {
    setIsAddingMaterial(false);
  };

  const updateMaterial = (updatedMaterial: Material) => {
    setMaterials(materials.map(material => (material.id === updatedMaterial.id ? updatedMaterial : material)));
  };

  const deleteMaterial = (materialId: string) => {
    deleteItem(materials, materialId, setMaterials);
  };

  const addNote = () => addItem(notes, setNotes, '');

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <CardFrame>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Phase {phaseNumber}</h2>
        <div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="mr-2 px-2 py-1 bg-zinc-500 text-white rounded"
          >
            {isMinimized ? 'Show' : 'Hide'}
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Phase Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={handlePhaseStartDateChange}
                min={jobStartDate}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Duration (days)</label>
              <input
                type="number"
                value={duration}
                onChange={handlePhaseDurationChange}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={handlePhaseEndDateChange}
                min={startDate}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
        <h3 className="text-xl font-bold mb-2">Tasks</h3>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={updateTask}
            onDelete={() => deleteTask(task.id)}
            phaseStartDate={startDate}
            contacts={contacts}
          />
        ))}
        {isAddingTask ? (
          <TaskCard
            task={{
              id: '',
              title: '',
              startDate: startDate,
              duration: '',
              dueDate: '',
              status: '',
              details: '',
              isExpanded: true,
            }}
            onUpdate={saveTask}
            onDelete={cancelNewTask}
            phaseStartDate={startDate}
            contacts={contacts}
          />
        ) : (
          <button onClick={addNewTask} className="text-blue-500">+ Add Task</button>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Materials</h3>
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onUpdate={updateMaterial}
            onDelete={() => deleteMaterial(material.id)}
            phaseStartDate={startDate}
            contacts={contacts}
          />
        ))}
        {isAddingMaterial ? (
          <MaterialCard
            material={{
              id: '',
              title: '',
              startDate: startDate,
              duration: '',
              dueDate: '',
              status: '',
              details: '',
              isExpanded: true,
            }}
            onUpdate={saveMaterial}
            onDelete={cancelNewMaterial}
            phaseStartDate={startDate}
            contacts={contacts}
          />
        ) : (
          <button onClick={addNewMaterial} className="text-blue-500">+ Add Material</button>
        )}
      </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Notes</h3>
            {notes.map((note, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-zinc-700">Note {index + 1}</label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    newNotes[index] = e.target.value;
                    setNotes(newNotes);
                  }}
                  className="w-full p-2 border rounded mb-2"
                  rows={2}
                />
              </div>
            ))}
            <button onClick={addNote} className="text-blue-500">+ Add Note</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>Are you sure you want to delete this phase?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="mr-2 px-4 py-2 bg-zinc-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </CardFrame>
  );
};

export default PhaseCard;