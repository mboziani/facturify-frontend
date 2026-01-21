
export interface Notification {
    id: string;
    userId: string;
    companyId?: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    priority: 'low' | 'medium' | 'high';
    read: boolean;
    readAt?: string;
    actionUrl?: string;
    actionLabel?: string;
    createdAt: string;
}

// Mock data store
let mockNotifications: Notification[] = [
    {
        id: '1',
        userId: 'user-1',
        type: 'invoice_paid',
        title: 'Invoice Paid',
        message: 'Invoice #INV-2024-001 for Acme Corp has been paid ($1,200.00)',
        priority: 'high',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        actionUrl: '/dashboard/invoices/1',
        actionLabel: 'View Invoice'
    },
    {
        id: '2',
        userId: 'user-1',
        type: 'client_registered',
        title: 'New Client',
        message: 'TechFlow Solutions has enriched their profile details.',
        priority: 'low',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/dashboard/clients/2',
        actionLabel: 'View Profile'
    },
    {
        id: '3',
        userId: 'user-1',
        type: 'subscription_alert',
        title: 'Trial Ending Soon',
        message: 'Your free trial ends in 3 days. Upgrade now to keep using pro features.',
        priority: 'high',
        read: true,
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        actionUrl: '/dashboard/subscription',
        actionLabel: 'Upgrade'
    }
];

export const notificationsApi = {
    async getNotifications(): Promise<Notification[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockNotifications];
    },

    async getUnreadCount(): Promise<{ count: number }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));
        const count = mockNotifications.filter(n => !n.read).length;
        return { count };
    },

    async markAsRead(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        mockNotifications = mockNotifications.map(n =>
            n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
        );
    },

    async markAllAsRead(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        mockNotifications = mockNotifications.map(n => ({
            ...n,
            read: true,
            readAt: new Date().toISOString()
        }));
    },

    async deleteNotification(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        mockNotifications = mockNotifications.filter(n => n.id !== id);
    },

    // Helper to add a notification (for demo purposes)
    addMockNotification(notification: Partial<Notification>) {
        const newNotification: Notification = {
            id: Math.random().toString(36).substring(2, 9),
            userId: 'user-1',
            type: notification.type || 'info', // default type
            title: notification.title || 'New Notification',
            message: notification.message || '',
            priority: notification.priority || 'medium',
            read: false,
            createdAt: new Date().toISOString(),
            ...notification
        } as Notification;
        mockNotifications = [newNotification, ...mockNotifications];
        return newNotification;
    }
};
