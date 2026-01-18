'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SettingsLayoutProps {
    children: React.ReactNode;
}

const navigationItems = [
    {
        name: 'Company Profile',
        href: '/dashboard/settings',
        description: 'Basic company information'
    },
    {
        name: 'Company Information',
        href: '/dashboard/settings/company',
        description: 'Tax IDs, banking & international'
    },
    {
        name: 'Branding',
        href: '/dashboard/settings/branding',
        description: 'Logo and visual identity'
    },
    {
        name: 'Invoice Settings',
        href: '/dashboard/settings/invoices',
        description: 'Invoice defaults and templates'
    },
    {
        name: 'Team Members',
        href: '/dashboard/settings/team',
        description: 'Manage access and roles'
    },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="lg:hidden p-2 text-slate-500 hover:text-slate-700"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex flex-col px-4 py-3 rounded-lg transition-all duration-150 ${isActive
                                                ? 'bg-indigo-50 border-l-4 border-indigo-600'
                                                : 'hover:bg-slate-100 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <span className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-slate-700'
                                                }`}>
                                                {item.name}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5">
                                                {item.description}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)}>
                                <div
                                    className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-4 border-b border-slate-200">
                                        <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
                                    </div>
                                    <nav className="p-4 space-y-1">
                                        {navigationItems.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`block px-4 py-3 rounded-lg transition-all ${isActive
                                                        ? 'bg-indigo-50 text-indigo-700'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                    <span className="block text-xs text-slate-500 mt-0.5">
                                                        {item.description}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <main className="lg:col-span-9">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
