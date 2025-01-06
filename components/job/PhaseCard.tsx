// components/PhaseCard.tsx
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import CardFrame from "../util/CardFrame";
import Note from "./NoteCard";
import TasksCard from "./TasksCard";
import MaterialsCard from "./MaterialsCard";
import SmallCardFrame from "../util/SmallCardFrame";
import { UserView } from "@/app/types/views";
import NewTaskCard from "../new/NewTaskCard";
import NewMaterialCard from "../new/NewMaterialCard";
import { FormTask, FormMaterial } from "@/app/types/database";

export interface DetailPhaseCardProps {
  phase: {
    phase_id: number;
    name: string;
    startDate: string;
    endDate: string;
    tasks: {
      task_id: number;
      task_title: string;
      task_startdate: string;
      task_duration: number;
      task_status: string;
      task_description: string;
      users: {
        user_id: number;
        first_name: string;
        last_name: string;
        user_email: string;
        user_phone: string;
      }[];
    }[];
    materials: {
      material_id: number;
      material_title: string;
      material_duedate: string;
      material_status: string;
      material_description: string;
      users: {
        user_id: number;
        first_name: string;
        last_name: string;
        user_email: string;
        user_phone: string;
      }[];
    }[];
    notes: any[];
  };
  phaseNumber: number;
  showTasks: boolean;
  showMaterials: boolean;
  contacts: UserView[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onStatusUpdate: (
    id: number,
    type: "task" | "material",
    newStatus: string
  ) => void;
  onTaskDelete: (taskId: number) => Promise<void>;
  onMaterialDelete: (materialId: number) => Promise<void>;
  onTaskCreate: (phaseId: number, task: FormTask) => Promise<any>;
  onMaterialCreate: (phaseId: number, material: FormMaterial) => Promise<any>;
}

const PhaseCard: React.FC<DetailPhaseCardProps> = ({
  phase,
  phaseNumber,
  showTasks = true,
  showMaterials = true,
  contacts,
  isCollapsed,
  onToggleCollapse,
  onStatusUpdate,
  onTaskDelete,
  onMaterialDelete,
  onTaskCreate,
  onMaterialCreate,
}) => {
  const params = useParams();
  const jobId = params?.id as string;
  const [notes, setNotes] = useState(phase.notes);
  const [newNote, setNewNote] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  // Format dates for display
  const startDate = new Date(phase.startDate).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
  const endDate = new Date(phase.endDate).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phase_id: phase.phase_id,
            note_details: newNote.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add note");
        }

        const data = await response.json();
        setNotes([...notes, data.note]);
        setNewNote("");
      } catch (error) {
        console.error("Failed to add note:", error);
      }
    }
  };

  return (
    <CardFrame>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Phase {phaseNumber} - {phase.name}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-md">
            {startDate} - {endDate}
          </span>
          <button
            onClick={onToggleCollapse}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {isCollapsed ? (
              <FaChevronDown size={20} />
            ) : (
              <FaChevronUp size={20} />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-4">
            {showTasks && (
              <div>
                <TasksCard
                  tasks={phase.tasks}
                  contacts={contacts}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onTaskDelete}
                />
                {isAddingTask && (
                  <NewTaskCard
                    task={{
                      id: `new-task-${Date.now()}`,
                      title: "",
                      startDate: phase.startDate,
                      duration: "1",
                      details: "",
                      selectedContacts: [],
                      isExpanded: true,
                      offset: 0,
                    }}
                    phaseStartDate={phase.startDate}
                    contacts={contacts}
                    onUpdate={async (updatedTask) => {
                      try {
                        await onTaskCreate(phase.phase_id, updatedTask);
                        setIsAddingTask(false);
                      } catch (error) {
                        console.error("Error creating task:", error);
                      }
                    }}
                    onDelete={() => setIsAddingTask(false)}
                  />
                )}
                {/* Add Task Button */}
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    onClick={() => setIsAddingTask(true)}
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

            {showMaterials && (
              <div>
                <MaterialsCard
                  materials={phase.materials}
                  contacts={contacts}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onMaterialDelete}
                />
                {isAddingMaterial && (
                  <NewMaterialCard
                    material={{
                      id: `new-material-${Date.now()}`,
                      title: "",
                      dueDate: phase.startDate,
                      details: "",
                      selectedContacts: [],
                      isExpanded: true,
                      offset: 0,
                    }}
                    phaseStartDate={phase.startDate}
                    contacts={contacts}
                    onUpdate={async (updatedMaterial) => {
                      try {
                        await onMaterialCreate(phase.phase_id, updatedMaterial);
                        setIsAddingMaterial(false);
                      } catch (error) {
                        console.error("Error creating material:", error);
                      }
                    }}
                    onDelete={() => setIsAddingMaterial(false)}
                  />
                )}
                {/* Add Material Button */}
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    onClick={() => setIsAddingMaterial(true)}
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

          <div className="mt-4">
            {/* Notes Section Title */}
            <h4 className="text-md font-semibold mb-2">Notes</h4>

            {/* Display Existing Notes */}
            <div className="space-y-2 mb-4">
              {notes.map((note, index) => (
                <SmallCardFrame key={index}>
                  <Note
                    {...note}
                    onClick={() =>
                      setExpandedNoteId(expandedNoteId === index ? null : index)
                    }
                    isExpanded={expandedNoteId === index}
                  />
                </SmallCardFrame>
              ))}
            </div>

            {/* Add New Note Section */}
            <SmallCardFrame>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Add New Note</h5>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type your note here..."
                  className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 shadow-sm"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </SmallCardFrame>
          </div>
        </>
      )}
    </CardFrame>
  );
};

export default PhaseCard;
