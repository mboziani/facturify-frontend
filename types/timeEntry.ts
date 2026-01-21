export type TimeEntryStatus = 'PENDING' | 'INVOICED' | 'UNBILLABLE';

export interface TimeEntry {
    id: string;
    projectId: string;
    taskId?: string;
    companyId: string;
    clientId: string;
    userId: string;
    description: string;
    startTime: string; // ISO string
    endTime?: string; // ISO string
    duration: number; // Duration in minutes
    billable: boolean;
    hourlyRate?: number;
    status: TimeEntryStatus;
    createdAt: string;
    updatedAt: string;

    // Joined data
    project?: {
        name: string;
    };
    task?: {
        title: string;
    };
    client?: {
        name: string;
    };
}

export interface CreateTimeEntryData {
    projectId: string;
    taskId?: string;
    companyId: string;
    clientId: string;
    description: string;
    startTime: string;
    endTime?: string;
    duration: number;
    billable?: boolean;
    hourlyRate?: number;
    status?: TimeEntryStatus;
}

export interface UpdateTimeEntryData {
    projectId?: string;
    taskId?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    billable?: boolean;
    hourlyRate?: number;
    status?: TimeEntryStatus;
}
