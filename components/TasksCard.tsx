// components/TasksCard.tsx
import React from 'react';
import SmallCardFrame from './SmallCardFrame';

interface TasksCardProps {
  tasks: string[];
}

const TasksCard: React.FC<TasksCardProps> = ({ tasks }) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Tasks</h4>
      {tasks.map((task, index) => (
        <SmallCardFrame key={index}>
          <p className="text-sm">{task}</p>
        </SmallCardFrame>
      ))}
    </div>
  );
};

export default TasksCard;