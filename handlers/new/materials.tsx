// handlers/new/materials.ts
import { FormMaterial } from "../../app/types/database";
import { UserView } from "../../app/types/views";

export const handleDeleteClick = (
  setShowDeleteConfirm: (value: boolean) => void
) => {
  setShowDeleteConfirm(true);
};

export const handleConfirmDelete = (
  onDelete: () => void,
  setShowDeleteConfirm: (value: boolean) => void
) => {
  onDelete();
  setShowDeleteConfirm(false);
};

export const handleInputChange = (
  field: keyof FormMaterial,
  value: string,
  phaseStartDate: string,
  setLocalMaterial: React.Dispatch<React.SetStateAction<FormMaterial>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (field === "dueDate") {
    if (new Date(value) >= new Date(phaseStartDate)) {
      setLocalMaterial((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        dueDate: "Due date cannot be before phase start date",
      }));
    }
  } else {
    setLocalMaterial((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }
};

export const handleContactSelect = (
  contact: UserView,
  selectedContacts: UserView[],
  setSelectedContacts: React.Dispatch<React.SetStateAction<UserView[]>>
) => {
  setSelectedContacts([...selectedContacts, contact]);
};

export const handleContactRemove = (
  userId: string,
  selectedContacts: UserView[],
  setSelectedContacts: React.Dispatch<React.SetStateAction<UserView[]>>
) => {
  setSelectedContacts(
    selectedContacts.filter((contact) => contact.user_id.toString() !== userId)
  );
};

export const validateMaterial = (
  localMaterial: FormMaterial,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
): boolean => {
  const newErrors: { [key: string]: string } = {};
  if (!localMaterial.title.trim()) newErrors.title = "Title is required";
  if (!localMaterial.dueDate) newErrors.dueDate = "Due date is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const handleDone = (
  localMaterial: FormMaterial,
  selectedContacts: UserView[],
  setLocalMaterial: React.Dispatch<React.SetStateAction<FormMaterial>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  onUpdate: (material: FormMaterial) => void
) => {
  if (validateMaterial(localMaterial, setErrors)) {
    const updatedMaterial = {
      ...localMaterial,
      selectedContacts: selectedContacts.map((contact) => ({
        id: contact.user_id.toString(),
      })),
      isExpanded: false,
    };
    onUpdate(updatedMaterial);
    setLocalMaterial(updatedMaterial);
  }
};