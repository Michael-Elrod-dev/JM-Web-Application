// components/CardFrame.tsx

import React, { ReactNode } from 'react';

interface CardFrameProps {
  children: ReactNode;
  className?: string;
}

const CardFrame: React.FC<CardFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-zinc-800 shadow-md overflow-hidden sm:rounded-lg mb-4 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default CardFrame;