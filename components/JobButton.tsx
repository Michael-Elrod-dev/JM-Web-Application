// components/JobButton.tsx

import React from 'react';
import { IconType } from 'react-icons';

interface JobButtonProps {
  title: string;
  icon?: IconType;
  onClick: () => void;
  color: 'green' | 'red' | 'default';
}

const JobButton: React.FC<JobButtonProps> = ({ title, icon: Icon, onClick, color }) => {
  const getButtonColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getButtonColor()} w-40 h-10 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out`}
    >
      {Icon && <Icon className="mr-2" size={16} />}
      <span className="whitespace-nowrap">{title}</span>
    </button>
  );
};

export default JobButton;