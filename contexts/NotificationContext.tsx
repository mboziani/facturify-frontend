'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '@/lib/api/client';

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

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await apiClient.get('/notifications');
            const data = response.data;
            setNotifications(data);

            // Calculate unread count
            const unread = data.filter((n: Notification) => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const response = await apiClient.get('/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await apiClient.patch(`/notifications/${id}/read`);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.patch('/notifications/read-all');

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await apiClient.delete(`/notifications/${id}`);

            // Update local state
            const notification = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));

            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Fetch notifications on mount and when user changes
    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, fetchNotifications]);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user, fetchUnreadCount]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
