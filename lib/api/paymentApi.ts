import apiClient from './client';
import { Payment, CreatePaymentDto, UpdatePaymentDto } from '@/types/payment';

export const paymentApi = {
    // Create a new payment
    createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
        const response = await apiClient.post<Payment>('/payments', data);
        return response.data;
    },

    // Get all payments for a company
    getPayments: async (companyId: string, invoiceId?: string): Promise<Payment[]> => {
        const params: any = { companyId };
        if (invoiceId) params.invoiceId = invoiceId;
        const response = await apiClient.get<Payment[]>('/payments', { params });
        return response.data;
    },

    // Get a single payment
    getPayment: async (id: string): Promise<Payment> => {
        const response = await apiClient.get<Payment>(`/payments/${id}`);
        return response.data;
    },

    // Update a payment
    updatePayment: async (id: string, data: UpdatePaymentDto): Promise<Payment> => {
        const response = await apiClient.patch<Payment>(`/payments/${id}`, data);
        return response.data;
    },

    // Delete a payment
    deletePayment: async (id: string): Promise<void> => {
        await apiClient.delete(`/payments/${id}`);
    },
};
