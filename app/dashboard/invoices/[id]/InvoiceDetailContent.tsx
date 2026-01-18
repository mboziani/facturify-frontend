'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { invoiceApi } from '@/lib/api/invoiceApi';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { getStatusColor, formatCurrency, formatDate } from '@/lib/utils/invoiceUtils';
import toast from 'react-hot-toast';
import { generateInvoicePDF } from '@/lib/utils/pdfGenerator';

export default function InvoiceDetailContent() {
    const router = useRouter();
    const params = useParams();
    const invoiceId = params.id as string;

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvoice();
    }, [invoiceId]);

    const loadInvoice = async () => {
        try {
            setIsLoading(true);
            const data = await invoiceApi.getInvoice(invoiceId);
            setInvoice(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load invoice');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (invoice) {
            generateInvoicePDF(invoice);
            toast.success('PDF downloaded!');
        }
    };

    const handleSendInvoice = async () => {
        if (!invoice) return;
        try {
            await invoiceApi.sendInvoice(invoiceId);
            toast.success('Invoice sent!');
            loadInvoice();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send invoice');
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
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Invoice Not Found</h2>
                <p className="text-slate-500 mb-6">{error || 'The invoice does not exist.'}</p>
                <Link href="/dashboard/invoices" className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
                    Back to Invoices
                </Link>
            </div>
        );
    }

    const statusColor = getStatusColor(invoice.status);

    return (
        <div className="p-6 sm:p-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/invoices" className="hover:text-indigo-600">Invoices</Link>
                    <span>/</span>
                    <span>{invoice.invoiceNumber}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                            {invoice.status}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleDownloadPDF} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                            Download PDF
                        </button>
                        {invoice.status === InvoiceStatus.DRAFT && (
                            <>
                                <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                                    Edit
                                </Link>
                                <button onClick={handleSendInvoice} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Send Invoice
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-slate-500">Client</dt>
                                <dd className="font-medium text-slate-900">{invoice.client?.name || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Issue Date</dt>
                                <dd className="font-medium text-slate-900">{formatDate(invoice.issueDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Due Date</dt>
                                <dd className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Amount</dt>
                                <dd className="font-medium text-slate-900">{formatCurrency(invoice.total)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Line Items</h2>
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-2">Description</th>
                                    <th className="text-right py-2">Qty</th>
                                    <th className="text-right py-2">Price</th>
                                    <th className="text-right py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items?.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100">
                                        <td className="py-3">{item.description}</td>
                                        <td className="text-right py-3">{item.quantity}</td>
                                        <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
                                        <td className="text-right py-3">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 pt-4 border-t border-slate-200 text-right">
                            <div className="text-slate-500">Subtotal: {formatCurrency(invoice.subtotal)}</div>
                            <div className="text-slate-500">Tax: {formatCurrency(invoice.taxAmount)}</div>
                            <div className="text-xl font-bold text-indigo-600 mt-2">Total: {formatCurrency(invoice.total)}</div>
                        </div>
                    </section>
                </div>

                <div>
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Status</dt>
                                <dd className={`font-medium ${statusColor}`}>{invoice.status}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Total</dt>
                                <dd className="font-bold text-lg">{formatCurrency(invoice.total)}</dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </div>
    );
}
