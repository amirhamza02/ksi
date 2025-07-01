export interface Circular {
  id: string
  title: string
  description: string
  publishDate: string
  category: string
  isActive: boolean
  attachments?: string[]
}

export interface ExecutiveProgram {
  id: number;
  programsName: string;
  executiveProgramTypeId: number;
  startDate: string | Date;  // Can be string or Date object
  startDateDescription: string;
  endDate: string | Date | null;
  programDuration: number | null;
  classCount: string;
  classSchedule: string;
  totalHours: number;
  regCost: number;
  discoutPC: number;
  iubStudentDiscoutPC: number;
  regCostDescription: string;
  isRunning: boolean;
  isSuccessfullyEPRegistration: boolean | null;
}

export interface ProgramType {
  id: string
  name: string
  description: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
}

export interface ApiError {
  message: string
  status: number
}