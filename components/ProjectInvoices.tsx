'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { invoiceApi } from '@/lib/api/invoiceApi';
import type { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils/invoiceUtils';
import { useCompany } from '@/contexts/CompanyContext';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ProjectInvoicesProps {
    projectId: string;
    clientId: string;
}

export default function ProjectInvoices({ projectId, clientId }: ProjectInvoicesProps) {
    const { currentCompany } = useCompany();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const loadInvoices = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await invoiceApi.getInvoices({
                companyId: currentCompany.id,
                projectId: projectId,
            });
            setInvoices(data);
        } catch (err) {
            console.error('Failed to load invoices', err);
        } finally {
            setLoading(false);
        }
    }, [currentCompany, projectId]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading invoices...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900">Invoices ({invoices.length})</h3>
                <Link
                    href={`/dashboard/invoices/new?projectId=${projectId}&clientId=${clientId}`}
                    className="flex items-center gap-1 text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <PlusIcon className="w-4 h-4" />
                    New Invoice
                </Link>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <DocumentTextIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">No invoices linked to this project yet.</p>
                    <Link
                        href={`/dashboard/invoices/new?projectId=${projectId}&clientId=${clientId}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        Create your first invoice
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Number</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:text-indigo-600">
                                            {invoice.invoiceNumber}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">
                                        {formatDate(invoice.issueDate)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-slate-900">
                                        {formatCurrency(invoice.total)}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <Link
                                            href={`/dashboard/invoices/${invoice.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-700',
        SENT: 'bg-blue-50 text-blue-700',
        VIEWED: 'bg-indigo-50 text-indigo-700',
        PAID: 'bg-emerald-50 text-emerald-700',
        OVERDUE: 'bg-red-50 text-red-700',
        CANCELLED: 'bg-slate-100 text-slate-600 line-through',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles['DRAFT']}`}>
            {status}
        </span>
    );
}
