// handlers/new/tasks.ts
import { FormTask } from "../../app/types/database";
import { UserView } from "../../app/types/views";
import { calculateEndDate } from "../utils";

export const handleStartDateChange = (
    newStartDate: string,
    phaseStartDate: string,
    setLocalTask: React.Dispatch<React.SetStateAction<FormTask>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ) => {
    if (new Date(newStartDate) >= new Date(phaseStartDate)) {
      setLocalTask((prev) => ({
        ...prev,
        startDate: newStartDate,
      }));
      setErrors((prev) => ({ ...prev, startDate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        startDate: "Task cannot start before phase start date",
      }));
    }
  };
  
  export const handleInputChange = (
    field: keyof FormTask,
    value: string,
    setLocalTask: React.Dispatch<React.SetStateAction<FormTask>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ) => {
    setLocalTask((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  
  export const handleDurationChange = (
    newDuration: string,
    localTask: FormTask,
    setLocalTask: React.Dispatch<React.SetStateAction<FormTask>>
  ) => {
    const newDueDate = calculateEndDate(
      localTask.startDate,
      parseInt(newDuration) || 0
    );
    setLocalTask((prev) => ({
      ...prev,
      duration: newDuration,
      dueDate: newDueDate,
    }));
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
  
  export const handleDeleteClick = (
    setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowDeleteConfirm(true);
  };
  
  export const handleConfirmDelete = (
    onDelete: () => void,
    setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    onDelete();
    setShowDeleteConfirm(false);
  };
  
  export const validateTask = (
    localTask: FormTask,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!localTask.title.trim()) newErrors.title = "Title is required";
    if (!localTask.startDate) newErrors.startDate = "Start date is required";
    if (!localTask.duration) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  export const handleDone = (
    localTask: FormTask,
    selectedContacts: UserView[],
    onUpdate: (task: FormTask) => void,
    setLocalTask: React.Dispatch<React.SetStateAction<FormTask>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ) => {
    if (validateTask(localTask, setErrors)) {
      const updatedTask = {
        ...localTask,
        selectedContacts: selectedContacts.map((contact) => ({
          id: contact.user_id.toString(),
        })),
        isExpanded: false,
      };
      onUpdate(updatedTask);
      setLocalTask(updatedTask);
    }
  };