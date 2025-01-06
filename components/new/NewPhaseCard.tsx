// components/PhaseCard.tsx

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardFrame from "../util/CardFrame";
import TaskCard from "./NewTaskCard";
import MaterialCard from "./NewMaterialCard";
import NoteCard from "./NewNoteCard";
import { UserView } from "../../app/types/views";
import { PhaseCardProps } from "../../app/types/props";
import { FormTask, FormMaterial, FormNote } from "@/app/types/database";

import {
  handleTitleClick,
  handleTitleBlur,
  handleTitleKeyDown,
  handleInputChange,
  updateTask,
  deleteTask,
  updateMaterial,
  deleteMaterial,
  updateNote,
  deleteNote,
} from "../../handlers/new/phases";

const NewPhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  onDelete,
  jobStartDate,
  onUpdate,
  onAddPhaseAfter,
  onMovePhase,
}) => {
  const [contacts, setContacts] = useState<UserView[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPhaseCollapsed, setIsPhaseCollapsed] = useState(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isMaterialsExpanded, setIsMaterialsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);

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
    <div className="relative group">
      {/* Movement controls */}
      <div className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors
            ${
              phase.isFirst
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          onClick={() => !phase.isFirst && onMovePhase("up")}
          disabled={phase.isFirst}
          title={phase.isFirst ? "Can't move up" : "Move phase up"}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors
            ${
              phase.isLast
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          onClick={() => !phase.isLast && onMovePhase("down")}
          disabled={phase.isLast}
          title={phase.isLast ? "Can't move down" : "Move phase down"}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className="relative">
        <CardFrame>
          {/* Title and Description Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={phase.title}
                  onChange={(e) =>
                    handleInputChange("title", e.target.value, phase, onUpdate)
                  }
                  onBlur={() => handleTitleBlur(setIsEditingTitle)}
                  onKeyDown={(e) => handleTitleKeyDown(e, setIsEditingTitle)}
                  autoFocus
                  className="text-2xl font-bold bg-transparent border-b border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h2
                  className="text-2xl font-bold cursor-text"
                  onClick={() =>
                    handleTitleClick(isPhaseCollapsed, setIsEditingTitle)
                  }
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
                  onChange={(e) =>
                    handleInputChange(
                      "startDate",
                      e.target.value,
                      phase,
                      onUpdate
                    )
                  }
                  min={jobStartDate}
                  className="p-2 border rounded-md shadow-sm dark:bg-zinc-800 dark:text-white dark:border-zinc-600 border-zinc-300"
                />
              </div>
              <button
                onClick={() => setIsPhaseCollapsed(!isPhaseCollapsed)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                {isPhaseCollapsed ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
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
                  onChange={(e) =>
                    handleInputChange(
                      "description",
                      e.target.value,
                      phase,
                      onUpdate
                    )
                  }
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded dark:bg-zinc-800 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Tasks Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Tasks
                  </h3>
                  <button
                    onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {isTasksExpanded ? (
                      <FaChevronDown size={20} />
                    ) : (
                      <FaChevronUp size={20} />
                    )}
                  </button>
                </div>
                {isTasksExpanded && (
                  <div className="space-y-2">
                    {phase.tasks
                      .sort(
                        (a, b) =>
                          new Date(a.startDate).getTime() -
                          new Date(b.startDate).getTime()
                      )
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdate={(updatedTask) =>
                            updateTask(updatedTask, phase, onUpdate)
                          }
                          onDelete={() =>
                            deleteTask(
                              task.id,
                              phase,
                              onUpdate,
                              setIsAddingTask
                            )
                          }
                          phaseStartDate={phase.startDate}
                          contacts={contacts}
                        />
                      ))}

                    {/* Add new task button */}
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={() => {
                          const newTask: FormTask = {
                            id: `task-${Date.now()}`,
                            title: "",
                            startDate: phase.startDate,
                            duration: "1",
                            details: "",
                            selectedContacts: [],
                            isExpanded: true,
                            offset: 0,
                          };
                          const updatedTasks = [...phase.tasks, newTask].sort(
                            (a, b) =>
                              new Date(a.startDate).getTime() -
                              new Date(b.startDate).getTime()
                          );
                          onUpdate({
                            ...phase,
                            tasks: updatedTasks,
                          });

                          // Add scroll behavior
                          setTimeout(() => {
                            const element = document.getElementById(
                              `task-${newTask.id}`
                            );
                            if (element) {
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }, 100);
                        }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Materials Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Materials
                  </h3>
                  <button
                    onClick={() => setIsMaterialsExpanded(!isMaterialsExpanded)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {isMaterialsExpanded ? (
                      <FaChevronDown size={20} />
                    ) : (
                      <FaChevronUp size={20} />
                    )}
                  </button>
                </div>
                {isMaterialsExpanded && (
                  <div className="space-y-2">
                    {phase.materials
                      .sort(
                        (a, b) =>
                          new Date(a.dueDate).getTime() -
                          new Date(b.dueDate).getTime()
                      )
                      .map((material) => (
                        <MaterialCard
                          key={material.id}
                          material={material}
                          onUpdate={(updatedMaterial) =>
                            updateMaterial(updatedMaterial, phase, onUpdate)
                          }
                          onDelete={() =>
                            deleteMaterial(
                              material.id,
                              phase,
                              onUpdate,
                              setIsAddingMaterial
                            )
                          }
                          phaseStartDate={phase.startDate}
                          contacts={contacts}
                        />
                      ))}

                    {/* Add new material button */}
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={() => {
                          const newMaterial: FormMaterial = {
                            id: `material-${Date.now()}`,
                            title: "",
                            dueDate: phase.startDate,
                            offset: 0,
                            details: "",
                            selectedContacts: [],
                            isExpanded: true,
                          };
                          const updatedMaterials = [
                            ...phase.materials,
                            newMaterial,
                          ].sort(
                            (a, b) =>
                              new Date(a.dueDate).getTime() -
                              new Date(b.dueDate).getTime()
                          );
                          onUpdate({
                            ...phase,
                            materials: updatedMaterials,
                          });

                          // Add scroll behavior
                          setTimeout(() => {
                            const element = document.getElementById(
                              `material-${newMaterial.id}`
                            );
                            if (element) {
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }, 100);
                        }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Notes
                  </h3>
                  <button
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {isNotesExpanded ? (
                      <FaChevronDown size={20} />
                    ) : (
                      <FaChevronUp size={20} />
                    )}
                  </button>
                </div>
                {isNotesExpanded && (
                  <div className="space-y-2">
                    {phase.notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onUpdate={(updatedNote) =>
                          updateNote(updatedNote, phase, onUpdate)
                        }
                        onDelete={() =>
                          deleteNote(note.id, phase, onUpdate, setIsAddingNote)
                        }
                      />
                    ))}

                    {/* Add new note button */}
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={() => {
                          const newNote: FormNote = {
                            id: `note-${Date.now()}`,
                            content: "",
                            isExpanded: true,
                          };
                          const updatedNotes = [...phase.notes, newNote];
                          onUpdate({
                            ...phase,
                            notes: updatedNotes,
                          });
                        }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardFrame>

        {/* Add a Phase Button */}
        <div
          className={`absolute left-0 right-0 -bottom-4 h-8 flex justify-center items-center transition-opacity duration-200 ${
            showAddButton ? "opacity-100" : "opacity-0"
          }`}
          onMouseEnter={() => setShowAddButton(true)}
          onMouseLeave={() => setShowAddButton(false)}
        >
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            onClick={() => onAddPhaseAfter?.(phase.tempId)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPhaseCard;
