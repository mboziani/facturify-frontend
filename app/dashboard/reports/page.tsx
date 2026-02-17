'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { reportsApi, IncomeStatement, AgingReport, ProjectProfitability, TaxReport } from '@/lib/api/reportsApi';
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

import { usePermissions } from '@/hooks/usePermissions';

export default function ReportsPage() {
    const { currentCompany } = useCompany();
    const { hasFeature } = usePermissions();
    const [activeTab, setActiveTab] = useState<'income' | 'aging' | 'projects' | 'tax' | 'export'>('income');
    const [isLoading, setIsLoading] = useState(false);

    const [incomeData, setIncomeData] = useState<IncomeStatement | null>(null);
    const [agingData, setAgingData] = useState<AgingReport | null>(null);
    const [projectData, setProjectData] = useState<ProjectProfitability[]>([]);
    const [taxData, setTaxData] = useState<TaxReport | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [taxPeriod, setTaxPeriod] = useState<'quarterly' | 'annual'>('quarterly');

    const loadData = useCallback(async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            if (activeTab === 'income') {
                const data = await reportsApi.getIncomeStatement(currentCompany.id, year);
                setIncomeData(data);
            } else if (activeTab === 'aging') {
                const data = await reportsApi.getAgingReport(currentCompany.id);
                setAgingData(data);
            } else if (activeTab === 'projects') {
                const data = await reportsApi.getProjectProfitability(currentCompany.id);
                setProjectData(Array.isArray(data) ? data : []);
            } else if (activeTab === 'tax') {
                const data = await reportsApi.getTaxReport(currentCompany.id, year, taxPeriod);
                setTaxData(data);
            }
        } catch (error) {
            console.error('Failed to load report data:', error);
            toast.error('Failed to load report data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [currentCompany, activeTab, year, taxPeriod]);

    useEffect(() => {
        if (!currentCompany) return;
        loadData();
    }, [currentCompany, activeTab, year, taxPeriod, loadData]);

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
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {[
                        { id: 'income', label: 'Profit & Loss', requiredFeature: null },
                        { id: 'aging', label: 'Receivables', requiredFeature: null },
                        { id: 'projects', label: 'Project Profitability', requiredFeature: 'ADVANCED_REPORTS' as const },
                        { id: 'tax', label: 'Tax Reports', requiredFeature: 'ADVANCED_REPORTS' as const },
                        { id: 'export', label: 'Export Data', requiredFeature: null }
                    ].map((tab) => {
                        const isLocked = !!(tab.requiredFeature && !hasFeature(tab.requiredFeature));
                        return (
                            <button
                                key={tab.id}
                                disabled={isLocked}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                            >
                                {tab.label}
                                {isLocked && (
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
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

                    {/* Project Profitability View */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Profitability</h2>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={projectData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="projectName" />
                                            <YAxis />
                                            <Tooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expenses" fill="#F43F5E" name="Expenses" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projectData.map((project) => (
                                            <tr key={project.projectId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.projectName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.clientName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(project.revenue)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(project.expenses)}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${project.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(project.profit)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.margin >= 30 ? 'bg-emerald-100 text-emerald-700' : project.margin >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {project.margin.toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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

                    {/* Tax Reports View */}
                    {activeTab === 'tax' && taxData && (
                        <div className="space-y-6">
                            {/* Header with Controls */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Tax Summary {year}</h2>
                                        <p className="text-sm text-gray-500 mt-1">Tax collected and deductions for the tax year</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <select
                                            value={taxPeriod}
                                            onChange={(e) => setTaxPeriod(e.target.value as 'quarterly' | 'annual')}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        >
                                            <option value="quarterly">Quarterly</option>
                                            <option value="annual">Annual</option>
                                        </select>
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
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                                        <p className="mt-2 text-2xl font-bold text-blue-900">{formatCurrency(taxData.totals?.revenue || 0)}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                        <p className="text-sm font-medium text-green-600">Tax Collected</p>
                                        <p className="mt-2 text-2xl font-bold text-green-900">{formatCurrency(taxData.totals?.taxCollected || 0)}</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                        <p className="text-sm font-medium text-orange-600">Total Expenses</p>
                                        <p className="mt-2 text-2xl font-bold text-orange-900">{formatCurrency(taxData.totals?.expenses || 0)}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <p className="text-sm font-medium text-purple-600">Deductions</p>
                                        <p className="mt-2 text-2xl font-bold text-purple-900">{formatCurrency(taxData.totals?.deductions || 0)}</p>
                                    </div>
                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <p className="text-sm font-medium text-indigo-600">Net Tax Owed</p>
                                        <p className="mt-2 text-2xl font-bold text-indigo-900">{formatCurrency(taxData.totals?.netTax || 0)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quarterly Breakdown */}
                            {taxPeriod === 'quarterly' && taxData.quarters && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Quarterly Breakdown</h3>
                                        <p className="text-sm text-gray-500">Detailed tax summary for each quarter</p>
                                    </div>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarter</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Collected</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {taxData.quarters.map((quarter: any) => (
                                                <tr key={quarter.name}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quarter.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(quarter.revenue)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">{formatCurrency(quarter.taxCollected)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(quarter.expenses)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 font-semibold">{formatCurrency(quarter.deductions)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600 font-bold">{formatCurrency(quarter.netTax)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-bold">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(taxData.totals.revenue)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-700">{formatCurrency(taxData.totals.taxCollected)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(taxData.totals.expenses)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-700">{formatCurrency(taxData.totals.deductions)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-700">{formatCurrency(taxData.totals.netTax)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Annual View */}
                            {taxPeriod === 'annual' && taxData.annual && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Annual Tax Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-700">Total Revenue</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(taxData.annual.revenue)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-700">Tax Collected</span>
                                            <span className="font-semibold text-green-600">{formatCurrency(taxData.annual.taxCollected)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-700">Total Expenses</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(taxData.annual.expenses)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-700">Deductions</span>
                                            <span className="font-semibold text-purple-600">{formatCurrency(taxData.annual.deductions)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 bg-indigo-50 rounded-lg px-4 mt-4">
                                            <span className="text-lg font-semibold text-indigo-900">Net Tax Owed</span>
                                            <span className="text-2xl font-bold text-indigo-700">{formatCurrency(taxData.annual.netTax)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Export Button */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-amber-900 mb-2">Ready for Tax Filing?</h4>
                                        <p className="text-sm text-amber-700 mb-4">
                                            Download this tax summary as a PDF or CSV to share with your accountant or file your taxes.
                                            Always consult with a tax professional for accurate filing.
                                        </p>
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                                                Download PDF
                                            </button>
                                            <button className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium">
                                                Export CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
