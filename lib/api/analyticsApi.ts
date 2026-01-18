import apiClient from './client';

export interface DashboardStats {
    totalRevenue: number;
    paidAmount: number;
    outstandingAmount: number;
    overdueAmount: number;
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

    // Get recent activity
    getRecentActivity: async (companyId: string, limit: number = 5): Promise<RecentActivity> => {
        const response = await apiClient.get<RecentActivity>('/analytics/recent-activity', {
            params: { companyId, limit },
        });
        return response.data;
    },
};
