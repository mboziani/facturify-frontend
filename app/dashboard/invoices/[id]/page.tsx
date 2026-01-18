'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { invoiceApi } from '@/lib/api/invoiceApi';
import { paymentApi } from '@/lib/api/paymentApi';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { PaymentMethod, PaymentStatus } from '@/types/payment';
import { getStatusColor, formatCurrency, formatDate } from '@/lib/utils/invoiceUtils';
import toast from 'react-hot-toast';
import { generateInvoicePDF } from '@/lib/utils/pdfGenerator';

export default function InvoiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const invoiceId = params.id as string;

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reference: '',
        notes: '',
    });

    useEffect(() => {
        loadInvoice();
    }, [invoiceId]);

    const loadInvoice = async () => {
        try {
            setIsLoading(true);
            const data = await invoiceApi.getInvoice(invoiceId);
            setInvoice(data);
            // Set default payment amount to amount due
            setPaymentForm((prev) => ({ ...prev, amount: data.amountDue }));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load invoice');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecordPayment = async () => {
        if (!invoice) return;
        try {
            setActionLoading('recording');
            await paymentApi.createPayment({
                invoiceId: invoice.id,
                ...paymentForm,
            });
            // Reload invoice to get updated amounts
            await loadInvoice();
            setShowPaymentModal(false);
            // Reset form
            setPaymentForm({
                amount: 0,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: PaymentMethod.BANK_TRANSFER,
                reference: '',
                notes: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to record payment');
        } finally {
            setActionLoading('');
        }
    };

    const handleMarkAsSent = async () => {
        if (!invoice) return;

        const email = invoice.client?.email;
        if (!email) {
            setError('Client does not have an email address. Please edit the client details.');
            return;
        }

        if (!confirm(`Send invoice to ${email}?`)) return;

        try {
            setActionLoading('sending');
            const updated = await invoiceApi.markAsSent(invoice.id);
            setInvoice(updated);
            toast.success('Invoice sent successfully via email!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send invoice');
        } finally {
            setActionLoading('');
        }
    };

    const handleMarkAsPaid = async () => {
        if (!invoice) return;
        const paidDate = prompt('Enter payment date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
        if (!paidDate) return;

        try {
            setActionLoading('paying');
            const updated = await invoiceApi.markAsPaid(invoice.id, { paidDate });
            setInvoice(updated);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to mark as paid');
        } finally {
            setActionLoading('');
        }
    };

    const handleDownloadPDF = async () => {
        if (!invoice) return;
        try {
            setActionLoading('downloading');
            await generateInvoicePDF(invoice);
        } catch (err: any) {
            setError('Failed to generate PDF');
        } finally {
            setActionLoading('');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            await invoiceApi.deleteInvoice(invoiceId);
            router.push('/dashboard/invoices');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete invoice');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600"></div>
                <p className="mt-4 text-slate-500">Loading invoice...</p>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Invoice not found</p>
                <Link href="/dashboard/invoices" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
                    Back to Invoices
                </Link>
            </div>
        );
    }

    const { bg, text, label } = getStatusColor(invoice.status);

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/invoices" className="hover:text-indigo-600">Invoices</Link>
                    <span>/</span>
                    <span>{invoice.invoiceNumber}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
                                {label}
                            </span>
                        </div>
                        <p className="text-slate-500 mt-1">{invoice.client?.name}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={!!actionLoading}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            {actionLoading === 'downloading' ? 'Generating...' : 'Download PDF'}
                        </button>
                        {invoice.status === InvoiceStatus.DRAFT && (
                            <>
                                <Link
                                    href={`/dashboard/invoices/${invoice.id}/edit`}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleMarkAsSent}
                                    disabled={!!actionLoading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {actionLoading === 'sending' ? 'Sending...' : 'Send Email to Client'}
                                </button>
                            </>
                        )}
                        {(invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.VIEWED) && invoice.amountDue > 0 && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                disabled={!!actionLoading}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Record Payment
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                                <p className="text-slate-500 mt-1">{invoice.invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-500">Issue Date</div>
                                <div className="font-medium text-slate-900">{formatDate(invoice.issueDate)}</div>
                                <div className="text-sm text-slate-500 mt-2">Due Date</div>
                                <div className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-sm font-medium text-slate-500 mb-2">BILLED TO</div>
                                <div className="font-semibold text-slate-900">{invoice.client?.name}</div>
                                {invoice.client?.email && <div className="text-slate-600 text-sm">{invoice.client.email}</div>}
                                {invoice.client?.phone && <div className="text-slate-600 text-sm">{invoice.client.phone}</div>}
                                {invoice.client?.addressLine1 && (
                                    <div className="mt-2 text-slate-600 text-sm">
                                        <div>{invoice.client.addressLine1}</div>
                                        {invoice.client.city && invoice.client.country && (
                                            <div>{invoice.client.city}, {invoice.client.country}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="mb-8">
                            <table className="w-full">
                                <thead className="border-b-2 border-slate-900">
                                    <tr>
                                        <th className="text-left py-3 text-sm font-semibold text-slate-900">DESCRIPTION</th>
                                        <th className="text-right py-3 text-sm font-semibold text-slate-900">QTY</th>
                                        <th className="text-right py-3 text-sm font-semibold text-slate-900">PRICE</th>
                                        <th className="text-right py-3 text-sm font-semibold text-slate-900">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {invoice.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-4 text-slate-900">{item.description}</td>
                                            <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                                            <td className="py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                                            <td className="py-4 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-8">
                            <div className="w-80">
                                <div className="flex justify-between py-2 text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.taxRate > 0 && (
                                    <div className="flex justify-between py-2 text-slate-600">
                                        <span>Tax ({invoice.taxRate}%)</span>
                                        <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                                    </div>
                                )}
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between py-2 text-slate-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-{formatCurrency(invoice.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-t-2 border-slate-900 text-lg font-bold">
                                    <span>TOTAL</span>
                                    <span className="text-indigo-600">{formatCurrency(invoice.total)}</span>
                                </div>
                                {invoice.amountPaid > 0 && (
                                    <>
                                        <div className="flex justify-between py-2 text-slate-600">
                                            <span>Amount Paid</span>
                                            <span className="font-medium">{formatCurrency(invoice.amountPaid)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 font-semibold">
                                            <span>Amount Due</span>
                                            <span className="text-red-600">{formatCurrency(invoice.amountDue)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Notes & Terms */}
                        {(invoice.notes || invoice.terms || invoice.footer) && (
                            <div className="border-t border-slate-200 pt-6 space-y-4">
                                {invoice.notes && (
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 mb-1">NOTES</div>
                                        <div className="text-slate-700 text-sm whitespace-pre-wrap">{invoice.notes}</div>
                                    </div>
                                )}
                                {invoice.terms && (
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 mb-1">PAYMENT TERMS</div>
                                        <div className="text-slate-700 text-sm whitespace-pre-wrap">{invoice.terms}</div>
                                    </div>
                                )}
                                {invoice.footer && (
                                    <div className="text-center text-slate-500 text-sm pt-4 border-t border-slate-200">
                                        {invoice.footer}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Activity Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-900">Created</div>
                                    <div className="text-xs text-slate-500">{formatDate(invoice.createdAt)}</div>
                                </div>
                            </div>
                            {invoice.sentAt && (
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-900">Sent</div>
                                        <div className="text-xs text-slate-500">{formatDate(invoice.sentAt)}</div>
                                    </div>
                                </div>
                            )}
                            {invoice.viewedAt && (
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-900">Viewed</div>
                                        <div className="text-xs text-slate-500">{formatDate(invoice.viewedAt)}</div>
                                    </div>
                                </div>
                            )}
                            {invoice.paidDate && (
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-900">Paid</div>
                                        <div className="text-xs text-slate-500">{formatDate(invoice.paidDate)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    {invoice.status === InvoiceStatus.PAID && (
                        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
                            <h2 className="text-lg font-semibold text-emerald-900 mb-4">Payment Information</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-emerald-700">Paid On</span>
                                    <span className="font-medium text-emerald-900">{invoice.paidDate && formatDate(invoice.paidDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-700">Amount</span>
                                    <span className="font-medium text-emerald-900">{formatCurrency(invoice.amountPaid)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Invoice Number</span>
                                <span className="font-medium text-slate-900">{invoice.invoiceNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Issue Date</span>
                                <span className="font-medium text-slate-900">{formatDate(invoice.issueDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Due Date</span>
                                <span className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-slate-200">
                                <span className="text-slate-600">Total</span>
                                <span className="text-lg font-bold text-indigo-600">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Record Payment</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-slate-500 mt-1">Amount due: {formatCurrency(invoice?.amountDue || 0)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Payment Date
                                </label>
                                <input
                                    type="date"
                                    value={paymentForm.paymentDate}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentForm.paymentMethod}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as PaymentMethod })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                                    <option value={PaymentMethod.CASH}>Cash</option>
                                    <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
                                    <option value={PaymentMethod.DEBIT_CARD}>Debit Card</option>
                                    <option value={PaymentMethod.PAYPAL}>PayPal</option>
                                    <option value={PaymentMethod.CHECK}>Check</option>
                                    <option value={PaymentMethod.OTHER}>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Reference (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={paymentForm.reference}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Transaction ID, check number, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={paymentForm.notes}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Additional notes about this payment..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                                disabled={actionLoading === 'recording'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRecordPayment}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                                disabled={actionLoading === 'recording'}
                            >
                                {actionLoading === 'recording' ? 'Recording...' : 'Record Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
