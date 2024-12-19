// components/TasksCard.tsx
import React, { useState } from "react";
import SmallCardFrame from "./SmallCardFrame";
import StatusButton from "./StatusButton";

interface User {
  user_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
}

interface Task {
  task_id: number;
  task_title: string;
  task_startdate: string;
  task_duration: number;
  task_status: string;
  task_description: string;
  users: User[];
}

interface TasksCardProps {
  tasks: Task[];
}

const TasksCard: React.FC<TasksCardProps> = ({ tasks }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const calculateDueDate = (startDate: string, duration: number): string => {
    try {
      const date = new Date(startDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid start date");
      }
      date.setDate(date.getDate() + duration + 1);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error calculating due date:", error);
      return "Invalid Date";
    }
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, task_status: newStatus } : task
      )
    );
  };

  const handleCardClick = (e: React.MouseEvent, taskId: number) => {
    if (!(e.target as HTMLElement).closest(".status-button")) {
      setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold mb-2">Tasks</h4>
      <div className="space-y-2">
        {localTasks.map((task) => {
          const dueDate = calculateDueDate(
            task.task_startdate,
            task.task_duration
          );
          const isExpanded = expandedTaskId === task.task_id;

          return (
            <div key={task.task_id}>
              <SmallCardFrame>
                <div
                  onClick={(e) => handleCardClick(e, task.task_id)}
                  className="cursor-pointer"
                >
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium col-span-1">
                      {task.task_title}
                    </span>
                    <span className="text-sm text-center col-span-1">
                      {dueDate}
                    </span>
                    <div className="flex justify-end col-span-1">
                      <div className="status-button">
                        <StatusButton
                          id={task.task_id}
                          type="task"
                          currentStatus={task.task_status}
                          onStatusChange={(newStatus) =>
                            handleStatusChange(task.task_id, newStatus)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t">
                      {task.task_description && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2">
                            Description:
                          </h5>
                          <SmallCardFrame>
                            <p className="text-sm">{task.task_description}</p>
                          </SmallCardFrame>
                        </div>
                      )}

                      {task.users && task.users.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium mb-2">
                            Assigned People:
                          </h5>
                          {task.users.map((user) => (
                            <SmallCardFrame key={user.user_id}>
                              <div className="grid grid-cols-3 items-center">
                                <span className="text-sm">
                                  {user.user_name}
                                </span>
                                <span className="text-sm text-center">
                                  {user.user_phone}
                                </span>
                                <span className="text-sm text-right">
                                  {user.user_email}
                                </span>
                              </div>
                            </SmallCardFrame>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModal(task.task_id);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded font-bold hover:bg-gray-600 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SmallCardFrame>

              {/* Edit Task Modal */}
              {activeModal === task.task_id && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setActiveModal(null);
                    }
                  }}
                >
                  <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-2xl w-full overflow-hidden relative">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Edit Task</h3>
                        <button
                          onClick={() => setActiveModal(null)}
                          className="text-gray-500 hover:text-gray-700"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                            defaultValue={task.task_title}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                            rows={3}
                            defaultValue={task.task_description}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Add Extension (Days)
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                            placeholder="Number of days"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Change Primary Contact
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600">
                            <option value="">Select Primary Contact</option>
                            {task.users.map((user) => (
                              <option key={user.user_id} value={user.user_id}>
                                {user.user_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Add People
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600">
                            <option value="">Select Person to Add</option>
                            <option value="1">John Doe</option>
                            <option value="2">Jane Smith</option>
                            <option value="3">Bob Johnson</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end gap-4">
                        <button
                          onClick={() => setActiveModal(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksCard;
