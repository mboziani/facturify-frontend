'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { quoteApi } from '@/lib/api/quoteApi';
import type { Quote } from '@/types/quote';
import { toast } from 'react-hot-toast';
import { generateQuotePDF } from '@/lib/utils/quotePdfGenerator';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending' },
    VIEWED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Viewed' },
    ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    EXPIRED: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' },
    CONVERTED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Invoiced' },
};

export default function PortalQuoteContent() {
    const params = useParams();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // In a real app, this would be a secure token, not just the ID
    const quoteId = params.id as string;

    const fetchQuote = useCallback(async () => {
        try {
            setLoading(true);
            const data = await quoteApi.getQuote(quoteId);
            setQuote(data);

            // Auto-mark as viewed if it's the first time
            if (data.status === 'SENT') {
                quoteApi.markAsViewed(data.id).catch(console.error);
            }
        } catch (err) {
            console.error('Failed to load quote:', err);
            toast.error('Failed to load quote details');
        } finally {
            setLoading(false);
        }
    }, [quoteId]);

    useEffect(() => {
        if (quoteId) {
            fetchQuote();
        }
    }, [quoteId, fetchQuote]);

    const handleAccept = async () => {
        if (!quote) return;
        if (!confirm('Are you sure you want to accept this quote?')) return;

        try {
            setActionLoading(true);
            await quoteApi.markAsAccepted(quote.id);
            toast.success('Quote accepted! Thank you.');
            fetchQuote();
        } catch (err) {
            toast.error('Failed to accept quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!quote) return;
        if (!confirm('Are you sure you want to reject this quote?')) return;

        try {
            setActionLoading(true);
            await quoteApi.markAsRejected(quote.id);
            toast.success('Quote rejected');
            fetchQuote();
        } catch (err) {
            toast.error('Failed to reject quote');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!quote) return;
        try {
            generateQuotePDF(quote, 'Facturify Demo Company');
            toast.success('PDF downloaded successfully!');
        } catch (err) {
            console.error('PDF generation error:', err);
            toast.error('Failed to generate PDF');
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
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quote Not Found</h2>
                <p className="text-slate-500">The quote you are looking for may have been removed or the link is invalid.</p>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[quote.status] || STATUS_STYLES.DRAFT;

    return (
        <div className="space-y-6">
            {/* Action Banner */}
            {(quote.status === 'SENT' || quote.status === 'VIEWED') && (
                <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Review Quote</h2>
                        <p className="text-slate-500">Please review the quote details below and accept or reject.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Accept Quote
                        </button>
                    </div>
                </div>
            )}

            {quote.status === 'ACCEPTED' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-green-900">This quote has been accepted</h2>
                        <p className="text-green-700">Thank you for your business! We will be in touch shortly.</p>
                    </div>
                </div>
            )}

            {quote.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-red-900">This quote has been rejected</h2>
                        <p className="text-red-700">If you have any questions, please contact us.</p>
                    </div>
                </div>
            )}

            {/* Quote Paper */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">QUOTE</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-xl text-slate-500">{quote.quoteNumber}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                    {statusStyle.label}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-900">Facturify Demo Company</h2>
                            <p className="text-slate-500">123 Business Street</p>
                            <p className="text-slate-500">Tech City, TC 90210</p>
                            <p className="text-slate-500">billing@facturify.com</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</h3>
                            <div className="text-slate-900 font-medium">{quote.client?.name}</div>
                            {quote.client?.email && <div className="text-slate-600">{quote.client.email}</div>}
                            {quote.client?.phone && <div className="text-slate-600">{quote.client.phone}</div>}
                            {quote.client?.addressLine1 && (
                                <div className="text-slate-600 mt-1">
                                    {quote.client.addressLine1}<br />
                                    {quote.client.city}, {quote.client.country}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-slate-500">Issue Date:</span>
                                <span className="font-medium text-slate-900">{formatDate(quote.issueDate)}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-slate-500">Valid Until:</span>
                                <span className="font-medium text-slate-900">{formatDate(quote.validUntil)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Item</th>
                                <th className="px-8 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Qty</th>
                                <th className="px-8 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                                <th className="px-8 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {quote.items.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td className="px-8 py-4 text-slate-900">
                                        <div className="font-medium">{item.description}</div>
                                    </td>
                                    <td className="px-8 py-4 text-right text-slate-600">{item.quantity}</td>
                                    <td className="px-8 py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-8 py-4 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer/Totals */}
                <div className="p-8 bg-slate-50 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            {quote.notes && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Notes</h3>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{quote.notes}</p>
                                </div>
                            )}
                            {quote.terms && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Terms & Conditions</h3>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{quote.terms}</p>
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-medium text-slate-900">{formatCurrency(quote.subtotal)}</span>
                            </div>
                            {quote.taxRate > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tax ({quote.taxRate}%)</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(quote.taxAmount)}</span>
                                </div>
                            )}
                            {quote.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Discount</span>
                                    <span className="font-medium text-red-600">-{formatCurrency(quote.discount)}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-end">
                                <span className="text-base font-semibold text-slate-900">Total</span>
                                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(quote.total)}</span>
                            </div>

                            <button
                                onClick={handleDownloadPDF}
                                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
