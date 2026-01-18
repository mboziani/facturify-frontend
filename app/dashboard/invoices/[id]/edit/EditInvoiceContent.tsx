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
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function EditInvoiceContent() {
    const router = useRouter();
    const params = useParams();
    const invoiceId = params.id as string;
    const { currentCompany } = useCompany();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const watchItems = watch('items');
    const watchTaxRate = watch('taxRate');
    const watchDiscount = watch('discount');

    useEffect(() => {
        loadInvoice();
        if (currentCompany) loadClients();
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
        const subtotal = watchItems?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) || 0;
        const taxableAmount = watchItems?.filter(item => item.taxable).reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) || 0;
        const taxAmount = (taxableAmount * (watchTaxRate || 0)) / 100;
        const total = subtotal + taxAmount - (watchDiscount || 0);
        return { subtotal: subtotal.toFixed(2), taxAmount: taxAmount.toFixed(2), total: total.toFixed(2) };
    };

    const totals = calculateTotals();

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            setIsSaving(true);
            await invoiceApi.updateInvoice(invoiceId, data);
            router.push('/dashboard/invoices');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update invoice');
        } finally {
            setIsSaving(false);
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
                <Link href="/dashboard/invoices" className="mt-4 inline-block text-indigo-600">Back to Invoices</Link>
            </div>
        );
    }

    if (invoice.status !== InvoiceStatus.DRAFT) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Cannot Edit Invoice</h2>
                <p className="text-slate-500 mb-6">Only draft invoices can be edited.</p>
                <Link href="/dashboard/invoices" className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Back to Invoices</Link>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Edit Invoice</h1>
                <p className="text-slate-500">{invoice.invoiceNumber}</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Client *</label>
                            <select {...register('clientId')} className="w-full px-4 py-3 border rounded-lg">
                                <option value="">Select client</option>
                                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Issue Date *</label>
                            <input type="date" {...register('issueDate')} className="w-full px-4 py-3 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Due Date *</label>
                            <input type="date" {...register('dueDate')} className="w-full px-4 py-3 border rounded-lg" />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-semibold">Line Items</h2>
                        <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxable: true })} className="text-indigo-600">+ Add Item</button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-slate-500">
                                <th>Description</th>
                                <th className="w-20">Qty</th>
                                <th className="w-28">Price</th>
                                <th className="w-28 text-right">Amount</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td className="py-2"><input {...register(`items.${index}.description`)} className="w-full px-3 py-2 border rounded" /></td>
                                    <td className="py-2"><input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" /></td>
                                    <td className="py-2"><input type="number" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" /></td>
                                    <td className="py-2 text-right">${((watchItems?.[index]?.quantity || 0) * (watchItems?.[index]?.unitPrice || 0)).toFixed(2)}</td>
                                    <td className="py-2">{fields.length > 1 && <button type="button" onClick={() => remove(index)} className="text-red-600">×</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 text-right">
                        <div>Subtotal: ${totals.subtotal}</div>
                        <div>Tax: ${totals.taxAmount}</div>
                        <div className="text-xl font-bold text-indigo-600">Total: ${totals.total}</div>
                    </div>
                </section>

                <div className="flex justify-end gap-3">
                    <Link href="/dashboard/invoices" className="px-6 py-3 border rounded-lg">Cancel</Link>
                    <button type="submit" disabled={isSaving} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
