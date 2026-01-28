import apiClient from './client';
import { Company, CreateCompanyData, UpdateCompanyData, CompanyRole, CompanyMember } from '@/types/company';

export const companyApi = {
    /**
     * Create a new company
     */
    create: async (data: CreateCompanyData): Promise<Company> => {
        const response = await apiClient.post<Company>('/companies', data);
        return response.data;
    },

    /**
     * Get all companies for the current user
     */
    list: async (): Promise<Company[]> => {
        const response = await apiClient.get<Company[]>('/companies');
        return response.data;
    },

    /**
     * Get user's default company
     */
    getDefault: async (): Promise<Company | null> => {
        const response = await apiClient.get<Company>('/companies/default');
        return response.data;
    },

    /**
     * Get a specific company
     */
    getById: async (id: string): Promise<Company> => {
        const response = await apiClient.get<Company>(`/companies/${id}`);
        return response.data;
    },

    /**
     * Update a company
     */
    update: async (id: string, data: UpdateCompanyData): Promise<Company> => {
        const response = await apiClient.patch<Company>(`/companies/${id}`, data);
        return response.data;
    },

    /**
     * Set company as default
     */
    setDefault: async (id: string): Promise<void> => {
        await apiClient.post(`/companies/${id}/set-default`);
    },

    /**
     * Delete a company
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/companies/${id}`);
    },

    /**
     * Get user's role in company
     */
    getRole: async (id: string): Promise<CompanyRole> => {
        const response = await apiClient.get<CompanyRole>(`/companies/${id}/role`);
        return response.data;
    },

    /**
     * Get company members
     */
    getMembers: async (id: string): Promise<CompanyMember[]> => {
        const response = await apiClient.get<CompanyMember[]>(`/companies/${id}/members`);
        return response.data;
    },
};
