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
    const currentDate = new Date().toISOString().split('T')[0];

    const processedPhases: FormPhase[] = phases.map((phase: FormPhase, phaseIndex: number) => {
      // Special handling for preplanning phase
      const isPreplanningPhase = phaseIndex === 0;
      const baseDate = isPreplanningPhase ? currentDate : startDate;

      // Calculate all task and material dates first
      const tasks = phase.tasks.map((task: FormTask, taskIndex: number) => {
        const taskStartDate = new Date(baseDate);
        taskStartDate.setDate(taskStartDate.getDate() + (task.offset || 0));

        return {
          ...task,
          id: `task-${tempId}-${phaseIndex}-${taskIndex}`,
          startDate: taskStartDate.toISOString().split('T')[0],
          isExpanded: false,
          selectedContacts: []
        };
      });

      const materials = phase.materials.map((material: FormMaterial, materialIndex: number) => {
        const materialDueDate = new Date(baseDate);
        materialDueDate.setDate(materialDueDate.getDate() + (material.offset || 0));

        return {
          ...material,
          id: `material-${tempId}-${phaseIndex}-${materialIndex}`,
          dueDate: materialDueDate.toISOString().split('T')[0],
          isExpanded: false,
          selectedContacts: []
        };
      });

      // Find earliest date among tasks and materials
      const allDates = [
        ...tasks.map(task => task.startDate),
        ...materials.map(material => material.dueDate)
      ];

      const phaseStartDate = allDates.length > 0 
        ? allDates.reduce((earliest, current) => 
            current < earliest ? current : earliest
          )
        : baseDate;

      return {
        ...phase,
        tempId: `phase-${tempId}-${phase.title.toLowerCase().replace(/\s+/g, '-')}`,
        startDate: phaseStartDate,
        tasks,
        materials,
        notes: [] as FormNote[]
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