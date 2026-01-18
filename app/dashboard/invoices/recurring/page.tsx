'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { recurringInvoiceApi, RecurringInvoice, RecurringFrequency } from '@/lib/api/recurringInvoiceApi';
import toast from 'react-hot-toast';

export default function RecurringInvoicesPage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [templates, setTemplates] = useState<RecurringInvoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentCompany) loadTemplates();
    }, [currentCompany]);

    const loadTemplates = async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            const data = await recurringInvoiceApi.getRecurringInvoices(currentCompany.id);
            setTemplates(data);
        } catch (error) {
            console.error('Failed to load recurring invoices:', error);
            toast.error('Failed to load recurring invoices');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async (id: string, name: string) => {
        if (!confirm(`Generate invoice from "${name}"?`)) return;
        try {
            await recurringInvoiceApi.generateInvoice(id);
            toast.success('Invoice generated successfully!');
            loadTemplates();
        } catch (error) {
            console.error('Failed to generate invoice:', error);
            toast.error('Failed to generate invoice');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete template "${name}"?`)) return;
        try {
            await recurringInvoiceApi.deleteRecurringInvoice(id);
            toast.success('Template deleted successfully');
            loadTemplates();
        } catch (error) {
            console.error('Failed to delete template:', error);
            toast.error('Failed to delete template');
        }
    };

    const frequencyLabels: Record<RecurringFrequency, string> = {
        WEEKLY: 'Weekly',
        BIWEEKLY: 'Bi-weekly',
        MONTHLY: 'Monthly',
        QUARTERLY: 'Quarterly',
        YEARLY: 'Yearly',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recurring Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage invoice templates and automation</p>
                </div>
                <Link
                    href="/dashboard/invoices/recurring/new"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Create Template
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recurring templates</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a template to automate invoice generation.</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/invoices/recurring/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            + Create Template
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {templates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {template.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {template.client?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {frequencyLabels[template.frequency]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {template.nextGenerationDate
                                            ? new Date(template.nextGenerationDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${template.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {template.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleGenerate(template.id, template.name)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Generate
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template.id, template.name)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
