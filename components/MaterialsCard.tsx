// components/MaterialsCard.tsx
import React, { useState } from 'react';
import SmallCardFrame from './SmallCardFrame';
import StatusButton from './StatusButton';

interface User {
  user_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
}

interface Material {
  material_id: number;
  material_title: string;
  material_duedate: string;
  material_status: string;
  material_description: string;
  users: User[];
}

interface MaterialsCardProps {
  materials: Material[];
}

const MaterialsCard: React.FC<MaterialsCardProps> = ({ materials }) => {
  const [expandedMaterialId, setExpandedMaterialId] = useState<number | null>(null);
  const [localMaterials, setLocalMaterials] = useState(materials);

  const handleStatusChange = (materialId: number, newStatus: string) => {
    setLocalMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.material_id === materialId 
          ? { ...material, material_status: newStatus } 
          : material
      )
    );
  };

  const handleCardClick = (e: React.MouseEvent, materialId: number) => {
    if (!(e.target as HTMLElement).closest('.status-button')) {
      setExpandedMaterialId(expandedMaterialId === materialId ? null : materialId);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold mb-2">Materials</h4>
      <div className="space-y-2">
        {localMaterials.map((material) => {
          const isExpanded = expandedMaterialId === material.material_id;
          const dueDate = new Date(material.material_duedate).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric'
          });

          return (
            <div
              key={material.material_id}
              onClick={(e) => handleCardClick(e, material.material_id)}
              className="cursor-pointer"
            >
              <SmallCardFrame>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm font-medium col-span-1">{material.material_title}</span>
                  <span className="text-sm text-center col-span-1">{dueDate}</span>
                  <div className="flex justify-end col-span-1">
                    <div className="status-button">
                      <StatusButton
                        id={material.material_id}
                        type="material"
                        currentStatus={material.material_status}
                        onStatusChange={(newStatus) => handleStatusChange(material.material_id, newStatus)}
                      />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                <div className="mt-2 pt-2 border-t">
                  {material.material_description && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">Description:</h5>
                      <SmallCardFrame>
                        <p className="text-sm">{material.material_description}</p>
                      </SmallCardFrame>
                    </div>
                  )}
                  
                  {material.users && material.users.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium mb-2">Assigned People:</h5>
                      {material.users.map((user) => (
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

export default MaterialsCard;