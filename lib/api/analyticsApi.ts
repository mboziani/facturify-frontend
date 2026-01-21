import apiClient from './client';

export interface DashboardStats {
    totalRevenue: number;
    paidAmount: number;
    outstandingAmount: number;
    overdueAmount: number;
    totalExpenses: number;
    netProfit: number;
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    overdueInvoices: number;
    totalClients: number;
    activeClients: number;
    totalPayments: number;
    averageInvoiceValue: number;
}

export interface RevenueData {
    month: string;
    revenue: number;
    paid: number;
    outstanding: number;
    expenses: number;
}

export interface TaxSummary {
    collectedTax: number;
    pendingTax: number;
    expenseTax: number;
    netTaxOwed: number;
}

export interface ProjectProfitability {
    projectId: string;
    projectName: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
}

export interface RecentActivity {
    invoices: any[];
    payments: any[];
}

export const analyticsApi = {
    // Get dashboard statistics
    getDashboardStats: async (companyId: string): Promise<DashboardStats> => {
        const response = await apiClient.get<DashboardStats>('/analytics/dashboard', {
            params: { companyId },
        });
        return response.data;
    },

    // Get revenue data
    getRevenueData: async (companyId: string, months: number = 6): Promise<RevenueData[]> => {
        const response = await apiClient.get<RevenueData[]>('/analytics/revenue', {
            params: { companyId, months },
        });
        return response.data;
    },

    // Get tax summary
    getTaxSummary: async (companyId: string, year?: number): Promise<TaxSummary> => {
        const response = await apiClient.get<TaxSummary>('/analytics/tax-summary', {
            params: { companyId, year },
        });
        return response.data;
    },

    // Get project profitability
    getProjectProfitability: async (companyId: string): Promise<ProjectProfitability[]> => {
        const response = await apiClient.get<ProjectProfitability[]>('/analytics/projects', {
            params: { companyId },
        });
        return response.data;
    },

    // Get recent activity
    getRecentActivity: async (companyId: string, limit: number = 5): Promise<RecentActivity> => {
        const response = await apiClient.get<RecentActivity>('/analytics/recent-activity', {
            params: { companyId, limit },
        });
        return response.data;
    },
};
