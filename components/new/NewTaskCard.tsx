// components/TaskCard.tsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ContactCard from "../ContactCard";
import { calculateEndDate } from "../../handlers/phases";
import { FormTask } from "../../app/types/database";
import { UserView } from "../../app/types/views";

interface TaskCardProps {
  task: FormTask;
  onUpdate: (updatedTask: FormTask) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: UserView[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  phaseStartDate,
  contacts,
}) => {
  const [selectedContacts, setSelectedContacts] = useState<UserView[]>(
    task.selectedContacts
      ?.map((id) => contacts.find((c) => c.user_id === parseInt(id.toString())) as UserView)
      .filter(Boolean) || []
  );
  const [localTask, setLocalTask] = useState<FormTask>(task);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task.id === "" && !task.startDate) {
      setLocalTask((prev) => ({
        ...prev,
        startDate: phaseStartDate,
      }));
    }
  }, [task.id, task.startDate, phaseStartDate]);

  const handleStartDateChange = (newStartDate: string) => {
    if (new Date(newStartDate) >= new Date(phaseStartDate)) {
      setLocalTask((prev) => ({
        ...prev,
        startDate: newStartDate,
      }));
      setErrors((prev) => ({ ...prev, startDate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        startDate: "Task cannot start before phase start date",
      }));
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const handleInputChange = (field: keyof FormTask, value: string) => {
    setLocalTask((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDurationChange = (newDuration: string) => {
    const newDueDate = calculateEndDate(
      localTask.startDate,
      parseInt(newDuration) || 0
    );
    setLocalTask((prev) => ({
      ...prev,
      duration: newDuration,
      dueDate: newDueDate,
    }));
  };

  const handleContactSelect = (contact: UserView) => {
    setSelectedContacts([...selectedContacts, contact]);
  };

  const handleContactRemove = (userId: string) => {
    setSelectedContacts(
      selectedContacts.filter((contact) => contact.user_id.toString() !== userId)
    );
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const validateTask = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!localTask.title.trim()) newErrors.title = "Title is required";
    if (!localTask.startDate) newErrors.startDate = "Start date is required";
    if (!localTask.duration) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDone = () => {
    if (validateTask()) {
      const updatedTask = {
        ...localTask,
        selectedContacts: selectedContacts.map((contact) => ({
          id: contact.user_id.toString(),
        })),
        isExpanded: false,
      };
      onUpdate(updatedTask);
      setLocalTask(updatedTask);
    }
  };

  return (
    <div className="mb-4 p-4 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800">
      {localTask.isExpanded ? (
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full p-2 border ${
                errors.title
                  ? "border-red-500"
                  : "border-zinc-300 dark:border-zinc-600"
              } rounded dark:bg-zinc-800 dark:text-white`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={localTask.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={phaseStartDate}
                className={`w-full p-2 border ${
                  errors.startDate
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-600"
                } rounded dark:bg-zinc-800 dark:text-white`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Duration (days)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={localTask.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                min="1"
                className={`w-full p-2 border ${
                  errors.duration
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-600"
                } rounded dark:bg-zinc-800 dark:text-white`}
              />
              {errors.duration && (
                <p className="text-red-500 text-xs">{errors.duration}</p>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Details
            </label>
            <textarea
              value={localTask.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded dark:bg-zinc-800 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Add People
            </label>
            <select
              onChange={(e) => {
                const selectedContact = contacts.find(
                  (contact) => contact.user_id === parseInt(e.target.value)
                );
                if (selectedContact) {
                  handleContactSelect(selectedContact);
                  e.target.value = "";
                }
              }}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Select a person</option>
              {contacts.map((contact: UserView) => (
                <option key={contact.user_id} value={contact.user_id}>
                  {`${contact.first_name} ${contact.last_name}`}
                </option>
              ))}
            </select>
            <div className="mt-2 space-y-2">
              {selectedContacts.map((contact: UserView) => (
                <div key={contact.user_id} className="relative">
                  <ContactCard
                    user_id={contact.user_id}
                    user_first_name={contact.first_name}
                    user_last_name={contact.last_name}
                    user_email={contact.user_email}
                    user_phone={contact.user_phone}
                    showCheckbox={false}
                  />
                  <button
                    onClick={() => handleContactRemove(contact.user_id.toString())}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-600"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDone}
              className="mr-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Done
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 items-center">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {localTask.title}
          </div>
          <div className="text-center">{formatDate(localTask.startDate)}</div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                const updatedTask = { ...localTask, isExpanded: true };
                setLocalTask(updatedTask);
                onUpdate(updatedTask);
              }}
              className="mr-2 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-300 dark:border-zinc-600">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
              Delete Task
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Are you sure you want to delete this task?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;