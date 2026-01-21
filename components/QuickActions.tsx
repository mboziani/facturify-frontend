'use client';

import Link from 'next/link';
import { useState } from 'react';

export const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        {
            label: 'New Invoice',
            href: '/dashboard/invoices/new',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-indigo-500 hover:bg-indigo-600',
        },
        {
            label: 'Add Client',
            href: '/dashboard/clients/new',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            label: 'Log Expense',
            href: '/dashboard/expenses/new',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-orange-500 hover:bg-orange-600',
        },
        {
            label: 'View Reports',
            href: '/dashboard/reports',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-purple-500 hover:bg-purple-600',
        },
    ];

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 pb-[env(safe-area-inset-bottom)]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
                    aria-label="Quick Actions"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Actions Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Actions Grid */}
                    <div className="fixed bottom-24 right-8 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 space-y-2 min-w-[200px] animate-fade-in-up">
                        {actions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-colors ${action.color}`}
                            >
                                {action.icon}
                                <span>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
