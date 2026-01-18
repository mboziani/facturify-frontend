import apiClient from './client';

export enum ExpenseCategory {
    OFFICE = 'OFFICE',
    TRAVEL = 'TRAVEL',
    SOFTWARE = 'SOFTWARE',
    MARKETING = 'MARKETING',
    UTILITIES = 'UTILITIES',
    SUPPLIES = 'SUPPLIES',
    EQUIPMENT = 'EQUIPMENT',
    SALARY = 'SALARY',
    CONSULTING = 'CONSULTING',
    OTHER = 'OTHER',
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: ExpenseCategory;
    receiptUrl?: string;
    notes?: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseData {
    description: string;
    amount: number;
    date: string;
    category: ExpenseCategory;
    receiptUrl?: string;
    notes?: string;
    companyId: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> { }

export const expenseApi = {
    async getExpenses(companyId: string, startDate?: string, endDate?: string): Promise<Expense[]> {
        const params: any = { companyId };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await apiClient.get('/expenses', { params });
        return response.data;
    },

    async getExpense(id: string): Promise<Expense> {
        const response = await apiClient.get(`/expenses/${id}`);
        return response.data;
    },

    async createExpense(data: CreateExpenseData): Promise<Expense> {
        const response = await apiClient.post('/expenses', data);
        return response.data;
    },

    async updateExpense(id: string, data: UpdateExpenseData): Promise<Expense> {
        const response = await apiClient.patch(`/expenses/${id}`, data);
        return response.data;
    },

    async deleteExpense(id: string): Promise<void> {
        await apiClient.delete(`/expenses/${id}`);
    },

    async getCategorySummary(companyId: string, year: number): Promise<any[]> {
        const response = await apiClient.get('/expenses/category-summary', {
            params: { companyId, year },
        });
        return response.data;
    },
};
