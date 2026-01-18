import apiClient from './client';

export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

export interface TeamInvitation {
    id: string;
    companyId: string;
    email: string;
    role: string;
    token: string;
    status: InvitationStatus;
    expiresAt: string;
    createdAt: string;
    inviter?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface CreateInvitationData {
    companyId: string;
    email: string;
    role: 'MEMBER' | 'ADMIN';
}

export const teamInvitationsApi = {
    async sendInvitation(data: CreateInvitationData): Promise<TeamInvitation> {
        const response = await apiClient.post('/team-invitations', data);
        return response.data;
    },

    async getInvitations(companyId: string): Promise<TeamInvitation[]> {
        const response = await apiClient.get('/team-invitations', {
            params: { companyId },
        });
        return response.data;
    },

    async acceptInvitation(token: string): Promise<void> {
        await apiClient.post(`/team-invitations/${token}/accept`);
    },

    async cancelInvitation(id: string): Promise<void> {
        await apiClient.delete(`/team-invitations/${id}`);
    },

    async resendInvitation(id: string): Promise<void> {
        await apiClient.post(`/team-invitations/${id}/resend`);
    },
};
