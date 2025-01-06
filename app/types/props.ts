// types/props.ts
import { ReactNode } from 'react';
import { FormPhase, FormMaterial, FormTask } from './database';
import { UserView, PhaseView, NoteView, NavTab } from './views';


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
        first_name: string;
        last_name: string;
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
        first_name: string;
        last_name: string;
        user_email: string;
        user_phone: string;
      }[];
    }[];
    notes: any[];
  };
  phaseNumber: number;
  showTasks: boolean;
  showMaterials: boolean;
  contacts: UserView[];
  isCollapsed: boolean;
}

export interface PhaseCardProps {
  phase: FormPhase;
  onDelete: () => void;
  jobStartDate: string;
  onUpdate: (updatedPhase: FormPhase) => void;
  onAddPhaseAfter: (phaseId: string) => void;
  onMovePhase: (direction: 'up' | 'down') => void;
  contacts: UserView[];
}

export interface TaskCardProps {
  task: FormTask;
  onUpdate: (updatedTask: FormTask) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: UserView[];
}

export interface MaterialCardProps {
  material: FormMaterial;
  onUpdate: (updatedMaterial: FormMaterial) => void;
  onDelete: () => void;
  phaseStartDate: string;
  contacts: UserView[];
}

export interface ContactCardProps {
  user_id?: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_phone?: string;
  showCheckbox?: boolean;
}

export interface TimelineProps {
  phases: PhaseView[];
  currentWeek: number;
  startDate: string;
  endDate: string;
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
  
export interface NoteProps extends NoteView {
    onClick: () => void;
    isExpanded: boolean;
    onAddNote?: () => void;
    newNote?: string;
    onNewNoteChange?: (value: string) => void;
  }