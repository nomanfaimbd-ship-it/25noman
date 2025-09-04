export enum WorkflowStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: WorkflowStatus;
}

export type InputFileType =
  | 'leatherPattern'
  | 'caseBack'
  | 'caseRight'
  | 'caseLeft'
  | 'caseTop'
  | 'caseBottom'
  | 'caseCamera'
  | 'logo'
  | 'depthMap';

export type InputFiles = Record<InputFileType, File | null>;
export type ImagePreviews = Record<InputFileType, string | null>;

export interface LogoFinishOption {
  id: string;
  name: string;
  description: string;
}

export interface LogoFinishCategory {
  category: string;
  icon: React.FC<{className?: string}>;
  options: LogoFinishOption[];
}
