import { FormPhase, FormTask, FormMaterial, FormNote } from "../../app/types/database";

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
  const context = require.context('../../data', false, /\.tsx$/);
  
  return context.keys()
    .map((key: string) => key.replace(/^\.\//, '').replace(/\.tsx$/, ''));
};

export const handleInputChange = (
  field: string,
  value: string,
  setStartDate: (value: string) => void
) => {
  if (field === "startDate") {
    setStartDate(value);
  }
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
      throw new Error('No phases found in template');
    }

    const tempId = Date.now().toString();
    
    // New getCurrentBusinessDate function
    const getCurrentBusinessDate = (currentDate: Date): Date => {
      // Create a new date using local time components to avoid timezone issues
      const localDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        12  // Set to noon to avoid any timezone edge cases
      );
      
      const day = localDate.getDay();
      
      if (day === 0) { // Sunday
        localDate.setDate(localDate.getDate() + 1);
      } else if (day === 6) { // Saturday
        localDate.setDate(localDate.getDate() + 2);
      }
      
      return localDate;
    };

    const currentDate = new Date();
    const currentBusinessDate = getCurrentBusinessDate(currentDate).toISOString().split('T')[0];

    // Modified addBusinessDays function
    const addBusinessDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      const day = result.getDay();

      // First ensure the start date is a business day
      if (day === 0) { // Sunday
        result.setDate(result.getDate() + 1);
      } else if (day === 6) { // Saturday
        result.setDate(result.getDate() + 2);
      }

      // If no additional days needed, return the business day-adjusted date
      if (days === 0) {
        return result;
      }

      // For additional days, add business days
      let remaining = Math.abs(days);
      const direction = days < 0 ? -1 : 1;
      
      while (remaining > 0) {
        result.setDate(result.getDate() + direction);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          remaining--;
        }
      }
      
      return result;
    };

    const processedPhases: FormPhase[] = phases.map((phase: FormPhase, phaseIndex: number) => {
      const isPreplanningPhase = phaseIndex === 0;

      const tasks = phase.tasks.map((task: FormTask, taskIndex: number) => {
        let baseDate = isPreplanningPhase 
          ? task.offset === 0 ? getCurrentBusinessDate(new Date(currentBusinessDate)) : new Date(startDate)
          : new Date(startDate);

        const taskStartDate = addBusinessDays(baseDate, task.offset || 0);
        return {
          ...task,
          id: `task-${tempId}-${phaseIndex}-${taskIndex}`,
          startDate: taskStartDate.toISOString().split('T')[0],
          isExpanded: false,
          selectedContacts: []
        };
      });

      const materials = phase.materials.map((material: FormMaterial, materialIndex: number) => {
        let baseDate = isPreplanningPhase
          ? material.offset === 0 ? getCurrentBusinessDate(new Date(currentBusinessDate)) : new Date(startDate)
          : new Date(startDate);
          
        const materialDueDate = addBusinessDays(baseDate, material.offset || 0);
        return {
          ...material,
          id: `material-${tempId}-${phaseIndex}-${materialIndex}`,
          dueDate: materialDueDate.toISOString().split('T')[0],
          isExpanded: false,
          selectedContacts: []
        };
      });

      const allDates = [...tasks.map(task => task.startDate), ...materials.map(material => material.dueDate)];
      const phaseStartDate = allDates.length > 0 
        ? allDates.reduce((earliest, current) => current < earliest ? current : earliest)
        : isPreplanningPhase ? currentBusinessDate : startDate;

      return {
        ...phase,
        tempId: `phase-${tempId}-${phase.title.toLowerCase().replace(/\s+/g, '-')}`,
        startDate: phaseStartDate,
        tasks,
        materials,
        notes: []
      };
    });

    setPhases(processedPhases);
    setShowNewJobCard(true);
    
  } catch (error) {
    console.error('Error loading job template:', error);
  }
};

export const handlePhaseUpdate = (
  updatedPhase: FormPhase,
  setPhases: (fn: (prevPhases: FormPhase[]) => FormPhase[]) => void
) => {
  setPhases((prevPhases) =>
    prevPhases.map((phase) =>
      phase.tempId === updatedPhase.tempId ? updatedPhase : phase
    )
  );
};