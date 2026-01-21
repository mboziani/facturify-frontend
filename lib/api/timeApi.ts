import apiClient from './client';
import type { TimeEntry, CreateTimeEntryData, UpdateTimeEntryData } from '@/types/timeEntry';

export const timeApi = {
    /**
     * Get all time entries for a company with optional filters
     */
    async getTimeEntries(params: {
        companyId: string;
        projectId?: string;
        clientId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<TimeEntry[]> {
        const response = await apiClient.get<TimeEntry[]>('/time-entries', { params });
        return response.data;
    },

    /**
     * Get a single time entry
     */
    async getTimeEntry(id: string): Promise<TimeEntry> {
        const response = await apiClient.get<TimeEntry>(`/time-entries/${id}`);
        return response.data;
    },

    /**
     * Create a new time entry
     */
    async createTimeEntry(data: CreateTimeEntryData): Promise<TimeEntry> {
        const response = await apiClient.post<TimeEntry>('/time-entries', data);
        return response.data;
    },

    /**
     * Update an existing time entry
     */
    async updateTimeEntry(id: string, data: UpdateTimeEntryData): Promise<TimeEntry> {
        const response = await apiClient.patch<TimeEntry>(`/time-entries/${id}`, data);
        return response.data;
    },

    /**
     * Delete a time entry
     */
    async deleteTimeEntry(id: string): Promise<void> {
        await apiClient.delete(`/time-entries/${id}`);
    },

    /**
     * Get summary stats for time tracking
     */
    async getTimeStats(companyId: string, params?: { projectId?: string; clientId?: string }): Promise<{
        totalMinutes: number;
        billableMinutes: number;
        totalAmount: number;
    }> {
        const response = await apiClient.get('/time-entries/stats', {
            params: { companyId, ...params }
        });
        return response.data;
    }
};
