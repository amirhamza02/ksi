import api from '../lib/api';

export interface PaymentRequest {
  Amount: string;
  ValueD:number;
  ValueB:string;
  RegId: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  data?: any;
}

export const paymentApi = {
  payRegistrationBill: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    console.log(" call data ",paymentData);
    const response = await api.post<PaymentResponse>('/Payment/pay-reg-bill',JSON.stringify(paymentData));
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