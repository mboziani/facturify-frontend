'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';
import { invoiceApi } from '@/lib/api/invoiceApi';
import { clientApi } from '@/lib/api/clientApi';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import type { Client } from '@/types/client';

// Required for static export
export function generateStaticParams() {
    return [
        { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
        { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' },
    ];
}

const invoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
    taxable: z.boolean(),
});

const invoiceSchema = z.object({
    clientId: z.string().min(1, 'Client is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    taxRate: z.number().min(0).max(100),
    discount: z.number().min(0),
    notes: z.string().optional(),
    terms: z.string().optional(),
    footer: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function EditInvoicePage() {
    const router = useRouter();
    const params = useParams();
    const invoiceId = params.id as string;
    const { currentCompany } = useCompany();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const watchItems = watch('items');
    const watchTaxRate = watch('taxRate');
    const watchDiscount = watch('discount');

    useEffect(() => {
        loadInvoice();
        if (currentCompany) {
            loadClients();
        }
    }, [invoiceId, currentCompany]);

    const loadInvoice = async () => {
        try {
            setIsLoading(true);
            const data = await invoiceApi.getInvoice(invoiceId);
            setInvoice(data);

            reset({
                clientId: data.clientId,
                issueDate: data.issueDate.split('T')[0],
                dueDate: data.dueDate.split('T')[0],
                taxRate: data.taxRate,
                discount: data.discount,
                notes: data.notes || '',
                terms: data.terms || '',
                footer: data.footer || '',
                items: data.items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    taxable: item.taxable,
                })),
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load invoice');
        } finally {
            setIsLoading(false);
        }
    };

    const loadClients = async () => {
        if (!currentCompany) return;
        try {
            const data = await clientApi.getClients({ companyId: currentCompany.id });
            setClients(data);
        } catch (err) {
            console.error('Failed to load clients:', err);
        }
    };

    const calculateTotals = () => {
        const subtotal = watchItems?.reduce((sum, item) => {
            return sum + (item.quantity || 0) * (item.unitPrice || 0);
        }, 0) || 0;

        const taxableAmount = watchItems?.filter(item => item.taxable)
            .reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) || 0;

        const taxAmount = (taxableAmount * (watchTaxRate || 0)) / 100;
        const total = subtotal + taxAmount - (watchDiscount || 0);

        return {
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            total: total.toFixed(2),
        };
    };

    const totals = calculateTotals();

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            setIsSaving(true);
            setError('');

            await invoiceApi.updateInvoice(invoiceId, data);
            router.push('/dashboard/invoices');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update invoice');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            return;
        }

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

    if (invoice.status !== InvoiceStatus.DRAFT) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Cannot Edit Invoice</h2>
                <p className="text-slate-500 mb-6">Only draft invoices can be edited. This invoice has already been sent.</p>
                <div className="flex gap-3 justify-center">
                    <Link href="/dashboard/invoices" className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50">
                        Back to Invoices
                    </Link>
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                        View Invoice
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/invoices" className="hover:text-indigo-600">Invoices</Link>
                    <span>/</span>
                    <span>{invoice.invoiceNumber}</span>
                    <span>/</span>
                    <span>Edit</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Invoice</h1>
                <p className="text-slate-500 mt-1">{invoice.invoiceNumber}</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client & Dates */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Client <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('clientId')}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${errors.clientId ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    >
                                        <option value="">Select client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>{client.name}</option>
                                        ))}
                                    </select>
                                    {errors.clientId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Issue Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        {...register('issueDate')}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.issueDate ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        {...register('dueDate')}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.dueDate ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Line Items */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
                                <button
                                    type="button"
                                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxable: true })}
                                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase w-24">Qty</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase w-32">Price</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase w-32">Amount</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase w-20">Tax</th>
                                            <th className="px-4 py-2 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {fields.map((field, index) => (
                                            <tr key={field.id}>
                                                <td className="px-4 py-3">
                                                    <input
                                                        {...register(`items.${index}.description`)}
                                                        placeholder="Item description"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        ${((watchItems?.[index]?.quantity || 0) * (watchItems?.[index]?.unitPrice || 0)).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        {...register(`items.${index}.taxable`)}
                                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Notes */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                    <textarea
                                        {...register('notes')}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Terms</label>
                                    <textarea
                                        {...register('terms')}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Footer</label>
                                    <input
                                        {...register('footer')}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium text-slate-900">${totals.subtotal}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('taxRate', { valueAsNumber: true })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tax</span>
                                    <span className="font-medium text-slate-900">${totals.taxAmount}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Discount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('discount', { valueAsNumber: true })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-slate-900">Total</span>
                                        <span className="text-2xl font-bold text-indigo-600">${totals.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-3 border border-red-300 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Delete Invoice
                    </button>

                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <Link
                            href="/dashboard/invoices"
                            className="px-6 py-3 text-center border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
