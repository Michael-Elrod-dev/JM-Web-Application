// components/PhaseCard.tsx

import React, { useState, useEffect } from 'react';
import { contacts } from '../../data/contactsData';
import CardFrame from '../CardFrame';
import TaskCard from './NewTaskCard';
import MaterialCard from './NewMaterialCard';
import NoteCard from './NewNoteCard';
import { FaPlus } from 'react-icons/fa';
import { deleteItem, addItem } from '../../handlers/phases';

interface PhaseCardProps {
  phase: Phase;
  phaseNumber: number;
  onDelete: () => void;
  jobStartDate: string;
  onUpdate: (updatedPhase: Phase) => void;
}

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

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  phaseNumber, 
  onDelete, 
  jobStartDate,
  onUpdate 
}) => {
  const [title, setTitle] = useState(phase.title);
  const [startDate, setStartDate] = useState(jobStartDate);
  const [description, setDescription] = useState(phase.description);
  const [tasks, setTasks] = useState<Task[]>(phase.tasks);
  const [materials, setMaterials] = useState<Material[]>(phase.materials);
  const [notes, setNotes] = useState<Note[]>(phase.notes || []);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isAddingNote, setIsAddingNote] = useState(false);

  const getInputClassName = (value: string, field: string) => {
    const baseClass = "w-full p-2 border rounded";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300";
    
    return `${baseClass} ${attempted && !value && errors[field] ? errorClass : normalClass}`;
  };

  useEffect(() => {
    if (jobStartDate && !startDate) {
      setStartDate(jobStartDate);
    }
  }, [jobStartDate, startDate]);

  const addNewTask = () => {
    setIsAddingTask(true);
  };

  const saveTask = (newTask: Task) => {
    const taskWithId = {
      ...newTask,
      id: newTask.id || `task-${Date.now()}`,
      isExpanded: false
    };
    
    setTasks(prevTasks => {
      if (newTask.id === '') {
        return [...prevTasks, taskWithId];
      } else {
        return prevTasks.map(task => 
          task.id === taskWithId.id ? taskWithId : task
        );
      }
    });
    setIsAddingTask(false);
  };

  // When updating tasks, preserve their dates
  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  // When phase date changes, don't modify task dates
  const handleInputChange = (field: string, value: string) => {
    switch(field) {
      case 'title':
        setTitle(value);
        onUpdate({
          ...phase,
          title: value
        });
        break;
      case 'startDate':
        setStartDate(value);
        onUpdate({
          ...phase,
          startDate: value
        });
        break;
      case 'description':
        setDescription(value);
        onUpdate({
          ...phase,
          description: value
        });
        break;
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const deleteTask = (taskId: string) => {
    if (taskId) {
      deleteItem(tasks, taskId, setTasks);
    }
    setIsAddingTask(false);
  };

  // Material handlers
  const addNewMaterial = () => {
    setIsAddingMaterial(true);
  };

  const saveMaterial = (newMaterial: Material) => {
    const materialWithId = {
      ...newMaterial,
      id: newMaterial.id || `material-${Date.now()}`,
      isExpanded: false
    };
    
    if (newMaterial.id === '') {
      addItem(materials, setMaterials, materialWithId);
    } else {
      setMaterials(materials.map(material => 
        material.id === materialWithId.id ? materialWithId : material
      ));
    }
    setIsAddingMaterial(false);
  };

  const updateMaterial = (updatedMaterial: Material) => {
    setMaterials(materials.map(material => 
      material.id === updatedMaterial.id ? updatedMaterial : material
    ));
  };

  const deleteMaterial = (materialId: string) => {
    if (materialId) {
      deleteItem(materials, materialId, setMaterials);
    }
    setIsAddingMaterial(false);
  };

  // Note handlers
  const addNewNote = () => {
    setIsAddingNote(true);
  };

  const saveNote = (newNote: Note) => {
    const noteWithId = {
      ...newNote,
      id: newNote.id || `note-${Date.now()}`,
      isExpanded: false
    };
    
    if (newNote.id === '') {
      setNotes([...notes, noteWithId]);
    } else {
      setNotes(notes.map(note => 
        note.id === noteWithId.id ? noteWithId : note
      ));
    }
    setIsAddingNote(false);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (noteId: string) => {
    if (noteId) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
    setIsAddingNote(false);
  };

  const handleSave = () => {
    setAttempted(true);
    const newErrors: {[key: string]: string} = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsMinimized(!isMinimized);
    }
  };

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
            onClick={handleSave}
            className={`mr-2 px-2 py-1 text-white rounded ${
              isMinimized 
                ? 'bg-gray-500 hover:bg-gray-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isMinimized ? 'Edit' : 'Done'}
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Phase Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={getInputClassName(title, 'title')}
              />
              {attempted && errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={jobStartDate}
                className={getInputClassName(startDate, 'startDate')}
              />
              {attempted && errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">Tasks</h3>
              {!isAddingTask && (
                <button 
                  onClick={addNewTask} 
                  className="w-6 h-6 rounded-full bg-white text-black border border-zinc-300 flex items-center justify-center hover:bg-zinc-100"
                >
                  <FaPlus size={12} />
                </button>
              )}
            </div>
            
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
            
            {isAddingTask && (
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
                onDelete={() => setIsAddingTask(false)}
                phaseStartDate={startDate}
                contacts={contacts}
              />
            )}
          </div>

          {/* Materials Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">Materials</h3>
              {!isAddingMaterial && (
                <button 
                  onClick={addNewMaterial} 
                  className="w-6 h-6 rounded-full bg-white text-black border border-zinc-300 flex items-center justify-center hover:bg-zinc-100"
                >
                  <FaPlus size={12} />
                </button>
              )}
            </div>
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
            {isAddingMaterial && (
              <MaterialCard
                material={{
                  id: '',
                  title: '',
                  dueDate: startDate,
                  status: '',
                  details: '',
                  isExpanded: true,
                }}
                onUpdate={saveMaterial}
                onDelete={() => setIsAddingMaterial(false)}
                phaseStartDate={startDate}
                contacts={contacts}
              />
            )}
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">Notes</h3>
              {!isAddingNote && (
                <button 
                  onClick={addNewNote} 
                  className="w-6 h-6 rounded-full bg-white text-black border border-zinc-300 flex items-center justify-center hover:bg-zinc-100"
                >
                  <FaPlus size={12} />
                </button>
              )}
            </div>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
            {isAddingNote && (
              <NoteCard
                note={{
                  id: '',
                  content: '',
                  isExpanded: true,
                }}
                onUpdate={saveNote}
                onDelete={() => setIsAddingNote(false)}
              />
            )}
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