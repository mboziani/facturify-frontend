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

export interface ProjectProfitability {
    projectId: string;
    projectName: string;
    clientName: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
    timeLogged: number; // in minutes
}

export interface TaxReport {
    totals: {
        revenue: number;
        taxCollected: number;
        expenses: number;
        deductions: number;
        netTax: number;
    };
    quarters?: {
        name: string;
        revenue: number;
        taxCollected: number;
        expenses: number;
        deductions: number;
        netTax: number;
    }[];
    annual?: any;
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

    getProjectProfitability: async (companyId: string): Promise<ProjectProfitability[]> => {
        const response = await apiClient.get<ProjectProfitability[]>('/reports/projects', {
            params: { companyId },
        });
        return response.data;
    },

    getTaxReport: async (companyId: string, year: number, period: 'quarterly' | 'annual'): Promise<TaxReport> => {
        const response = await apiClient.get<TaxReport>('/reports/tax', {
            params: { companyId, year, period },
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
