// components/PhaseCard.tsx

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardFrame from "../CardFrame";
import TaskCard from "./NewTaskCard";
import MaterialCard from "./NewMaterialCard";
import NoteCard from "./NewNoteCard";
import { UserView } from "../../app/types/views";
import { PhaseCardProps } from "../../app/types/props";

import {
  handleTitleClick,
  handleTitleBlur,
  handleTitleKeyDown,
  handleInputChange,
  addNewTask,
  saveTask,
  updateTask,
  deleteTask,
  addNewMaterial,
  saveMaterial,
  updateMaterial,
  deleteMaterial,
  addNewNote,
  saveNote,
  updateNote,
  deleteNote,
} from "../../handlers/new/phases";

const NewPhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  onDelete,
  jobStartDate,
  onUpdate,
}) => {
  const [contacts, setContacts] = useState<UserView[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPhaseCollapsed, setIsPhaseCollapsed] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isMaterialsExpanded, setIsMaterialsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/users/non-clients");
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <CardFrame>
      {/* Title and Description Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={phase.title}
              onChange={(e) => handleInputChange('title', e.target.value, phase, onUpdate)}
              onBlur={() => handleTitleBlur(setIsEditingTitle)}
              onKeyDown={(e) => handleTitleKeyDown(e, setIsEditingTitle)}
              autoFocus
              className="text-2xl font-bold bg-transparent border-b border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h2 
              className="text-2xl font-bold cursor-text" 
              onClick={() => handleTitleClick(isPhaseCollapsed, setIsEditingTitle)}
            >
              {phase.title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-white mr-2">
              Start Date
            </label>
            <input
              type="date"
              value={phase.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value, phase, onUpdate)}
              min={jobStartDate}
              className="p-2 border rounded-md shadow-sm dark:bg-zinc-800 dark:text-white dark:border-zinc-600 border-zinc-300"
            />
          </div>
          <button
            onClick={() => setIsPhaseCollapsed(!isPhaseCollapsed)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {isPhaseCollapsed ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </button>
        </div>
      </div>

      {!isPhaseCollapsed && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-white">
              Description
            </label>
            <textarea
              value={phase.description}
              onChange={(e) => handleInputChange('description', e.target.value, phase, onUpdate)}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded dark:bg-zinc-800 dark:text-white"
              rows={3}
            />
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Tasks</h3>
              <button
                onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                {isTasksExpanded ? <FaChevronDown size={20} /> : <FaChevronUp size={20} />}
              </button>
            </div>
            {isTasksExpanded && (
              <div className="space-y-2">
                {phase.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={(updatedTask) => updateTask(updatedTask, phase, onUpdate)}
                    onDelete={() => deleteTask(task.id, phase, onUpdate, setIsAddingTask)}
                    phaseStartDate={phase.startDate}
                    contacts={contacts}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Materials Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Materials</h3>
              <button
                onClick={() => setIsMaterialsExpanded(!isMaterialsExpanded)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                {isMaterialsExpanded ? <FaChevronDown size={20} /> : <FaChevronUp size={20} />}
              </button>
            </div>
            {isMaterialsExpanded && (
              <div className="space-y-2">
                {phase.materials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    onUpdate={(updatedMaterial) => updateMaterial(updatedMaterial, phase, onUpdate)}
                    onDelete={() => deleteMaterial(material.id, phase, onUpdate, setIsAddingMaterial)}
                    phaseStartDate={phase.startDate}
                    contacts={contacts}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Notes</h3>
              <button
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                {isNotesExpanded ? <FaChevronDown size={20} /> : <FaChevronUp size={20} />}
              </button>
            </div>
            {isNotesExpanded && (
              <div className="space-y-2">
                {phase.notes?.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={(updatedNote) => updateNote(updatedNote, phase, onUpdate)}
                    onDelete={() => deleteNote(note.id, phase, onUpdate, setIsAddingNote)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </CardFrame>
  );
};

export default NewPhaseCard;