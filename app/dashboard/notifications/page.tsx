'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { formatDistanceToNow, format } from 'date-fns';

export default function NotificationsPage() {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const getIcon = (type: string) => {
        // Same icon logic as NotificationCenter
        if (type === 'login_success' || type === 'logout') {
            return (
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            );
        }
        if (type === 'registration_success') {
            return (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
            );
        }
        if (type === 'invoice_paid') {
            return (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        }
        if (type === 'invoice_overdue') {
            return (
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            );
        }

        return (
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        );
    };

    const formatTime = (date: string) => {
        try {
            const d = new Date(date);
            const now = new Date();
            const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return formatDistanceToNow(d, { addSuffix: true });
            } else {
                return format(d, 'MMM d, yyyy h:mm a');
            }
        } catch {
            return 'Recently';
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Stay updated with your account activity and important events
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'unread'
                                ? "You don't have any unread notifications"
                                : "We'll notify you when something important happens"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    {getIcon(notification.type)}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTime(notification.createdAt)}
                                            </span>

                                            <div className="flex items-center gap-2 ml-auto">
                                                {notification.actionUrl && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                                    >
                                                        {notification.actionLabel || 'View'}
                                                    </Link>
                                                )}

                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="text-xs px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
