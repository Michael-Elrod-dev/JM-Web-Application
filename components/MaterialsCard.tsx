// components/MaterialsCard.tsx
import React from 'react';
import SmallCardFrame from './SmallCardFrame';

interface MaterialsCardProps {
  materials: string[];
}

const MaterialsCard: React.FC<MaterialsCardProps> = ({ materials }) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Materials</h4>
      {materials.map((material, index) => (
        <SmallCardFrame key={index}>
          <p className="text-sm">{material}</p>
        </SmallCardFrame>
      ))}
    </div>
  );
};

export default MaterialsCard;