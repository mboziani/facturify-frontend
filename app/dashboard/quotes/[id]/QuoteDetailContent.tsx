'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { quoteApi } from '@/lib/api/quoteApi';
import type { Quote } from '@/types/quote';
import { toast } from 'react-hot-toast';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
    VIEWED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Viewed' },
    ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    EXPIRED: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' },
    CONVERTED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Converted to Invoice' },
};

export default function QuoteDetailContent() {
    const params = useParams();
    const router = useRouter();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const quoteId = params.id as string;

    const fetchQuote = useCallback(async () => {
        try {
            setLoading(true);
            const data = await quoteApi.getQuote(quoteId);
            setQuote(data);
        } catch (err) {
            console.error('Failed to load quote:', err);
            toast.error('Failed to load quote');
        } finally {
            setLoading(false);
        }
    }, [quoteId]);

    useEffect(() => {
        if (quoteId) {
            fetchQuote();
        }
    }, [quoteId, fetchQuote]);

    const handleSend = async () => {
        if (!quote) return;
        try {
            setActionLoading(true);
            await quoteApi.markAsSent(quote.id);
            toast.success('Quote sent to client!');
            fetchQuote();
        } catch (err) {
            toast.error('Failed to send quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!quote) return;
        try {
            setActionLoading(true);
            await quoteApi.markAsAccepted(quote.id);
            toast.success('Quote marked as accepted!');
            fetchQuote();
        } catch (err) {
            toast.error('Failed to accept quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!quote) return;
        try {
            setActionLoading(true);
            await quoteApi.markAsRejected(quote.id);
            toast.success('Quote marked as rejected');
            fetchQuote();
        } catch (err) {
            toast.error('Failed to reject quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleConvertToInvoice = async () => {
        if (!quote) return;
        try {
            setActionLoading(true);
            const result = await quoteApi.convertToInvoice(quote.id);
            toast.success('Quote converted to invoice!');
            router.push(`/dashboard/invoices/${result.invoiceId}`);
        } catch (err) {
            toast.error('Failed to convert quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDuplicate = async () => {
        if (!quote) return;
        try {
            setActionLoading(true);
            const newQuote = await quoteApi.duplicateQuote(quote.id);
            toast.success('Quote duplicated!');
            router.push(`/dashboard/quotes/${newQuote.id}`);
        } catch (err) {
            toast.error('Failed to duplicate quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!quote) return;
        if (!confirm('Are you sure you want to delete this quote?')) return;

        try {
            setActionLoading(true);
            await quoteApi.deleteQuote(quote.id);
            toast.success('Quote deleted');
            router.push('/dashboard/quotes');
        } catch (err) {
            toast.error('Failed to delete quote');
        } finally {
            setActionLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quote Not Found</h2>
                <p className="text-slate-500 mb-4">The quote you're looking for doesn't exist.</p>
                <Link href="/dashboard/quotes" className="text-indigo-600 hover:text-indigo-800">
                    ← Back to Quotes
                </Link>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[quote.status] || STATUS_STYLES.DRAFT;

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/quotes" className="hover:text-indigo-600">
                        Quotes
                    </Link>
                    <span>/</span>
                    <span>{quote.quoteNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">{quote.quoteNumber}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                {statusStyle.label}
                            </span>
                        </div>
                        <p className="text-slate-500 mt-1">Created on {formatDate(quote.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        {quote.status === 'DRAFT' && (
                            <>
                                <button
                                    onClick={handleSend}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    Send to Client
                                </button>
                                <Link
                                    href={`/dashboard/quotes/${quote.id}/edit`}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Edit
                                </Link>
                            </>
                        )}
                        {(quote.status === 'SENT' || quote.status === 'VIEWED') && (
                            <>
                                <button
                                    onClick={handleAccept}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    Mark Accepted
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                >
                                    Mark Rejected
                                </button>
                            </>
                        )}
                        {quote.status === 'ACCEPTED' && !quote.convertedInvoiceId && (
                            <button
                                onClick={handleConvertToInvoice}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                Convert to Invoice
                            </button>
                        )}
                        {quote.convertedInvoiceId && (
                            <Link
                                href={`/dashboard/invoices/${quote.convertedInvoiceId}`}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                            >
                                View Invoice
                            </Link>
                        )}
                        <button
                            onClick={handleDuplicate}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Duplicate
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client Info */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Client Name</p>
                                <p className="font-medium text-slate-900">{quote.client?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="font-medium text-slate-900">{quote.client?.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Phone</p>
                                <p className="font-medium text-slate-900">{quote.client?.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Address</p>
                                <p className="font-medium text-slate-900">
                                    {quote.client?.addressLine1 ? `${quote.client.addressLine1}, ${quote.client.city}` : '-'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Line Items */}
                    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {quote.items.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td className="px-6 py-4 text-slate-900">{item.description}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Notes */}
                    {quote.notes && (
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Notes</h2>
                            <p className="text-slate-600 whitespace-pre-line">{quote.notes}</p>
                        </section>
                    )}

                    {/* Terms */}
                    {quote.terms && (
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Terms & Conditions</h2>
                            <p className="text-slate-600 whitespace-pre-line">{quote.terms}</p>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Summary */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Issue Date</span>
                                <span className="font-medium text-slate-900">{formatDate(quote.issueDate)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Valid Until</span>
                                <span className="font-medium text-slate-900">{formatDate(quote.validUntil)}</span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-medium text-slate-900">{formatCurrency(quote.subtotal)}</span>
                            </div>
                            {quote.taxRate > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax ({quote.taxRate}%)</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(quote.taxAmount)}</span>
                                </div>
                            )}
                            {quote.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Discount</span>
                                    <span className="font-medium text-red-600">-{formatCurrency(quote.discount)}</span>
                                </div>
                            )}
                            <hr className="my-3" />
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold text-slate-900">Total</span>
                                <span className="text-2xl font-bold text-slate-900">{formatCurrency(quote.total)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Activity */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity</h2>
                        <div className="space-y-3 text-sm">
                            {quote.convertedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-900">Converted to Invoice</p>
                                        <p className="text-slate-500">{formatDate(quote.convertedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {quote.acceptedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-900">Accepted by Client</p>
                                        <p className="text-slate-500">{formatDate(quote.acceptedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {quote.rejectedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-900">Rejected by Client</p>
                                        <p className="text-slate-500">{formatDate(quote.rejectedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {quote.viewedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-900">Viewed by Client</p>
                                        <p className="text-slate-500">{formatDate(quote.viewedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {quote.sentAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-900">Sent to Client</p>
                                        <p className="text-slate-500">{formatDate(quote.sentAt)}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-slate-900">Quote Created</p>
                                    <p className="text-slate-500">{formatDate(quote.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
