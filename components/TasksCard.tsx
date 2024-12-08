// components/TasksCard.tsx
import React, { useState } from 'react';
import SmallCardFrame from './SmallCardFrame';

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

  const calculateDueDate = (startDate: string, duration: number) => {
    try {
      const date = new Date(startDate);
      date.setDate(date.getDate() + duration);
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold mb-2">Tasks</h4>
      <div className="space-y-2">
        {tasks.map((task) => {
          const dueDate = calculateDueDate(task.task_startdate, task.task_duration);
          const isExpanded = expandedTaskId === task.task_id;

          return (
            <div
              key={task.task_id}
              onClick={() => setExpandedTaskId(isExpanded ? null : task.task_id)}
              className="cursor-pointer"
            >
              <SmallCardFrame>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm font-medium col-span-1">{task.task_title}</span>
                  <span className="text-sm text-center col-span-1">{dueDate}</span>
                  <div className="flex justify-end col-span-1">
                    <span className={`text-sm px-3 py-1 rounded ${
                      task.task_status === 'Complete' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {task.task_status}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                <div className="mt-2 pt-2 border-t">
                  {task.task_description && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">Description:</h5>
                      <SmallCardFrame>
                        <p className="text-sm">{task.task_description}</p>
                      </SmallCardFrame>
                    </div>
                  )}
                  
                  {task.users && task.users.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium mb-2">Assigned People:</h5>
                      {task.users.map((user) => (
                        <SmallCardFrame key={user.user_id}>
                          <div className="grid grid-cols-3 items-center">
                            <span className="text-sm">{user.user_name}</span>
                            <span className="text-sm text-center">{user.user_phone}</span>
                            <span className="text-sm text-right">{user.user_email}</span>
                          </div>
                        </SmallCardFrame>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </SmallCardFrame>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksCard;