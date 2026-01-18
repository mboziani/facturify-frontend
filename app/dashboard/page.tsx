'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { analyticsApi, type DashboardStats, type RevenueData } from '@/lib/api/analyticsApi';
import { formatCurrency, formatDate } from '@/lib/utils/invoiceUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user } = useAuth();
    const { currentCompany } = useCompany();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [recentActivity, setRecentActivity] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Show welcome message if just logged in
    useEffect(() => {
        const justLoggedIn = localStorage.getItem('justLoggedIn');
        if (justLoggedIn === 'true') {
            localStorage.removeItem('justLoggedIn');
            toast.success(`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}!`, {
                duration: 3000,
                icon: '👋',
            });
        }
    }, [user?.firstName]);

    useEffect(() => {
        if (currentCompany?.id) {
            loadDashboardData();
        }
    }, [currentCompany?.id]);

    const loadDashboardData = async () => {
        if (!currentCompany?.id) return;

        try {
            setIsLoading(true);
            const [statsData, revenueChartData, activityData] = await Promise.all([
                analyticsApi.getDashboardStats(currentCompany.id),
                analyticsApi.getRevenueData(currentCompany.id, 6),
                analyticsApi.getRecentActivity(currentCompany.id, 5),
            ]);

            setStats(statsData);
            setRevenueData(revenueChartData);
            setRecentActivity(activityData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="inline-block animate-spin rounded-full h12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {getGreeting()}, {user?.firstName}! 👋
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Here's what's happening with <span className="font-semibold text-slate-700">{currentCompany?.name || 'your business'}</span> today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/invoices/new"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Invoice
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatCurrency(stats?.totalRevenue || 0)}</div>
                    <div className="text-indigo-100 text-sm">Total Revenue</div>
                </div>

                {/* Outstanding */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(stats?.outstandingAmount || 0)}</div>
                    <div className="text-slate-500 text-sm">Outstanding</div>
                    {stats && stats.overdueInvoices > 0 && (
                        <div className="mt-2 text-xs text-amber-600">
                            {stats.overdueInvoices} overdue · {formatCurrency(stats.overdueAmount)}
                        </div>
                    )}
                </div>

                {/* Total Invoices */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats?.totalInvoices || 0}</div>
                    <div className="text-slate-500 text-sm">Total Invoices</div>
                    <div className="mt-2 text-xs text-slate-600">
                        {stats?.paidInvoices || 0} paid · {stats?.unpaidInvoices || 0} unpaid
                    </div>
                </div>

                {/* Clients */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats?.totalClients || 0}</div>
                    <div className="text-slate-500 text-sm">Total Clients</div>
                    <div className="mt-2 text-xs text-slate-600">
                        {stats?.activeClients || 0} active (90 days)
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Trend (Last 6 Months)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                            formatter={(value: any) => formatCurrency(Number(value || 0))}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} name="Total Revenue" />
                        <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} name="Paid" />
                        <Line type="monotone" dataKey="outstanding" stroke="#f59e0b" strokeWidth={2} name="Outstanding" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
                        <Link href="/dashboard/invoices" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivity?.invoices?.length > 0 ? (
                            recentActivity.invoices.map((invoice: any) => (
                                <Link
                                    key={invoice.id}
                                    href={`/dashboard/invoices/${invoice.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-900">{invoice.invoiceNumber}</div>
                                        <div className="text-sm text-slate-500">{invoice.client?.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                            invoice.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {invoice.status}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No invoices yet. Create your first invoice!
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Payments</h2>
                    <div className="space-y-4">
                        {recentActivity?.payments?.length > 0 ? (
                            recentActivity.payments.map((payment: any) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{payment.invoice?.invoiceNumber}</div>
                                            <div className="text-sm text-slate-500">{formatDate(payment.paymentDate)}</div>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-emerald-600">
                                        +{formatCurrency(payment.amount)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No payments recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
