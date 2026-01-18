import apiClient from './client';

export enum RecurringFrequency {
    WEEKLY = 'WEEKLY',
    BIWEEKLY = 'BIWEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
}

export interface RecurringInvoice {
    id: string;
    name: string;
    clientId: string;
    companyId: string;
    client?: {
        id: string;
        name: string;
        email: string;
    };
    items: {
        description: string;
        quantity: number;
        price: number;
    }[];
    taxRate: number;
    discount: number;
    frequency: RecurringFrequency;
    startDate: string;
    endDate?: string;
    lastGenerated?: string;
    nextGenerationDate?: string;
    isActive: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRecurringInvoiceData {
    name: string;
    clientId: string;
    companyId: string;
    items: {
        description: string;
        quantity: number;
        price: number;
    }[];
    taxRate: number;
    discount: number;
    frequency: RecurringFrequency;
    startDate: string;
    endDate?: string;
    notes?: string;
    isActive?: boolean;
}

export interface UpdateRecurringInvoiceData extends Partial<CreateRecurringInvoiceData> { }

export const recurringInvoiceApi = {
    async getRecurringInvoices(companyId: string): Promise<RecurringInvoice[]> {
        const response = await apiClient.get('/recurring-invoices', {
            params: { companyId },
        });
        return response.data;
    },

    async getRecurringInvoice(id: string): Promise<RecurringInvoice> {
        const response = await apiClient.get(`/recurring-invoices/${id}`);
        return response.data;
    },

    async createRecurringInvoice(data: CreateRecurringInvoiceData): Promise<RecurringInvoice> {
        const response = await apiClient.post('/recurring-invoices', data);
        return response.data;
    },

    async updateRecurringInvoice(id: string, data: UpdateRecurringInvoiceData): Promise<RecurringInvoice> {
        const response = await apiClient.patch(`/recurring-invoices/${id}`, data);
        return response.data;
    },

    async deleteRecurringInvoice(id: string): Promise<void> {
        await apiClient.delete(`/recurring-invoices/${id}`);
    },

    async generateInvoice(id: string): Promise<any> {
        const response = await apiClient.post(`/recurring-invoices/${id}/generate`);
        return response.data;
    },
};
