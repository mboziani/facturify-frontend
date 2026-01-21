export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
    id: string;
    companyId: string;
    clientId: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    currency?: string;
    totalTimeSpent?: number; // in seconds or minutes
    createdAt: string;
    updatedAt: string;
    client?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateProjectData {
    clientId: string;
    name: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    currency?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> { }
