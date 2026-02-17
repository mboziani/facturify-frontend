'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { recurringInvoiceApi, RecurringFrequency, CreateRecurringInvoiceData } from '@/lib/api/recurringInvoiceApi';
import { clientApi } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function NewRecurringInvoicePage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [clients, setClients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<CreateRecurringInvoiceData>({
        name: '',
        clientId: '',
        companyId: currentCompany?.id || '',
        items: [{ description: '', quantity: 1, price: 0 }],
        taxRate: 0,
        discount: 0,
        frequency: RecurringFrequency.MONTHLY,
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
        isActive: true,
    });

    const loadClients = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await clientApi.getClients({ companyId: currentCompany.id });
            setClients(data);
        } catch (error) {
            console.error('Failed to load clients:', error);
        }
    }, [currentCompany]);

    useEffect(() => {
        if (currentCompany) {
            loadClients();
            setFormData(prev => ({ ...prev, companyId: currentCompany.id }));
        }
    }, [currentCompany, loadClients]);

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, price: 0 }],
        });
    };

    const removeItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCompany) return;

        setIsLoading(true);
        try {
            await recurringInvoiceApi.createRecurringInvoice({
                ...formData,
                companyId: currentCompany.id,
            });
            toast.success('Recurring invoice template created!');
            router.push('/dashboard/invoices/recurring');
        } catch (error) {
            console.error('Failed to create template:', error);
            toast.error('Failed to create template');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Recurring Invoice Template</h1>
                <p className="text-gray-500 mt-1">Set up automated invoice generation</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                {/* Template Name & Client */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g. Monthly Retainer - Client X"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                        <select
                            required
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Select client...</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Frequency & Dates */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                        <select
                            required
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="WEEKLY">Weekly</option>
                            <option value="BIWEEKLY">Bi-weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="YEARLY">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                        <input
                            type="date"
                            value={formData.endDate || ''}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Items */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                    <div className="space-y-2">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {formData.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="px-3 py-2 text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        + Add Item
                    </button>
                </div>

                {/* Tax & Discount */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={formData.taxRate}
                            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add any notes for this template..."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/invoices/recurring')}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Template'}
                    </button>
                </div>
            </form>
        </div>
    );
}
