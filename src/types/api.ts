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
  id: string
  title: string
  description: string
  duration: string
  fee: number
  programType: string
  startDate: string
  endDate: string
  capacity: number
  enrolled: number
  instructor: string
  level: string
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