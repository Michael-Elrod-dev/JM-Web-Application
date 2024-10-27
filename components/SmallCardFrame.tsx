// components/SmallCardFrame.tsx
import React from 'react';

interface SmallCardFrameProps {
  children: React.ReactNode;
}

const SmallCardFrame: React.FC<SmallCardFrameProps> = ({ children }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-md p-3 mb-2">
      {children}
    </div>
  );
};

export default SmallCardFrame;