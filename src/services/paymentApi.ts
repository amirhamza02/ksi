import api from '../lib/api';

export interface PaymentRequest {
  programId: number;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  data?: any;
}

export const paymentApi = {
  payRegistrationBill: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post<PaymentResponse>('/Payment/pay-reg-bill', paymentData);
    return response.data;
  },

  getPaymentHistory: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/Payment/history/${userId}`);
    return response.data.data || [];
  },

  getPaymentStatus: async (programId: number, userId: string): Promise<any> => {
    const response = await api.get(`/Payment/status/${programId}/${userId}`);
    return response.data.data;
  }
};