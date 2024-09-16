// components/PhaseCard.tsx

import React, { useState, useEffect } from 'react';
import CardFrame from './CardFrame';
import {
  calculateEndDate,
  calculateDuration,
  handleStartDateChange,
  handleDurationChange,
  handleEndDateChange,
  toggleExpansion,
  deleteItem,
  addItem
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

const PhaseCard: React.FC<PhaseCardProps> = ({ phaseNumber, onDelete, jobStartDate }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(jobStartDate);
  const [duration, setDuration] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTask, setNewTask] = useState<Task | null>(null);

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

  const handleTaskStartDateChange = (taskId: string, newStartDate: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            startDate: newStartDate,
            dueDate: calculateEndDate(newStartDate, parseInt(t.duration) || 0)
          } 
        : t
    ));
  };

  const handleTaskDurationChange = (taskId: string, newDuration: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            duration: newDuration,
            dueDate: calculateEndDate(t.startDate, parseInt(newDuration) || 0)
          } 
        : t
    ));
  };

  const handleTaskDueDateChange = (taskId: string, newDueDate: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            dueDate: newDueDate,
            duration: calculateDuration(t.startDate, newDueDate).toString()
          } 
        : t
    ));
  };

  const addNewTask = () => {
    setNewTask({
      id: Date.now().toString(),
      title: '',
      startDate: startDate,
      duration: '',
      dueDate: '',
      status: '',
      details: '',
      isExpanded: true,
    });
  };

  const saveTask = () => {
    if (newTask) {
      addItem(tasks, setTasks, { ...newTask, isExpanded: false });
      setNewTask(null);
    }
  };

  const cancelNewTask = () => {
    setNewTask(null);
  };

  const toggleTaskExpansion = (taskId: string) => {
    toggleExpansion(tasks, taskId, setTasks);
  };

  const deleteTask = (taskId: string) => {
    deleteItem(tasks, taskId, setTasks);
  };

  const addMaterial = () => addItem(materials, setMaterials, '');
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
            className="mr-2 px-2 py-1 bg-gray-200 rounded"
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
            <label className="block text-sm font-medium text-gray-700">Phase Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={handlePhaseStartDateChange}
                min={jobStartDate}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                value={duration}
                onChange={handlePhaseDurationChange}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
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
              <div key={task.id} className="mb-4 p-4 border rounded">
                {task.isExpanded ? (
                  <div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => {
                          const newTasks = tasks.map(t => 
                            t.id === task.id ? { ...t, title: e.target.value } : t
                          );
                          setTasks(newTasks);
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          value={task.startDate}
                          onChange={(e) => handleTaskStartDateChange(task.id, e.target.value)}
                          min={startDate}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                        <input
                          type="number"
                          value={task.duration}
                          onChange={(e) => handleTaskDurationChange(task.id, e.target.value)}
                          min="1"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => handleTaskDueDateChange(task.id, e.target.value)}
                          min={task.startDate}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Details</label>
                      <textarea
                        value={task.details}
                        onChange={(e) => {
                          const newTasks = tasks.map(t => 
                            t.id === task.id ? { ...t, details: e.target.value } : t
                          );
                          setTasks(newTasks);
                        }}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Add People</label>
                      <select className="w-full p-2 border rounded">
                        <option value="">Select a person</option>
                      </select>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => toggleTaskExpansion(task.id)}
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Minimize
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex justify-between items-center cursor-pointer" 
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <span>{task.title}</span>
                    <span>{task.startDate}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
{newTask && (
              <div className="mb-4 p-4 border rounded">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={newTask.startDate}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        startDate: e.target.value,
                        dueDate: calculateEndDate(e.target.value, parseInt(newTask.duration) || 0)
                      })}
                      min={startDate}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                    <input
                      type="number"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        duration: e.target.value,
                        dueDate: calculateEndDate(newTask.startDate, parseInt(e.target.value) || 0)
                      })}
                      min="1"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        dueDate: e.target.value,
                        duration: calculateDuration(newTask.startDate, e.target.value).toString()
                      })}
                      min={newTask.startDate}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    value={newTask.details}
                    onChange={(e) => setNewTask({ ...newTask, details: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add People</label>
                  <select className="w-full p-2 border rounded">
                    <option value="">Select a person</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={saveTask}
                    className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelNewTask}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {!newTask && (
              <button onClick={addNewTask} className="text-blue-500">+ Add Task</button>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Materials</h3>
            {materials.map((material, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">Material {index + 1}</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => {
                    const newMaterials = [...materials];
                    newMaterials[index] = e.target.value;
                    setMaterials(newMaterials);
                  }}
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
            ))}
            <button onClick={addMaterial} className="text-blue-500">+ Add Material</button>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Notes</h3>
            {notes.map((note, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">Note {index + 1}</label>
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
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
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