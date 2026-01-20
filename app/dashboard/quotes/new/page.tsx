'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';
import { quoteApi } from '@/lib/api/quoteApi';
import { clientApi } from '@/lib/api/clientApi';
import type { Client } from '@/types/client';
import { toast } from 'react-hot-toast';

const quoteItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
    taxable: z.boolean(),
});

const quoteSchema = z.object({
    clientId: z.string().min(1, 'Client is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    validUntil: z.string().min(1, 'Valid until date is required'),
    taxRate: z.number().min(0).max(100),
    discount: z.number().min(0),
    notes: z.string().optional(),
    terms: z.string().optional(),
    footer: z.string().optional(),
    items: z.array(quoteItemSchema).min(1, 'At least one item is required'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function NewQuotePage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [clients, setClients] = useState<Client[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            taxRate: 0,
            discount: 0,
            items: [{ description: '', quantity: 1, unitPrice: 0, taxable: true }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const watchItems = watch('items');
    const watchTaxRate = watch('taxRate');
    const watchDiscount = watch('discount');

    useEffect(() => {
        if (currentCompany) {
            loadClients();
        }
    }, [currentCompany]);

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
        const subtotal = watchItems.reduce((sum, item) => {
            return sum + (item.quantity || 0) * (item.unitPrice || 0);
        }, 0);

        const taxableAmount = watchItems
            .filter(item => item.taxable)
            .reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);

        const taxAmount = (taxableAmount * (watchTaxRate || 0)) / 100;
        const total = subtotal + taxAmount - (watchDiscount || 0);

        return {
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            total: total.toFixed(2),
        };
    };

    const totals = calculateTotals();

    const onSubmit = async (data: QuoteFormData, sendImmediately = false) => {
        if (!currentCompany) return;

        try {
            setIsSaving(true);
            setError('');

            const quote = await quoteApi.createQuote({
                ...data,
                companyId: currentCompany.id,
            });

            if (sendImmediately) {
                await quoteApi.markAsSent(quote.id);
                toast.success('Quote created and sent to client!');
            } else {
                toast.success('Quote saved as draft!');
            }

            router.push('/dashboard/quotes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create quote');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentCompany) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Please select a company first</p>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/quotes" className="hover:text-indigo-600">
                        Quotes
                    </Link>
                    <span>/</span>
                    <span>New Quote</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Create Quote</h1>
                <p className="text-slate-500 mt-1">Create a new quote or estimate for your client</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client & Dates */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quote Details</h2>
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
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
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
                                    {errors.issueDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Valid Until <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        {...register('validUntil')}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.validUntil ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                    {errors.validUntil && (
                                        <p className="mt-1 text-sm text-red-600">{errors.validUntil.message}</p>
                                    )}
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
                                                        placeholder="0.00"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        ${((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)).toFixed(2)}
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
                            {errors.items && (
                                <p className="mt-2 text-sm text-red-600">Please add at least one item</p>
                            )}
                        </section>

                        {/* Notes & Terms */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes & Terms</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        {...register('notes')}
                                        rows={3}
                                        placeholder="Add a note for your client (optional)"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        {...register('terms')}
                                        rows={3}
                                        placeholder="Quote terms and conditions"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="space-y-6">
                        {/* Totals */}
                        <section className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium text-slate-900">${totals.subtotal}</span>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label className="text-sm text-slate-600 whitespace-nowrap">Tax Rate</label>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            step="0.1"
                                            {...register('taxRate', { valueAsNumber: true })}
                                            className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-right focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        <span className="text-sm text-slate-500">%</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tax Amount</span>
                                    <span className="font-medium text-slate-900">${totals.taxAmount}</span>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label className="text-sm text-slate-600">Discount</label>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-slate-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('discount', { valueAsNumber: true })}
                                            className="w-20 px-2 py-1 border border-slate-200 rounded text-sm text-right focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-slate-900">Total</span>
                                        <span className="text-2xl font-bold text-slate-900">${totals.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save as Draft'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={handleSubmit((data) => onSubmit(data, true))}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Sending...' : 'Save & Send to Client'}
                                </button>
                                <Link
                                    href="/dashboard/quotes"
                                    className="block w-full px-4 py-3 text-center text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>
    );
}
