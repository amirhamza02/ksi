import api from '../lib/api';

export interface PaymentRequest {
  Amount: string;
  ValueD: string;
  ValueB: string;
  RegId: string;
}

export interface PaymentResponse {
  baseFair: string | null;
  valueA: string | null;
  valueB: string;
  valueC: string | null;
  valueD: string;
  paymentUrl: string;
}

export interface ExProgramRegDetail {
  id: number;
  excutiveProgramId: number;
  regBill: number;
  exeProgramName: string;
  credithours: number | null;
}

export interface BillingHistoryItem {
  id: number;
  userId: number;
  regYear: number;
  isBillPaid: boolean;
  isIubian: boolean;
  isSuccessfullyEPRegistration: boolean;
  regDiscount: number;
  regPayable: number;
  regSem: number;
  regValue: number;
  typeId: number;
  exProgramRegDetails: ExProgramRegDetail[];
}

export const paymentApi = {
  payRegistrationBill: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    console.log(" call data ", paymentData);
    const response = await api.post<PaymentResponse>('/Payment/pay-reg-bill', JSON.stringify(paymentData));
    return response.data;
  },

  getBillingHistory: async (): Promise<BillingHistoryItem[]> => {
    const response = await api.get('/Payment/billing-history');
    return response.data.data || [];
  },

  getPaymentHistory: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/Payment/billing-history`);
    return response.data.data || [];
  },

  getPaymentStatus: async (programId: number, userId: string): Promise<any> => {
    const response = await api.get(`/Payment/status/${programId}/${userId}`);
    return response.data.data;
  }
};