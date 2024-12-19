// components/MaterialsCard.tsx
import React, { useState } from "react";
import SmallCardFrame from "./SmallCardFrame";
import StatusButton from "./StatusButton";

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
  const [localMaterials, setLocalMaterials] = useState(() =>
    materials.map((material) => ({
      ...material,
      dueDate: new Date(material.material_duedate + "T00:00:00").toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
    }))
  );
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const handleStatusChange = (materialId: number, newStatus: string) => {
    setLocalMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.material_id === materialId
          ? { ...material, material_status: newStatus }
          : material
      )
    );
  };

  const handleCardClick = (e: React.MouseEvent, materialId: number) => {
    if (!(e.target as HTMLElement).closest(".status-button")) {
      setExpandedMaterialId((prev) => (prev === materialId ? null : materialId));
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold mb-2">Materials</h4>
      <div className="space-y-2">
        {localMaterials.map((material) => {
          const isExpanded = expandedMaterialId === material.material_id;
  
          // Use the precomputed dueDate from localMaterials
          return (
            <div key={material.material_id}>
              <SmallCardFrame>
                <div
                  onClick={(e) => handleCardClick(e, material.material_id)}
                  className="cursor-pointer"
                >
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium col-span-1">
                      {material.material_title}
                    </span>
                    <span className="text-sm text-center col-span-1">
                      {material.dueDate} {/* Precomputed dueDate */}
                    </span>
                    <div className="flex justify-end col-span-1">
                      <div className="status-button">
                        <StatusButton
                          id={material.material_id}
                          type="material"
                          currentStatus={material.material_status}
                          onStatusChange={(newStatus) =>
                            handleStatusChange(material.material_id, newStatus)
                          }
                        />
                      </div>
                    </div>
                  </div>
  
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t">
                      {material.material_description && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2">
                            Description:
                          </h5>
                          <SmallCardFrame>
                            <p className="text-sm">
                              {material.material_description}
                            </p>
                          </SmallCardFrame>
                        </div>
                      )}
  
                      {material.users && material.users.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium mb-2">
                            Assigned People:
                          </h5>
                          {material.users.map((user) => (
                            <SmallCardFrame key={user.user_id}>
                              <div className="grid grid-cols-3 items-center">
                                <span className="text-sm">{user.user_name}</span>
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
                            setActiveModal(material.material_id);
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
  
              {/* Edit Material Modal */}
              {activeModal === material.material_id && (
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
                        <h3 className="text-xl font-semibold">Edit Material</h3>
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
                            defaultValue={material.material_title}
                          />
                        </div>
  
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                            rows={3}
                            defaultValue={material.material_description}
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

export default MaterialsCard;
