'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { quoteApi } from '@/lib/api/quoteApi';
import type { Quote, QuoteStatus } from '@/types/quote';
import { toast } from 'react-hot-toast';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
    VIEWED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Viewed' },
    ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    EXPIRED: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' },
    CONVERTED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Converted' },
};

export default function QuotesPage() {
    const { currentCompany } = useCompany();
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const fetchQuotes = useCallback(async () => {
        if (!currentCompany?.id) return;

        try {
            setLoading(true);
            const data = await quoteApi.getQuotes({
                companyId: currentCompany.id,
                status: statusFilter as QuoteStatus || undefined,
            });
            setQuotes(data);
        } catch (err) {
            setError('Failed to load quotes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentCompany?.id, statusFilter]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    const handleConvertToInvoice = async (quoteId: string) => {
        try {
            const result = await quoteApi.convertToInvoice(quoteId);
            toast.success('Quote converted to invoice successfully!');
            router.push(`/dashboard/invoices/${result.invoiceId}`);
        } catch (err) {
            toast.error('Failed to convert quote');
        }
    };

    const handleSendQuote = async (quoteId: string) => {
        try {
            await quoteApi.markAsSent(quoteId);
            toast.success('Quote sent to client!');
            fetchQuotes();
        } catch (err) {
            toast.error('Failed to send quote');
        }
    };

    const filteredQuotes = quotes.filter(quote => {
        const matchesSearch = !searchQuery ||
            quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quote.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
                    <p className="text-slate-500 mt-1">Create and manage your quotes and estimates</p>
                </div>
                <Link
                    href="/dashboard/quotes/new"
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Quote
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search quotes by number or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white sm:w-48"
                >
                    <option value="">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="VIEWED">Viewed</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CONVERTED">Converted</option>
                </select>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredQuotes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No quotes found</h3>
                    <p className="text-slate-500 mb-6">Create your first quote to get started</p>
                    <Link
                        href="/dashboard/quotes/new"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Create Quote
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quote #</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valid Until</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredQuotes.map((quote) => {
                                    const statusStyle = STATUS_STYLES[quote.status] || STATUS_STYLES.DRAFT;
                                    return (
                                        <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/quotes/${quote.id}`} className="font-semibold text-indigo-600 hover:text-indigo-800">
                                                    {quote.quoteNumber}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{quote.client?.name}</div>
                                                <div className="text-sm text-slate-500">{quote.client?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {formatCurrency(quote.total)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(quote.validUntil)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                    {statusStyle.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {quote.status === 'DRAFT' && (
                                                        <button
                                                            onClick={() => handleSendQuote(quote.id)}
                                                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            Send
                                                        </button>
                                                    )}
                                                    {quote.status === 'ACCEPTED' && !quote.convertedInvoiceId && (
                                                        <button
                                                            onClick={() => handleConvertToInvoice(quote.id)}
                                                            className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            Convert to Invoice
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/dashboard/quotes/${quote.id}`}
                                                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-sm text-slate-500">Total Quotes</div>
                    <div className="text-2xl font-bold text-slate-900">{quotes.length}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-sm text-slate-500">Pending Response</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {quotes.filter(q => ['SENT', 'VIEWED'].includes(q.status)).length}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-sm text-slate-500">Accepted</div>
                    <div className="text-2xl font-bold text-green-600">
                        {quotes.filter(q => q.status === 'ACCEPTED').length}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-sm text-slate-500">Total Value</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {formatCurrency(quotes.reduce((sum, q) => sum + q.total, 0))}
                    </div>
                </div>
            </div>
        </div>
    );
}
