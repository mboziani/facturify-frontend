import apiClient from './client';
import type {
    Invoice,
    CreateInvoiceData,
    UpdateInvoiceData,
    MarkAsPaidData,
    InvoiceFilters,
    InvoiceStatus,
} from '@/types/invoice';

export const invoiceApi = {
    /**
     * Create a new invoice
     */
    async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
        const response = await apiClient.post<Invoice>('/invoices', data);
        return response.data;
    },

    /**
     * Get all invoices with optional filters
     */
    async getInvoices(filters: InvoiceFilters): Promise<Invoice[]> {
        const params: any = { companyId: filters.companyId };
        if (filters.status) {
            params.status = filters.status;
        }
        if (filters.clientId) {
            params.clientId = filters.clientId;
        }
        if (filters.projectId) {
            params.projectId = filters.projectId;
        }
        const response = await apiClient.get<Invoice[]>('/invoices', { params });
        return response.data;
    },

    /**
     * Get a single invoice by ID
     */
    async getInvoice(invoiceId: string): Promise<Invoice> {
        const response = await apiClient.get<Invoice>(`/invoices/${invoiceId}`);
        return response.data;
    },

    /**
     * Update an invoice
     */
    async updateInvoice(invoiceId: string, data: UpdateInvoiceData): Promise<Invoice> {
        const response = await apiClient.patch<Invoice>(`/invoices/${invoiceId}`, data);
        return response.data;
    },

    /**
     * Delete an invoice
     */
    async deleteInvoice(invoiceId: string): Promise<void> {
        await apiClient.delete(`/invoices/${invoiceId}`);
    },

    /**
     * Mark invoice as sent
     */
    async markAsSent(invoiceId: string): Promise<Invoice> {
        const response = await apiClient.post<Invoice>(`/invoices/${invoiceId}/send`);
        return response.data;
    },

    /**
     * Mark invoice as paid
     */
    async markAsPaid(invoiceId: string, data: MarkAsPaidData): Promise<Invoice> {
        const response = await apiClient.post<Invoice>(`/invoices/${invoiceId}/pay`, data);
        return response.data;
    },

    /**
     * Mark invoice as viewed (public endpoint)
     */
    async markAsViewed(invoiceId: string): Promise<Invoice> {
        const response = await apiClient.post<Invoice>(`/invoices/${invoiceId}/view`);
        return response.data;
    },

    /**
     * Get overdue invoices
     */
    async getOverdueInvoices(companyId: string): Promise<Invoice[]> {
        const response = await apiClient.get<Invoice[]>('/invoices/overdue', {
            params: { companyId },
        });
        return response.data;
    },
};
