import { Circular, ExecutiveProgram, ProgramType, ApiResponse } from '../types/api'
import api from '../lib/api';

export interface RegistrationRequest {
  regYear: number;
  regSem: number;
  exProgramRegDetails: {
    excutiveProgramId: number;
    credithours: number;
    regBill: number;
    exeProgramName: string;
  }[];
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const circularApi = {
  getCircular: async (id: string): Promise<Circular> => {
    const response = await api.get<ApiResponse<Circular>>(`/Circular/get-circular/${id}`)
    return response.data.data
  },

  getCirculars: async (): Promise<Circular[]> => {
    const response = await api.get<ApiResponse<Circular[]>>('/Circular/get-circulars')
    return response.data.data
  },
}

export const executiveProgramApi = {
  getProgramTypes: async (): Promise<ProgramType[]> => {
    const response = await api.get<ApiResponse<ProgramType[]>>('/ExecutiveProgram/program-type')
    return response.data.data
  },

  getExecutivePrograms: async (): Promise<ExecutiveProgram[]> => {
    const response = await api.get<ApiResponse<ExecutiveProgram[]>>('/ExecutiveProgram/executive-programs')
    return response.data.data
  },

  registerForProgram: async (registrationData: RegistrationRequest): Promise<RegistrationResponse> => {
    const response = await api.post<RegistrationResponse>('/ExecutiveProgram/ep-registraiton', registrationData)
    return response.data
  },
}