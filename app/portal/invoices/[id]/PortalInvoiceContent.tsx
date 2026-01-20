'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { invoiceApi } from '@/lib/api/invoiceApi';
import { type Invoice, InvoiceStatus } from '@/types/invoice';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
    PAID: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
    OVERDUE: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
    VOID: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Void' },
};

export default function PortalInvoiceContent() {
    const params = useParams();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const invoiceId = params.id as string;

    const fetchInvoice = useCallback(async () => {
        try {
            setLoading(true);
            const data = await invoiceApi.getInvoice(invoiceId);
            setInvoice(data);
        } catch (err) {
            console.error('Failed to load invoice:', err);
            toast.error('Failed to load invoice details');
        } finally {
            setLoading(false);
        }
    }, [invoiceId]);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId, fetchInvoice]);

    const handleDownloadPDF = () => {
        if (!invoice) return;

        // Simple PDF generation placeholder - ideally reuse a shared generator
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Invoice ${invoice.invoiceNumber}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Total: $${invoice.total.toFixed(2)}`, 20, 40);
        doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
    };

    const handlePayment = async () => {
        if (!invoice) return;

        try {
            setPaymentProcessing(true);
            // Simulate API call to Stripe
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mark as paid via API (simulated)
            await invoiceApi.updateInvoice(invoice.id, { ...invoice, status: InvoiceStatus.PAID });

            toast.success('Payment successful! Thank you.');
            setShowPaymentModal(false);
            fetchInvoice();
        } catch (err) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setPaymentProcessing(false);
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

    if (!invoice) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Invoice Not Found</h2>
                <p className="text-slate-500">The invoice you are looking for may have been removed or the link is invalid.</p>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[invoice.status] || STATUS_STYLES.DRAFT;

    return (
        <div className="space-y-6">
            {/* Payment Success Banner */}
            {invoice.status === 'PAID' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-green-900">Paid in Full</h2>
                        <p className="text-green-700">Thank you for your payment!</p>
                    </div>
                </div>
            ) : (
                /* Pay Action Banner */
                <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Total Due: {formatCurrency(invoice.total)}</h2>
                        <p className="text-slate-500">Please pay by {formatDate(invoice.dueDate)} to avoid late fees.</p>
                    </div>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Pay Now
                    </button>
                </div>
            )}

            {/* Invoice Paper */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-xl text-slate-500">{invoice.invoiceNumber}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                    {statusStyle.label}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-900">Facturify Demo Company</h2>
                            <p className="text-slate-500">123 Business Street</p>
                            <p className="text-slate-500">Tech City, TC 90210</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</h3>
                            <div className="text-slate-900 font-medium">{invoice.client?.name}</div>
                            {invoice.client?.email && <div className="text-slate-600">{invoice.client.email}</div>}
                            {invoice.client?.addressLine1 && (
                                <div className="text-slate-600 mt-1">
                                    {invoice.client.addressLine1}<br />
                                    {invoice.client.city}, {invoice.client.country}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-slate-500">Issue Date:</span>
                                <span className="font-medium text-slate-900">{formatDate(invoice.issueDate)}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-slate-500">Due Date:</span>
                                <span className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</span>
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
                            {invoice.items.map((item, index) => (
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
                            {invoice.notes && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Notes</h3>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{invoice.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-medium text-slate-900">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.taxAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tax</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-end">
                                <span className="text-base font-semibold text-slate-900">Total</span>
                                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(invoice.total)}</span>
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

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <h3 className="font-bold text-slate-900">Secure Payment</h3>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 text-center">
                                <p className="text-slate-500 mb-1">Total Due</p>
                                <p className="text-3xl font-bold text-slate-900">{formatCurrency(invoice.total)}</p>
                            </div>

                            {/* Mock Stripe Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Information</label>
                                    <div className="p-3 border border-slate-300 rounded-lg bg-white flex items-center gap-3">
                                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <input type="text" placeholder="Card number" className="flex-1 outline-none text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-3 border border-slate-300 rounded-lg bg-white">
                                            <input type="text" placeholder="MM / YY" className="w-full outline-none text-sm" />
                                        </div>
                                        <div className="p-3 border border-slate-300 rounded-lg bg-white">
                                            <input type="text" placeholder="CVC" className="w-full outline-none text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    disabled={paymentProcessing}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {paymentProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ${formatCurrency(invoice.total)}`
                                    )}
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    Secured by Stripe (Mock Mode)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
