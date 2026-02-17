'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { invoiceApi } from '@/lib/api/invoiceApi';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { getStatusColor, formatCurrency, formatDate } from '@/lib/utils/invoiceUtils';

export default function InvoicesPage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
    const [error, setError] = useState('');

    const loadInvoices = useCallback(async () => {
        if (!currentCompany) return;

        try {
            setIsLoading(true);
            const data = await invoiceApi.getInvoices({
                companyId: currentCompany.id,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
            });
            setInvoices(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load invoices');
        } finally {
            setIsLoading(false);
        }
    }, [currentCompany, statusFilter]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    if (!currentCompany) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Please select a company first</p>
            </div>
        );
    }

    const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
        const { bg, text, label } = getStatusColor(status);
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
                    <p className="text-slate-500 mt-1">Create and manage your invoices</p>
                </div>
                <Link
                    href="/dashboard/invoices/new"
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Invoice
                </Link>
            </div>

            {/* Tabs */}
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <Link
                        href="/dashboard/invoices"
                        className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                    >
                        All Invoices
                    </Link>
                    <Link
                        href="/dashboard/invoices/recurring"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                    >
                        Recurring
                    </Link>
                </nav>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {['ALL', ...Object.values(InvoiceStatus)].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as InvoiceStatus | 'ALL')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {status === 'ALL' ? 'All' : getStatusColor(status as InvoiceStatus).label}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600"></div>
                        <p className="mt-4 text-slate-500">Loading invoices...</p>
                    </div>
                </div>
            ) : invoices.length === 0 ? (
                // Empty State
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {statusFilter !== 'ALL' ? `No ${getStatusColor(statusFilter as InvoiceStatus).label.toLowerCase()} invoices` : 'No invoices yet'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {statusFilter !== 'ALL' ? 'Try selecting a different filter' : 'Get started by creating your first invoice'}
                    </p>
                    {statusFilter === 'ALL' && (
                        <Link
                            href="/dashboard/invoices/new"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Invoice
                        </Link>
                    )}
                </div>
            ) : (
                // Invoice Table
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Issue Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{invoice.invoiceNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{invoice.client?.name || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{formatDate(invoice.issueDate)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{formatDate(invoice.dueDate)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                                            {invoice.amountDue > 0 && invoice.amountDue < invoice.total && (
                                                <div className="text-xs text-slate-500">{formatCurrency(invoice.amountDue)} due</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/invoices/${invoice.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                </Link>
                                                {invoice.status === InvoiceStatus.DRAFT && (
                                                    <Link
                                                        href={`/dashboard/invoices/${invoice.id}/edit`}
                                                        className="text-slate-600 hover:text-slate-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Showing {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
                        </p>
                        <div className="text-sm font-semibold text-slate-900">
                            Total: {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
