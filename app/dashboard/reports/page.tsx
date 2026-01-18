'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { reportsApi, IncomeStatement, AgingReport } from '@/lib/api/reportsApi';
import { downloadCSV } from '@/lib/utils/csv';
import toast from 'react-hot-toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
    const { currentCompany } = useCompany();
    const [activeTab, setActiveTab] = useState<'income' | 'aging' | 'export'>('income');
    const [isLoading, setIsLoading] = useState(false);

    const [incomeData, setIncomeData] = useState<IncomeStatement | null>(null);
    const [agingData, setAgingData] = useState<AgingReport | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!currentCompany) return;
        loadData();
    }, [currentCompany, activeTab, year]);

    const loadData = async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            if (activeTab === 'income') {
                const data = await reportsApi.getIncomeStatement(currentCompany.id, year);
                setIncomeData(data);
            } else if (activeTab === 'aging') {
                const data = await reportsApi.getAgingReport(currentCompany.id);
                setAgingData(data);
            }
        } catch (error) {
            console.error('Failed to load report data:', error);
            toast.error('Failed to load report data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async (type: 'clients' | 'invoices') => {
        if (!currentCompany) return;
        try {
            const data = await reportsApi.getExportData(currentCompany.id, type);
            const filename = `${currentCompany.name.replace(/\s+/g, '_')}_${type}_${new Date().toISOString().split('T')[0]}.csv`;
            downloadCSV(data, filename);
            toast.success(`Exported ${type} successfully!`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Export failed. Please try again.');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currentCompany?.currency || 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['income', 'aging', 'export'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`${activeTab === tab
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {tab === 'income' ? 'Income Statement' : tab === 'aging' ? 'Aging Report' : 'Export Data'}
                        </button>
                    ))}
                </nav>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="mt-6">
                    {/* Income Statement View */}
                    {activeTab === 'income' && incomeData && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Revenue Overview {year}</h2>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    >
                                        {[2024, 2025, 2026, 2027].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={incomeData.data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {incomeData.data.map((row) => (
                                            <tr key={row.month}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.month}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(row.revenue)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(row.expenses)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-indigo-600">{formatCurrency(row.netIncome)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-bold">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(incomeData.totals.revenue)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(incomeData.totals.expenses)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600">{formatCurrency(incomeData.totals.netIncome)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Aging Report View */}
                    {activeTab === 'aging' && agingData && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-sm font-medium text-gray-500">Total Receivables</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(agingData.totalReceivables)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total outstanding amount</p>
                                </div>
                                {/* Could add more summary cards here */}
                            </div>

                            <div className="space-y-6">
                                {Object.values(agingData.buckets).map((bucket) => {
                                    if (bucket.count === 0) return null;
                                    return (
                                        <div key={bucket.label} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">{bucket.label}</h3>
                                                <span className="text-sm font-semibold text-gray-700">{formatCurrency(bucket.amount)} ({bucket.count})</span>
                                            </div>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {bucket.invoices.map((inv) => (
                                                        <tr key={inv.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{inv.invoiceNumber}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.clientName}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(inv.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                                {agingData.totalReceivables === 0 && (
                                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                                        No overdue invoices found. Great job! 🎉
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Export View */}
                    {activeTab === 'export' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Export Data</h2>
                            <p className="text-gray-500 mb-8">
                                Download your company data in CSV format. Use these files for accounting software,
                                offline analysis, or backups.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => handleExport('clients')}
                                    className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                                >
                                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-gray-900">Export Clients</span>
                                    <span className="text-sm text-gray-500 mt-2">Download client list as CSV</span>
                                </button>

                                <button
                                    onClick={() => handleExport('invoices')}
                                    className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                                >
                                    <div className="p-3 bg-green-100 text-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-gray-900">Export Invoices</span>
                                    <span className="text-sm text-gray-500 mt-2">Download all invoices as CSV</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
