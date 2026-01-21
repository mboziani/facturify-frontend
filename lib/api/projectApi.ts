import apiClient from './client';
import type { Project, CreateProjectData, UpdateProjectData } from '@/types/project';

export const projectApi = {
    /**
     * Create a new project
     */
    async createProject(data: CreateProjectData): Promise<Project> {
        const response = await apiClient.post<Project>('/projects', data);
        return response.data;
    },

    /**
     * Get all projects for a company with optional filters
     */
    async getProjects(companyId: string, filters?: { search?: string; status?: string }): Promise<Project[]> {
        const params: any = { companyId };
        if (filters?.search) params.search = filters.search;
        if (filters?.status && filters.status !== 'ALL') params.status = filters.status;

        const response = await apiClient.get<Project[]>('/projects', { params });
        return response.data;
    },

    /**
     * Get a single project by ID
     */
    async getProject(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    /**
     * Update a project
     */
    async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
        const response = await apiClient.patch<Project>(`/projects/${id}`, data);
        return response.data;
    },

    /**
     * Delete a project
     */
    async deleteProject(id: string): Promise<void> {
        await apiClient.delete(`/projects/${id}`);
    },
};
