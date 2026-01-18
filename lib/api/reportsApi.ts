import apiClient from './client';

export interface IncomeStatement {
    period: number;
    data: {
        month: string;
        revenue: number;
        expenses: number;
        netIncome: number;
        invoiceCount: number;
    }[];
    totals: {
        revenue: number;
        expenses: number;
        netIncome: number;
        invoiceCount: number;
    };
}

export interface AgingBucket {
    label: string;
    amount: number;
    count: number;
    invoices: {
        id: string;
        invoiceNumber: string;
        clientName: string;
        amount: number;
        dueDate: string;
        daysOverdue: number;
    }[];
}

export interface AgingReport {
    generatedAt: string;
    totalReceivables: number;
    buckets: Record<string, AgingBucket>;
}

export const reportsApi = {
    getIncomeStatement: async (companyId: string, year: number): Promise<IncomeStatement> => {
        const response = await apiClient.get('/reports/income-statement', {
            params: { companyId, year },
        });
        return response.data;
    },

    getAgingReport: async (companyId: string): Promise<AgingReport> => {
        const response = await apiClient.get('/reports/aging', {
            params: { companyId },
        });
        return response.data;
    },

    getExportData: async (companyId: string, type: 'clients' | 'invoices'): Promise<any[]> => {
        const response = await apiClient.get('/reports/export', {
            params: { companyId, type },
        });
        return response.data;
    },
};
