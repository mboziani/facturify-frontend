'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CompanySwitcher from '@/components/CompanySwitcher';
import { Logo } from '@/components/Logo';
import { QuickActions } from '@/components/QuickActions';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationCenter } from '@/components/NotificationCenter';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Sidebar collapse state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Load saved preference from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
            setIsSidebarCollapsed(savedState === 'true');
        }
    }, []);

    // Toggle sidebar and persist state
    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', String(newState));
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    const navLinks = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Clients',
            href: '/dashboard/clients',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            name: 'Invoices',
            href: '/dashboard/invoices',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Expenses',
            href: '/dashboard/expenses',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            name: 'Subscription',
            href: '/dashboard/subscription',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
        {
            name: 'Reports',
            href: '/dashboard/reports',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
    ];

    return (
        <ProtectedRoute>
            <NotificationProvider>
                <div className="min-h-screen bg-gray-50">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                        <div className="container mx-auto px-6 h-16">
                            <div className="flex items-center justify-between h-full">
                                {/* Left Side: Sidebar Toggle & Switcher */}
                                <div className="flex items-center gap-4">
                                    {/* Sidebar Toggle Button (visible on desktop) */}
                                    <button
                                        onClick={toggleSidebar}
                                        className="hidden md:flex items-center justify-center p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                    >
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <CompanySwitcher />
                                </div>

                                {/* Right Side: Navigation & User */}
                                <div className="flex items-center gap-4">
                                    <NotificationCenter />

                                    <Link
                                        href="/dashboard/settings"
                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
                                        title="Settings"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </Link>

                                    <div className="h-4 w-px bg-gray-200 mx-1"></div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex">
                        {/* Sidebar Navigation */}
                        <aside className={`hidden md:flex flex-col bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                            {/* Sidebar Header with Logo */}
                            <div className={`p-4 border-b border-gray-100 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
                                <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                                    <Logo
                                        className={isSidebarCollapsed ? "w-10 h-10" : "w-8 h-8"}
                                        showText={!isSidebarCollapsed}
                                    />
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 p-3 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all group relative ${isActive(link.href)
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title={isSidebarCollapsed ? link.name : undefined}
                                    >
                                        <span className={isSidebarCollapsed ? '' : ''}>{link.icon}</span>
                                        {!isSidebarCollapsed && <span>{link.name}</span>}

                                        {/* Tooltip for collapsed state */}
                                        {isSidebarCollapsed && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                                {link.name}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Sidebar Footer with Toggle Button */}
                            <div className="p-3 border-t border-gray-200">
                                <button
                                    onClick={toggleSidebar}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
                                    title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                >
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                    {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
                                </button>

                                {!isSidebarCollapsed && (
                                    <div className="mt-3 text-xs text-gray-500 text-center">
                                        Facturify Platform
                                        <br />
                                        <span className="text-gray-400">v1.0.0</span>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 p-6 lg:p-8">{children}</main>
                    </div>

                    {/* Mobile Bottom Navigation */}
                    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
                        <div className="flex justify-around">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors ${isActive(link.href) ? 'text-indigo-600' : 'text-gray-500'
                                        }`}
                                >
                                    {link.icon}
                                    <span className="text-xs font-medium">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Quick Actions Button */}
                    <QuickActions />
                </div>
            </NotificationProvider>
        </ProtectedRoute>
    );
}
