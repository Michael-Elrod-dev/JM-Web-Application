// types/props.ts
// Component prop types
import { ReactNode } from 'react';
import { FormPhase } from './database';
import { PhaseView, TaskView, MaterialView, NavTab } from './views';


// app/types/props.ts
export interface DetailPhaseCardProps {
  phase: {
    phase_id: number;
    name: string;
    startDate: string;
    endDate: string;
    tasks: {
      task_id: number;
      task_title: string;
      task_startdate: string;
      task_duration: number;
      task_status: string;
      task_description: string;
      users: {
        user_id: number;
        user_name: string;
        user_email: string;
        user_phone: string;
      }[];
    }[];
    materials: {
      material_id: number;
      material_title: string;
      material_duedate: string;
      material_status: string;
      material_description: string;
      users: {
        user_id: number;
        user_name: string;
        user_email: string;
        user_phone: string;
      }[];
    }[];
    notes: {
      note_details: string;
      created_at: string;
      created_by: {
        user_name: string;
      };
    }[];
  };
  phaseNumber: number;
  showTasks?: boolean;
  showMaterials?: boolean;
}

export interface PhaseCardProps {
  phase: FormPhase;
  phaseNumber: number;
  onDelete: () => void;
  jobStartDate: string;
  onUpdate: (updatedPhase: FormPhase) => void;
}

export interface TasksCardProps {
  tasks: TaskView[];
}

export interface MaterialsCardProps {
  materials: MaterialView[];
}

export interface ContactCardProps {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface TimelineProps {
  phases: PhaseView[];
  currentWeek: number;
  startDate: string;
  endDate: string;
}

export interface ContactCardProps {
    user_id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    showCheckbox?: boolean;
  }

  export interface HeaderTabsProps {
    tabs: NavTab[];
    activeTab: string;
    setActiveTab: (tabName: string) => void;
  }

export interface CardFrameProps {
    children: ReactNode;
    className?: string;
  }
  
export interface TimelineProps {
    phases: PhaseView[];
    startDate: string;
    endDate: string;
    currentWeek: number;
  }