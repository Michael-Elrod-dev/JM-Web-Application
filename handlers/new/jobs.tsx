import { FormPhase, FormTask, FormMaterial } from "@/app/types/database";
import { createLocalDate, formatToDateString, getCurrentBusinessDate, addBusinessDays } from "@/app/utils";

declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => {
    keys(): string[];
    (id: string): any;
  };
};

export const getJobTypes = (): string[] => {
  const context = require.context("../../data", false, /\.tsx$/);

  return context
    .keys()
    .map((key: string) => key.replace(/^\.\//, "").replace(/\.tsx$/, ""));
};

const calculatePhaseStartDate = (
  phase: FormPhase | Partial<FormPhase>,
  isPreplanningPhase = false,
  currentBusinessDate = '',
  jobStartDate = ''
): string => {
  const allDates = [
    ...(phase.tasks?.map(task => task.startDate) || []),
    ...(phase.materials?.map(material => material.dueDate) || [])
  ];

  return allDates.length > 0
    ? allDates.reduce((earliest, current) => 
        current < earliest ? current : earliest
      )
    : isPreplanningPhase
      ? currentBusinessDate
      : jobStartDate;
};

export const handleConfirmDelete = (
  onDelete: () => void,
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  phase: FormPhase,
  onPhaseUpdate: (phase: FormPhase) => void
) => {
  onDelete();
  setShowDeleteConfirm(false);
  
  // Update phase after deletion using existing handlePhaseUpdate
  onPhaseUpdate(phase);
};

export const handleCreateJob = async (
  jobType: string,
  startDate: string,
  setShowNewJobCard: (show: boolean) => void,
  setPhases: (phases: FormPhase[]) => void
) => {
  try {
    const template = await import(`../../data/${jobType}.tsx`);
    const phases = template.PHASES;

    if (!Array.isArray(phases) || phases.length === 0) {
      throw new Error("No phases found in template");
    }

    const tempId = Date.now().toString();
    const currentDate = new Date();
    const currentBusinessDate = formatToDateString(getCurrentBusinessDate(currentDate));

    const processedPhases: FormPhase[] = phases.map(
      (phase: FormPhase, phaseIndex: number) => {
        const isPreplanningPhase = phaseIndex === 0;
        
        const tasks = phase.tasks.map((task: FormTask, taskIndex: number) => {
          let baseDate = isPreplanningPhase
            ? task.offset === 0
              ? getCurrentBusinessDate(new Date(currentBusinessDate))
              : createLocalDate(startDate)
            : createLocalDate(startDate);

          const taskStartDate =
            task.offset === 0
              ? baseDate
              : addBusinessDays(baseDate, task.offset);

          return {
            ...task,
            id: `task-${tempId}-${phaseIndex}-${taskIndex}`,
            startDate: formatToDateString(taskStartDate),
            isExpanded: false,
            selectedContacts: [],
          };
        });

        const materials = phase.materials.map(
          (material: FormMaterial, materialIndex: number) => {
            let baseDate = isPreplanningPhase
              ? material.offset === 0
                ? getCurrentBusinessDate(new Date(currentBusinessDate))
                : createLocalDate(startDate)
              : createLocalDate(startDate);

            const materialDueDate =
              material.offset === 0
                ? baseDate
                : addBusinessDays(baseDate, material.offset);

            return {
              ...material,
              id: `material-${tempId}-${phaseIndex}-${materialIndex}`,
              dueDate: formatToDateString(materialDueDate),
              isExpanded: false,
              selectedContacts: [],
            };
          }
        );

        const phaseWithItems = {
          ...phase,
          tasks,
          materials
        };

        return {
          ...phaseWithItems,
          tempId: `phase-${tempId}-${phase.title.toLowerCase().replace(/\s+/g, "-")}`,
          startDate: calculatePhaseStartDate(phaseWithItems, isPreplanningPhase, currentBusinessDate, startDate),
          notes: [],
        };
      }
    );
    
    setPhases(processedPhases);
    setShowNewJobCard(true);
  } catch (error) {
    console.error("Error loading job template:", error);
  }
};

export const handlePhaseUpdate = (
  updatedPhase: FormPhase,
  setPhases: (fn: (prevPhases: FormPhase[]) => FormPhase[]) => void,
  extend?: number,
  extendFuturePhases?: boolean
) => {
  setPhases((prevPhases) => {
    const phaseIndex = prevPhases.findIndex(p => p.tempId === updatedPhase.tempId);
    let newPhases = [...prevPhases];
    
    // Calculate new phase start date
    const newStartDate = calculatePhaseStartDate(updatedPhase, false, '', updatedPhase.startDate);
    
    // Update the current phase with new start date
    newPhases[phaseIndex] = {
      ...updatedPhase,
      startDate: newStartDate
    };
    
    // Handle extending future phases
    if (extend && extendFuturePhases) {
      for (let i = phaseIndex + 1; i < newPhases.length; i++) {
        const phase = newPhases[i];
        
        const extendedStartDate = formatToDateString(
          addBusinessDays(createLocalDate(phase.startDate), extend)
        );
        
        const updatedTasks = phase.tasks.map(task => ({
          ...task,
          startDate: formatToDateString(
            addBusinessDays(createLocalDate(task.startDate), extend)
          )
        }));
        
        const updatedMaterials = phase.materials.map(material => ({
          ...material,
          dueDate: formatToDateString(
            addBusinessDays(createLocalDate(material.dueDate), extend)
          )
        }));
        
        newPhases[i] = {
          ...phase,
          startDate: extendedStartDate,
          tasks: updatedTasks,
          materials: updatedMaterials
        };
      }
    }
    
    return newPhases;
  });
};