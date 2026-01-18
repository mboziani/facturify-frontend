import apiClient from './client';
import type { Client, CreateClientData, UpdateClientData, ClientFilters } from '@/types/client';

export const clientApi = {
    /**
     * Create a new client
     */
    async createClient(data: CreateClientData): Promise<Client> {
        const response = await apiClient.post<Client>('/clients', data);
        return response.data;
    },

    /**
     * Get all clients for a company with optional search
     */
    async getClients(filters: ClientFilters): Promise<Client[]> {
        const params: any = { companyId: filters.companyId };
        if (filters.search) {
            params.q = filters.search;
        }
        const response = await apiClient.get<Client[]>('/clients', { params });
        return response.data;
    },

    /**
     * Get a single client by ID
     */
    async getClient(clientId: string): Promise<Client> {
        const response = await apiClient.get<Client>(`/clients/${clientId}`);
        return response.data;
    },

    /**
     * Update a client
     */
    async updateClient(clientId: string, data: UpdateClientData): Promise<Client> {
        const response = await apiClient.patch<Client>(`/clients/${clientId}`, data);
        return response.data;
    },

    /**
     * Delete a client (soft delete)
     */
    async deleteClient(clientId: string): Promise<void> {
        await apiClient.delete(`/clients/${clientId}`);
    },

    /**
     * Search clients
     */
    async searchClients(companyId: string, query: string): Promise<Client[]> {
        const response = await apiClient.get<Client[]>('/clients/search', {
            params: { companyId, q: query },
        });
        return response.data;
    },
};
