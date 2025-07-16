import api from "../lib/api";
import { ResetPasswordData } from "../types/auth";


export const authApi = {
  forgotPassword: async (email: string): Promise<void> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  
  validateToken: async (token: string): Promise<{ valid: boolean }> => {
    const response = await api.post('/auth/validate-reset-token', { token });
    return response.data;
  }
};