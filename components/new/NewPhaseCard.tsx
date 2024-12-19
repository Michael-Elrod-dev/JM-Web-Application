// components/PhaseCard.tsx

import React, { useState, useEffect } from "react";
import CardFrame from "../CardFrame";
import TaskCard from "./NewTaskCard";
import MaterialCard from "./NewMaterialCard";
import NoteCard from "./NewNoteCard";
import { FaPlus } from "react-icons/fa";
import { PhaseCardProps } from "@/app/types/props";
import { FormTask, FormMaterial, FormNote } from "../../app/types/database";
import { UserView } from "../../app/types/views";

const emptyTask: FormTask = {
  id: "",
  title: "",
  startDate: "",
  duration: "",
  details: "",
  isExpanded: true,
  selectedContacts: [],
};

const emptyMaterial: FormMaterial = {
  id: "",
  title: "",
  dueDate: "",
  details: "",
  isExpanded: true,
  selectedContacts: [],
};

const emptyNote: FormNote = {
  id: "",
  content: "",
  isExpanded: true,
};

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  phaseNumber,
  onDelete,
  jobStartDate,
  onUpdate,
}) => {
  const [contacts, setContacts] = useState<UserView[]>([]);
  const [title, setTitle] = useState(phase.title);
  const [startDate, setStartDate] = useState(jobStartDate);
  const [description, setDescription] = useState(phase.description);
  const [tasks, setTasks] = useState<FormTask[]>(phase.tasks);
  const [materials, setMaterials] = useState<FormMaterial[]>(phase.materials);
  const [notes, setNotes] = useState<FormNote[]>(phase.notes || []);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isAddingNote, setIsAddingNote] = useState(false);

  const getInputClassName = (value: string, field: string) => {
    const baseClass = "w-full p-2 border rounded";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300 dark:border-zinc-600";
    const darkModeClass = "dark:bg-zinc-800 dark:text-white";

    return `${baseClass} ${
      attempted && errors[field] ? errorClass : normalClass
    } ${darkModeClass}`;
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/users/workers');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);
  
  useEffect(() => {
    if (jobStartDate && !startDate) {
      setStartDate(jobStartDate);
    }
  }, [jobStartDate, startDate]);

  const addNewTask = () => {
    setIsAddingTask(true);
  };

  const saveTask = (newTask: FormTask) => {
    const taskId = newTask.id || `task-${Date.now()}`;
    const taskWithId = {
      ...newTask,
      id: taskId,
      isExpanded: false,
    };

    const updatedTasks =
      newTask.id === ""
        ? [...tasks, taskWithId]
        : tasks.map((task) => (task.id === taskId ? taskWithId : task));

    setTasks(updatedTasks);
    onUpdate({
      ...phase,
      tasks: updatedTasks,
      materials,
      notes,
    });
    setIsAddingTask(false);
  };

  const updateTask = (updatedTask: FormTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    onUpdate({
      ...phase,
      tasks: updatedTasks,
      materials,
      notes,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "description":
        setDescription(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Update parent with all changes
    onUpdate({
      ...phase,
      title: field === "title" ? value : title,
      startDate: field === "startDate" ? value : startDate,
      description: field === "description" ? value : description,
      tasks,
      materials,
      notes,
    });
  };

  const deleteTask = (taskId: string) => {
    if (taskId) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      onUpdate({
        ...phase,
        tasks: updatedTasks,
        materials,
        notes,
      });
    }
    setIsAddingTask(false);
  };

  // Material handlers
  const addNewMaterial = () => {
    setIsAddingMaterial(true);
  };

  const saveMaterial = (newMaterial: FormMaterial) => {
    const materialId = newMaterial.id || `material-${Date.now()}`;
    const materialWithId = {
      ...newMaterial,
      id: materialId,
      isExpanded: false,
    };

    const updatedMaterials =
      newMaterial.id === ""
        ? [...materials, materialWithId]
        : materials.map((material) =>
            material.id === materialId ? materialWithId : material
          );

    setMaterials(updatedMaterials);
    onUpdate({
      ...phase,
      tasks,
      materials: updatedMaterials,
      notes,
    });
    setIsAddingMaterial(false);
  };

  const updateMaterial = (updatedMaterial: FormMaterial) => {
    const updatedMaterials = materials.map((material) =>
      material.id === updatedMaterial.id ? updatedMaterial : material
    );
    setMaterials(updatedMaterials);
    onUpdate({
      ...phase,
      tasks,
      materials: updatedMaterials,
      notes,
    });
  };

  const deleteMaterial = (materialId: string) => {
    if (materialId) {
      const updatedMaterials = materials.filter(
        (material) => material.id !== materialId
      );
      setMaterials(updatedMaterials);
      onUpdate({
        ...phase,
        tasks,
        materials: updatedMaterials,
        notes,
      });
    }
    setIsAddingMaterial(false);
  };

  // Note handlers
  const addNewNote = () => {
    setIsAddingNote(true);
  };

  const saveNote = (newNote: FormNote) => {
    const noteId = newNote.id || `note-${Date.now()}`;
    const noteWithId = {
      ...newNote,
      id: noteId,
      isExpanded: false,
    };

    const updatedNotes =
      newNote.id === ""
        ? [...notes, noteWithId]
        : notes.map((note) => (note.id === noteId ? noteWithId : note));

    setNotes(updatedNotes);
    onUpdate({
      ...phase,
      tasks,
      materials,
      notes: updatedNotes,
    });
    setIsAddingNote(false);
  };

  const updateNote = (updatedNote: FormNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    onUpdate({
      ...phase,
      tasks,
      materials,
      notes: updatedNotes,
    });
  };

  const deleteNote = (noteId: string) => {
    if (noteId) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      onUpdate({
        ...phase,
        tasks,
        materials,
        notes: updatedNotes,
      });
    }
    setIsAddingNote(false);
  };

  const handleSave = () => {
    setAttempted(true);
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!startDate) newErrors.startDate = "Start date is required";
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
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isMinimized ? "Edit" : "Done"}
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
              {/* Phase Title input */}
              <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                Phase Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={getInputClassName(title, "title")}
              />
              {attempted && errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              {/* Start Date input */}
              <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={jobStartDate}
                className={getInputClassName(startDate, "startDate")}
              />
              {attempted && errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
          </div>

          <div>
            {/* Description textarea */}
            <label className="block text-sm font-medium text-zinc-700 dark:text-white">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded dark:bg-zinc-800 dark:text-white"
              rows={3}
            />
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Tasks
              </h3>
              {!isAddingTask && (
                <button
                  onClick={addNewTask}
                  className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 text-black dark:text-white border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-600"
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
                contacts={contacts as UserView[]}
              />
            ))}

            {isAddingTask && (
              <TaskCard
                task={{
                  ...emptyTask,
                  startDate: startDate,
                }}
                onUpdate={saveTask}
                onDelete={() => setIsAddingTask(false)}
                phaseStartDate={startDate}
                contacts={contacts as UserView[]}
              />
            )}
          </div>

          {/* Materials Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Materials
              </h3>
              {!isAddingMaterial && (
                <button
                  onClick={addNewMaterial}
                  className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 text-black dark:text-white border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-600"
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
                contacts={contacts as UserView[]}
              />
            ))}
            {isAddingMaterial && (
              <MaterialCard
                material={{
                  ...emptyMaterial,
                  dueDate: startDate,
                }}
                onUpdate={saveMaterial}
                onDelete={() => setIsAddingMaterial(false)}
                phaseStartDate={startDate}
                contacts={contacts as UserView[]}
              />
            )}
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Notes
              </h3>
              {!isAddingNote && (
                <button
                  onClick={addNewNote}
                  className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 text-black dark:text-white border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-600"
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
                note={emptyNote}
                onUpdate={saveNote}
                onDelete={() => setIsAddingNote(false)}
              />
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-300 dark:border-zinc-600">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
              Delete Phase
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Are you sure you want to delete this phase?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
